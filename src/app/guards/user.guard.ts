import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { LocalStoreService } from '../service/local-store.service';
import { adminGuard } from './admin.guard';

@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {

  constructor(
    private router: Router,
    private $local: LocalStoreService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.$local.getRole() == 'user' || adminGuard) {
      return true
    }
    this.$local.removeAllLocalStore()
    alert()

    this.router.navigate(['login'])
    return false
  }

}
