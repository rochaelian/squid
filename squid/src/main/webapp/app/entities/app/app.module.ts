import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { APPComponent } from './list/app.component';
import { APPDetailComponent } from './detail/app-detail.component';
import { APPUpdateComponent } from './update/app-update.component';
import { APPDeleteDialogComponent } from './delete/app-delete-dialog.component';
import { APPRoutingModule } from './route/app-routing.module';

@NgModule({
  imports: [SharedModule, APPRoutingModule],
  declarations: [APPComponent, APPDetailComponent, APPUpdateComponent, APPDeleteDialogComponent],
  entryComponents: [APPDeleteDialogComponent],
})
export class APPModule {}
