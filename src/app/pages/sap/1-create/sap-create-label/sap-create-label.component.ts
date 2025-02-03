import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { debounceTime, lastValueFrom } from 'rxjs';
import { HttpModelService } from 'src/app/http/http-model.service';
import { QrCodeAndBarcodeService } from 'src/app/pages/user/create-label/qr-code-and-barcode.service';
import { GenerateLabelService } from 'src/app/service/generate-label.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { HttpSapFormService } from '../../http/http-sap-form.service';
import { HttpSapPkta117Service } from '../../http/http-sap-pkta117.service';
import { HttpSapSendingService } from '../../http/http-sap-sending.service';
@Component({
  selector: 'app-sap-create-label',
  templateUrl: './sap-create-label.component.html',
  styleUrls: ['./sap-create-label.component.scss']
})
export class SapCreateLabelComponent {

  // todo element files control
  @ViewChild('scan', { static: true }) scan!: ElementRef;
  @ViewChild('scanSending', { static: true }) scanSending!: ElementRef;

  form: any = {
    modelName: null,
    shipmentDate: null,
    modelCode: null,
    partNumber: null,
    PO: null,
    qty: null,
    shipPlace: null,
    shipTo: null,
    invoice: null,
    TTL: null,
    lotNo: null,
    lotShow: [],
    boxNo: null,
    sap: true
  }
  // pkta117: any = null
  // models: any = null
  dataSending: any = []
  // manyLot: boolean = false
  model: any
  mode: any = null
  pkta117Main: any


