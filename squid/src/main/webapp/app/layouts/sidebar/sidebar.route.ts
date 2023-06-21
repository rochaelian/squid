import { Routes } from '@angular/router';

import { UserProfileComponent } from '../../pages/client/userProfile/userProfile.component';
import { DashboardComponent } from '../../pages/all/dashboard/dashboard.component';
import { CatalogComponent } from '../../entities/catalog/list/catalog.component';
import { CatService } from '../../entities/cat-service/cat-service.model';
import { BusinessesComponent } from '../../pages/client/businesses/businesses.component';
import { AppointmentComponent } from '../../entities/appointment/list/appointment.component';
import { DashboardOwnerComponent } from '../../pages/dashboard-owner/dashboard-owner.component';
import { InsuranceComponent } from '../../pages/insurance/insurance.component';
import { InsuranceUpdateComponent } from '../../pages/insurance-update/insurance-update.component';

export const sidebarRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'cat-service', component: CatService },
  { path: 'change-password', component: UserProfileComponent },
  { path: 'businesses', component: BusinessesComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'dashboard-owner', component: DashboardOwnerComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'insurance-update', component: InsuranceUpdateComponent },
  { path: 'dashboard-owner', component: DashboardOwnerComponent },
];
