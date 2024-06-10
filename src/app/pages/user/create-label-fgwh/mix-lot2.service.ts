import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { QrCodeAndBarcodeService } from '../create-label/qr-code-and-barcode.service';
@Injectable({
  providedIn: 'root'
})
export class MixLot2Service {

  private model: any
  private form: any
  private dataSending: any
  constructor(
    private $qrCodeAndBarcode: QrCodeAndBarcodeService
  ) { }

  mix(spValue: any[], models: any, pkta117: any) {
    try {
      const resultScan = {
        modelName: spValue[0],
        qty: spValue[1],
        cs: spValue[2],
        packingDate: spValue[3],
        lot: this.cutAndTrim(spValue[4]),
        PO: spValue[5]
      }
      // console.log("🚀 ~ resultScan:", resultScan)
      // const dataFoundInPKTA117 = pkta117.find((item: any) => item['Cust PO#'] == resultScan.PO)
      // if (!dataFoundInPKTA117) throw 'not found in pkta117'
      const dataFoundAtModel = models.find((model: any) => model['modelName'] == resultScan.modelName)
      if (!dataFoundAtModel) throw 'not found model'
      this.model = dataFoundAtModel
      this.form = {
        modelCode: dataFoundAtModel.internalModel,
        modelName: dataFoundAtModel.modelName,
        partNumber: dataFoundAtModel.partName,
        PO: dataFoundAtModel.po,
        qty: resultScan.qty,
        boxNo: resultScan.cs,
        lotNo: resultScan.lot,
        lotShow: resultScan.lot.map((item: any) => item.lot)
      }
      return {
        form: this.form,
        model: this.model
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return null
    }
  }

  // todo cut and trim string
  private cutAndTrim(value: string) {
    return [{
      lot: value,
      qty: 0,
      status: false
    }]
  }


  async mixSend(value: any, form: any, model: any, dataSending: any) {
    try {
      this.form = form
      this.model = model
      this.dataSending = dataSending
      let spValue = value.split(',')
      const resultScan = {
        lot: spValue[0],
        cs: spValue[1],
        internalModel: spValue[2],
        sendingDate: spValue[3],
        qty: spValue[4],
        date: new Date()
      }
      // todo check model
      if (!this.form.lotNo) throw 'Not found lot'
      if (resultScan.internalModel != this.form.modelCode) throw 'Model not correct'
      // todo sum next qty
      let nextQty: number = this.sumScan() + Number(resultScan.qty)
      // todo check total qty and next qty not over total qty
      if (nextQty <= Number(this.form.qty)) {
        // todo add new result scan in data sending
        const valueBarcode1 = `A${moment().format('YYYY')}0${resultScan.cs}`
        const valueBarcode1_1 = `${moment().format('YYYY')}0${resultScan.cs}`
        const valueBarcode2 = this.model.remark4
        const valueBarcode3 = resultScan.qty
        const valueBarcode4 = `000000${resultScan.lot}`
        const barcode1 = await this.$qrCodeAndBarcode.genBarcode1(`${moment().format('YYYY')}0${resultScan.cs}`)
        const barcode2 = await this.$qrCodeAndBarcode.genBarcode2(valueBarcode2)
        const barcode3 = await this.$qrCodeAndBarcode.genBarcode3(valueBarcode3)
        const barcode4 = await this.$qrCodeAndBarcode.genBarcode4(valueBarcode4)
        let valueQrCode = `<[!3S${this.form.PO}!P${this.model.remark4}!Q${valueBarcode3.toString().padStart(6, '0')}!1T${valueBarcode4}!D${moment(resultScan.sendingDate).format('DDMMYY')}!S${valueBarcode1}!`
        const qrCode = await QRCode.toDataURL(valueQrCode)
        console.log("🚀 ~ valueQrCode:", valueQrCode)
        this.dataSending.push({
          ...resultScan,
          barcode1: barcode1,
          barcode2: barcode2,
          barcode3: barcode3,
          barcode4: barcode4,
          valueBarcode1: valueBarcode1,
          valueBarcode2: valueBarcode2,
          valueBarcode3: valueBarcode3.toString().padStart(6, '0'),
          valueBarcode4: valueBarcode4,
          qrCode: qrCode,
          date: moment(resultScan.sendingDate).format('DDMMYY'),
          remark1: model.remark1,
          remark2: model.remark2,
          remark3: model.remark3,
          remark4: model.remark4,
          unit: model.unit,
          runNo: this.dataSending.length + 1

        })
        return this.dataSending
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return null
    }
  }
  // todo summary total qty scan
  private sumScan() {
    return this.dataSending.reduce((p: any, n: any) => {
      return p += Number(n.qty)
    }, 0)
  }
}
