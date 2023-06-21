import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScheduleComponent } from '../list/schedule.component';
import { ScheduleDetailComponent } from '../detail/schedule-detail.component';
import { ScheduleUpdateComponent } from '../update/schedule-update.component';
import { ScheduleRoutingResolveService } from './schedule-routing-resolve.service';

const scheduleRoute: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScheduleDetailComponent,
    resolve: {
      schedule: ScheduleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScheduleUpdateComponent,
    resolve: {
      schedule: ScheduleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScheduleUpdateComponent,
    resolve: {
      schedule: ScheduleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scheduleRoute)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
