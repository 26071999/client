import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopService } from './shop.service';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
 @ViewChild('search') searchTerm? : ElementRef
  products:IProduct[]=[];
  brands: IBrand[]=[];
  types : IType[]=[];
  shopParams :ShopParams = new ShopParams();
  sortOptions=[
    {name:'Alphabetical',value:'name'},
    {name:'Price:Low to High',value:'priceAsc'},
    {name:'Price:High to Low',value:'priceDesc'}
  ];
  totalCounts = 0;
  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
 
    this.getProducts();
    this.getBrands();
    this.getTypes();
    
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next:response=>{
        this.products=response.data;
        this.shopParams.pageIndex = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCounts = response.count;
      } ,
      error:error =>console.log(error)
    });
  }

  getBrands(){
    this.shopService.getBrands().subscribe({
      next:response=>this.brands= [{id:0,name:'All'},...response],
      error:error => console.log(error)
    });
  
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
     next:response=> this.types=[{id:0,name:'All'},...response],
     error:error =>console.log(error)
    });
  }

  onBrandSelected(brandId:number){
     this.shopParams.brandId = brandId;
     this.shopParams.pageIndex=1;
     this.getProducts();
  }
   onTypeSelected(typeId:number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageIndex=1;
    this.getProducts();
   }

   onSortSelected(event:any){
    this.shopParams.sort = event.target.value;
    this.getProducts();
   }

   onPageChanged(event:any){
   if(this.shopParams.pageIndex !== event){
    this.shopParams.pageIndex = event;
    this.getProducts();
   }
   }

   onSearch(){
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.shopParams.pageIndex =1;
    this.getProducts();
   }
   onReset(){
    if(this.searchTerm){
        this.searchTerm.nativeElement.value ='';
    }
        this.shopParams = new ShopParams();
        this.getProducts();
   }
}
