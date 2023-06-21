import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceOrder } from '../service-order.model';

@Component({
  selector: 'jhi-service-order-detail',
  templateUrl: './service-order-detail.component.html',
})
export class ServiceOrderDetailComponent implements OnInit {
  serviceOrder: IServiceOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceOrder }) => {
      this.serviceOrder = serviceOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
