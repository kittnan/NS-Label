import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelComponent } from './model/model.component';
import { UserComponent } from '../user/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'model',
    pathMatch: 'full',
  },
  {
    path: 'model',
    component: ModelComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
