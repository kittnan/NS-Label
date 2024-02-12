import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LocalStoreService } from 'src/app/service/local-store.service';
import { bounceInAnimation, fadeInOnEnterAnimation, flipAnimation, flipOutXAnimation } from 'angular-animations';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    flipOutXAnimation({ delay: 1000, duration: 200 }),
  ]
})
export class LoginComponent {
  readonly loginForm = new FormGroup({
    username: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
  })
  userLogin: any
  constructor(
    private router: Router,
    private $local: LocalStoreService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    let profile: any = this.$local.getProfile()
    this.userLogin = JSON.parse(profile)

  }
  onSubmit() {
    try {
      const { username, password }: any = this.loginForm.value;
      console.log(this.loginForm.value);
      // this.router.navigate(['/admin']).then(() => location.reload())
      this.onLogin(username, password)
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  async onLogin(username: any, password: any) {
    try {
      const auth: any = await lastValueFrom(this.http.post(`${environment.API}/auth/login-SSO`, {
        name: username,
        pass: password
      }))
      if (auth) {
        this.$local.setToken(auth.access_token)
        this.$local.setRefreshToken(auth.refresh_token)
        this.userLogin = auth.profile
        let profiles = {
          ...auth.profile,
          ...auth.adAcc
        }
        console.log("🚀 ~ profiles:", profiles)
        this.$local.setProfile(JSON.stringify(profiles))
      }

    } catch (error) {
      Swal.fire({
        title: 'User or password it wrong!!',
        icon: 'error',
      })
      console.log("🚀 ~ error:", error)
    }
  }

  goLink(role: string) {
    console.log("🚀 ~ role:", role)
    this.$local.setRole(role)
    switch (role) {
      case 'admin':
        this.router.navigate(['admin']).then(() => location.reload())
        break;
      case 'user':
        this.router.navigate(['user']).then(() => location.reload())
        break;
      case 'logout':
        this.$local.removeAllLocalStore()
        break;

      default:
        break;
    }
  }


  loginStatus() {
    if (localStorage.getItem('NS-Label_profile')) {
      return true
    } else {
      return false
    }
  }
}
