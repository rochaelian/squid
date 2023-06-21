import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderRatingComponent } from '../list/order-rating.component';
import { OrderRatingDetailComponent } from '../detail/order-rating-detail.component';
import { OrderRatingUpdateComponent } from '../update/order-rating-update.component';
import { OrderRatingRoutingResolveService } from './order-rating-routing-resolve.service';

const orderRatingRoute: Routes = [
  {
    path: '',
    component: OrderRatingComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderRatingDetailComponent,
    resolve: {
      orderRating: OrderRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderRatingUpdateComponent,
    resolve: {
      orderRating: OrderRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderRatingUpdateComponent,
    resolve: {
      orderRating: OrderRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderRatingRoute)],
  exports: [RouterModule],
})
export class OrderRatingRoutingModule {}
