import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;
  focus!: boolean;
  focus1!: boolean;
  focus2!: boolean;
  test: Date = new Date();
  isLoading = false;

  authenticationError = false;

  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    // this.username.nativeElement.focus();
    true;
  }

  login(): void {
    this.isLoading = true;
    this.loginService
      .login({
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value,
        rememberMe: this.loginForm.get('rememberMe')!.value,
      })
      .subscribe(
        () => {
          this.authenticationError = false;
          this.isLoading = false;
          if (!this.router.getCurrentNavigation()) {
            if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
              this.router.navigate(['/dashboard']);
            } else if (this.accountService.hasAnyAuthority('ROLE_USER')) {
              this.router.navigate(['/businesses']);
            } else if (this.accountService.hasAnyAuthority('ROLE_BUSINESS_ADMIN')) {
              this.router.navigate(['/business']);
            } else if (this.accountService.hasAnyAuthority('ROLE_OPERATOR')) {
              this.router.navigate(['/user-profile']);
            }
          }
        },
        () => {
          this.authenticationError = true;
          this.isLoading = false;
        }
      );
  }
}
