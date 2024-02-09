import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStoreService } from './service/local-store.service';
import { MediaMatcher } from '@angular/cdk/layout';

interface SideItem {
  title: string,
  icon: string,
  path: string,
  items: SideItem[]
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
      icon: 'groups',
      path: '',
      items: [
        {
          title: 'New',
          icon: 'person_add_alt',
          path: 'user/create',
          items: []
        },
        {
          title: 'Manage',
          icon: 'manage_accounts',
          path: 'user/manage',
          items: []
        },

      ]
    },
    {
      title: 'Model',
      icon: 'groups',
      path: '',
      items: [
        {
          title: 'Manage',
          icon: 'manage_accounts',
          path: 'admin/model',
          items: []
        },

      ]
    },



  ]

  login: boolean = false
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router,
    private $local: LocalStoreService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    if (localStorage.getItem('NS-Label_access')) {
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
    this.$local.removeAllLocalStore()
    this.router.navigate(['/login']).then(() => location.reload())
  }

  // todo show user login nane
  displayName() {
    let userLogin: any = localStorage.getItem('RGAS_user')
    userLogin = userLogin ? JSON.parse(userLogin) : null
    if (userLogin) {
      let firstName = userLogin.firstName ? userLogin.firstName : ''
      let lastName = userLogin.lastName ? userLogin.lastName[0] : ''
      return `${firstName}-${lastName}`
    }
    return ''
  }
}
