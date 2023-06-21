import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ORDER_ROUTE } from './order-page.route';
import { OrderPageComponent } from './order-page.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([ORDER_ROUTE]), FullCalendarModule, TagInputModule],
  declarations: [OrderPageComponent],
})
export class OrderPageModule {}
