import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { HttpFormService } from 'src/app/http/http-form.service';
import { HttpSendingService } from 'src/app/http/http-sending.service';

@Component({
  selector: 'app-print-label',
  templateUrl: './print-label.component.html',
  styleUrls: ['./print-label.component.scss']
})
export class PrintLabelComponent {

  // todo table
  displayedColumns: string[] = ['select', 'PO', 'boxNo', 'lot', 'modelCode', 'modelName', 'qty', 'printNo', 'printHistory'];
  dataSource!: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);

  range_value = {
    start: null,
    end: new Date()
  }
  constructor(
    private $form: HttpFormService,
    private $sending: HttpSendingService,
    private router: Router
  ) {
    // this.$sending.printTable(new HttpParams()).pipe(map((items: any) => {
    //   return items.map((item: any) => {
    //     item.form = item.forms[0]
    //     item.PO = item.form.PO
    //     item.PO = item.form.PO
    //     item.boxNo = item.cs
    //     item.modelCode = item.form.modelCode
    //     item.modelName = item.form.modelName
    //     item.printNo = item.printNo
    //     item.printHistory = item.printHistory ? item.printHistory[item.printHistory.length - 1] : null
    //     delete item.forms
    //     return item
    //   })
    // })).subscribe((data: any) => {
    //   this.dataSource = new MatTableDataSource(data)
    //   setTimeout(() => {
    //     this.dataSource.sort = this.sort
    //     this.dataSource.paginator = this.paginator
    //   }, 300);
    // },
    //   ((err: any) => {
    //     console.log('err', err);
    //   }))


    // this.$sending.printTable(new HttpParams()).subscribe((res: any) => {
    //   this.dataSource = new MatTableDataSource(res)
    //   setTimeout(() => {
    //     this.dataSource.sort = this.sort
    //     this.dataSource.paginator = this.paginator
    //   }, 300);
    // })
  }

  ngOnInit(): void {
    try {
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  // todo on print
  onPrint() {
    try {
      this.router.navigate(['user/print-preview'], {
        state: this.selection.selected
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

  onSubmit() {
    let params: HttpParams = new HttpParams()
    params = params.set('start', JSON.stringify(this.range_value.start))
    params = params.set('end', JSON.stringify(this.range_value.end))
    this.$sending.printTable(params).pipe(map((items: any) => {
      return items.map((item: any) => {
        item.form = item.forms[0]
        item.PO = item.form.PO
        item.boxNo = item.cs
        item.modelCode = item.form.modelCode
        item.modelName = item.form.modelName
        item.printNo = item.printNo
        item.printHistory = item.printHistory ? item.printHistory[item.printHistory.length - 1] : null
        delete item.forms
        return item
      })
    })).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data)
      setTimeout(() => {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }, 300);
    },
      ((err: any) => {
        console.log('err', err);
      }))

  }
}
