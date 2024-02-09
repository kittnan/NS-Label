import { Injectable } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
@Injectable({
  providedIn: 'root'
})
export class QrCodeAndBarcodeService {

  constructor() { }


  // todo gen bar code
  genBarcode1(value: any) {
    return this.generateBarcodeDataURL(value,
      {
        format: 'CODE39',
        displayValue: false,
        margin: 0,
        marginLeft: 5,
        marginRight: 5,
        textMargin: 0,
        height: 120,
        width: 4
      })
  }
  genBarcode2(value: any) {
    return this.generateBarcodeDataURL(value,
      {
        format: 'CODE39',
        displayValue: false,
        margin: 0,
        marginLeft: 5,
        marginRight: 5,
        textMargin: 0,
        height: 120,
        width: 4
      })
  }
  genBarcode3(value: any) {
    return this.generateBarcodeDataURL(value,
      {
        format: 'CODE39',
        displayValue: false,
        margin: 0,
        marginLeft: 5,
        marginRight: 5,
        textMargin: 0,
        height: 25,
        width: 1.5
      })
  }
  genBarcode4(value: any) {
    return this.generateBarcodeDataURL(value,
      {
        format: 'CODE39',
        displayValue: false,
        margin: 0,
        marginLeft: 5,
        marginRight: 5,
        textMargin: 0,
        height: 70,
        width: 4
      })
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
}
