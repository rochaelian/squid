import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITransaction, Transaction } from '../transaction.model';
import { TransactionService } from '../service/transaction.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-transaction-update',
  templateUrl: './transaction-update.component.html',
})
export class TransactionUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  businessesSharedCollection: IBusiness[] = [];
  ordersSharedCollection: IOrder[] = [];

  editForm = this.fb.group({
    id: [],
    cardNumber: [],
    cost: [],
    source: [],
    destination: [],
    order: [],
  });

  constructor(
    protected transactionService: TransactionService,
    protected userService: UserService,
    protected businessService: BusinessService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transaction }) => {
      this.updateForm(transaction);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transaction = this.createFromForm();
    if (transaction.id !== undefined) {
      this.subscribeToSaveResponse(this.transactionService.update(transaction));
    } else {
      this.subscribeToSaveResponse(this.transactionService.create(transaction));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  trackOrderById(index: number, item: IOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransaction>>): void {
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

  protected updateForm(transaction: ITransaction): void {
    this.editForm.patchValue({
      id: transaction.id,
      cardNumber: transaction.cardNumber,
      cost: transaction.cost,
      source: transaction.source,
      destination: transaction.destination,
      order: transaction.order,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, transaction.source);
    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      transaction.destination
    );
    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersSharedCollection, transaction.order);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('source')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.businessService
      .query()
      .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
      .pipe(
        map((businesses: IBusiness[]) =>
          this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('destination')!.value)
        )
      )
      .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));

    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, this.editForm.get('order')!.value)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));
  }

  protected createFromForm(): ITransaction {
    return {
      ...new Transaction(),
      id: this.editForm.get(['id'])!.value,
      cardNumber: this.editForm.get(['cardNumber'])!.value,
      cost: this.editForm.get(['cost'])!.value,
      source: this.editForm.get(['source'])!.value,
      destination: this.editForm.get(['destination'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }
}
