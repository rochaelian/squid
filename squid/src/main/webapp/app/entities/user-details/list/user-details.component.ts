import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';
import { UserDetailsDeleteDialogComponent } from '../delete/user-details-delete-dialog.component';

@Component({
  selector: 'jhi-user-details',
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent implements OnInit {
  userDetails?: IUserDetails[];
  isLoading = false;

  constructor(protected userDetailsService: UserDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userDetailsService.query().subscribe(
      (res: HttpResponse<IUserDetails[]>) => {
        this.isLoading = false;
        this.userDetails = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserDetails): number {
    return item.id!;
  }

  delete(userDetails: IUserDetails): void {
    const modalRef = this.modalService.open(UserDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userDetails = userDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
