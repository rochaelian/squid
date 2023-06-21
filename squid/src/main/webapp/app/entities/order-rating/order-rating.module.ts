import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderRatingComponent } from './list/order-rating.component';
import { OrderRatingDetailComponent } from './detail/order-rating-detail.component';
import { OrderRatingUpdateComponent } from './update/order-rating-update.component';
import { OrderRatingDeleteDialogComponent } from './delete/order-rating-delete-dialog.component';
import { OrderRatingRoutingModule } from './route/order-rating-routing.module';
import { NgxStarRatingModule } from 'ngx-star-rating';

@NgModule({
  imports: [SharedModule, OrderRatingRoutingModule, NgxStarRatingModule],
  declarations: [OrderRatingComponent, OrderRatingDetailComponent, OrderRatingUpdateComponent, OrderRatingDeleteDialogComponent],
  entryComponents: [OrderRatingDeleteDialogComponent],
})
export class OrderRatingModule {}
