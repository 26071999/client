import { Component, OnInit } from '@angular/core';
import { BreadcrumbDefinition, BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {

  breadcrumbs :any;
  isHomePage:boolean;

  constructor(public breadcrumbService:BreadcrumbService) {
  }
     // If we are using "public", then we can access this service through the HTML and CSS or testing file also

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe({
      next:response =>{
        this.breadcrumbs = response;
        if(this.breadcrumbs[this.breadcrumbs.length-1].label === 'Home'){
   this.isHomePage = true;
        }
        else{
          this.isHomePage = false;
        }
      },
      error:error => console.log(error)
    });
   }
  }


