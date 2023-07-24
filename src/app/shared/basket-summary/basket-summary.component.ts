import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasketItem } from '../models/basket';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent implements OnInit {
  // Why we are using this output property?
  // Because this component will act as a shared component for both review and basketComponent, so In Basket Component we are already using two functionalities, so we need to return this two events into BasketComponent
  @Output() addItem = new EventEmitter<BasketItem>();
  @Output() removeItem = new EventEmitter<{ id: number; quantity: number }>();
  @Input() isBasket = true;
  constructor(public basketService: BasketService) {}

  ngOnInit(): void {}

  addBasketItem(item: BasketItem) {
    this.addItem.emit(item);
  }

  removeBasketItem(id: number, quantity: number) {
    this.removeItem.emit({ id, quantity });
  }
}
