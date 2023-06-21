import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CatalogComponent } from './list/catalog.component';
import { CatalogDetailComponent } from './detail/catalog-detail.component';
import { CatalogUpdateComponent } from './update/catalog-update.component';
import { CatalogDeleteDialogComponent } from './delete/catalog-delete-dialog.component';
import { CatalogRoutingModule } from './route/catalog-routing.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

@NgModule({
  imports: [SharedModule, CatalogRoutingModule, JwBootstrapSwitchNg2Module],
  declarations: [CatalogComponent, CatalogDetailComponent, CatalogUpdateComponent, CatalogDeleteDialogComponent],
  entryComponents: [CatalogDeleteDialogComponent],
})
export class CatalogModule {}
