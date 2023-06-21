import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICatService } from '../cat-service.model';
import { CatServiceService } from '../service/cat-service.service';
import { CatServiceDeleteDialogComponent } from '../delete/cat-service-delete-dialog.component';

@Component({
  selector: 'jhi-cat-service',
  templateUrl: './cat-service.component.html',
})
export class CatServiceComponent implements OnInit {
  catServices?: ICatService[];
  isLoading = false;

  constructor(protected catServiceService: CatServiceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.catServiceService.query().subscribe(
      (res: HttpResponse<ICatService[]>) => {
        this.isLoading = false;
        this.catServices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICatService): number {
    return item.id!;
  }

  delete(catService: ICatService): void {
    const modalRef = this.modalService.open(CatServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.catService = catService;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
