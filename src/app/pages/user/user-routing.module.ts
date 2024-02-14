import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLabelComponent } from './create-label/create-label.component';
import { PrintLabelComponent } from './print-label/print-label.component';
import { PrintPreviewComponent } from './print-preview/print-preview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: CreateLabelComponent,
  },
  {
    path: 'print',
    component: PrintLabelComponent,
  },
  {
    path: 'print-preview',
    component: PrintPreviewComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
