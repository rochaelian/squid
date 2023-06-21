import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html',
})
export class PasswordComponent implements OnInit {
  doNotMatch = false;
  error = false;
  success = false;
  //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';
  account$?: Observable<Account | null>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(this.regex)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
  });

  constructor(private passwordService: PasswordService, private accountService: AccountService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
        () => {
          this.success = true;
          //Send to home page afterwards
          setTimeout(() => {
            location.reload();
          }, 2000);
        },
        response => this.processError(response)
      );
    }
  }

  private processError(response: HttpErrorResponse): void {
    this.error = true;
  }
}
