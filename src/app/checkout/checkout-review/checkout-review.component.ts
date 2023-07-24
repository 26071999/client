import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {

  @Input() appStepper:CdkStepper; //Here we are declare one Input property, so definitely there is one input property declare in the HTML page. for the checkoutReview tag.
  constructor(private basketService:BasketService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  createPaymentIntent(){
    this.basketService.createPaymentIntent().subscribe({
    next:next=> {
      //this.toastr.success("Payment intent was created successfully"); this will not use
      this.appStepper.next()
    },
      error:error=>this.toastr.error(error.message)
    })
  }

}
