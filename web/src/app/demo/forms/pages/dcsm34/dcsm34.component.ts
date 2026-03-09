import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Dcsm34Service } from './dcsm34.service';
import { LoadingService } from 'src/app/demo/loadingservice/loading';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-dcsm34',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule, FormsModule, MatIconModule, MatPaginatorModule],
    templateUrl: './dcsm34.component.html',
    styleUrls: ['./dcsm34.component.scss']
})
export class Dcsm34Component implements OnInit {
    logs: any[] = [];
    pageIndex = 0;
    pageSize = 10;
    totalElements = 0;
    totalPages = 0;

    searchJoId = '';
    searchTechnician = '';

    constructor(
        private dcsm34Service: Dcsm34Service,
        private alertParams: SweetAlertService,
        private loadService: LoadingService
    ) { }

    ngOnInit(): void {
        this.loadLogs();
    }

    loadLogs(): void {
        this.loadService.show();
        const filters = {
            joId: this.searchJoId,
            technicianName: this.searchTechnician
        };

        this.dcsm34Service.getAll(this.pageIndex, this.pageSize, filters).subscribe({
            next: (res) => {
                this.logs = res.content || [];
                this.totalElements = res.totalElements || 0;
                this.totalPages = res.totalPages || 0;
                this.loadService.hide();
            },
            error: (err) => {
                this.loadService.hide();
                this.alertParams.error('Error', 'ไม่สามารถโหลดข้อมูลประวัติการเคลือบได้');
            }
        });
    }

    onSearch(): void {
        this.pageIndex = 0;
        this.loadLogs();
    }

    onClearSearch(): void {
        this.searchJoId = '';
        this.searchTechnician = '';
        this.pageIndex = 0;
        this.loadLogs();
    }

    changePage(event: any): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadLogs();
    }
}
