import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable()
//By using this interceptor, we can pass the current user token to all API requests headers
export class JwtInterceptor implements HttpInterceptor {
token?: string;
  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
 this.accountService.currentUser$.pipe(take(1)).subscribe({  // First we need to subscribe and get the one user, then it will automatically unsubscribed, so we need to again subscribe the Observable
    next: user=> this.token = user?.token
 })
 if(this.token){
  request = request.clone({
    setHeaders:{
          Authorization:`Bearer ${this.token}`    // Here we are set the current user token to header of the requests
    }
  })
 }
    return next.handle(request);
  }
}
