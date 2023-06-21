import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VehicleComponent } from '../list/vehicle.component';
import { VehicleDetailComponent } from '../detail/vehicle-detail.component';
import { VehicleUpdateComponent } from '../update/vehicle-update.component';
import { VehicleRoutingResolveService } from './vehicle-routing-resolve.service';
import { HistorialComponent } from '../historial/historial.component';

const vehicleRoute: Routes = [
  {
    path: '',
    component: VehicleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VehicleDetailComponent,
    resolve: {
      vehicle: VehicleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VehicleUpdateComponent,
    resolve: {
      vehicle: VehicleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VehicleUpdateComponent,
    resolve: {
      vehicle: VehicleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/historial',
    component: HistorialComponent,
    resolve: {
      vehicle: VehicleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vehicleRoute)],
  exports: [RouterModule],
})
export class VehicleRoutingModule {}
