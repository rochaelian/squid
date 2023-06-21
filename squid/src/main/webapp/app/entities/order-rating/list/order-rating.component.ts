import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderRating } from '../order-rating.model';
import { OrderRatingService } from '../service/order-rating.service';
import { OrderRatingDeleteDialogComponent } from '../delete/order-rating-delete-dialog.component';

@Component({
  selector: 'jhi-order-rating',
  templateUrl: './order-rating.component.html',
})
export class OrderRatingComponent implements OnInit {
  orderRatings?: IOrderRating[];
  isLoading = false;

  constructor(protected orderRatingService: OrderRatingService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.orderRatingService.query().subscribe(
      (res: HttpResponse<IOrderRating[]>) => {
        this.isLoading = false;
        this.orderRatings = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOrderRating): number {
    return item.id!;
  }

  delete(orderRating: IOrderRating): void {
    const modalRef = this.modalService.open(OrderRatingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderRating = orderRating;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
