import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { IUserDetails } from '../user-details/user-details.model';
import { UserDetailsService } from '../user-details/service/user-details.service';
import { Account } from 'app/core/auth/account.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { UserManagementService } from '../../admin/user-management/service/user-management.service';
import { IUser, IUserWithImage } from '../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-user-profile-external',
  templateUrl: './userProfileExternal.component.html',
  styleUrls: ['./userProfileExternal.component.scss'],
})
export class UserProfileExternalComponent implements OnInit {
  user!: IUserWithImage;
  userDetails?: IUserDetails;
  imageHover = false;
  success = false;
  error = false;
  files: File[] = [];

  @Input()
  userId: number | undefined;

  @Input()
  orderId: number | undefined;

  @Input()
  idNullMessage: string | undefined;

  constructor(
    private userManagementService: UserManagementService,
    private userDetailsService: UserDetailsService,
    private fb: FormBuilder,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.userManagementService.findById(this.userId!).subscribe(user => {
      this.user = user;
      this.userDetailsService.queryByInternalUser({ internalUserId: this.userId }).subscribe((res: HttpResponse<IUserDetails>) => {
        if (res.body) {
          this.userDetails = res.body;
        }
      });
    });
  }

  private processError(response: HttpErrorResponse): void {
    this.error = true;
  }
}
