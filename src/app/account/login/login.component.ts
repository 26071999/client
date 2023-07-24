import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // if you want to add more validators for email property, we can add in this array
    password: new FormControl('', Validators.required),
  });
  returnUrl: string;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';  //Here if the activated login route does have any string like 'returnUrl', then it will move into that page after successfully login, otherwise if its empty then it will move into 'shop' page.
  }

  ngOnInit(): void {}

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: (next) => this.router.navigateByUrl(this.returnUrl)
    });
  }
}
