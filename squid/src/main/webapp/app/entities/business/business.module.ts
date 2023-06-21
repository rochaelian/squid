import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessComponent } from './list/business.component';
import { BusinessDetailComponent } from './detail/business-detail.component';
import { BusinessUpdateComponent } from './update/business-update.component';
import { BusinessDeleteDialogComponent } from './delete/business-delete-dialog.component';
import { BusinessRoutingModule } from './route/business-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AgmCoreModule } from '@agm/core';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

@NgModule({
  imports: [SharedModule, BusinessRoutingModule, NgxDropzoneModule, AgmCoreModule, CloudinaryModule, JwBootstrapSwitchNg2Module],
  declarations: [BusinessComponent, BusinessDetailComponent, BusinessUpdateComponent, BusinessDeleteDialogComponent],
  entryComponents: [BusinessDeleteDialogComponent],
})
export class BusinessModule {}
