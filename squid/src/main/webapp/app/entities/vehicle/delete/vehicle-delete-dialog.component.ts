import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';

@Component({
  templateUrl: './vehicle-delete-dialog.component.html',
})
export class VehicleDeleteDialogComponent {
  vehicle?: IVehicle;
  warning?: string;
  p1?: string;
  p2?: string;

  constructor(protected vehicleService: VehicleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(): void {
    this.activeModal.close('showBusiness');
  }
}
