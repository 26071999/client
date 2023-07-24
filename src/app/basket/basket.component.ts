import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { BasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  constructor(public basketService:BasketService) { }

  ngOnInit(): void {
  }

  incrementBasketQuantity(basket:BasketItem){
    this.basketService.addItemIntoBasket(basket);
  }

  removeItem(event:{id:number,quantity:number}){
    this.basketService.removeItemFromBasket(event.id,event.quantity);
  }
}
