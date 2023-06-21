import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderRating } from '../order-rating.model';

@Component({
  selector: 'jhi-order-rating-detail',
  templateUrl: './order-rating-detail.component.html',
})
export class OrderRatingDetailComponent implements OnInit {
  orderRating: IOrderRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderRating }) => {
      this.orderRating = orderRating;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
