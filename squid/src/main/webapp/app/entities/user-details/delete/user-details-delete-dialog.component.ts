import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';

@Component({
  templateUrl: './user-details-delete-dialog.component.html',
})
export class UserDetailsDeleteDialogComponent {
  userDetails?: IUserDetails;

  constructor(protected userDetailsService: UserDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
