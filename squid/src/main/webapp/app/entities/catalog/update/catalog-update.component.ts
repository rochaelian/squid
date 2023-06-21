import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICatalog, Catalog } from '../catalog.model';
import { CatalogService } from '../service/catalog.service';

@Component({
  selector: 'jhi-catalog-update',
  templateUrl: './catalog-update.component.html',
})
export class CatalogUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    type: [],
    status: [],
  });

  constructor(protected catalogService: CatalogService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catalog }) => {
      this.updateForm(catalog);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const catalog = this.createFromForm();
    if (catalog.id !== undefined) {
      this.subscribeToSaveResponse(this.catalogService.update(catalog));
    } else {
      this.subscribeToSaveResponse(this.catalogService.create(catalog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatalog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(catalog: ICatalog): void {
    this.editForm.patchValue({
      id: catalog.id,
      name: catalog.name,
      type: catalog.type,
      status: catalog.status,
    });
  }

  protected createFromForm(): ICatalog {
    return {
      ...new Catalog(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      type: this.editForm.get(['type'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
