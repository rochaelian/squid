import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeoRecord } from '../seo-record.model';
import { SeoRecordService } from '../service/seo-record.service';
import { SeoRecordDeleteDialogComponent } from '../delete/seo-record-delete-dialog.component';

@Component({
  selector: 'jhi-seo-record',
  templateUrl: './seo-record.component.html',
})
export class SeoRecordComponent implements OnInit {
  seoRecords?: ISeoRecord[];
  isLoading = false;

  constructor(protected seoRecordService: SeoRecordService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.seoRecordService.query().subscribe(
      (res: HttpResponse<ISeoRecord[]>) => {
        this.isLoading = false;
        this.seoRecords = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISeoRecord): number {
    return item.id!;
  }

  delete(seoRecord: ISeoRecord): void {
    const modalRef = this.modalService.open(SeoRecordDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.seoRecord = seoRecord;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
