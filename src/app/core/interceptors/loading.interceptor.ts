import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService:BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //To avoid the whole page loading, only should load and validate the EmailExists API call , and also to avoid the multiple times call the  "checkEmailExists API"
   //To avoid the whole page loading, only should load and validate the CreateOrder API call , and also to avoid the multiple times call the  "CreateOrder API"
    if(
      request.url.includes('emailExists') || 
    (request.method ==='POST' && request.url.includes('orders')) //So there is no overloading spinner for this two functionalities
    )
    {
     return next.handle(request);
    }
    this.busyService.busy();
    return next.handle(request).pipe(
      delay(1000),
      finalize(()=>this.busyService.idle())
    );
   
  }
}
