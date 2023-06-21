import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrderRating, OrderRating } from '../order-rating.model';
import { OrderRatingService } from '../service/order-rating.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-order-rating-update',
  templateUrl: './order-rating-update.component.html',
})
export class OrderRatingUpdateComponent implements OnInit {
  isSaving = false;

  ordersCollection: IOrder[] = [];

  editForm = this.fb.group({
    id: [],
    rating: [],
    comment: [],
    order: [],
  });

  constructor(
    protected orderRatingService: OrderRatingService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderRating }) => {
      this.updateForm(orderRating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderRating = this.createFromForm();
    if (orderRating.id !== undefined) {
      this.subscribeToSaveResponse(this.orderRatingService.update(orderRating));
    } else {
      this.subscribeToSaveResponse(this.orderRatingService.create(orderRating));
    }
  }

  trackOrderById(index: number, item: IOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderRating>>): void {
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

  protected updateForm(orderRating: IOrderRating): void {
    this.editForm.patchValue({
      id: orderRating.id,
      rating: orderRating.rating,
      comment: orderRating.comment,
      order: orderRating.order,
    });

    this.ordersCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersCollection, orderRating.order);
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query({ filter: 'orderrating-is-null' })
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, this.editForm.get('order')!.value)))
      .subscribe((orders: IOrder[]) => (this.ordersCollection = orders));
  }

  protected createFromForm(): IOrderRating {
    return {
      ...new OrderRating(),
      id: this.editForm.get(['id'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }
}
