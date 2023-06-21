import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../service/vehicle.service';
import { IVehicle } from '../vehicle.model';
import { AccountService } from '../../../core/auth/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IOrder } from '../../order/order.model';
import { IServiceOrder } from '../../service-order/service-order.model';
import { ServiceOrderService } from '../../service-order/service/service-order.service';
import * as dayjs from 'dayjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VehicleDeleteDialogComponent } from '../delete/vehicle-delete-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  isSaving = false;
  order?: IOrder;
  serviceOrders: IServiceOrder[] = [];
  resourceUrl = '/businesses';
  warning?: string = '!Su vehículo no posee ningún servicio registrado!';
  p1?: string = 'En nuestra aplicación podrá encontar muchos comercios que ofercen diferentes servicios.';
  p2?: string = 'Si desea agendar un servicio, solamente haga clic en el siguiente botón';
  hideButton = true;

  constructor(
    protected serviceOrderService: ServiceOrderService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicle }) => {
      if (vehicle !== undefined) {
        this.serviceOrderService.findByVehicle(vehicle.id).subscribe((res: HttpResponse<IServiceOrder[]>) => {
          this.serviceOrders = res.body ?? [];
          console.warn('response', this.serviceOrders);
          this.validateTheOilChangeTime();
        });
      }
    });
  }

  validateTheOilChangeTime(): void {
    const now = dayjs();
    if (this.serviceOrders.length !== 0) {
      for (let i = 0; i < this.serviceOrders.length; i++) {
        if (this.serviceOrders[i].businessService?.service?.name === 'Cambio de aceite') {
          const dateServ = dayjs(this.serviceOrders[i].endDate!);
          const diff = now.diff(dateServ, 'months');
          if (diff >= 6) {
            this.hideButton = false;
            this.warning = '!Su vehículo tiene ';
            this.warning += diff.toString();
            this.warning += ' meses sin solicitar un cambio de aceite!';
            this.p1 = 'Con nosotros podrá encontar muchos comercios que ofercen este servicio.';
            this.p2 = 'Si desea agendar este servicio y más, solamente haga clic en el siguiente botón';
            console.warn(this.warning);
          }
        }
      }
    } else {
      this.hideButton = false;
    }
  }

  goToBusinesses(): void {
    this.router.navigateByUrl(`${this.resourceUrl}`);
  }

  showRecommendation(): void {
    const modalRef = this.modalService.open(VehicleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.warning = this.warning;
    modalRef.componentInstance.p1 = this.p1;
    modalRef.componentInstance.p2 = this.p2;
    modalRef.closed.subscribe(reason => {
      if (reason === 'showBusiness') {
        this.goToBusinesses();
      }
    });
  }
}
