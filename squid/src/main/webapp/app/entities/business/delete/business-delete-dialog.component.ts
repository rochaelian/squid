import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';

@Component({
  templateUrl: './business-delete-dialog.component.html',
})
export class BusinessDeleteDialogComponent {
  business?: IBusiness;

  constructor(protected businessService: BusinessService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.businessService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
