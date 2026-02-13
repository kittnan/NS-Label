
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as ExcelJS from 'exceljs';
import * as saveAs from 'file-saver'
import * as XLSX from 'xlsx'
import * as moment from 'moment';
import { Subject, first, from, fromEvent, interval, lastValueFrom, map, of, switchMap } from 'rxjs';
import { HttpModelService } from 'src/app/http/http-model.service';
import Swal from 'sweetalert2';

export interface MODEL {
  internalModel?: string,
  partName?: string,
  type?: string,
  remark1?: string,
  remark2?: string,
  remark3?: string,
  modelName?: string,
}



@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent {

  // todo table
  displayedColumns: string[] = ['internalModel', 'partName', 'type', 'remark1', 'remark2', 'remark3', 'modelName','po','seiden'];
  dataSource!: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // todo element files control
  @ViewChild('fileUpload', { static: true }) fileUpload!: ElementRef;

  constructor(
    private $model: HttpModelService
  ) {

  }

  async ngOnInit(): Promise<void> {
    try {

      let resData = await lastValueFrom(this.$model.get(new HttpParams()))
      let data: MODEL = {
        internalModel: 'asdasd',
        partName: "asdasd",
        type: 'mass',
        remark1: '1',
        remark2: '11',
        remark3: '123',
        modelName: '12313'
      }
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
        ws.eachRow({ includeEmpty: true },async (row: ExcelJS.Row, rowNumber: number) => {
          if (rowNumber === 1) {
            header = row.values
            header.filter((item: any) => item)
          } else {
            if (rowNumber !== 1) {  // Skip header row
              const rowData: any = {};
              row.eachCell((cell: any, colNumber: any) => {
                const key = header[colNumber]
                rowData[key] = cell.value;
              });
              sheetData.push(rowData);
              let lrNum: any = ws.lastRow?.number
              let lcNum: any = ws.lastColumn?.number
              if (lrNum && lrNum == rowNumber) {
                await lastValueFrom(this.$model.import(sheetData))
                location.reload()
                Swal.fire({
                  title: 'SUCCESS',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => location.reload())
              }
            }
            console.log("🚀 ~ sheetData:", sheetData)
          }
        });
      this.fileUpload.nativeElement.value = ''
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }

  async onDownload() {
    try {
      let resData: any = await lastValueFrom(this.$model.get(new HttpParams()))
      resData = resData.map((item: any) => {
        delete item._id
        delete item.createdAt
        delete item.updatedAt
        return item
      })

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(resData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const blob: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });      // Save the Blob as an Excel file using file-saver
      saveAs(blob, 'model.xlsx');
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

}
