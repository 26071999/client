import { Injectable } from '@angular/core';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../shared/models/product';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();
  discount=10;
  constructor(private httpClient: HttpClient) {}

  createPaymentIntent(){
  return  this.httpClient.post<Basket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id,{})
  .pipe(
    map(basket=>{
      this.basketSource.next(basket);
    })
  )  //If we are not passing any body, then we have to pass empty object.
  }
  getBasket(id: string) {
    return this.httpClient
      .get<Basket>(this.baseUrl + 'basket/GetBasket?id=' + id)
      .subscribe({
        next: (basket) => {
          this.basketSource.next(basket);
          this.calculateTotals();
        },
      });
  }

  setBasket(basket: Basket) {
    return this.httpClient
      .post<Basket>(this.baseUrl + 'basket', basket)
      .subscribe({
        next: (basket) => {
          this.basketSource.next(basket);
          this.calculateTotals();      // Once the basket comes back we have to calculate the total price of the basket
        },
      });
  }

  getCurrentBasketValue() {
   const basketSourceValue = this.basketSource.value;
   return basketSourceValue;
  }

  setShippingPrice(deliveryMethod:DeliveryMethod){
    const basket = this.getCurrentBasketValue();
    if(basket){
      basket.shippingPrice = deliveryMethod.price;
      basket.deliveryMethodId = deliveryMethod.id;
      this.setBasket(basket);
    }
  }
  addItemIntoBasket(item: IProduct | BasketItem, quantity = 1) {   //If we are adding the product from products page, then it will be a Product type, when if we are increment or decrement the products in Basket page, then it will be a BasketItem type, so we have to manage both in this same method
   if(this.isProduct(item)) item = this.mapProductItemIntoBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.basketItems = this.addorUpdateBasketItems(
      basket.basketItems,
      item,
      quantity
    );
    this.setBasket(basket);
  }

  removeItemFromBasket(id:number,quantity=1){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;

    const item = basket.basketItems.find(x=>x.id === id);
    if(item){
      item.quantity -= quantity;
      if(item.quantity === 0 ){
        basket.basketItems = basket.basketItems.filter(x=>x.id !==id);
      }
      if(basket.basketItems.length >0) this.setBasket(basket)
      else this.deleteBasket(basket);
    }
  }
  deleteBasket(basket: Basket) {
    this.httpClient.delete(this.baseUrl + 'basket/deleteBasket?id=' + basket.id).subscribe({
      next:()=>{
           this.deleteLocalBasket();
      },
      error:error=> console.log(error)
    })
  }

  deleteLocalBasket(){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }
  private addorUpdateBasketItems(
    basketItems: BasketItem[],
    itemToAdd: BasketItem,
    quantity: number
  ): BasketItem[] {
    const item = basketItems.find((b) => b.id === itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      basketItems.push(itemToAdd);
    }
    return basketItems;
  }
  private createBasket(): Basket {
    var basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemIntoBasketItem(item: IProduct): BasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      type: item.productType,
      brand: item.productBrand,
      quantity: 0,
    };
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;
     
     const subTotal = basket.basketItems.reduce((sum,item)=> (item.price * item.quantity) + sum,0);
     const total = (subTotal + basket.shippingPrice) - this.discount;
     this.basketTotalSource.next({shipping:basket.shippingPrice,discount:this.discount,subTotal:subTotal,total:total});
  }

  private isProduct(item:IProduct | BasketItem) : item is IProduct{
    return (item as IProduct).productBrand !==undefined;
  }
}
