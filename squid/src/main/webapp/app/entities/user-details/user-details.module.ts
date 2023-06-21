import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserDetailsComponent } from './list/user-details.component';
import { UserDetailsDetailComponent } from './detail/user-details-detail.component';
import { UserDetailsUpdateComponent } from './update/user-details-update.component';
import { UserDetailsDeleteDialogComponent } from './delete/user-details-delete-dialog.component';
import { UserDetailsRoutingModule } from './route/user-details-routing.module';

@NgModule({
  imports: [SharedModule, UserDetailsRoutingModule],
  declarations: [UserDetailsComponent, UserDetailsDetailComponent, UserDetailsUpdateComponent, UserDetailsDeleteDialogComponent],
  entryComponents: [UserDetailsDeleteDialogComponent],
})
export class UserDetailsModule {}
