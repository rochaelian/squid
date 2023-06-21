import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAPP } from '../app.model';
import { APPService } from '../service/app.service';

@Component({
  templateUrl: './app-delete-dialog.component.html',
})
export class APPDeleteDialogComponent {
  aPP?: IAPP;

  constructor(protected aPPService: APPService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.aPPService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
