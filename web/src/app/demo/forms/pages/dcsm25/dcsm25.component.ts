import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Dcsm25Service } from './dcsm25.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { StatusColorService } from 'src/app/shared/services/status-color.service';

@Component({
  selector: 'app-dcsm25',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, DataTableComponent],
  templateUrl: './dcsm25.component.html',
  styleUrls: ['./dcsm25.component.scss']
})
export class Dcsm25Component implements OnInit {
  
  filterId: string = null;
  filterJobId: string = null;
  filterCustomerName: string = null;
  filterPrintStatus: string = null;
  filterStartDate: string = null;
  filterEndDate: string = null;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  tableData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  tableColumns = [
    { key: 'id', label: 'ลำดับ'},
    { key: 'jobId', label: 'JOB ID'},
    { key: 'customerJobName', label: 'ชื่อลูกค้า/ชื่องาน'},  
    { key: 'deliveryDate', label: 'วันที่ส่งพิมพ์',},
    { key: 'printerName', label: 'พิมพ์ที่',},
    { key: 'jobStatus', label: 'สถานะงาน', styleFunction: this.getStatusColumnStyle.bind(this)  },
  ];


  constructor(
    private dcsm25Service: Dcsm25Service,
    private router: Router,
    private loadingService: LoadingService,
    private sweetAlert: SweetAlertService,
    private statusColorService: StatusColorService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    const filters = {
      id: this.filterId,
      jobId: this.filterJobId,
      customerJobName: this.filterCustomerName,
      printerName: this.filterPrintStatus,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate
    };

    this.dcsm25Service.getOrdersWithSearch(this.pageIndex, this.pageSize, filters)
      .subscribe({
        next: (response: any) => {
          this.tableData = response.content.map((item: any) => ({
            ...item,
            date: this.formatDate(item.date),
            printingDate: this.formatDate(item.printingDate),
            coatingDate: this.formatDate(item.coatingDate),
            stampingDate: this.formatDate(item.stampingDate),
            gluingDate: this.formatDate(item.gluingDate),
            qcDate: this.formatDate(item.qcDate),
            dueDate: this.formatDate(item.dueDate)
          }));
          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.loadingService.hide();
          this.sweetAlert.error('Error', 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearchChange() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['/Dcsm25Detail', row.id]);
    }
  }

  getStatusColumnStyle(columnKey: string, rowData: any): any {
    if (columnKey === 'printStatus') {
      const statusColor = this.statusColorService.getStatusColor(rowData.printStatus);
      return {
        'background-color': statusColor,
        'color': '#ffffffff'
      };
    }
    return {};
  }

  clearAllFilters() {
    this.filterId = '';
    this.filterJobId = '';
    this.filterCustomerName = '';
    this.filterPrintStatus = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.onSearchChange();
  }
}
