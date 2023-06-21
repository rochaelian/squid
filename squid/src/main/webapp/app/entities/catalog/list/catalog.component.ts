import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICatalog } from '../catalog.model';
import { CatalogService } from '../service/catalog.service';
import { CatalogDeleteDialogComponent } from '../delete/catalog-delete-dialog.component';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-catalog',
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  catalogs?: ICatalog[];
  isLoading = false;
  isSaving = false;
  catalogCat?: ICatalog[];

  constructor(protected catalogService: CatalogService, protected activatedRoute: ActivatedRoute, protected modalService: NgbModal) {}
  ngOnInit(): void {
    this.loadAll();
    this.activatedRoute.data.subscribe(({ catalog }) => {
      this.updateStatusButton(catalog);
    });
  }

  loadAll(): void {
    this.isLoading = true;
    this.catalogService.query().subscribe(
      (res: HttpResponse<ICatalog[]>) => {
        this.isLoading = false;
        this.catalogs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  trackId(index: number, item: ICatalog): number {
    return item.id!;
  }

  updateStatusButton(catalog: any): void {
    this.isSaving = true;
    const actualCatalog = catalog;

    if (actualCatalog.status === 'Enabled') {
      actualCatalog.status = 'Disabled';
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Catálogo deshabilitado',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      actualCatalog.status = 'Enabled';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Catálogo habilitado',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    this.subscribeToSaveResponse(this.catalogService.update(catalog));
  }

  delete(catalog: ICatalog): void {
    const modalRef = this.modalService.open(CatalogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.catalog = catalog;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatalog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    // Api for inheritance.
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
