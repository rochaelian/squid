import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Business, IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';
import { BusinessDeleteDialogComponent } from '../delete/business-delete-dialog.component';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Location } from '../../location/location.model';
import { LocationService } from '../../location/service/location.service';
import Swal from 'sweetalert2';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { Status } from '../../enumerations/status.model';

@Component({
  selector: 'jhi-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.componente.css'],
})
export class BusinessComponent implements OnInit {
  businesses?: IBusiness[];
  isSaving = false;
  isLoading = false;
  account?: Account;
  modal: any;
  state_with_icons?: boolean;
  rollAdmin = false;

  constructor(
    protected businessService: BusinessService,
    protected modalService: NgbModal,
    protected locationService: LocationService,
    protected accountService: AccountService
  ) {}

  loadAll(): void {
    this.isLoading = true;

    if (this.account?.authorities[0] === 'ROLE_ADMIN') {
      this.rollAdmin = true;
      this.businessService.query().subscribe(
        (res: HttpResponse<IBusiness[]>) => {
          this.isLoading = false;
          this.businesses = res.body ?? [];
        },
        () => {
          this.isLoading = false;
        }
      );
    } else if (this.account?.authorities[0] === 'ROLE_BUSINESS_ADMIN') {
      this.businessService.queryByOwner(Number(this.account.id)).subscribe(
        (res: HttpResponse<IBusiness[]>) => {
          this.isLoading = false;
          this.businesses = res.body ?? [];
          this.businesses = this.getOnlyEnabledBusinesses();
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.loadAll();
  }

  getOnlyEnabledBusinesses(): IBusiness[] {
    let approvedBusinesses: IBusiness[] = [];
    if (this.businesses) {
      approvedBusinesses = this.businesses.filter(function (business) {
        return business.status === 'Enabled';
      });
    }
    return approvedBusinesses;
  }

  getUser(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  trackId(index: number, item: IBusiness): number {
    return item.id!;
  }

  updateStatusButtonHD(business: any): void {
    this.isSaving = true;
    const actualBusiness = business;

    if (actualBusiness.status === 'Enabled') {
      actualBusiness.status = 'Disabled';
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Comercio deshabilitado',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      actualBusiness.status = 'Enabled';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Comercio habilitado',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    this.subscribeToSaveResponse(this.businessService.update(business));
  }

  updateStatusButton(business: any, status: string): void {
    this.isSaving = true;
    const actualBusiness = business;
    const businessUpdate: IBusiness = business;

    if (status === 'Enabled') {
      businessUpdate.status = Status.Pending;
      this.subscribeToSaveResponse(this.businessService.update(businessUpdate));
      actualBusiness.status = 'Enabled';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Comercio a sido aprobado',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      businessUpdate.status = Status.Rejected;
      this.subscribeToSaveResponse(this.businessService.update(businessUpdate));
      actualBusiness.status = 'Disabled';
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Comercio ha sido rechazado',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  delete(business: IBusiness): void {
    const modalRef = this.modalService.open(BusinessDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.business = business;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusiness>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    // Api for inheritance.
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
