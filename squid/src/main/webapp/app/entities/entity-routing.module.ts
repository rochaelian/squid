import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-details',
        data: { pageTitle: 'UserDetails' },
        loadChildren: () => import('./user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: 'business',
        data: { pageTitle: 'Businesses' },
        loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
      },
      {
        path: 'vehicle',
        data: { pageTitle: 'Vehicles' },
        loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'Locations' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'schedule',
        data: { pageTitle: 'Schedules' },
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
      },
      {
        path: 'catalog',
        data: { pageTitle: 'Catalogs' },
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
      },
      {
        path: 'file',
        data: { pageTitle: 'Files' },
        loadChildren: () => import('./file/file.module').then(m => m.FileModule),
      },
      {
        path: 'seo-record',
        data: { pageTitle: 'SeoRecords' },
        loadChildren: () => import('./seo-record/seo-record.module').then(m => m.SeoRecordModule),
      },
      {
        path: 'transaction',
        data: { pageTitle: 'Transactions' },
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      },
      {
        path: 'cat-service',
        data: { pageTitle: 'CatServices' },
        loadChildren: () => import('./cat-service/cat-service.module').then(m => m.CatServiceModule),
      },
      {
        path: 'app',
        data: { pageTitle: 'APPS' },
        loadChildren: () => import('./app/app.module').then(m => m.APPModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'Orders' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'order-rating',
        data: { pageTitle: 'OrderRatings' },
        loadChildren: () => import('./order-rating/order-rating.module').then(m => m.OrderRatingModule),
      },
      {
        path: 'service-order',
        data: { pageTitle: 'ServiceOrders' },
        loadChildren: () => import('./service-order/service-order.module').then(m => m.ServiceOrderModule),
      },
      {
        path: 'business-service',
        data: { pageTitle: 'BusinessServices' },
        loadChildren: () => import('./business-service/business-service.module').then(m => m.BusinessServiceModule),
      },
      {
        path: 'operator-management',
        data: { pageTitle: 'OperatorManagement' },
        loadChildren: () => import('./operator/operator-management.module').then(m => m.OperatorManagementModule),
      },
      {
        path: 'appointment',
        data: { pageTitle: 'AppointmentManagement' },
        loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
