// Angular import
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

type Approver = { userName: string; positionIds: number[] };
type EmployeeRow = { id: number; positionId: number | null };
type LeaveReq = { employeeId: number; status: string };

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit, OnDestroy {
  userName: string = 'User';
  userRole: string = 'Project Admin';
  isApprover = false;
  pendingCount = 0;

  private pollId: any;
  private client?: Client;
  private wsUrl = environment.apiUrl.replace(/\/api\/?$/, '') + '/ws';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userName = user.sub;
    }

    this.refreshApprovalBadge();

    // push จริง: subscribe WebSocket -> refresh ทันทีเมื่อมีคนส่ง/อนุมัติใบลา
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl) as any,
      reconnectDelay: 3000,
      onConnect: () => {
        this.client!.subscribe('/topic/leave-requests', (_msg: IMessage) => this.refreshApprovalBadge());
      },
      onStompError: (frame) => console.error('STOMP error', frame),
    });
    this.client.activate();

    // fallback poll ทุก 60 วิ (เผื่อ WebSocket หลุด)
    this.pollId = setInterval(() => this.refreshApprovalBadge(), 60000);
  }

  ngOnDestroy() {
    if (this.pollId) clearInterval(this.pollId);
    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
    }
  }

  // นับคำขอลาที่ "รออนุมัติ" และอยู่ในสายอนุมัติของผู้ใช้คนนี้
  private refreshApprovalBadge() {
    forkJoin({
      approvers: this.http.get<Approver[]>(`${environment.apiUrl}/dcsm45/approvers`),
      employees: this.http.get<EmployeeRow[]>(`${environment.apiUrl}/dcsm44/employees`),
      requests: this.http.get<LeaveReq[]>(`${environment.apiUrl}/leave-request`),
    }).subscribe({
      next: ({ approvers, employees, requests }) => {
        const me = (approvers || []).find(a => a.userName === this.userName);
        this.isApprover = !!me;
        if (!me) {
          this.pendingCount = 0;
          return;
        }
        const posSet = new Set<number>(me.positionIds || []);
        const empPos = new Map<number, number | null>((employees || []).map(e => [e.id, e.positionId]));
        this.pendingCount = (requests || []).filter(r => {
          const pos = empPos.get(r.employeeId);
          return (!r.status || r.status === 'pending') && pos != null && posSet.has(pos);
        }).length;
      },
      error: () => { /* คงค่าจำนวนเดิมไว้ */ }
    });
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
