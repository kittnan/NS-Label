import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubTitleComponent } from './sub-title/sub-title.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TitleComponent } from './title/title.component';

let item = [
  SubTitleComponent,
  TitleComponent
]

@NgModule({
  declarations: [
    ...item
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports:[
    ...item
  ]
})
export class SharedModule { }
