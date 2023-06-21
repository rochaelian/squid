import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SeoRecordComponent } from '../list/seo-record.component';
import { SeoRecordDetailComponent } from '../detail/seo-record-detail.component';
import { SeoRecordUpdateComponent } from '../update/seo-record-update.component';
import { SeoRecordRoutingResolveService } from './seo-record-routing-resolve.service';

const seoRecordRoute: Routes = [
  {
    path: '',
    component: SeoRecordComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SeoRecordDetailComponent,
    resolve: {
      seoRecord: SeoRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SeoRecordUpdateComponent,
    resolve: {
      seoRecord: SeoRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SeoRecordUpdateComponent,
    resolve: {
      seoRecord: SeoRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(seoRecordRoute)],
  exports: [RouterModule],
})
export class SeoRecordRoutingModule {}
