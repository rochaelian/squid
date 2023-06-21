import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrder } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { AppointmentDeleteDialogComponent } from '../delete/appointment-delete-dialog.component';
import { AccountService } from '../../../core/auth/account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-order',
  templateUrl: './appointment.component.html',
})
export class AppointmentComponent implements OnInit {
  orders?: IOrder[];
  isLoading = false;
  id = 0;
  resourceUrl = '/order';

  constructor(
    protected orderService: AppointmentService,
    private accountService: AccountService,
    protected modalService: NgbModal,
    private router: Router
  ) {}

  loadAll(): void {
    this.isLoading = true;
    this.accountService.identity().subscribe(account => {
      console.warn(account);
      if (account) {
        this.id = Number(account.id);
      }

      this.orderService.query(this.id).subscribe(
        (res: HttpResponse<IOrder[]>) => {
          this.isLoading = false;
          this.orders = res.body ?? [];
        },
        () => {
          this.isLoading = false;
        }
      );
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOrder): number {
    return item.id!;
  }

  updateAppointmentToOrder(order: IOrder): void {
    const identificationInput = this.id;
    this.orderService.updateAppointmentToOrder(order, { idOperator: identificationInput }).subscribe();
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'La cita ha sido iniciada.',
      showConfirmButton: true,
      timerProgressBar: true,
    }).then(() => {
      this.router.navigateByUrl(`${this.resourceUrl}/${order.id!}/edit`);
    });
  }
}
