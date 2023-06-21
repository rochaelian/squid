import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessServiceComponent } from '../list/business-service.component';
import { BusinessServiceDetailComponent } from '../detail/business-service-detail.component';
import { BusinessServiceUpdateComponent } from '../update/business-service-update.component';
import { BusinessServiceRoutingResolveService } from './business-service-routing-resolve.service';

const businessServiceRoute: Routes = [
  {
    path: '',
    component: BusinessServiceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessServiceDetailComponent,
    resolve: {
      businessService: BusinessServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessServiceUpdateComponent,
    resolve: {
      businessService: BusinessServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessServiceUpdateComponent,
    resolve: {
      businessService: BusinessServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessServiceRoute)],
  exports: [RouterModule],
})
export class BusinessServiceRoutingModule {}
