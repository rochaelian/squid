import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFile, File } from '../file.model';
import { FileService } from '../service/file.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IServiceOrder } from 'app/entities/service-order/service-order.model';
import { ServiceOrderService } from 'app/entities/service-order/service/service-order.service';

@Component({
  selector: 'jhi-file-update',
  templateUrl: './file-update.component.html',
})
export class FileUpdateComponent implements OnInit {
  isSaving = false;

  ordersSharedCollection: IOrder[] = [];
  serviceOrdersSharedCollection: IServiceOrder[] = [];

  editForm = this.fb.group({
    id: [],
    uRL: [],
    bLOB: [],
    bLOBContentType: [],
    order: [],
    serviceOrder: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fileService: FileService,
    protected orderService: OrderService,
    protected serviceOrderService: ServiceOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file }) => {
      this.updateForm(file);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('squidApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const file = this.createFromForm();
    if (file.id !== undefined) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  trackOrderById(index: number, item: IOrder): number {
    return item.id!;
  }

  trackServiceOrderById(index: number, item: IServiceOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFile>>): void {
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

  protected updateForm(file: IFile): void {
    this.editForm.patchValue({
      id: file.id,
      uRL: file.uRL,
      bLOB: file.bLOB,
      bLOBContentType: file.bLOBContentType,
      order: file.order,
      serviceOrder: file.serviceOrder,
    });

    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersSharedCollection, file.order);
    this.serviceOrdersSharedCollection = this.serviceOrderService.addServiceOrderToCollectionIfMissing(
      this.serviceOrdersSharedCollection,
      file.serviceOrder
    );
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, this.editForm.get('order')!.value)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));

    this.serviceOrderService
      .query()
      .pipe(map((res: HttpResponse<IServiceOrder[]>) => res.body ?? []))
      .pipe(
        map((serviceOrders: IServiceOrder[]) =>
          this.serviceOrderService.addServiceOrderToCollectionIfMissing(serviceOrders, this.editForm.get('serviceOrder')!.value)
        )
      )
      .subscribe((serviceOrders: IServiceOrder[]) => (this.serviceOrdersSharedCollection = serviceOrders));
  }

  protected createFromForm(): IFile {
    return {
      ...new File(),
      id: this.editForm.get(['id'])!.value,
      uRL: this.editForm.get(['uRL'])!.value,
      bLOBContentType: this.editForm.get(['bLOBContentType'])!.value,
      bLOB: this.editForm.get(['bLOB'])!.value,
      order: this.editForm.get(['order'])!.value,
      serviceOrder: this.editForm.get(['serviceOrder'])!.value,
    };
  }
}
