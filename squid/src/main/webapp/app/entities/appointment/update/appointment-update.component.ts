import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrder, Order } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './appointment-update.component.html',
})
export class AppointmentUpdateComponent implements OnInit {
  isSaving = false;

  vehiclesSharedCollection: IVehicle[] = [];
  usersSharedCollection: IUser[] = [];
  businessesSharedCollection: IBusiness[] = [];
  catalogsSharedCollection: ICatalog[] = [];

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    totalCost: [],
    comission: [],
    vehicle: [],
    operator: [],
    business: [],
    status: [],
  });

  constructor(
    protected orderService: AppointmentService,
    protected vehicleService: VehicleService,
    protected userService: UserService,
    protected businessService: BusinessService,
    protected catalogService: CatalogService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackVehicleById(index: number, item: IVehicle): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  trackCatalogById(index: number, item: ICatalog): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      startDate: order.startDate,
      endDate: order.endDate,
      totalCost: order.totalCost,
      comission: order.comission,
      vehicle: order.vehicle,
      operator: order.operator,
      business: order.business,
      status: order.status,
    });

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing(this.vehiclesSharedCollection, order.vehicle);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, order.operator);
    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      order.business
    );
    this.catalogsSharedCollection = this.catalogService.addCatalogToCollectionIfMissing(this.catalogsSharedCollection, order.status);
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleService
      .query()
      .pipe(map((res: HttpResponse<IVehicle[]>) => res.body ?? []))
      .pipe(
        map((vehicles: IVehicle[]) => this.vehicleService.addVehicleToCollectionIfMissing(vehicles, this.editForm.get('vehicle')!.value))
      )
      .subscribe((vehicles: IVehicle[]) => (this.vehiclesSharedCollection = vehicles));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('operator')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.businessService
      .query()
      .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
      .pipe(
        map((businesses: IBusiness[]) =>
          this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('business')!.value)
        )
      )
      .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));

    this.catalogService
      .query()
      .pipe(map((res: HttpResponse<ICatalog[]>) => res.body ?? []))
      .pipe(
        map((catalogs: ICatalog[]) => this.catalogService.addCatalogToCollectionIfMissing(catalogs, this.editForm.get('status')!.value))
      )
      .subscribe((catalogs: ICatalog[]) => (this.catalogsSharedCollection = catalogs));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      totalCost: this.editForm.get(['totalCost'])!.value,
      comission: this.editForm.get(['comission'])!.value,
      vehicle: this.editForm.get(['vehicle'])!.value,
      operator: this.editForm.get(['operator'])!.value,
      business: this.editForm.get(['business'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
