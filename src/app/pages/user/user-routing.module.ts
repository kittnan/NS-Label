import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLabelComponent } from './create-label/create-label.component';
import { PrintLabelComponent } from './print-label/print-label.component';

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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
