import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Account } from '../../../core/auth/account.model';
import { Business, IBusiness } from 'app/entities/business/business.model';
import { IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { BusinessServiceDeleteDialogComponent } from '../delete/business-service-delete-dialog.component';
import { AccountService } from '../../../core/auth/account.service';
import { BusinessService } from '../../business/service/business.service';

@Component({
  selector: 'jhi-business-service',
  templateUrl: './business-service.component.html',
})
export class BusinessServiceComponent implements OnInit {
  businessServices?: IBusinessService[] = [];
  business?: IBusiness[] = [];
  businessByOwner?: Business[] = [];
  isLoading = false;
  account?: Account;
  servicesByOwner?: IBusinessService[] = [];

  constructor(
    protected businessServiceService: BusinessServiceService,
    protected modalService: NgbModal,
    protected businessService: BusinessService,
    protected accountService: AccountService
  ) {}

  loadAll(): void {
    this.isLoading = true;
    const idOwner = this.account?.id;

    this.businessServiceService.query().subscribe(
      (res: HttpResponse<IBusinessService[]>) => {
        this.isLoading = false;
        this.businessServices = res.body ?? [];
        this.getBusiness(this.businessServices);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });

    this.loadAll();
  }

  getBusiness(businessService: IBusinessService[]): void {
    const idOwner = this.account?.id;
    this.businessService.query().subscribe((res: HttpResponse<IBusiness[]>) => {
      this.business = res.body ?? [];
      console.warn('comercios filtrados', this.business);
      this.businessByOwner = this.business.filter(function (bus) {
        return bus.owner?.id === idOwner;
      });
      console.warn('comercios filtrados', this.businessByOwner);
      this.getServicesByOwner(this.businessByOwner, businessService);
    });
  }

  getServicesByOwner(businessByOwner: IBusiness[], businessService: IBusinessService[]): void {
    this.servicesByOwner = [];
    let busServices = businessService;
    for (const business of businessByOwner) {
      busServices = businessService.filter(function (busServ) {
        return busServ.business?.id === business.id;
      });
      if (busServices.length !== 0) {
        if (this.servicesByOwner.length === 0) {
          this.servicesByOwner = busServices;
        } else {
          this.servicesByOwner = this.servicesByOwner.concat(busServices);
        }
      }
    }
  }

  trackId(index: number, item: IBusinessService): number {
    return item.id!;
  }

  delete(businessService: IBusinessService): void {
    const modalRef = this.modalService.open(BusinessServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.businessService = businessService;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
