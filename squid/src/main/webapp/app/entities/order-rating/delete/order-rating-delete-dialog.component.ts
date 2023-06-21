import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderRating } from '../order-rating.model';
import { OrderRatingService } from '../service/order-rating.service';

@Component({
  templateUrl: './order-rating-delete-dialog.component.html',
})
export class OrderRatingDeleteDialogComponent {
  orderRating?: IOrderRating;

  constructor(protected orderRatingService: OrderRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
