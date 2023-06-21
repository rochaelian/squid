import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAPP } from '../app.model';
import { APPService } from '../service/app.service';
import { APPDeleteDialogComponent } from '../delete/app-delete-dialog.component';

@Component({
  selector: 'jhi-app',
  templateUrl: './app.component.html',
})
export class APPComponent implements OnInit {
  aPPS?: IAPP[];
  isLoading = false;

  constructor(protected aPPService: APPService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.aPPService.query().subscribe(
      (res: HttpResponse<IAPP[]>) => {
        this.isLoading = false;
        this.aPPS = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAPP): number {
    return item.id!;
  }

  delete(aPP: IAPP): void {
    const modalRef = this.modalService.open(APPDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.aPP = aPP;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
