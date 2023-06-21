import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderComponent } from './list/order.component';
import { OrderDetailComponent } from './detail/order-detail.component';
import { OrderUpdateComponent } from './update/order-update.component';
import { OrderDeleteDialogComponent } from './delete/order-delete-dialog.component';
import { OrderRoutingModule } from './route/order-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ServiceOrderTimelineComponent } from '../service-order/timeline/service-order-timeline.component';
import { UserProfileExternalComponent } from '../user/userProfileExternal.component';
import { PaymentComponent } from './payment/payment.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { CalendarComponent } from './calendar/calendar.component';
import {
  ScheduleModule,
  RecurrenceEditorModule,
  DragAndDropService,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  MonthAgendaService,
} from '@syncfusion/ej2-angular-schedule';

@NgModule({
  imports: [SharedModule, OrderRoutingModule, NgxDropzoneModule, NgxPayPalModule, ScheduleModule, RecurrenceEditorModule],
  declarations: [
    OrderComponent,
    OrderDetailComponent,
    OrderUpdateComponent,
    OrderDeleteDialogComponent,
    ServiceOrderTimelineComponent,
    UserProfileExternalComponent,
    PaymentComponent,
    CalendarComponent,
  ],
  exports: [CalendarComponent],
  providers: [DragAndDropService, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService],
  entryComponents: [OrderDeleteDialogComponent],
})
export class OrderModule {}
