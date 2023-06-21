import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CatServiceComponent } from '../list/cat-service.component';
import { CatServiceDetailComponent } from '../detail/cat-service-detail.component';
import { CatServiceUpdateComponent } from '../update/cat-service-update.component';
import { CatServiceRoutingResolveService } from './cat-service-routing-resolve.service';

const catServiceRoute: Routes = [
  {
    path: '',
    component: CatServiceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CatServiceDetailComponent,
    resolve: {
      catService: CatServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CatServiceUpdateComponent,
    resolve: {
      catService: CatServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CatServiceUpdateComponent,
    resolve: {
      catService: CatServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(catServiceRoute)],
  exports: [RouterModule],
})
export class CatServiceRoutingModule {}
