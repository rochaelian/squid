import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import * as dayjs from 'dayjs';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { SERVER_API_URL } from './app.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { EntityRoutingModule } from './entities/entity-routing.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';

// https://www.npmjs.com/package/@fortawesome/angular-fontawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//https://angular-maps.com/guides/getting-started/
import { AgmCoreModule } from '@agm/core';

//Ngx lib dropzone
import { NgxDropzoneModule } from 'ngx-dropzone';

//https://www.npmjs.com/package/@cloudinary/angular-5.x
//import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
//import { Cloudinary } from 'cloudinary-core';
// File upload module
//import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';

import { BusinessesComponent } from './pages/client/businesses/businesses.component';
import { BusPipePipe } from './pages/client/businesses/pipes/bus-pipe.pipe';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { InsuranceUpdateComponent } from './pages/insurance-update/insurance-update.component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    HomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EntityRoutingModule,
    AppRoutingModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAgJdwczHPF2zpTcmxTtBWwk2OX05KrZFQ',
    }),
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyC1G9WUo9fx8K_1XmCJIgEtVJW9a0zw3k8' }),
    NgxDropzoneModule,
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    ErrorComponent,
    PageRibbonComponent,
    FooterComponent,
    BusinessesComponent,
    InsuranceComponent,
    BusPipePipe,
    InsuranceUpdateComponent,
  ],
  bootstrap: [MainComponent],
  exports: [],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
