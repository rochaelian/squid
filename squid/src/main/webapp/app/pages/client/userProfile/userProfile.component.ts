import { Component, OnInit } from '@angular/core';
//import {} from 'google.maps';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { IUserDetails } from '../../../entities/user-details/user-details.model';
import { UserDetailsService } from '../../../entities/user-details/service/user-details.service';
import { Account } from 'app/core/auth/account.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Status } from '../../../entities/enumerations/status.model';
import { IUser } from '../../../entities/user/user.model';
import { IFile } from '../../../entities/file/file.model';
import { UserProfileService } from './userProfile.service';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from '../../../config/error.constants';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-user-profile',
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  account!: Account;
  userDetails?: IUserDetails;
  showDropZone = false;
  imageHover = false;
  success = false;
  error = false;
  files: File[] = [];

  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    login: [undefined],
    identification: [undefined],
    phone: [undefined],
    image: [''],
  });

  constructor(
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private userDetailsService: UserDetailsService,
    private fb: FormBuilder,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          login: account.login,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
        });
        //console.warn('lo que se trae', account);
        this.account = account;

        //const photo=new File([this.account.imageUrl+".jpg"],this.account.imageUrl+".jpg",{type: "image/jpeg"});

        //this.files.push(photo);
        this.userDetailsService.queryByInternalUser({ internalUserId: this.account.id }).subscribe((res: HttpResponse<IUserDetails>) => {
          if (res.body) {
            this.userDetails = res.body;
            console.warn(res.body);
            this.settingsForm.patchValue({
              identification: this.userDetails.identification,
              phone: this.userDetails.phone,
            });
          }
          if (this.userDetails?.status === 'Pending') {
            Swal.fire({
              text: 'Favor cambiar su contraseña.',
              iconHtml: '<i class="fa fa-exclamation-circle"></i>',
              showConfirmButton: true,
              timerProgressBar: true,
            }).then(() => {
              this.changePassword();
            });
          }
        });
      }
    });
  }

  changePassword(): void {
    this.router.navigateByUrl('account/password');
    //this.router.navigateByUrl(`${this.resourceUrl}/${id}`);
  }

  htmlChange(): void {
    const inputFirstname = this.settingsForm.get('phone');
    inputFirstname?.valueChanges.forEach((value: string) => {
      console.warn('Tel: ');
      console.warn(inputFirstname.value);
      this.account.firstName = value;
    });
  }

  update(pUrlImage: string): void {
    const id = this.account.id;
    console.warn(id);
    const login = this.settingsForm.get(['login'])!.value;
    const email = this.settingsForm.get(['email'])!.value;
    const firstName = this.settingsForm.get(['firstName'])!.value;
    const lastName = this.settingsForm.get(['lastName'])!.value;
    const identificationInput = this.settingsForm.get(['identification'])!.value;
    const phoneInput = this.settingsForm.get(['phone'])!.value;
    const imageUrl = pUrlImage;
    const user = { id, login, email, firstName, lastName, imageUrl };

    this.userProfileService.saveWithUserDetails(id, user, { identification: identificationInput, phone: phoneInput }).subscribe(
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

  checkImageBeforeUpdate(): string {
    let imageUrl = '';
    if (!this.files[0]) {
      //User not updating image
      this.update(this.account.imageUrl!);
    } else {
      //Upload my image to cloudinary
      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'squid_Proyecto3');
      data.append('cloud_name', 'squidproyecto3');
      this.userProfileService.uploadImage(data).subscribe(response => {
        const image = response;
        imageUrl = image.secure_url;
        this.update(imageUrl);
        console.warn('La url que devuelve cloudinary', imageUrl);
      });
    }
    return imageUrl;
  }

  // al darle click puedo agregar fotos
  onSelect(event: { addedFiles: any }): void {
    this.files.push(...event.addedFiles);
    console.warn('Test');
  }

  //Se pueden remover antes de subir
  onRemove(event: File): void {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.showDropZone = !this.showDropZone;
  }

  alertImage(): void {
    Swal.fire({
      title: 'Create an Event',
      html: '<div class="form-group">' + '<input class="form-control" placeholder="Event Title" id="input-field">' + '</div>',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    }).then(function (result: any) {
      console.warn('La imagen before uploading');
    });
  }
  private processError(response: HttpErrorResponse): void {
    this.error = true;
  }
}
