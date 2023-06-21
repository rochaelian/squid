import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserDetails, UserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IFile } from 'app/entities/file/file.model';
import { FileService } from 'app/entities/file/service/file.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html',
})
export class UserDetailsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  photographsCollection: IFile[] = [];
  businessesSharedCollection: IBusiness[] = [];

  editForm = this.fb.group({
    id: [],
    identification: [],
    phone: [],
    status: [],
    internalUser: [],
    photograph: [],
    business: [],
  });

  constructor(
    protected userDetailsService: UserDetailsService,
    protected userService: UserService,
    protected fileService: FileService,
    protected businessService: BusinessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.updateForm(userDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDetails = this.createFromForm();
    if (userDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.userDetailsService.update(userDetails));
    } else {
      this.subscribeToSaveResponse(this.userDetailsService.create(userDetails));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackFileById(index: number, item: IFile): number {
    return item.id!;
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userDetails: IUserDetails): void {
    this.editForm.patchValue({
      id: userDetails.id,
      identification: userDetails.identification,
      phone: userDetails.phone,
      status: userDetails.status,
      internalUser: userDetails.internalUser,
      photograph: userDetails.photograph,
      business: userDetails.business,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userDetails.internalUser);
    this.photographsCollection = this.fileService.addFileToCollectionIfMissing(this.photographsCollection, userDetails.photograph);
    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      userDetails.business
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.fileService
      .query({ filter: 'userdetails-is-null' })
      .pipe(map((res: HttpResponse<IFile[]>) => res.body ?? []))
      .pipe(map((files: IFile[]) => this.fileService.addFileToCollectionIfMissing(files, this.editForm.get('photograph')!.value)))
      .subscribe((files: IFile[]) => (this.photographsCollection = files));

    this.businessService
      .query()
      .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
      .pipe(
        map((businesses: IBusiness[]) =>
          this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('business')!.value)
        )
      )
      .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));
  }

  protected createFromForm(): IUserDetails {
    return {
      ...new UserDetails(),
      id: this.editForm.get(['id'])!.value,
      identification: this.editForm.get(['identification'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      status: this.editForm.get(['status'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
      photograph: this.editForm.get(['photograph'])!.value,
      business: this.editForm.get(['business'])!.value,
    };
  }
}
