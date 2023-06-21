import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeoRecord } from '../seo-record.model';

@Component({
  selector: 'jhi-seo-record-detail',
  templateUrl: './seo-record-detail.component.html',
})
export class SeoRecordDetailComponent implements OnInit {
  seoRecord: ISeoRecord | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seoRecord }) => {
      this.seoRecord = seoRecord;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
