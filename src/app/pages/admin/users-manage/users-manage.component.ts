import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpUserService } from 'src/app/http/http-user.service';
import * as ExcelJS from 'exceljs';
import * as saveAs from 'file-saver'
import * as XLSX from 'xlsx'
import { HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.scss']
})
export class UsersManageComponent {

  // todo table
  displayedColumns: string[] = ['employeeCode', 'firstName', 'lastName', 'role'];
  dataSource!: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // todo element files control
  @ViewChild('fileUpload', { static: true }) fileUpload!: ElementRef;

  constructor(
    private $user: HttpUserService
  ) {

  }

  async ngOnInit(): Promise<void> {
    try {
      let resData = await lastValueFrom(this.$user.get(new HttpParams()))
      this.dataSource = new MatTableDataSource(resData)
      setTimeout(() => {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }, 300);
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

  async onUpload($event: any) {
    let file: any = $event.target.files[0] as File;
    const wb: ExcelJS.Workbook = new ExcelJS.Workbook();
    try {
      await wb.xlsx.load(file);
      const ws: ExcelJS.Worksheet | undefined = wb.getWorksheet(1);
      const sheetData: any = [];
      let header: any = []
      if (ws)
        ws.eachRow(async (row: ExcelJS.Row, rowNumber: number) => {
          if (rowNumber === 1) {
            header = row.values
            header.filter((item: any) => item)
          } else {
            if (rowNumber !== 1) {  // Skip header row
              const rowData: any = {};
              row.eachCell((cell: any, colNumber: any) => {
                const key = header[colNumber]
                if (key == 'role') {
                  rowData[key] = rowData[key] && rowData[key].length >= 0 ? rowData[key] : []
                  rowData[key] = [...rowData[key], cell.value]
                } else {
                  rowData[key] = cell.value;
                }
              });
              sheetData.push(rowData);
              let lrNum: any = ws.lastRow?.number
              let lcNum: any = ws.lastColumn?.number
              if (lrNum && lrNum == rowNumber) {
                await lastValueFrom(this.$user.import(sheetData))
                location.reload()
                Swal.fire({
                  title: 'SUCCESS',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => location.reload())
              }
            }
          }
        });
      this.fileUpload.nativeElement.value = ''
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }

  async onDownload() {
    try {
      let resData: any = await lastValueFrom(this.$user.get(new HttpParams()))
      resData = resData.map((item: any) => {
        delete item._id
        delete item.createdAt
        delete item.updatedAt
        return item
      })

      const wb: any = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('My Sheet');
      ws.addRow(['employeeCode', 'firstName', 'lastName', 'role', 'role', 'role'])
      let dataSheet = resData.map((item: any) => {
        return [
          item.employeeCode,
          item.firstName,
          item.lastName,
          ...item.role
        ]
      })
      ws.addRows(dataSheet)
      wb.xlsx.writeBuffer().then((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `userMaster.xlsx`);
      });
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

}
