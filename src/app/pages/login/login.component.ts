import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LocalStoreService } from 'src/app/service/local-store.service';
import { bounceInAnimation, fadeInOnEnterAnimation, flipAnimation, flipOutXAnimation } from 'angular-animations';

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
    private $local: LocalStoreService
  ) { }

  ngOnInit(): void {
    let localUser: any = localStorage.getItem('NS-Label_user')
    this.userLogin = JSON.parse(localUser)

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
      // const userLogin :any= await lastValueFrom(this.$user.login({
      //   username: username,
      //   password: password
      // }))
      // console.log("🚀 ~ userLogin:", userLogin)
      // if (userLogin && userLogin.length > 0) {
      //   localStorage.setItem('RGAS_user', JSON.stringify(userLogin[0]))
      //   this.userLogin = userLogin[0]
      //   if (userLogin && userLogin.access && userLogin.access.length === 1) {
      //     this.goLink(userLogin.access[0])
      //   }
      // }
      // // localStorage.setItem('RGAS_login', 'ok')

      // console.log("🚀 ~ userLogin:", userLogin)

      this.goLink('admin')
    } catch (error) {
      console.log("🚀 ~ error:", error)
      alert('')
    }
  }

  goLink(access: string) {
    console.log("🚀 ~ access:", access)
    this.$local.saveLocalStore('NS-Label_access',access)
    this.$local.saveLocalStore('NS-Label_access',access)
    switch (access) {
      case 'admin':
        this.router.navigate(['admin']).then(() => location.reload())
        break;
      case 'logout':
        this.$local.removeAllLocalStore()
        break;

      default:
        break;
    }
  }


  loginStatus() {
    if (localStorage.getItem('RGAS_user')) {
      return true
    } else {
      return false
    }
  }
}
