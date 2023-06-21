import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessServiceComponent } from './list/business-service.component';
import { BusinessServiceDetailComponent } from './detail/business-service-detail.component';
import { BusinessServiceUpdateComponent } from './update/business-service-update.component';
import { BusinessServiceDeleteDialogComponent } from './delete/business-service-delete-dialog.component';
import { BusinessServiceRoutingModule } from './route/business-service-routing.module';

@NgModule({
  imports: [SharedModule, BusinessServiceRoutingModule],
  declarations: [
    BusinessServiceComponent,
    BusinessServiceDetailComponent,
    BusinessServiceUpdateComponent,
    BusinessServiceDeleteDialogComponent,
  ],
  entryComponents: [BusinessServiceDeleteDialogComponent],
})
export class BusinessServiceModule {}
