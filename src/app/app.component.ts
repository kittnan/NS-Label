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
  role: any,
  department: any,
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
      department: [],

      items: [

        {
          title: 'Manage',
          icon: 'user-avatar.png',
          path: 'admin/user-manage',
          items: [],
          role: [''],
          department: []
        },

      ]
    },
    {
      title: 'Model',
      icon: 'model.png',
      path: '',
      role: ['admin'],
      department: [],

      items: [
        {
          title: 'Manage',
          icon: 'project-management.png',
          path: 'admin/model',
          items: [],
          role: [],
          department: []

        },

      ]
    },
    {
      title: 'Label',
      icon: 'price-tag.png',
      path: '',
      role: ['admin', 'user'],
      department: ['PE'],

      items: [
        {
          title: 'Create',
          icon: 'warranty.png',
          path: 'user/create-pe',
          items: [],
          role: [],
          department: [],


        },
        {
          title: 'Create SAP',
          icon: 'warranty.png',
          path: 'sap/create-pe',
          items: [],
          role: [],
          department: [],


        },
        {
          title: 'Print',
          icon: 'printer.png',
          path: 'user/print',
          items: [],
          role: [],
          department: [],


        },

      ]
    },
    {
      title: 'Label',
      icon: 'price-tag.png',
      path: '',
      role: ['admin', 'user'],
      department: ['FGWH'],

      items: [

        {
          title: 'Create',
          icon: 'warranty.png',
          path: 'user/create-fgwh',
          items: [],
          role: [],
          department: [],


        },
        {
          title: 'Print',
          icon: 'printer.png',
          path: 'user/print',
          items: [],
          role: [],
          department: [],


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
    if (this.$local.getProfile() && this.$local.getDepartment()) {
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
    }, 1000);
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
  displayRole() {
    return `(${this.$local.getRole()})`
  }
  // todo show role login
  displayDepartment() {
    return `(${this.$local.getDepartment()})`
  }

  // todo check role login
  checkRole(role: any, department: any) {
    let roleLogin: any = this.$local.getRole()
    let departmentLogin: any = this.$local.getDepartment()


    if (role?.length === 0 && department?.length == 0) {
      return true
    }

    if (role?.length > 0) {
      if (role.some((r: any) => r == roleLogin) && department?.length == 0) {
        return true
      }
      if (role.some((r: any) => r == roleLogin) && department?.length > 0) {
        if (department.some((d: any) => d == departmentLogin)){
          return true
        }
      }
      }
    return false

  }
}
