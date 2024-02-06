import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLabelComponent } from './create-label/create-label.component';

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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
