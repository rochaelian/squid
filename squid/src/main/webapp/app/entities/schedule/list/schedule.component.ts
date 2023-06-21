import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISchedule } from '../schedule.model';
import { ScheduleService } from '../service/schedule.service';
import { BusinessService } from '../../business/service/business.service';
import { ScheduleDeleteDialogComponent } from '../delete/schedule-delete-dialog.component';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { IBusiness } from '../../business/business.model';
import { IBusinessService } from '../../business-service/business-service.model';

@Component({
  selector: 'jhi-schedule',
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit {
  schedules?: ISchedule[] = [];
  schedulesByOwner?: ISchedule[];
  isLoading = false;
  account?: Account;
  businessByOwner: IBusiness[] = [];

  constructor(
    protected scheduleService: ScheduleService,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected businessService: BusinessService
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.scheduleService.query().subscribe(
      (res: HttpResponse<ISchedule[]>) => {
        this.isLoading = false;
        this.schedules = res.body ?? [];
        this.filterBusinessByOwner();
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

  filterBusinessByOwner(): void {
    const idOwner = this.account?.id;
    this.businessService.queryByOwner(Number(idOwner)).subscribe((res: HttpResponse<IBusiness[]>) => {
      this.businessByOwner = res.body ?? [];
      this.getSchedulesByOwner(this.businessByOwner);
    });
  }

  getSchedulesByOwner(businessByOwner: IBusiness[]): void {
    this.schedulesByOwner = [];
    let sched = this.schedules;
    if (this.schedules) {
      for (const business of businessByOwner) {
        sched = this.schedules.filter(function (sc) {
          return sc.business?.id === business.id;
        });
        if (this.schedulesByOwner.length === 0) {
          this.schedulesByOwner = sched;
        } else {
          this.schedulesByOwner = this.schedulesByOwner.concat(sched);
        }
      }
    }
    console.warn('horarios filtrados por dueño', this.schedulesByOwner);
    this.filterSpecialDaysByOwner();
  }

  filterSpecialDaysByOwner(): void {
    if (this.schedulesByOwner) {
      this.schedulesByOwner = this.schedulesByOwner.filter(function (specialD) {
        return specialD.isSpecial === true;
      });
      console.warn('por dias especiañes', this.schedulesByOwner);
    }
  }

  trackId(index: number, item: ISchedule): number {
    return item.id!;
  }

  delete(schedule: ISchedule): void {
    const modalRef = this.modalService.open(ScheduleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.schedule = schedule;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
