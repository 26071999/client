 import * as cuid from 'cuid'
export interface Basket {
    id: string
    basketItems: BasketItem[]
    deliveryMethodId?:number;
    paymentIntentId?:string;
    clientSecret?:string;
    shippingPrice :number ;
  }
  
  export interface BasketItem {
    id: number
    productName: string
    price: number
    quantity: number    
    pictureUrl: string
    brand: string
    type: string
  }
  
  export class Basket implements Basket{
    id = cuid();
    basketItems: BasketItem[]=[];
    shippingPrice =0;
  }

  export interface BasketTotals{
    shipping:number;
    subTotal:number;
    total:number;
    discount:number;
  }