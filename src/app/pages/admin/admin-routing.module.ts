import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelComponent } from './model/model.component';
import { UsersManageComponent } from './users-manage/users-manage.component';

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
    path: 'user-manage',
    component: UsersManageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
