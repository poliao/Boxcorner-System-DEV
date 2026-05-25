import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

export interface FoodOrderSession {
  id: number;
  restaurantName: string;
  status: 'OPEN' | 'SENT';
  openedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodOrderItem {
  id?: number;
  sessionId: number;
  username?: string;
  displayName: string;
  menuName: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodOrderView {
  session: FoodOrderSession | null;
  items: FoodOrderItem[];
  currentUser: string;
  canControl: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FoodOrderService implements OnDestroy {

  private apiUrl = `${environment.apiUrl}/food-order`;
  private wsUrl = environment.apiUrl.replace(/\/api\/?$/, '') + '/ws';

  private client?: Client;
  private refresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  getActive(): Observable<FoodOrderView> {
    return this.http.get<FoodOrderView>(`${this.apiUrl}/active`);
  }

  openSession(restaurantName: string): Observable<FoodOrderSession> {
    return this.http.post<FoodOrderSession>(`${this.apiUrl}/session`, { restaurantName });
  }

  sendSession(id: number): Observable<FoodOrderSession> {
    return this.http.post<FoodOrderSession>(`${this.apiUrl}/session/${id}/send`, {});
  }

  addItem(item: FoodOrderItem): Observable<FoodOrderItem> {
    return this.http.post<FoodOrderItem>(`${this.apiUrl}/items`, item);
  }

  updateItem(id: number, item: FoodOrderItem): Observable<FoodOrderItem> {
    return this.http.put<FoodOrderItem>(`${this.apiUrl}/items/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  connect(): Observable<void> {
    if (!this.client) {
      this.client = new Client({
        webSocketFactory: () => new SockJS(this.wsUrl) as any,
        reconnectDelay: 3000,
        onConnect: () => {
          this.client!.subscribe('/topic/food-order', (_msg: IMessage) => {
            this.refresh$.next();
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        }
      });
      this.client.activate();
    }
    return this.refresh$.asObservable();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = undefined;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
