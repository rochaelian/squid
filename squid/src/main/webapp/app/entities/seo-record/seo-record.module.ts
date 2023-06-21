import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SeoRecordComponent } from './list/seo-record.component';
import { SeoRecordDetailComponent } from './detail/seo-record-detail.component';
import { SeoRecordUpdateComponent } from './update/seo-record-update.component';
import { SeoRecordDeleteDialogComponent } from './delete/seo-record-delete-dialog.component';
import { SeoRecordRoutingModule } from './route/seo-record-routing.module';

@NgModule({
  imports: [SharedModule, SeoRecordRoutingModule],
  declarations: [SeoRecordComponent, SeoRecordDetailComponent, SeoRecordUpdateComponent, SeoRecordDeleteDialogComponent],
  entryComponents: [SeoRecordDeleteDialogComponent],
})
export class SeoRecordModule {}
