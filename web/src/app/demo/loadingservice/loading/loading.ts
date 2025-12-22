import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/demo/loadingservice/loading';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.scss']
})
export class LoadingComponent {
  // รับค่าสถานะจาก Service โดยตรง
  isLoading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}