import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
dayjs().format();
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  focus!: boolean;
  focus1!: boolean;
  focus2!: boolean;
  focus3!: boolean;
  focus4!: boolean;
  focus5!: boolean;
  focus6!: boolean;
  focus7!: boolean;
  focus8!: boolean;
  focus9!: boolean;

  isAdmin = false;
  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  errorUnderAge = false;
  birthdate: dayjs.Dayjs | undefined;
  isLoading = false;

  //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  regexPassword = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';

  registerForm = this.fb.group({
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    ],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(254)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(254)]],
    identification: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
    birthdate: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(this.regexPassword)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    authorities: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
  });

  constructor(private registerService: RegisterService, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  underAgeValidator(date: string): void {
    this.birthdate = dayjs(date);
    const age = Math.abs(this.birthdate.diff(dayjs(), 'year'));
    console.warn(age);
    if (age < 18) {
      this.errorUnderAge = true;
    } else {
      this.errorUnderAge = false;
    }
  }

  userChange(event: { previousValue: false; currentValue: true }): void {
    this.isAdmin = event.currentValue;
  }

  register(): void {
    this.isLoading = true;
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;
    this.errorUnderAge = false;

    const password = this.registerForm.get(['password'])!.value;
    if (password !== this.registerForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      const login = this.registerForm.get(['login'])!.value;
      const email = this.registerForm.get(['email'])!.value;
      const firstName = this.registerForm.get(['firstName'])!.value;
      const lastName = this.registerForm.get(['lastName'])!.value;
      const identificationInput = this.registerForm.get(['identification'])!.value;
      const phoneInput = this.registerForm.get(['phone'])!.value;
      const imageUrl = './content/images/default-avatar.png';
      const authorities: string[] = [this.registerForm.get(['authorities'])!.value];
      const user = { login, email, firstName, lastName, imageUrl, password, langKey: 'en', authorities };

      this.registerService.saveWithUserDetails(user, { identification: identificationInput, phone: phoneInput }).subscribe(
        () => {
          this.success = true;
          //Send to home page afterwards
          setTimeout(() => {
            window.location.href = origin;
          }, 3000);
        },
        response => {
          this.processError(response);
          this.isLoading = true;
        }
      );
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
