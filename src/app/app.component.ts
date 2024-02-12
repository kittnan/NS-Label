import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStoreService } from './service/local-store.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface SideItem {
  title: string,
  icon: string,
  path: string,
  items: SideItem[],
  role: any
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NS Slope Shipment Label';
  theme = false;

  mobileQuery!: MediaQueryList;

  fillerNav: SideItem[] = [
    {
      title: 'Users',
      icon: 'multiple-users-silhouette.png',
      path: '',
      role: [
        'admin'
      ],
      items: [

        {
          title: 'Manage',
          icon: 'user-avatar.png',
          path: 'admin/user-manage',
          items: [],
          role: [''],

        },

      ]
    },
    {
      title: 'Model',
      icon: 'model.png',
      path: '',
      role: ['admin'],
      items: [
        {
          title: 'Manage',
          icon: 'project-management.png',
          path: 'admin/model',
          items: [],
          role: [''],

        },

      ]
    },
    {
      title: 'Label',
      icon: 'price-tag.png',
      path: '',
      role: ['admin', 'user'],
      items: [
        {
          title: 'Create Label',
          icon: 'warranty.png',
          path: 'user/create',
          items: [],
          role: [''],

        },

      ]
    },



  ]

  login: boolean = false
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private $local: LocalStoreService,
    private $loader: NgxUiLoaderService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    if (this.$local.getProfile()) {
      this.login = true
    } else {
      this.login = false
      // this.router.navigate(['/login'])
    }
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  onLogout() {
    this.$loader.start()
    this.$local.removeAllLocalStore()
    setTimeout(() => {
      this.router.navigate(['/login']).then(() => location.reload())
    }, 300);
  }

  // todo show user login name
  displayName() {
    let userLogin: any = this.$local.getProfile()
    userLogin = userLogin ? JSON.parse(userLogin) : null
    if (userLogin) {
      let firstName = userLogin.firstName ? userLogin.firstName : ''
      let lastName = userLogin.lastName ? userLogin.lastName[0] : ''
      return `${firstName}-${lastName}`
    }
    return ''
  }

  // todo show role login
  displayRole(){
    return `(${this.$local.getRole()})`
  }

  // todo check role login
  checkRole(role: any) {
    let roleLogin: any = this.$local.getRole()
    if (role.some((r: string) => r == roleLogin)) return true
    return false
  }
}
