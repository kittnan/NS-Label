import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SapCreateLabelComponent } from './1-create/sap-create-label/sap-create-label.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
  {
    path: 'create-pe',
    component: SapCreateLabelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SapRoutingModule { }
