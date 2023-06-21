import { Component, OnInit } from '@angular/core';
import { IOrder, Order } from '../../../../entities/order/order.model';
import { OrderPageService } from './order-page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { VehicleService } from '../../../../entities/vehicle/service/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { IVehicle } from '../../../../entities/vehicle/vehicle.model';
import { IBusiness } from '../../../../entities/business/business.model';
import { IBusinessService } from '../../../../entities/business-service/business-service.model';
import { BusinessServiceService } from '../../../../entities/business-service/service/business-service.service';
import { BusinessService } from '../../../../entities/business/service/business.service';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../../../../config/input.constants';
import { OrderService } from '../../../../entities/order/service/order.service';
import { Observable } from 'rxjs';
import { IAPP } from '../../../../entities/app/app.model';
import { APPService } from '../../../../entities/app/service/app.service';
import { ICatalog } from '../../../../entities/catalog/catalog.model';
import { CatalogService } from '../../../../entities/catalog/service/catalog.service';
import { IServiceOrder, ServiceOrder } from '../../../../entities/service-order/service-order.model';
import { ServiceOrderService } from '../../../../entities/service-order/service/service-order.service';

@Component({
  selector: 'jhi-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  isSaving = false;
  order?: IOrder | null;
  serviceOrder?: ServiceOrder;

  busServOrder?: IBusinessService | null;
  bussiness?: IBusiness | null;
  catalog?: ICatalog | null;
  appValues?: IAPP | null;

  businessServicesTemporal: IBusinessService[] = []; // uso
  businessServices?: IBusinessService[] = []; // Uso
  servItemsTemp: IBusinessService[] = []; // Uso
  servItems?: IBusinessService[] = []; // Uso
  vehicles?: IVehicle[]; // Uso

  isLoading = false;

  timeService = 0;
  servicesCost = 0;
  totalCost = 0;
  costIVA = 0;
  IVA = 0.13;
  resourceUrl = '/order';

  saveForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    totalCost: [''],
    vehicle: ['', [Validators.required]],
  });

  constructor(
    protected businessServiceService: BusinessServiceService,
    protected serviceOrderService: ServiceOrderService,
    protected orderPageService: OrderPageService,
    protected businessService: BusinessService,
    protected catalogService: CatalogService,
    protected activatedRoute: ActivatedRoute,
    protected vehicleService: VehicleService,
    protected orderService: OrderService,
    protected modalService: NgbModal,
    protected aPPService: APPService,
    protected fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBusinessServices();
    this.loadCatStatus();
    this.loadAppValues();
    this.loadVehicles();
    this.loadBussines();
  }

  trackId(index: number, item: IOrder): number {
    return item.id!;
  }

  trackVehicleById(index: number, item: IVehicle): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }

  loadBussines(): void {
    //El businness actual
    const idBus = Number(localStorage.getItem('business'));
    this.isLoading = true;
    this.businessService.find(idBus).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.bussiness = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadAppValues(): void {
    this.isLoading = true;
    this.aPPService.find(7).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.appValues = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadCatStatus(): void {
    this.isLoading = true;
    this.catalogService.find(28).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.catalog = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadBusinessServices(): void {
    const idBus = Number(localStorage.getItem('business'));
    this.isLoading = true;
    this.businessServiceService.findServicesBusPrices(idBus).subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businessServices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadVehicles(): void {
    this.vehicleService.queryMyVehicles().subscribe(
      (res: HttpResponse<IVehicle[]>) => {
        this.isLoading = false;
        this.vehicles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onSelectServ(serv: IBusinessService, price: any, time: any): void {
    this.businessServicesTemporal = this.businessServices ?? [];
    this.servItems = this.servItems ?? [];
    this.timeService += time;

    if (serv.service) {
      this.servItems.push(serv);
      this.servicesCost += price;
      this.costIVA = this.servicesCost * this.IVA;
      this.totalCost = this.servicesCost + this.costIVA;
    }

    this.businessServicesTemporal.forEach((value, index) => {
      if (value.service?.id === serv.service?.id) {
        this.businessServicesTemporal.splice(index, 1);
      }
    });
    this.businessServices = this.businessServicesTemporal;
  }

  onSelectDelete(serv: IBusinessService, price: any, time: any): void {
    this.servItemsTemp = this.servItems ?? [];
    this.businessServices = this.businessServices ?? [];
    this.timeService -= time;

    this.servItemsTemp.forEach((value, index) => {
      if (value.service?.id === serv.service?.id) {
        this.servItemsTemp.splice(index, 1);
        this.servicesCost -= price;
        this.costIVA = this.servicesCost * this.IVA;
        this.totalCost = this.servicesCost + this.costIVA;
      }
    });
    this.businessServices.push(serv);
  }

  save(): void {
    this.isSaving = true;
    const orderA = this.createFromForm();

    this.orderService.create(orderA).subscribe(
      (res: HttpResponse<IOrder>) => {
        this.isLoading = false;
        this.order = res.body;
        console.warn('order creada', this.order);

        this.servItems = this.servItems ?? [];
        this.businessServices = this.businessServices ?? [];

        for (let i = 0; i < this.servItems.length; i++) {
          // Por cada orden hay que hacer un loop para crear servicios
          this.busServOrder = this.servItems[i]; // dentro de esa orden
          const serviceOrder = this.createFromFormServices();
          this.subscribeToSaveResponse(this.serviceOrderService.create(serviceOrder));
        }
        this.calendarView(this.order!.id!);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  calendarView(id: number): void {
    this.router.navigateByUrl(`${this.resourceUrl}/${id}/calendar`);
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      startDate: this.saveForm.get(['startDate'])!.value ? dayjs(this.saveForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : null,
      endDate: this.saveForm.get(['endDate'])!.value ? dayjs(this.saveForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : null,
      //startDate : dayjs(new Date(), DATE_TIME_FORMAT),
      //endDate : dayjs(new Date(), DATE_TIME_FORMAT),
      totalCost: this.totalCost,
      comission: this.appValues?.comission,
      vehicle: this.saveForm.get(['vehicle'])!.value,
      business: this.bussiness,
      status: this.catalog,
    };
  }

  protected createFromFormServices(): IServiceOrder {
    return {
      ...new ServiceOrder(),
      startDate: this.saveForm.get(['startDate'])!.value ? dayjs(this.saveForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.saveForm.get(['endDate'])!.value ? dayjs(this.saveForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      //   deductible: this.editForm.get(['deductible'])!.value,
      //   updatedCost: this.editForm.get(['updatedCost'])!.value,
      //   comment: this.editForm.get(['comment'])!.value,
      status: this.catalog,
      order: this.order,
      businessService: this.busServOrder,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.router.navigateByUrl(`${this.resourceUrl}/${this.order!.id!}/calendar`);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
