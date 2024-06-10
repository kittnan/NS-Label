import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStoreService } from 'src/app/service/local-store.service';

@Component({
  selector: 'app-select-department',
  templateUrl: './select-department.component.html',
  styleUrls: ['./select-department.component.scss']
})
export class SelectDepartmentComponent {

  userLogin: any
  constructor(
    private $local: LocalStoreService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    try {
      let profile: any = this.$local.getProfile()
      this.userLogin = JSON.parse(profile)
      if (this.userLogin && this.userLogin.department && this.userLogin.department.length == 1) {
        this.goLink(this.userLogin.department[0])
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

  goLink(department: any) {
    this.$local.setDepartment(department)
    let role = this.$local.getRole()
    if (role == 'admin') {
      this.router.navigate(['admin']).then(() => location.reload())
    } else if (role == 'user') {
      if (department == 'PE') {
        this.router.navigate(['user/create-pe']).then(() => location.reload())
      }
      if (department == 'FGWH') {
        this.router.navigate(['user/create-fgwh']).then(() => location.reload())
      }
    }

  }
}
