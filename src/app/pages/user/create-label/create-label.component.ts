import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConvertTextService } from 'src/app/service/convert-text.service';
export interface FORM {
  modelName?: string,
  shipmentDate?: Date,
  modelCode?: string,
  partNumber?: string,
  PO?: string,
  qty?: string,
  shipPlace?: string,
  shipTo?: string,
  invoice?: string,
  TTL?: string,
  lotNo?: string,
  BoxNo?: string,
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

  form = {
    modelName: null,
    shipmentDate: new Date(),
    modelCode: null,
    partNumber: null,
    PO: null,
    qty: null,
    shipPlace: null,
    shipTo: null,
    invoice: null,
    TTL: null,
    lotNo: null,
    boxNo: null,

  }
  constructor(
    private $convertText: ConvertTextService,
    private el: ElementRef
  ) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  async onUpload117($event: any) {
    try {
      let file: any = $event.target.files as File;
      const data = await this.$convertText.continueFiles(file)
      console.log("🚀 ~ data:", data)
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  onScan($event: any) {
    let value = $event.target.value
    setTimeout(() => {
      this.scan.nativeElement.value = ''
    }, 300);
  }
  onScanSending($event: any) {
    let value = $event.target.value
    if ($event.key == 'Enter' || $event.key == 'Tab') {
      console.log("🚀 ~ value:", this.scanSending.nativeElement.value)
      setTimeout(() => {
        this.scanSending.nativeElement.value = ''
        let el = document.getElementById('scanSending')?.focus()
      }, 300);
    }


  }
}
