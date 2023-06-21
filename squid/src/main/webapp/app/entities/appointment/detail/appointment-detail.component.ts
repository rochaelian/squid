import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrder } from '../appointment.model';

@Component({
  selector: 'jhi-order-detail',
  templateUrl: './appointment-detail.component.html',
})
export class AppointmentDetailComponent implements OnInit {
  order: IOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
