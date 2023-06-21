import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVehicle, Vehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';
import { IUser, User } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Catalog, ICatalog } from 'app/entities/catalog/catalog.model';

import { CatalogService } from 'app/entities/catalog/service/catalog.service';
import * as dayjs from 'dayjs';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';

@Component({
  selector: 'jhi-vehicle-update',
  templateUrl: './vehicle-update.component.html',
})
export class VehicleUpdateComponent implements OnInit {
  isSaving = false;
  usersSharedCollection: IUser[] = [];
  user!: IUser;
  catalogsSharedCollection: ICatalog[] = [];
  futureRTVDateError = false;
  rtvDate: dayjs.Dayjs | undefined;
  title!: string;

  editForm = this.fb.group({
    id: [],
    plate: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
    year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
    rTV: [],
    status: [],
    user: [],
    insurer: [],
    motorType: [],
    vehicleType: [],
    brand: [],
  });

  constructor(
    protected vehicleService: VehicleService,
    protected userService: UserService,
    protected accountService: AccountService,
    protected catalogService: CatalogService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.title = window.location.pathname === '/vehicle/new' ? 'Agregar Vehículo' : 'Editar Vehículo';
    this.activatedRoute.data.subscribe(({ vehicle }) => {
      if (this.title !== '/vehicle/new') {
        this.updateForm(vehicle);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicle = this.createFromForm();
    console.warn(vehicle);
    if (vehicle.id !== undefined) {
      this.subscribeToSaveResponse(this.vehicleService.update(vehicle));
    } else {
      this.subscribeToSaveResponse(this.vehicleService.create(vehicle));
    }
  }

  futureDateValidator(date: string): void {
    this.rtvDate = dayjs(date);
    this.futureRTVDateError = this.rtvDate.isBefore(dayjs());
  }
  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCatalogById(index: number, item: ICatalog): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicle>>): void {
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

  protected updateForm(vehicle: IVehicle): void {
    this.editForm.patchValue({
      id: vehicle.id,
      plate: vehicle.plate,
      year: vehicle.year,
      rTV: vehicle.rTV,
      status: vehicle.status,
      user: vehicle.user,
      insurer: vehicle.insurer,
      motorType: vehicle.motorType,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, vehicle.user);
    this.catalogsSharedCollection = this.catalogService.addCatalogToCollectionIfMissing(
      this.catalogsSharedCollection,
      vehicle.insurer,
      vehicle.motorType,
      vehicle.vehicleType,
      vehicle.brand
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.accountService.identity().subscribe(user => {
      this.user = {
        id: Number(user?.id),
        login: user?.login,
      };
    });

    this.catalogService
      .query()
      .pipe(map((res: HttpResponse<ICatalog[]>) => res.body ?? []))
      .pipe(
        map((catalogs: ICatalog[]) =>
          this.catalogService.addCatalogToCollectionIfMissing(
            catalogs,
            this.editForm.get('insurer')!.value,
            this.editForm.get('motorType')!.value,
            this.editForm.get('vehicleType')!.value,
            this.editForm.get('brand')!.value
          )
        )
      )
      .subscribe((catalogs: ICatalog[]) => (this.catalogsSharedCollection = catalogs));
  }

  protected createFromForm(): IVehicle {
    return {
      ...new Vehicle(),
      id: this.editForm.get(['id'])!.value,
      plate: this.editForm.get(['plate'])!.value,
      year: this.editForm.get(['year'])!.value,
      rTV: this.editForm.get(['rTV'])!.value,
      status: this.editForm.get(['status'])!.value,
      user: this.user,
      insurer: this.editForm.get(['insurer'])!.value,
      motorType: this.editForm.get(['motorType'])!.value,
      vehicleType: this.editForm.get(['vehicleType'])!.value,
      brand: this.editForm.get(['brand'])!.value,
    };
  }
}
