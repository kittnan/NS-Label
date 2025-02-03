import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminModule } from './pages/admin/admin.module';
import { UserModule } from './pages/user/user.module';
import { GuestModule } from './pages/guest/guest.module';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';
import { SelectDepartmentComponent } from './pages/select-department/select-department.component';
import { SapModule } from './pages/sap/sap.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'select-department',
    component: SelectDepartmentComponent
  },
  {
    path: 'admin',
    loadChildren: () => AdminModule,
    canActivate: [adminGuard],
  },
  {
    path: 'user',
    loadChildren: () => UserModule,
    canActivate: [userGuard],
  },
  {
    path: 'guest',
    loadChildren: () => GuestModule,
    canActivate: [],
  },
  {
    path: 'sap',
    loadChildren: () => SapModule,
    canActivate: [],
  },
  { path: '**', component: NotfoundComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
