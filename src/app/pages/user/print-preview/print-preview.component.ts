import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpSendingService } from 'src/app/http/http-sending.service';
import { GenerateLabelService } from 'src/app/service/generate-label.service';
import { LocalStoreService } from 'src/app/service/local-store.service';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})
export class PrintPreviewComponent {
  // todo table
  navigation: any
  items: any = null
  userLogin: any
  constructor(
    private router: Router,
    private $label: GenerateLabelService,
    private $sending: HttpSendingService,
    private $local: LocalStoreService
  ) {
    this.navigation = this.router.getCurrentNavigation()
    let profile: any = this.$local.getProfile()
    profile = profile ? JSON.parse(profile) : null
    this.userLogin = profile
  }

  ngOnInit(): void {
    try {
      if (this.navigation?.extras?.state) {
        const state: any = this.navigation.extras.state
        if (!state) throw '1'
        if (typeof state == 'object') {
          const valuesArray = Object.values(state);
          this.items = valuesArray
        } else {
          this.items = state
        }
      } else {
        throw '2'
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
      this.router.navigate(['user/print'])
    }
  }


  // todo on print
  async onPrint() {
    try {
      await lastValueFrom(this.$sending.createOrUpdate(this.items.map((item: any) => {
        const fullName = `${this.userLogin.firstName} ${this.userLogin.lastName}`
        delete item.form
        return {
          ...item,
          printNo: item.printNo ? item.printNo + 1 : 1,
          printHistory: item.printHistory ? [...item.printHistory, fullName] : [fullName],
        }
      })))
      this.$label.generatePDF('foo')
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }



}
