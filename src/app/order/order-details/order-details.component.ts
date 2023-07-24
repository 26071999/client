import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from 'src/app/shared/models/order';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
order?:Order;
  constructor(private activatedRoute:ActivatedRoute,private breadCrumb:BreadcrumbService, private orderService:OrderService) {
    this.breadCrumb.set('@OrderDetails','');
   }

  ngOnInit(): void {
   this.getOrderById();
  }
  getOrderById() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
    this.orderService.getOrderById(+id).subscribe({
      next: (order) => {
        this.order = order;
        this.breadCrumb.set('@OrderDetails',`Order# ${order.id} - ${order.orderStatus}`);
      },
    });
  }
}
}
