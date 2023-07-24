import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl='https://localhost:5001/api/';
  constructor(private http:HttpClient) {  //Here we are only inject the HttpClient in Service not directly inject into the components

   }

   getProducts(shopParams:ShopParams){

    let params=new HttpParams();
    if(shopParams.brandId>0){
      params=params.append('brandId',shopParams.brandId);
    }
    if(shopParams.typeId>0){
      params=params.append('typeId',shopParams.typeId);
    }
    params = params.append('sort',shopParams.sort);
    params = params.append('pageIndex',shopParams.pageIndex);
    params = params.append('pageSize',shopParams.pageSize);
    if(shopParams.search){
    params = params.append('search',shopParams.search);
    }
    return this.http.get<IPagination<IProduct[]>>(this.baseUrl + 'products',{params:params});
   }

   getProduct(id:number){
    return this.http.get<IProduct>(this.baseUrl+'products/'+id);
   }

   getBrands(){
    return this.http.get<IBrand[]> (this.baseUrl + 'products/brands');
   }

   getTypes(){
    return this.http.get<IType[]> (this.baseUrl + 'products/types');
   }
}
