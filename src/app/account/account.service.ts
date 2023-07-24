import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, User } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl; // If we are using AuthGuard , when application starts the initial value becomes null, so the Guard redirect the page into login only, even if the user already logged in, So avoid this situation, we can use the "ReplaySubject" class,which should have some default value also.
  //private currentUserSource = new BehaviorSubject<User | null>(null);  // this will be used to set the initial value for the user as null, by using this "BehaviourSubject" we can check this user all components
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private httpClient: HttpClient, private router: Router) {}

  loadCurrentUser(token: string | null) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient
      .get<User>(this.baseUrl + 'account', { headers: headers })
      .pipe(
        map((user) => {
          if (user) {
            localStorage.setItem('token', token);
            this.currentUserSource.next(user);
            return null;
          } else return null;
        })
      );
  }
  login(formValues: any) {
    return this.httpClient
      .post<User>(this.baseUrl + 'account/login', formValues)
      .pipe(
        map((user) => {
          this.currentUserSource.next(user);
          localStorage.setItem('token', user.token);
        })
      );
  }

  register(formValues: any) {
    return this.httpClient
      .post<User>(this.baseUrl + 'account/register', formValues)
      .pipe(
        map((user) => {
          this.currentUserSource.next(user);
          localStorage.setItem('token', user.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.httpClient.get<boolean>(
      this.baseUrl + 'account/emailExists?email=' + email
    );
  }

  getUserAddress(){
    return this.httpClient.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address:Address){
    return this.httpClient.put(this.baseUrl + 'account/address',address);
  }
}
