import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrder } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';

@Component({
  templateUrl: './appointment-delete-dialog.component.html',
})
export class AppointmentDeleteDialogComponent {
  order?: IOrder;

  constructor(protected orderService: AppointmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
