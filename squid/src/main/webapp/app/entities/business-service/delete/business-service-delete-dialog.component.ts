import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';

@Component({
  templateUrl: './business-service-delete-dialog.component.html',
})
export class BusinessServiceDeleteDialogComponent {
  businessService?: IBusinessService;

  constructor(protected businessServiceService: BusinessServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.businessServiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
