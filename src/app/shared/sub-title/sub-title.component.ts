import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-title',
  templateUrl: './sub-title.component.html',
  styleUrls: ['./sub-title.component.scss']
})
export class SubTitleComponent implements OnInit {
  @Input() title: string = ''
  @Input() icon: string = 'check_circle'

  constructor() { }

  ngOnInit(): void {
  }

}
