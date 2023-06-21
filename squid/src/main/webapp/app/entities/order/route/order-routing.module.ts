import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderComponent } from '../list/order.component';
import { OrderDetailComponent } from '../detail/order-detail.component';
import { OrderUpdateComponent } from '../update/order-update.component';
import { OrderRoutingResolveService } from './order-routing-resolve.service';
import { PaymentComponent } from '../payment/payment.component';
import { CalendarComponent } from '../calendar/calendar.component';

const orderRoute: Routes = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderDetailComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderUpdateComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderUpdateComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/payment',
    component: PaymentComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/calendar',
    component: CalendarComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderRoute)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
