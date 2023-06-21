import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceOrder } from '../service-order.model';
import { ServiceOrderService } from '../service/service-order.service';
import { ServiceOrderDeleteDialogComponent } from '../delete/service-order-delete-dialog.component';

@Component({
  selector: 'jhi-service-order',
  templateUrl: './service-order.component.html',
})
export class ServiceOrderComponent implements OnInit {
  serviceOrders?: IServiceOrder[];
  isLoading = false;

  constructor(protected serviceOrderService: ServiceOrderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.serviceOrderService.query().subscribe(
      (res: HttpResponse<IServiceOrder[]>) => {
        this.isLoading = false;
        this.serviceOrders = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IServiceOrder): number {
    return item.id!;
  }

  delete(serviceOrder: IServiceOrder): void {
    const modalRef = this.modalService.open(ServiceOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.serviceOrder = serviceOrder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
