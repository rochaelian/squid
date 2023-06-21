import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITransaction } from '../transaction.model';
import { TransactionService } from '../service/transaction.service';
import { TransactionDeleteDialogComponent } from '../delete/transaction-delete-dialog.component';

@Component({
  selector: 'jhi-transaction',
  templateUrl: './transaction.component.html',
})
export class TransactionComponent implements OnInit {
  transactions?: ITransaction[];
  isLoading = false;

  constructor(protected transactionService: TransactionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.transactionService.query().subscribe(
      (res: HttpResponse<ITransaction[]>) => {
        this.isLoading = false;
        this.transactions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITransaction): number {
    return item.id!;
  }

  delete(transaction: ITransaction): void {
    const modalRef = this.modalService.open(TransactionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.transaction = transaction;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
