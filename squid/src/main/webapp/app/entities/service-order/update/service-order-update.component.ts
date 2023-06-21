import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IServiceOrder, ServiceOrder } from '../service-order.model';
import { ServiceOrderService } from '../service/service-order.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';

@Component({
  selector: 'jhi-service-order-update',
  templateUrl: './service-order-update.component.html',
})
export class ServiceOrderUpdateComponent implements OnInit {
  isSaving = false;

  catalogsSharedCollection: ICatalog[] = [];
  ordersSharedCollection: IOrder[] = [];
  businessServicesSharedCollection: IBusinessService[] = [];

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    deductible: [],
    updatedCost: [],
    comment: [],
    status: [],
    order: [],
    businessService: [],
  });

  constructor(
    protected serviceOrderService: ServiceOrderService,
    protected catalogService: CatalogService,
    protected orderService: OrderService,
    protected businessServiceService: BusinessServiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceOrder }) => {
      this.updateForm(serviceOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceOrder = this.createFromForm();
    if (serviceOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceOrderService.update(serviceOrder));
    } else {
      this.subscribeToSaveResponse(this.serviceOrderService.create(serviceOrder));
    }
  }

  trackCatalogById(index: number, item: ICatalog): number {
    return item.id!;
  }

  trackOrderById(index: number, item: IOrder): number {
    return item.id!;
  }

  trackBusinessServiceById(index: number, item: IBusinessService): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceOrder>>): void {
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

  protected updateForm(serviceOrder: IServiceOrder): void {
    this.editForm.patchValue({
      id: serviceOrder.id,
      startDate: serviceOrder.startDate,
      endDate: serviceOrder.endDate,
      deductible: serviceOrder.deductible,
      updatedCost: serviceOrder.updatedCost,
      comment: serviceOrder.comment,
      status: serviceOrder.status,
      order: serviceOrder.order,
      businessService: serviceOrder.businessService,
    });

    this.catalogsSharedCollection = this.catalogService.addCatalogToCollectionIfMissing(this.catalogsSharedCollection, serviceOrder.status);
    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersSharedCollection, serviceOrder.order);
    this.businessServicesSharedCollection = this.businessServiceService.addBusinessServiceToCollectionIfMissing(
      this.businessServicesSharedCollection,
      serviceOrder.businessService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.catalogService
      .query()
      .pipe(map((res: HttpResponse<ICatalog[]>) => res.body ?? []))
      .pipe(
        map((catalogs: ICatalog[]) => this.catalogService.addCatalogToCollectionIfMissing(catalogs, this.editForm.get('status')!.value))
      )
      .subscribe((catalogs: ICatalog[]) => (this.catalogsSharedCollection = catalogs));

    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, this.editForm.get('order')!.value)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));

    this.businessServiceService
      .query()
      .pipe(map((res: HttpResponse<IBusinessService[]>) => res.body ?? []))
      .pipe(
        map((businessServices: IBusinessService[]) =>
          this.businessServiceService.addBusinessServiceToCollectionIfMissing(businessServices, this.editForm.get('businessService')!.value)
        )
      )
      .subscribe((businessServices: IBusinessService[]) => (this.businessServicesSharedCollection = businessServices));
  }

  protected createFromForm(): IServiceOrder {
    return {
      ...new ServiceOrder(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      deductible: this.editForm.get(['deductible'])!.value,
      updatedCost: this.editForm.get(['updatedCost'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      status: this.editForm.get(['status'])!.value,
      order: this.editForm.get(['order'])!.value,
      businessService: this.editForm.get(['businessService'])!.value,
    };
  }
}
