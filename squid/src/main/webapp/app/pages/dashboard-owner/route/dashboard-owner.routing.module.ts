import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DashboardOwnerComponent } from '../dashboard-owner.component';

const dashboardOwnerRoute: Routes = [
  {
    path: '',
    component: DashboardOwnerComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardOwnerRoute)],
  exports: [RouterModule],
})
export class DashboardOwnerRoutingModule {}
