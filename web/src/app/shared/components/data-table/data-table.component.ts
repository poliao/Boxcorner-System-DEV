import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 20, 50, 100, 200, 500];
  @Input() clickableColumn = '';
  @Input() headerStyle = 'background: #171851; color: white;';
  
  @Output() pageChange = new EventEmitter<{pageIndex: number, pageSize: number}>();
  @Output() rowClick = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource = new MatTableDataSource<any>([]);

  ngAfterViewInit() {
    this.dataSource.data = this.data;
    
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageChange.emit({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize
        });
      });
    }
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }

  getDisplayedColumns(): string[] {
    if (!this.columns || this.columns.length === 0) {
      return [];
    }
    if (window.innerWidth <= 900) {
      return this.columns.slice(0, 3).map(col => col.key).filter(key => key);
    }
    return this.columns.map(col => col.key).filter(key => key);
  }

  onRowClick(row: any, columnKey: string) {
    if (this.clickableColumn === columnKey) {
      this.rowClick.emit(row);
    }
  }
}