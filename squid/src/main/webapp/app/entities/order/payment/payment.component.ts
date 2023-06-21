import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../service/order.service';
import { IOrder } from '../order.model';
import { FormBuilder, Validators } from '@angular/forms';
import { IOrderRating, OrderRating } from '../../order-rating/order-rating.model';
import { OrderRatingService } from '../../order-rating/service/order-rating.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { booleanReturn, IServiceOrder } from '../../service-order/service-order.model';
import Swal from 'sweetalert2';

declare let paypal: any;

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;
  order: IOrder | null = null;
  currentOrder: IOrder | null = null;
  isSaving = false;
  currentRating = 5;
  isPaid = false;
  total?: number = 500;
  myBooleanVal?: booleanReturn;

  editForm = this.fb.group({
    rating: [],
    comment: [],
  });

  producto = {
    descripcion: 'description',
    precio: 100.0,
    img: 'image',
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected orderRatingService: OrderRatingService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
    });

    if (this.order?.id !== undefined) {
      this.orderService.find(this.order.id).subscribe((res: HttpResponse<IOrder>) => {
        if (res.body) {
          this.currentOrder = res.body;
          //this.total! += this.currentOrder?.totalCost!;
          this.paypalButton(this.currentOrder.totalCost, this.currentOrder, this.orderService, this.isPaid);
        }
      });
    }

    if (this.order?.id !== undefined) {
      this.orderService.getRatingStatus(this.order.id).subscribe(x => {
        this.myBooleanVal = x;
        console.warn(x.retData, 'X Value'); // this print true "X Value"
        console.warn('booleano', this.myBooleanVal); // this prints "true"
      });
    }
  }

  paypalButton(ppaymentAmount: any, currentOrder: IOrder, orderService: any, isPaid: boolean): void {
    const price = Math.floor(ppaymentAmount / 621);
    paypal
      .Buttons({
        ///createOrder: this.createOrder,
        createOrder(data: any, actions: any): any {
          return actions.order.create({
            purchase_units: [
              {
                description: 'hola',
                amount: {
                  currency_code: 'USD',
                  value: price,
                },
              },
            ],
          });
        },
        async onApprove(data: any, actions: any) {
          const order = await actions.order.capture();
          console.warn(order);
          const newOrder = currentOrder;
          const now = dayjs();
          newOrder.endDate = now;
          orderService.paymentupdate(newOrder).subscribe((res: HttpResponse<IServiceOrder>) => {
            currentOrder = res.body ?? {};
            isPaid = true;

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'La orden fue pagada con éxito',
              showConfirmButton: true,
              timerProgressBar: true,
            }).then(() => {
              setTimeout(() => {
                location.reload();
              }, 1000);
            });
          });
        },
        onError(err: any): any {
          console.warn(err);
        },
      })
      .render(this.paypalElement?.nativeElement);
  }

  save(): void {
    this.isSaving = true;
    const orderRating = this.createFromForm();
    orderRating.rating = this.currentRating;
    orderRating.order = this.order;
    orderRating.id = undefined;
    orderRating.order = this.currentOrder;

    this.subscribeToSaveResponse(this.orderRatingService.create(orderRating));

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'La orden fue calificada con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(function () {
      window.location.reload(); // you can pass true to reload function to ignore the client cache and reload from the server
    }, 2000);
  }

  previousState(): void {
    window.history.back();
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

  protected createFromForm(): IOrderRating {
    return {
      ...new OrderRating(),
      rating: this.editForm.get(['rating'])!.value,
      comment: this.editForm.get(['comment'])!.value,
    };
  }

  private createOrder(data: any, actions: any): any {
    return actions.order.create({
      purchase_units: [
        {
          description: 'hola',
          amount: {
            currency_code: 'USD',
            value: '100',
          },
        },
      ],
    });
  }
}
