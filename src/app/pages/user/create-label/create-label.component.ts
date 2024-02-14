import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { lastValueFrom } from 'rxjs';
import { HttpModelService } from 'src/app/http/http-model.service';
import { HttpPkta117Service } from 'src/app/http/http-pkta117.service';
import { ConvertTextService } from 'src/app/service/convert-text.service';
import { GenerateLabelService } from 'src/app/service/generate-label.service';
import Swal from 'sweetalert2';
import { MixLotService } from './mix-lot.service';
import { OneLotService } from './one-lot.service';
import { ManyLotService } from './many-lot.service';
import { HttpFormService } from 'src/app/http/http-form.service';
import { HttpSendingService } from 'src/app/http/http-sending.service';

export interface FORM {
  modelName?: any | null,
  shipmentDate?: Date | null,
  modelCode?: any | null,
  partNumber?: any | null,
  PO?: any | null,
  qty?: any | null,
  shipPlace?: any | null,
  shipTo?: any | null,
  invoice?: any | null,
  TTL?: any | null,
  lotNo?: any | null,
  lotShow?: any | null,
  boxNo?: any | null,
}
@Component({
  selector: 'app-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.scss']
})
export class CreateLabelComponent {

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

  }
  pkta117: any = null
  models: any = null
  dataSending: any = []
  // manyLot: boolean = false
  model: any
  mode: any = null

  constructor(
    private $convertText: ConvertTextService,
    private $pkta117: HttpPkta117Service,
    private $model: HttpModelService,
    private $label: GenerateLabelService,
    private $mixLot: MixLotService,
    private $oneLot: OneLotService,
    private $manyLot: ManyLotService,
    private $form: HttpFormService,
    private $sending: HttpSendingService
  ) {

  }
  async ngOnInit(): Promise<void> {
    try {
      const resDataPKTA117 = await lastValueFrom(this.$pkta117.get(new HttpParams()))
      this.pkta117 = resDataPKTA117
      const resDataModel = await lastValueFrom(this.$model.get(new HttpParams()))
      this.models = resDataModel

    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

  generateBarcodeDataURL(barcodeValue: any, options: any) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, barcodeValue, options);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    });
  };
  async onUpload117($event: any) {
    try {
      let file: any = $event.target.files as File;
      const data = await this.$convertText.continueFiles(file)
      console.log("🚀 ~ data:", data)
      const resData = await lastValueFrom(this.$pkta117.import(data))
      this.pkta117 = resData
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
  onScanIndicate($event: any) {
    if ($event.key == 'Enter' || $event.key == 'Tab') {
      let value = this.scan.nativeElement.value
      value = value?.length > 0 ? value.trim() : value
      this.scan.nativeElement.value = ''
      this.scan.nativeElement.focus()
      setTimeout(() => {
        try {
          let spValue = value.split(',')
          if (spValue.length !== 6) {
            // this.manyLot = true
            // this.manageManyLot(value, spValue)
            // this.scanSending.nativeElement.focus()
            const { form, model }: any = this.$manyLot.many(spValue, this.models, this.pkta117)
            if (!form || !model) throw ''
            this.form = form
            this.model = model
            setTimeout(() => {
              this.scanSending.nativeElement.focus()
            }, 100);
            this.mode = 'many'

          } else if (spValue[4] != 'MIX LOT') {
            const { form, model }: any = this.$oneLot.one(spValue, this.models, this.pkta117)
            if (!form || !model) throw ''
            this.form = form
            this.model = model
            setTimeout(() => {
              this.scanSending.nativeElement.focus()
            }, 100);
            this.mode = 'one'

            // console.log('normal');
            // this.manyLot = false
            // this.manageNormalLotAndMixLot(value, spValue)
            // this.scanSending.nativeElement.focus()
          } else {
            const { form, model }: any = this.$mixLot.mix(spValue, this.models, this.pkta117)
            if (!form || !model) throw ''
            this.form = form
            this.model = model
            setTimeout(() => {
              this.scanSending.nativeElement.focus()
            }, 100);
            this.mode = 'mix'

          }
        } catch (error) {
          console.log("🚀 ~ error:", error)
        }
        // let dataFound = this.pkta117.find((item:any)=>item['Cust PO#']==value)
      }, 100);
    }
  }



  async onScanSending($event: any) {
    try {
      if ($event.key == 'Enter' || $event.key == 'Tab') {
        let value = this.scanSending.nativeElement.value
        value = value?.length > 0 ? value.trim() : value
        console.log("🚀 ~ value:", value)
        // this.scanSending.nativeElement.value = ''
        // this.scanSending.nativeElement.focus()

        // if (this.manyLot) {
        //   this.createDataSendingManyLot(value)
        // } else {
        //   this.createDataSendingNormalLotAndMixLot(value)
        // }

        if (this.mode == 'many') {
          this.dataSending = await this.$manyLot.manySend(value, this.form, this.model, this.dataSending)
          console.log("🚀 ~ this.dataSending:", this.dataSending)
          this.scanSending.nativeElement.value = ''
          setTimeout(() => {
            this.scanSending.nativeElement.focus()
          }, 100);
        }
        if (this.mode == 'one') {
          this.dataSending = await this.$oneLot.oneSend(value, this.form, this.model, this.dataSending)
          console.log("🚀 ~ this.dataSending:", this.dataSending)
          this.scanSending.nativeElement.value = ''
          setTimeout(() => {
            this.scanSending.nativeElement.focus()
          }, 100);

        }
        if (this.mode == 'mix') {
          this.dataSending = await this.$mixLot.mixSend(value, this.form, this.model, this.dataSending)
          console.log("🚀 ~ this.dataSending:", this.dataSending)
          this.scanSending.nativeElement.value = ''
          setTimeout(() => {
            this.scanSending.nativeElement.focus()
          }, 100);

        }


      }
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }

  }


  // todo summary total qty scan
  sumScan() {
    return this.dataSending.reduce((p: any, n: any) => {
      return p += Number(n.qty)
    }, 0)
  }

  // todo class
  scanBarClass() {
    if (!this.form.qty) return 'bg-red-300'
    if (this.sumScan() != Number(this.form.qty)) return 'bg-red-300'
    return 'bg-green-100'
  }

  // todo status upload pkta117
  fileUploadPKTA117Class() {
    if (this.pkta117 && this.pkta117.length > 0) {
      return 'bg-green-100'
    }
    return 'bg-red-400'
  }

  // todo show lasted upload pkta117
  showLastPKTA117() {
    if (this.pkta117 && this.pkta117.length > 0) {
      return moment(this.pkta117[0].createdAt).format('DD-MMM-YYYY, HH:mm')
    }
    return 'not have pkta117'
  }


  // todo print
  onClickPrint() {
    this.$label.generatePDF('foo')
  }

  // todo submit
  async onSubmit() {
    try {
      console.log(this.form);
      console.log(this.dataSending);
      const newData = {
        ...this.form,
        model: this.model,
        mode: this.mode,
      }
      const { runNo } = await lastValueFrom(this.$form.runNo())
      console.log("🚀 ~ runNo:", runNo)
      newData['runNo'] = runNo
      await lastValueFrom(this.$form.create(newData))
      await lastValueFrom(this.$sending.create(this.dataSending.map((item: any) => {
        return {
          ...item,
          runNo: runNo,
          printNo: 0,
          printHistory:null
        }
      })))
      Swal.fire({
        title: 'Success',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      }).then(() => location.reload())
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
}

