import { Component, OnInit } from '@angular/core';
import { IVehicle } from '../../entities/vehicle/vehicle.model';
import { VehicleService } from '../../entities/vehicle/service/vehicle.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { IBusiness } from '../client/businesses/business.model';
import { BusinessService } from '../../entities/business/service/business.service';
import { CatalogService } from '../../entities/catalog/service/catalog.service';
import { ICatalog } from '../../entities/catalog/catalog.model';
import { formattedError } from '@angular/compiler';
import { IOrder, Order } from '../../entities/order/order.model';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../../config/input.constants';
import { IAPP } from '../../entities/app/app.model';
import { APPService } from '../../entities/app/service/app.service';
import { IBusinessService } from '../../entities/business-service/business-service.model';
import { BusinessServiceService } from '../../entities/business-service/service/business-service.service';
import { IServiceOrder, ServiceOrder } from '../../entities/service-order/service-order.model';
import { OrderService } from '../../entities/order/service/order.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceOrderService } from '../../entities/service-order/service/service-order.service';
import { Account } from '../../core/auth/account.model';
import { AccountService } from '../../core/auth/account.service';
import { IUserDetails } from '../../entities/user-details/user-details.model';
import { UserDetailsService } from '../../entities/user-details/service/user-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-order-page',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
})
export class InsuranceComponent implements OnInit {
  statusInsuranceApproved?: ICatalog | null;
  statusInsuranceRejected?: ICatalog | null;
  bussinessServices?: IBusinessService[];
  idAseguradora: number | undefined = 0;
  businessInsurance?: IBusiness[] = [];
  currentAccount: Account | undefined;
  businessSingleService?: IBusiness;
  statusInsurance?: ICatalog | null;
  serviceOfTheOrder?: IServiceOrder | null;
  bussinesWithService?: IBusiness[];

  selectedBusiness?: IBusiness;
  userDetails?: IUserDetails;
  selectedVehicle?: IVehicle;
  ordersToAccept?: IOrder[];
  bussinessServiceName: any;
  businesses?: IBusiness[];
  appValues?: IAPP | null;
  ordersOpertr?: IOrder[];
  ordersClient?: IOrder[];
  ordersTable?: IOrder[];
  order?: IOrder | null;
  linkAval = '';

  vehicles?: IVehicle[];
  busines?: IBusiness;
  isLoading = false;
  isSaving = false;
  resourceUrl = '/order';

  cost1: number | null | undefined = 0;
  cost2: number | null | undefined = 0;
  tcost: number | null | undefined = 0;

  saveForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    totalCost: [],
    vehicle: ['', [Validators.required]],
    business: ['', [Validators.required]],
  });

  constructor(
    protected aPPService: APPService,
    protected orderService: OrderService,
    protected vehicleService: VehicleService,
    protected catalogService: CatalogService,
    protected accountService: AccountService,
    protected businessService: BusinessService,
    protected userDetailsService: UserDetailsService,
    protected serviceOrderService: ServiceOrderService,
    protected bussinessServiceService: BusinessServiceService,
    protected fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.currentAccount = account;
      }
      this.userDetailsService
        .queryByInternalUser({ internalUserId: this.currentAccount?.id })
        .subscribe((res: HttpResponse<IUserDetails>) => {
          if (res.body) {
            this.userDetails = res.body;
          }
        });
    });

    this.loadVehicles();
    this.loadBusiness();
    this.loadAppValues();
    this.loadStatusInsurance();
    this.loadBusinessService();

    this.loadOrdersInsurance();
    this.loarOrdersToProcess();
    this.loadStatusInsuranceApproved();
    this.loadStatusInsuranceRejected();
  }

  previousState(): void {
    window.history.back();
  }

  trackId(index: number, item: IOrder): number {
    return item.id!;
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

  trackVehicleById(index: number, item: IVehicle): number {
    return item.id!;
  }

  onSelectVehicle(): void {
    this.idAseguradora = this.selectedVehicle?.insurer?.id;
    this.loadBusinessInsurance();
  }

  loadBusiness(): void {
    this.businessService.query().subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businesses = res.body ?? [];
        this.loadBusinessInsurance();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadBusinessInsurance(): void {
    this.businessInsurance = [];

    if (this.businesses) {
      for (const business of this.businesses) {
        if (business.catalogs) {
          for (const catalogs of business.catalogs) {
            if (catalogs.id === this.idAseguradora) {
              this.businessInsurance.push(business);
            }
          }
        }
      }
    }
  } // Trae los business que están afiliados a la aseguradora del vehiculo

  /*
    loadBusinessWithTheService(): void{
      this.bussinesWithService  = [];
      if (this.businessInsurance){
        for (const business of this.businessInsurance){
          if (this.bussinessServices){
            for (const service of this.bussinessServices){
              if (service.service?.id === 16){
                this.bussinesWithService.push(business);
              }
            }
          }
        }
      }
    }*/

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
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

  loadStatusInsurance(): void {
    this.isLoading = true;
    this.catalogService.find(57).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.statusInsurance = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae el status 57: En avalúo

  loadStatusInsuranceApproved(): void {
    this.isLoading = true;
    this.catalogService.find(28).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.statusInsuranceApproved = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae el status 58: En espera

  loadStatusInsuranceRejected(): void {
    this.isLoading = true;
    this.catalogService.find(29).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.statusInsuranceRejected = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae el status 29: Cancelado

  loadServiceOfBusiness(): void {
    this.busines = this.selectedBusiness;

    if (this.bussinessServices) {
      for (const businessServ of this.bussinessServices) {
        if (businessServ.service?.id === 16) {
          this.businessSingleService = businessServ;
          this.bussinessServiceName = businessServ.service.name;
        }
      }
    }
  } // Para el form

  loadBusinessService(): void {
    this.bussinessServiceService.findBusinessesServiceByServiceId(16).subscribe(
      (res: HttpResponse<IBusinessService[]>) => {
        this.isLoading = false;
        this.bussinessServices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae servicios de un comercio por el id del servicio: Reparación de daños

  loadOrdersInsurance(): void {
    this.isLoading = true;

    this.orderService.ordersStatusInsurance(57).subscribe(
      (res: HttpResponse<IOrder[]>) => {
        this.isLoading = false;
        this.ordersTable = res.body ?? [];
        this.loadOrdersUserClient();
        this.loadOrdersOperator();
      },
      () => {
        this.isLoading = false;
      }
    );
  } //Trae las ordenes que se muestran en la tabla status En avaluo

  loadOrdersOperator(): void {
    this.ordersOpertr = [];
    if (this.ordersTable) {
      for (const ordersAvaluo of this.ordersTable) {
        if (ordersAvaluo.business?.id === this.userDetails?.business?.id) {
          this.ordersOpertr.push(ordersAvaluo);
        }
      }
    }
  }

  loadOrdersUserClient(): void {
    this.ordersClient = [];
    if (this.ordersTable) {
      for (const ordersAvaluo of this.ordersTable) {
        if (this.vehicles) {
          for (const vehicle of this.vehicles) {
            if (ordersAvaluo.vehicle?.id === vehicle.id) {
              this.ordersClient.push(ordersAvaluo);
            }
          }
        }
      }
    }
  }

  loarOrdersToProcess(): void {
    this.isLoading = true;

    this.orderService.ordersStatusInsurance(58).subscribe(
      (res: HttpResponse<IOrder[]>) => {
        this.isLoading = false;
        this.ordersTable = res.body ?? [];
        this.loadOrdersUserClientToAccept();
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae todas las ordenes en estado 58: Avalúo finalizado

  loadOrdersUserClientToAccept(): void {
    this.ordersToAccept = [];
    if (this.ordersTable) {
      for (const ordersAvaluo of this.ordersTable) {
        if (this.vehicles) {
          for (const vehicle of this.vehicles) {
            if (ordersAvaluo.vehicle?.id === vehicle.id) {
              this.ordersToAccept.push(ordersAvaluo);
            }
          }
        }
      }
    }
  } // Carga sólo las ordenes en estado: Avalúo finalizado para mostrar en la lista

  updateStatusButton(order: any): void {
    if (order.status) {
      order.status = this.statusInsuranceApproved;
      const stDate = order.startDate;
      const eDate = order.endDate;
      order.startDate = dayjs(stDate, DATE_TIME_FORMAT);
      order.endDate = dayjs(eDate, DATE_TIME_FORMAT);
      this.subscribeToSaveResponse(this.orderService.update(order));
      window.location.reload();
    }
  }

  updateRejectedStatusButton(order: any): void {
    if (order.status) {
      order.status = this.statusInsuranceRejected;
      const stDate = order.startDate;
      const eDate = order.endDate;
      order.startDate = dayjs(stDate, DATE_TIME_FORMAT);
      order.endDate = dayjs(eDate, DATE_TIME_FORMAT);
      this.subscribeToSaveResponse(this.orderService.update(order));
    }
  }

  save(): void {
    this.isSaving = true;
    const orderForm = this.createFromForm();

    this.orderService.create(orderForm).subscribe(
      (res: HttpResponse<IOrder>) => {
        this.isLoading = false;
        this.order = res.body;

        const serviceOrder = this.createFromFormServices();
        this.subscribeToSaveResponse(this.serviceOrderService.create(serviceOrder));
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  editAval(order: any): void {
    localStorage.setItem('aval', order);
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      startDate: this.saveForm.get(['startDate'])!.value ? dayjs(this.saveForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : null,
      endDate: this.saveForm.get(['endDate'])!.value ? dayjs(this.saveForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : null,
      comission: this.appValues?.comission,
      vehicle: this.saveForm.get(['vehicle'])!.value,
      business: this.saveForm.get(['business'])!.value,
      status: this.statusInsurance,
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
      status: this.statusInsurance,
      order: this.order,
      businessService: this.businessSingleService,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    localStorage.clear();
    this.router.navigateByUrl(`${this.resourceUrl}/${this.order!.id!}/calendar`);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
