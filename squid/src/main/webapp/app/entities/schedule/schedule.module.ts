import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScheduleComponent } from './list/schedule.component';
import { ScheduleDetailComponent } from './detail/schedule-detail.component';
import { ScheduleUpdateComponent } from './update/schedule-update.component';
import { ScheduleDeleteDialogComponent } from './delete/schedule-delete-dialog.component';
import { ScheduleRoutingModule } from './route/schedule-routing.module';

@NgModule({
  imports: [SharedModule, ScheduleRoutingModule],
  declarations: [ScheduleComponent, ScheduleDetailComponent, ScheduleUpdateComponent, ScheduleDeleteDialogComponent],
  entryComponents: [ScheduleDeleteDialogComponent],
})
export class ScheduleModule {}
