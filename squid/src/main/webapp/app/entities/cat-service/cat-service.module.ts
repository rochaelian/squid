import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CatServiceComponent } from './list/cat-service.component';
import { CatServiceDetailComponent } from './detail/cat-service-detail.component';
import { CatServiceUpdateComponent } from './update/cat-service-update.component';
import { CatServiceDeleteDialogComponent } from './delete/cat-service-delete-dialog.component';
import { CatServiceRoutingModule } from './route/cat-service-routing.module';

@NgModule({
  imports: [SharedModule, CatServiceRoutingModule],
  declarations: [CatServiceComponent, CatServiceDetailComponent, CatServiceUpdateComponent, CatServiceDeleteDialogComponent],
  entryComponents: [CatServiceDeleteDialogComponent],
})
export class CatServiceModule {}
