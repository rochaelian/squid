import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServiceOrderComponent } from '../list/service-order.component';
import { ServiceOrderDetailComponent } from '../detail/service-order-detail.component';
import { ServiceOrderUpdateComponent } from '../update/service-order-update.component';
import { ServiceOrderRoutingResolveService } from './service-order-routing-resolve.service';

const serviceOrderRoute: Routes = [
  {
    path: '',
    component: ServiceOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceOrderDetailComponent,
    resolve: {
      serviceOrder: ServiceOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceOrderUpdateComponent,
    resolve: {
      serviceOrder: ServiceOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceOrderUpdateComponent,
    resolve: {
      serviceOrder: ServiceOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceOrderRoute)],
  exports: [RouterModule],
})
export class ServiceOrderRoutingModule {}
