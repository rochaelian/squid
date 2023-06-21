import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VehicleComponent } from './list/vehicle.component';
import { VehicleDetailComponent } from './detail/vehicle-detail.component';
import { VehicleUpdateComponent } from './update/vehicle-update.component';
import { VehicleDeleteDialogComponent } from './delete/vehicle-delete-dialog.component';
import { VehicleRoutingModule } from './route/vehicle-routing.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { HistorialComponent } from './historial/historial.component';

@NgModule({
  imports: [SharedModule, VehicleRoutingModule, JwBootstrapSwitchNg2Module],
  declarations: [VehicleComponent, VehicleDetailComponent, VehicleUpdateComponent, VehicleDeleteDialogComponent, HistorialComponent],
  entryComponents: [VehicleDeleteDialogComponent],
})
export class VehicleModule {}
