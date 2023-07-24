import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(public basketService:BasketService,public accountService:AccountService) { } 

  ngOnInit(): void {

    
  }

  getItemsCount(items:BasketItem[]){
    return items.reduce((sum,item)=> sum + item.quantity,0);  // this method was used to get the total count of added basket items, previously the already added items are not added, so we are using this method.
  }

}
