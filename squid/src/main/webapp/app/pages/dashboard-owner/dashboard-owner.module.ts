import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DashboardOwnerComponent } from './dashboard-owner.component';
import { DashboardOwnerRoutingModule } from './route/dashboard-owner.routing.module';

@NgModule({
  declarations: [DashboardOwnerComponent],
  imports: [SharedModule, DashboardOwnerRoutingModule],
  exports: [DashboardOwnerComponent],
})
export class DashboardOwnerModule {}
