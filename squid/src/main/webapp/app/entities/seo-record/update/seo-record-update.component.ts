import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISeoRecord, SeoRecord } from '../seo-record.model';
import { SeoRecordService } from '../service/seo-record.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

@Component({
  selector: 'jhi-seo-record-update',
  templateUrl: './seo-record-update.component.html',
})
export class SeoRecordUpdateComponent implements OnInit {
  isSaving = false;

  businessesSharedCollection: IBusiness[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    cost: [],
    status: [],
    business: [],
  });

  constructor(
    protected seoRecordService: SeoRecordService,
    protected businessService: BusinessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seoRecord }) => {
      this.updateForm(seoRecord);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const seoRecord = this.createFromForm();
    if (seoRecord.id !== undefined) {
      this.subscribeToSaveResponse(this.seoRecordService.update(seoRecord));
    } else {
      this.subscribeToSaveResponse(this.seoRecordService.create(seoRecord));
    }
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeoRecord>>): void {
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

  protected updateForm(seoRecord: ISeoRecord): void {
    this.editForm.patchValue({
      id: seoRecord.id,
      date: seoRecord.date,
      cost: seoRecord.cost,
      status: seoRecord.status,
      business: seoRecord.business,
    });

    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      seoRecord.business
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

  protected createFromForm(): ISeoRecord {
    return {
      ...new SeoRecord(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      cost: this.editForm.get(['cost'])!.value,
      status: this.editForm.get(['status'])!.value,
      business: this.editForm.get(['business'])!.value,
    };
  }
}
