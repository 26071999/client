import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product:IProduct;
  quantity =1;
  quantityInBasket =0;
  constructor(private shopService:ShopService,private activatedRoute:ActivatedRoute,private breadcrumbService:BreadcrumbService,
              private basketService:BasketService) {
    this.breadcrumbService.set('@productDetails',' '); //This will be use for when after loaded the values from API, then only it will show the title of the product
   }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');  // It wil used to get the id of the route by mapping the "id" value in the active route, but its returns only either string or null.
    if(id){
      this.shopService.getProduct(+id).subscribe({   //this (+) casting was used to convert the string into number type.
        next:product=>{
          this.product = product;
          this.breadcrumbService.set('@productDetails',product.name);  // This is used to set the productName as the breadcrumb alias when view the product page, "productDetails" this alias key we are already set in the "ShopRoutingModule" class
          this.basketService.basketSource$.pipe(take(1)).subscribe({    // Here by using this pipe method, we can easily unsubscribe the basket Observable and then we can subscribe based on our requirement.
            next:basket =>{
              const item = basket.basketItems.find(x=>x.id === +id);
              if(item){
                  this.quantity = item.quantity;        //This is used to update the components when increment or decrement the button
                  this.quantityInBasket =item.quantity;
              }
            }
          })
        },
        error:error=>console.log(error)
      }) ;
    }
  }

  incrementQuantity(){
    this.quantity++;
  }

  decrementQuantity(){
    this.quantity--;
  }

  updateBasket(){
    if(this.product){
      if(this.quantity > this.quantityInBasket){
       const itemsToAdd = this.quantity - this.quantityInBasket;
       this.quantityInBasket +=itemsToAdd;
       this.basketService.addItemIntoBasket(this.product,itemsToAdd);
      }
      else{
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemFromBasket(this.product.id,itemsToRemove);
      }
    }
  }
  get buttonText(){
    return this.quantityInBasket ===0 ? 'Add to Basket' : 'Update Basket';
  }
}
