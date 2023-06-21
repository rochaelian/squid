import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserDetailsComponent } from '../list/user-details.component';
import { UserDetailsDetailComponent } from '../detail/user-details-detail.component';
import { UserDetailsUpdateComponent } from '../update/user-details-update.component';
import { UserDetailsRoutingResolveService } from './user-details-routing-resolve.service';

const userDetailsRoute: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserDetailsDetailComponent,
    resolve: {
      userDetails: UserDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserDetailsUpdateComponent,
    resolve: {
      userDetails: UserDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserDetailsUpdateComponent,
    resolve: {
      userDetails: UserDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userDetailsRoute)],
  exports: [RouterModule],
})
export class UserDetailsRoutingModule {}
