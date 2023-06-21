import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { UserProfileComponent } from '../pages/client/userProfile/userProfile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { PhotoUploadComponent } from '../pages/all/photoUpload/photoUpload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DashboardAdminComponent } from '../pages/adminApp/dashboardAdmin.component';
import { DashboardComponent } from '../pages/all/dashboard/dashboard.component';
import { DashboardOwnerModule } from '../pages/dashboard-owner/dashboard-owner.module';

@NgModule({
  imports: [
    SharedModule,
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'jtorresb' } as CloudinaryConfiguration),
    RouterModule.forChild([HOME_ROUTE]),
    FileUploadModule,
    NgxDropzoneModule,
    FontAwesomeModule,
  ],
  declarations: [HomeComponent, UserProfileComponent, DashboardComponent, DashboardAdminComponent, PhotoUploadComponent],
})
export class HomeModule {}
