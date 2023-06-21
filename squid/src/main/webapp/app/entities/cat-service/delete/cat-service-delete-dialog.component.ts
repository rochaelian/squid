import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICatService } from '../cat-service.model';
import { CatServiceService } from '../service/cat-service.service';

@Component({
  templateUrl: './cat-service-delete-dialog.component.html',
})
export class CatServiceDeleteDialogComponent {
  catService?: ICatService;

  constructor(protected catServiceService: CatServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.catServiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