  // todo new *****************************************************
  shippingInputControl = new FormControl();
  shipment: any
  // sendingInputControl = new FormControl();
  sendingItems: any = []
  sendingResultItems: any = []
  constructor(
    private $pkta117: HttpSapPkta117Service,
    private $model: HttpModelService,
    private $label: GenerateLabelService,
    private $form: HttpSapFormService,
    private $sending: HttpSapSendingService,
    private $qrCodeAndBarcode: QrCodeAndBarcodeService,
  ) {

  }
  async ngOnInit(): Promise<void> {
    try {
      this.shippingInputControl.valueChanges.pipe(
        debounceTime(500)
      ).subscribe(() => {
        this.shippingInputControl.setValue('');
      });
      let { pkta117, models } = await this.getInitialData()
      this.pkta117Main = pkta117
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  async getInitialData() {
    const resDataPKTA117 = await lastValueFrom(this.$pkta117.get(new HttpParams()))
    const pkta117 = resDataPKTA117
    const resDataModel = await lastValueFrom(this.$model.get(new HttpParams()))
    const models = resDataModel
    return { pkta117, models }
  }

  blockCtrlV(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
    }
    if (event.key === 'Tab' || event.key === 'Enter') {
      let text: any = this.shippingInputControl.value
      if (text) {
        this.clearInput()
        this.onShipping(text)
      }
    }
  }
  blockRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  async onShipping(text: string) {
    try {
      let shipmentTextSp: any = text.split(',')
      const seident = shipmentTextSp[shipmentTextSp.length - 1].trim()

      let { pkta117, models } = await this.getInitialData()

      if (
        !pkta117.some((item: any) => item['Customer SO#'] == seident) &&
        !pkta117.some((item: any) => item['PO number'] == seident)
      ) throw 'not found SEIDENT In SAP Data, please upload again!!!!!'

      // TODO MIX LOT
      if (text.toLocaleLowerCase().includes('mix lot')) {
        this.shipment = {
          customerDes: shipmentTextSp[0],
          total: Number(shipmentTextSp[1]),
          box: shipmentTextSp[2],
          lot: [],
          shipDate: moment(shipmentTextSp[3], 'DD/MM/YY').toDate(),
          org: text,
          sap: true
        }
        let countMix: any = shipmentTextSp[4].toLocaleLowerCase().replace('mix lot', '')
        countMix = countMix.length + 1
        for (let i = 0; i < countMix; i++) {
          this.shipment.lot = 'mix lot'
          this.sendingItems.push({
            id: `text${this.sendingItems.length + 1}`
          })
        }
        this.jumpToFirstSendingScan()
      } else


        // TODO ONE LOT
        if (text.split(',').length == 6) {
          this.shipment = {
            customerDes: shipmentTextSp[0],
            total: Number(shipmentTextSp[1]),
            box: shipmentTextSp[2],
            lot: [],
            shipDate: moment(shipmentTextSp[3], 'DD/MM/YY').toDate(),
            org: text,
            sap: true
          }
          for (let i = 0; i < text.split(',').length; i++) {
            const element = text.split(',')[i];
            if (element.toLocaleLowerCase().includes('pcs')) {
              let elemSP = element.split(' ')
              let newLot = {
                name: elemSP[0],
                qty: Number(elemSP[2])
              }
              this.shipment.lot.push(newLot)
              this.sendingItems.push({
                id: `text${this.sendingItems.length + 1}`
              })
            }
          }
          this.jumpToFirstSendingScan()

        } else


          // TODO MANY LOT
          if (text.split(',').length >= 7) {
            this.shipment = {
              customerDes: shipmentTextSp[0],
              total: Number(shipmentTextSp[1]),
              box: shipmentTextSp[2],
              lot: [],
              shipDate: moment(shipmentTextSp[3], 'DD/MM/YY').toDate(),
              org: text,
              sap: true
            }
            for (let i = 0; i < text.split(',').length; i++) {
              const element = text.split(',')[i];
              if (element.toLocaleLowerCase().includes('pcs')) {
                let elemSP = element.split(' ')
                let newLot = {
                  name: elemSP[0],
                  qty: Number(elemSP[2])
                }
                this.shipment.lot.push(newLot)
                this.sendingItems.push({
                  id: `text${this.sendingItems.length + 1}`
                })
              }
            }
            this.jumpToFirstSendingScan()

          }



    } catch (error) {
      console.log("🚀 ~ error:", error)
      setTimeout(() => {
        Swal.fire(JSON.stringify(error), '', 'error')

      }, 500);
    }
  }


  blockCtrlV2(event: KeyboardEvent, index: number, id: string) {
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
    }
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.sumResultSendingScan(this.sendingItems[index][id], id)
    }
  }
  blockRightClick2(event: MouseEvent) {
    event.preventDefault();
  }

  async sumResultSendingScan(text: string, id: string) {
    try {
      if (this.sendingResultItems.some((item: any) => item.org == text)) throw 'duplicate'
      let spText: any = text.split(',')
      const resultScan: any = {
        lot: spText[0],
        box: spText[1],
        internalCode: spText[2],
        sendingDate: moment(spText[3], 'DD/MM/YY').toDate(),
        qty: Number(spText[4]),
        org: text,
        sap: true
      }
      if (this.shipment?.lot.toString().toLowerCase() != 'mix lot' && this.shipment?.lot.length > 0 && !this.shipment?.org.includes(resultScan.lot)) throw 'no lot in shipping'
      for (const key in resultScan) {
        if (!resultScan[key]) throw `${key} = no data`
      }

      let { pkta117, models } = await this.getInitialData()

      let model = this.checkResultWithInterModel(resultScan.internalCode, models)
      if (model) {
        this.form.PO = model.po
        this.shipment.PO = model.po
        const resultScanObj = await this.genQrCode(resultScan, model)
        this.sendingResultItems.push(resultScanObj)
      }


      let sum = this.sendingResultItems.reduce((p: any, n: any) => p += n.qty, 0)
      if (this.shipment.total == sum) throw 'OK'
      let idSp: any = id.split('text')
      let newId = `text${Number(idSp[1]) + 1}`
      this.jumpToSendingScan(newId)
    } catch (error) {
      console.log("🚀 ~ error:", error)
      setTimeout(() => {
        if (JSON.stringify(error).includes('OK')) {
          Swal.fire(JSON.stringify(error), '', 'success')
        } else {
          Swal.fire(JSON.stringify(error), '', 'error')

        }

      }, 500);
    }

  }


  async onUpload117($event: any) {
    try {
      let file: any = $event.target.files as File;
      if (!file) throw "Can't read file"
      const data = await this.readExcel(file[0])
      // console.log("🚀 ~ data:", data)
      // const data = await this.$convertText.continueFiles(file)
      const resData = await lastValueFrom(this.$pkta117.import(data))
      this.pkta117Main = resData
      Swal.fire({
        title: "SUCCESS",
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  readExcel(file: File) {
    return new Promise((resolve) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const dataMapping = data.map((d: any) => {
          const item: any = {}
          for (const key in d) {
            const orgKey: any = key
            const newKey: any = orgKey.replaceAll('.', '')
            item[newKey] = d[key]
          }
          return item
        })
        resolve(dataMapping);
      };
      reader.readAsBinaryString(file);
    });
  }


  // todo status upload pkta117
  fileUploadPKTA117Class() {
    if (this.pkta117Main && this.pkta117Main.length > 0) {
      return 'bg-green-100'
    }
    return 'bg-red-400'
  }
  // todo show lasted upload pkta117
  showLastPKTA117() {
    if (this.pkta117Main && this.pkta117Main.length > 0) {
      return moment(this.pkta117Main[0].createdAt).format('DD-MMM-YYYY, HH:mm')
    }
    return 'not have SAP Data'
  }

  checkResultWithInterModel(result: any, models: any) {
    return models.find((item: any) => item.internalModel == result)
  }


  clearInput() {
    this.shippingInputControl.setValue('')
    // this.sendingInputControl.setValue('')
    this.shipment = null
    this.sendingItems = []
    this.sendingResultItems = []
  }
  jumpToFirstSendingScan() {
    setTimeout(() => {
      let el: any = document.getElementById('text1')
      el?.focus()
    }, 300);
  }
  jumpToSendingScan(id: string) {
    setTimeout(() => {
      let el: any = document.getElementById(id)
      el?.focus()
    }, 300);
  }
  showTotal() {
    if (this.shipment?.total) return Number(this.shipment.total).toLocaleString()
    return ''
  }
  showQty() {
    if (this.sendingResultItems && this.sendingResultItems.length > 0) {
      return this.sendingResultItems.reduce((p: any, n: any) => p += n.qty, 0)
    }
    return ''
  }
  scanSuccess() {
    let sum = this.sendingResultItems?.reduce((p: any, n: any) => p += n.qty, 0)
    if (this.shipment?.total == sum) return true
    return false
  }

  async genQrCode(resultScan: any, model: any) {
    const valueBarcode1 = `A${moment().format('YYYY')}0${resultScan.box}`
    const barcode1 = await this.$qrCodeAndBarcode.genBarcode1(valueBarcode1)

    const valueBarcode2 = model.partName
    const barcode2 = await this.$qrCodeAndBarcode.genBarcode2(valueBarcode2)

    const tempValueBarcode3 = resultScan.qty
    const barcode3 = await this.$qrCodeAndBarcode.genBarcode3(tempValueBarcode3)
    const valueBarcode3 = tempValueBarcode3.toString().padStart(6, '0')

    const valueBarcode4 = `000000${resultScan.lot.toString()}`
    const barcode4 = await this.$qrCodeAndBarcode.genBarcode4(valueBarcode4)

    const date = moment(this.shipment.shipDate, 'DD/MM/YY').format('DDMMYY')

    let valueQrCode = `<[!3S${this.form.PO}!P${valueBarcode2}!Q${valueBarcode3}!1T${valueBarcode4}!D${date}!S${moment().format('YYYY')}0${resultScan.box}!`
    const qrCode = await QRCode.toDataURL(valueQrCode)
    return {
      ...resultScan,
      barcode1: barcode1,
      barcode2: barcode2,
      barcode3: barcode3,
      barcode4: barcode4,
      valueBarcode1: valueBarcode1,
      valueBarcode2: valueBarcode2,
      valueBarcode3: valueBarcode3,
      valueBarcode4: valueBarcode4,
      qrCode: qrCode,
      date: date,
      remark1: model.remark1,
      remark2: model.remark2,
      remark3: model.remark3,
      unit: model.unit,
      runNo: this.dataSending.length + 1,
      PO: this.form.PO,
      sap: true
    }
  }

  clickClearScanSending(id: string) {
    this.jumpToSendingScan(id)
  }


  async onClickPrint() {
    const { runNo } = await lastValueFrom(this.$form.runNo())
    this.shipment.runNo = runNo
    const sendingUpdate = this.sendingResultItems.map((item: any) => {
      item.runNo = runNo
      return item
    })
    await lastValueFrom(this.$form.create(this.shipment))
    await lastValueFrom(this.$sending.create(sendingUpdate))
    let name: any = new Date().getTime()
    this.$label.generatePDF(name)
  }
  checkPrint() {
    let sum = this.sendingResultItems?.reduce((p: any, n: any) => p += n.qty, 0)
    if (sum >=this.shipment?.total  ) return false
    return true
  }

  async onSubmit() {
    const { runNo } = await lastValueFrom(this.$form.runNo())
    this.shipment.runNo = runNo
    const sendingUpdate = this.sendingResultItems.map((item: any) => {
      item.runNo = runNo
      return item
    })
    await lastValueFrom(this.$form.create(this.shipment))
    await lastValueFrom(this.$sending.create(sendingUpdate))
    Swal.fire({
      title: 'OK',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      location.reload()
    })
  }

}
