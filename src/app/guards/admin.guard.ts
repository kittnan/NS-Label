import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { LocalStoreService } from '../service/local-store.service';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivate {

  constructor(
    private router: Router,
    private $local: LocalStoreService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.$local.getRole() == 'admin') {
      return true
    }else{
      this.$local.removeAllLocalStore()
      alert()
      this.router.navigate(['login'])
      return false
    }
  }

}
