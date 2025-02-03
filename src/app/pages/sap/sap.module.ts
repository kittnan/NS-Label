import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SapRoutingModule } from './sap-routing.module';
import { SapCreateLabelComponent } from './1-create/sap-create-label/sap-create-label.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SapCreateLabelComponent,
  ],
  imports: [
    CommonModule,
    SapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    SharedModule
  ]
})
export class SapModule { }
