import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';


const routes:Routes=[
  {path:'',component:ShopComponent},
  {path:':id',component:ProductDetailsComponent,data:{breadcrumb:{alias:'productDetails'}}}  // This is used for show the what kind of property will be shown in the breadcrumb, then we have to set the "ProductName" as this alias in ProductDetailsComponent by using BreadcrumbService
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ShopRoutingModule { }
