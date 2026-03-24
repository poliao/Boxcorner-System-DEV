import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 20, 50, 100, 200, 500];
  @Input() clickableColumn = '';
  @Input() headerStyle = 'background: #171851; color: white;';
  @Input() rowStyles: (row: any) => any = () => ({});

  @Output() pageChange = new EventEmitter<{ pageIndex: number, pageSize: number }>();
  @Output() rowClick = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);

  private get storageKey(): string {
    return `pagination_${window.location.pathname}`;
  }

  ngOnInit() {
    const savedStateStr = sessionStorage.getItem(this.storageKey);
    if (savedStateStr) {
      try {
        const state = JSON.parse(savedStateStr);
        if (state.pageIndex !== undefined) {
          this.pageIndex = state.pageIndex;
          this.pageSize = state.pageSize;
          // Emit immediately so the parent knows to fetch this restored page
          setTimeout(() => {
            this.pageChange.emit({
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
            });
          });
        }
      } catch (e) { }
    }
  }

  ngAfterViewInit() {
    this.dataSource.data = this.data;

    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.pageSize = this.pageSize;

      this.paginator.page.subscribe(() => {
        sessionStorage.setItem(this.storageKey, JSON.stringify({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize
        }));

        this.pageChange.emit({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['pageIndex'] && this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      sessionStorage.setItem(this.storageKey, JSON.stringify({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }));
    }
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

  getNestedValue(row: any, key: string): any {
    if (!key || !row) return '-';
    return key.split('.').reduce((acc, part) => acc && acc[part], row) || '-';
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
}