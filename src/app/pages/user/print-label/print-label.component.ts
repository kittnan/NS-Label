import { Component } from '@angular/core';

@Component({
  selector: 'app-print-label',
  templateUrl: './print-label.component.html',
  styleUrls: ['./print-label.component.scss']
})
export class PrintLabelComponent {


  constructor() {
  }

  ngOnInit(): void {
    try {
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
}
