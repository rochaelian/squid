import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeoRecord } from '../seo-record.model';
import { SeoRecordService } from '../service/seo-record.service';

@Component({
  templateUrl: './seo-record-delete-dialog.component.html',
})
export class SeoRecordDeleteDialogComponent {
  seoRecord?: ISeoRecord;

  constructor(protected seoRecordService: SeoRecordService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.seoRecordService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
