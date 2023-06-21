import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServiceOrder } from '../service-order.model';
import { ServiceOrderService } from '../service/service-order.service';

@Component({
  templateUrl: './service-order-delete-dialog.component.html',
})
export class ServiceOrderDeleteDialogComponent {
  serviceOrder?: IServiceOrder;

  constructor(protected serviceOrderService: ServiceOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
