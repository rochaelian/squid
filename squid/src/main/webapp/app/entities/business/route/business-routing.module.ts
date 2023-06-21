import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessComponent } from '../list/business.component';
import { BusinessDetailComponent } from '../detail/business-detail.component';
import { BusinessUpdateComponent } from '../update/business-update.component';
import { BusinessRoutingResolveService } from './business-routing-resolve.service';

const businessRoute: Routes = [
  {
    path: '',
    component: BusinessComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessDetailComponent,
    resolve: {
      business: BusinessRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessUpdateComponent,
    resolve: {
      business: BusinessRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessUpdateComponent,
    resolve: {
      business: BusinessRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessRoute)],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
