import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';
import { BasketService } from './basket/basket.service';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'SkiNet';
  
  constructor(private basketService: BasketService,private accountService:AccountService) {
    
  }
  ngOnInit(): void {
   this.loadBasket();
   this.loadCurrentUser();
  }

  loadBasket(){
    const basketId = localStorage.getItem('basket_id');   // Here why we are adding this service means, when we are refreshing the page, already added baskets also refreshed and  we can got. So its only loaded for the first time.
    if(basketId) this.basketService.getBasket(basketId);
  }

  loadCurrentUser(){
    var token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe();
  }
}
