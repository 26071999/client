import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() product:IProduct;  // this Input decorator is used to configure the properties into the HTML DOM

  constructor(private basketService:BasketService) { }

  ngOnInit(): void {
  }

  addItemIntoBasket(){
    this.product && this.basketService.addItemIntoBasket(this.product);
  }

}
