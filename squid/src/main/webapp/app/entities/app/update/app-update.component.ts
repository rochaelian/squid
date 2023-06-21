import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAPP, APP } from '../app.model';
import { APPService } from '../service/app.service';

@Component({
  selector: 'jhi-app-update',
  templateUrl: './app-update.component.html',
})
export class APPUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    type: [],
    income: [],
    comission: [],
    sEOCost: [],
  });

  constructor(protected aPPService: APPService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aPP }) => {
      this.updateForm(aPP);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const aPP = this.createFromForm();
    if (aPP.id !== undefined) {
      this.subscribeToSaveResponse(this.aPPService.update(aPP));
    } else {
      this.subscribeToSaveResponse(this.aPPService.create(aPP));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAPP>>): void {
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

  protected updateForm(aPP: IAPP): void {
    this.editForm.patchValue({
      id: aPP.id,
      type: aPP.type,
      income: aPP.income,
      comission: aPP.comission,
      sEOCost: aPP.sEOCost,
    });
  }

  protected createFromForm(): IAPP {
    return {
      ...new APP(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      income: this.editForm.get(['income'])!.value,
      comission: this.editForm.get(['comission'])!.value,
      sEOCost: this.editForm.get(['sEOCost'])!.value,
    };
  }
}
