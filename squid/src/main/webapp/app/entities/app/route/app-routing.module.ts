import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { APPComponent } from '../list/app.component';
import { APPDetailComponent } from '../detail/app-detail.component';
import { APPUpdateComponent } from '../update/app-update.component';
import { APPRoutingResolveService } from './app-routing-resolve.service';

const aPPRoute: Routes = [
  {
    path: '',
    component: APPComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: APPDetailComponent,
    resolve: {
      aPP: APPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: APPUpdateComponent,
    resolve: {
      aPP: APPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: APPUpdateComponent,
    resolve: {
      aPP: APPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(aPPRoute)],
  exports: [RouterModule],
})
export class APPRoutingModule {}
