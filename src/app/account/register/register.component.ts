import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { debounce, debounceTime, finalize, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  errors: string[] | null =null;
  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email],[this.validateEmailNotTaken()]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          "(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$"
        ),
      ],
    ],
  });

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (next) => this.router.navigateByUrl('/shop'),
      error:error => this.errors = error.errors
    });
  }

  //If we want to check the email is already exists or not , when user type the input, So we have to use the AsyncValidatorFn class, which will be use to check the validators when emit the input

  validateEmailNotTaken():AsyncValidatorFn{
    return (control:AbstractControl) =>{
       return control.valueChanges.pipe(
          debounceTime(1000),  // Its used to wait when user type the character. So its avoid to call the particular API calls, still other Observables called.
          take(1),             // Take the first value of the Observable
          switchMap(()=>{       // Switch again the first value into Observable, then its merged into the outputs Observable
            return this.accountService.checkEmailExists(control.value).pipe(
              map(result => result ? {emailExists:true} : null),
              finalize(()=> control.markAsTouched)
             )
          })
        )

      
    }
  }

}
