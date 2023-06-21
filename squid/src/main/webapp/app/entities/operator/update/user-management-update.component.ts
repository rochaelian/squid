import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { User } from '../operator-management.model';
import { UserManagementService } from '../service/user-management.service';
import { IBusiness } from '../../business/business.model';
import { BusinessService } from '../../business/service/business.service';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { IUserDetails } from '../../user-details/user-details.model';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { UserDetailsService } from '../../user-details/service/user-details.service';
import { Alert } from '../operator.model';

@Component({
  selector: 'jhi-user-mgmt-update',
  templateUrl: './user-management-update.component.html',
})
export class UserManagementUpdateComponent implements OnInit {
  user!: User;
  account!: Account;
  authorities: string[] = [];
  isSaving = false;
  businessesSharedCollection: IBusiness[] = [];
  files: File[] = [];
  userDetails?: IUserDetails;
  alerts: Alert[] = [];
  showContent = false;

  editForm = this.fb.group({
    id: [],
    login: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    identification: [''],
    phone: [''],
    business: ['', [Validators.required]],
    image: [''],
  });

  constructor(
    private userService: UserManagementService,
    protected businessService: BusinessService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private accountService: AccountService,
    private userDetailsService: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      console.warn(account);
      let id = 0;
      if (account) {
        id = Number(account.id);
      }

      this.businessService
        .queryByOwner(id)
        .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
        .pipe(
          map((businesses: IBusiness[]) =>
            this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('business')!.value)
          )
        )
        .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));
    });

    this.route.data.subscribe(({ user }) => {
      if (user) {
        this.user = user;
        if (this.user.id === undefined) {
          this.user.activated = true;
        }
        this.updateForm(user);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  onUploadImageCloudinary(): void {
    let imageUrl = './content/images/default-avatar.png';
    if (!this.files[0]) {
      this.save(imageUrl);
    } else {
      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'squid_Proyecto3');
      data.append('cloud_name', 'squidproyecto3');
      this.userService.uploadImage(data).subscribe(response => {
        const image = response;
        imageUrl = image.secure_url;
        this.save(image.secure_url);
      });
    }
  }

  save(pUrlImage: string): void {
    this.isSaving = true;
    const login = this.editForm.get(['login'])!.value;
    const email = this.editForm.get(['email'])!.value;
    const firstName = this.editForm.get(['firstName'])!.value;
    const lastName = this.editForm.get(['lastName'])!.value;
    const identificationInput = this.editForm.get(['identification'])!.value;
    const phoneInput = this.editForm.get(['phone'])!.value;
    const authorities: string[] = ['ROLE_OPERATOR'];
    const businessInput: number = this.editForm.get(['business'])!.value.id;
    const imageUrl = pUrlImage;
    console.warn('la imagen que va a la BD', imageUrl);

    const operator = { login, email, firstName, lastName, imageUrl, password: 'Password1', langKey: 'en', authorities };

    this.updateUser(this.user);
    if (this.user.id !== undefined) {
      const id = this.user.id.toString();
      const op = { id, login, email, firstName, lastName, imageUrl };

      this.userService
        .saveWithUserDetails(id, op, { identification: identificationInput, phone: phoneInput, businessId: businessInput })
        .subscribe(
          () => this.onSaveSuccess(),
          () => this.onSaveError()
        );
    } else {
      this.user.langKey = 'en';
      this.userService
        .createOperator(operator, { identification: identificationInput, phone: phoneInput, businessId: businessInput })
        .subscribe(
          () => this.onSaveSuccess(),
          () => this.onSaveError()
        );
    }
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  // al darle click puedo agregar fotos
  onSelect(event: { addedFiles: any }): void {
    //console.log(event);
    this.files.push(...event.addedFiles);
  }

  //Se pueden remover antes de subir
  onRemove(event: File): void {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  private updateForm(user: User): void {
    if (this.businessesSharedCollection.length === 0) {
      setTimeout(() => (this.showContent = true), 1200);
    }

    this.editForm.patchValue({
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    if (user.id) {
      this.userDetailsService.queryByInternalUser({ internalUserId: user.id }).subscribe((res: HttpResponse<IUserDetails>) => {
        if (res.body) {
          this.userDetails = res.body;
          console.warn(res.body);
          this.editForm.patchValue({
            identification: this.userDetails.identification,
            phone: this.userDetails.phone,
            business: this.userDetails.business,
          });
        }
      });
    }
  }

  private updateUser(user: User): void {
    user.login = this.editForm.get(['login'])!.value;
    user.firstName = this.editForm.get(['firstName'])!.value;
    user.lastName = this.editForm.get(['lastName'])!.value;
    user.email = this.editForm.get(['email'])!.value;
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
