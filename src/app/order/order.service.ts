import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../shared/models/order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

  getOrders(){
    return this.httpClient.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrderById(id:number){
    return this.httpClient.get<Order>(this.baseUrl + 'orders/' + id);
  }
}
