import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceOrderComponent } from './list/service-order.component';
import { ServiceOrderDetailComponent } from './detail/service-order-detail.component';
import { ServiceOrderUpdateComponent } from './update/service-order-update.component';
import { ServiceOrderDeleteDialogComponent } from './delete/service-order-delete-dialog.component';
import { ServiceOrderRoutingModule } from './route/service-order-routing.module';

@NgModule({
  imports: [SharedModule, ServiceOrderRoutingModule],
  declarations: [ServiceOrderComponent, ServiceOrderDetailComponent, ServiceOrderUpdateComponent, ServiceOrderDeleteDialogComponent],
  entryComponents: [ServiceOrderDeleteDialogComponent],
})
export class ServiceOrderModule {}
