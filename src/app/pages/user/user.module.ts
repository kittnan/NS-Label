import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { CreateLabelComponent } from './create-label/create-label.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrintLabelComponent } from './print-label/print-label.component';
import { PrintPreviewComponent } from './print-preview/print-preview.component';


@NgModule({
  declarations: [
    UserComponent,
    CreateLabelComponent,
    PrintLabelComponent,
    PrintPreviewComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    SharedModule
  ]
})
export class UserModule { }
