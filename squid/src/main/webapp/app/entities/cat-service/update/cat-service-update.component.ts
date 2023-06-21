import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICatService, CatService } from '../cat-service.model';
import { CatServiceService } from '../service/cat-service.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

@Component({
  selector: 'jhi-cat-service-update',
  templateUrl: './cat-service-update.component.html',
})
export class CatServiceUpdateComponent implements OnInit {
  isSaving = false;

  businessesSharedCollection: IBusiness[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    status: [],
    category: [],
    business: [],
  });

  constructor(
    protected catServiceService: CatServiceService,
    protected businessService: BusinessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catService }) => {
      this.updateForm(catService);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const catService = this.createFromForm();
    if (catService.id !== undefined) {
      this.subscribeToSaveResponse(this.catServiceService.update(catService));
    } else {
      this.subscribeToSaveResponse(this.catServiceService.create(catService));
    }
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatService>>): void {
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

  protected updateForm(catService: ICatService): void {
    this.editForm.patchValue({
      id: catService.id,
      name: catService.name,
      status: catService.status,
      category: catService.category,
      business: catService.business,
    });

    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      catService.business
    );
  }

  protected loadRelationshipsOptions(): void {
    this.businessService
      .query()
      .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
      .pipe(
        map((businesses: IBusiness[]) =>
          this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('business')!.value)
        )
      )
      .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));
  }

  protected createFromForm(): ICatService {
    return {
      ...new CatService(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      status: this.editForm.get(['status'])!.value,
      category: this.editForm.get(['category'])!.value,
      business: this.editForm.get(['business'])!.value,
    };
  }
}
