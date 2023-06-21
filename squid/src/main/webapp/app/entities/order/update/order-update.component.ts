import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { Catalog, ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';
import { FileWrapper, IFile } from '../../file/file.model';
import { FileService } from '../../file/service/file.service';
import { IServiceOrder, ServiceOrder, IServiceOrderEditable, booleanReturn } from '../../service-order/service-order.model';
import { ServiceOrderService } from '../../service-order/service/service-order.service';
import { IBusinessService } from '../../business-service/business-service.model';
import { BusinessServiceService } from '../../business-service/service/business-service.service';
import { Account } from '../../../core/auth/account.model';
import { IUserDetails } from '../../user-details/user-details.model';
import Swal from 'sweetalert2';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.scss'],
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  order?: IOrder;
  copyOrder?: IOrder;
  isLoadingOrderStatus = false;
  isLoadingNewServiceOrderStatus = false;
  newServiceEditable = false;
  myBooleanVal?: booleanReturn;
  account!: Account;

  vehiclesSharedCollection: IVehicle[] = [];
  usersSharedCollection: IUser[] = [];
  businessesSharedCollection: IBusiness[] = [];
  catalogsSharedCollection: ICatalog[] = [];
  serviceOrders: IServiceOrderEditable[] = [];
  dropZoneFiles: File[] = [];

  //For adding a new service
  businessServicesCollection?: IBusinessService[] = [];
  selectedBusinessService?: IBusinessService;
  businessServicesTemporalCollection: IBusinessService[] = [];
  servItemsTemp: IBusinessService[] = []; // Uso
  servItems?: IBusinessService[] = []; // Uso
  @ViewChild('newServiceOrder', { static: false }) selectNewServiceOrder: ElementRef | undefined;

  @ViewChild('addPhotoButtonOrder', { static: false }) photoBtn: ElementRef | undefined;

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    totalCost: [],
    comission: [],
    vehicle: [],
    operator: [],
    business: [],
    status: [],
  });

  constructor(
    protected orderService: OrderService,
    protected vehicleService: VehicleService,
    protected userService: UserService,
    protected businessService: BusinessService,
    protected businessServiceService: BusinessServiceService,
    protected catalogService: CatalogService,
    protected fileService: FileService,
    protected serviceOrderService: ServiceOrderService,
    private accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      if (order.id === undefined) {
        const today = dayjs().startOf('day');
        order.startDate = today;
        order.endDate = today;
      }

      if (order.id !== undefined) {
        this.order = order;
        this.serviceOrderService.findByOrder(order.id).subscribe((res: HttpResponse<IServiceOrder[]>) => {
          this.serviceOrders = res.body ?? [];
        });

        this.loadBusinessServices(order.business.id);
      }

      if (this.order?.id !== undefined) {
        this.orderService.getRatingStatus(this.order.id).subscribe(x => {
          this.myBooleanVal = x;
          console.warn(x.retData, 'X Value'); // this print true "X Value"
          console.warn('booleano', this.myBooleanVal); // this prints "true"
        });
      }

      this.updateForm(order);

      this.loadRelationshipsOptions();
      console.warn('orden', this.order);
    });
    this.accountService.identity().subscribe(account => {
      if (account) {
        console.warn('lo que se trae', account);
        this.account = account;
      }
    });
  }

  loadBusinessServices(businessId: number): void {
    this.businessServiceService.findServicesBusPrices(businessId).subscribe((res: HttpResponse<IBusiness[]>) => {
      this.businessServicesCollection = res.body ?? [];
    });
  }

  serviceEditable(value: boolean): void {
    this.newServiceEditable = value;
  }

  saveNewServiceOrder(): void {
    this.isLoadingNewServiceOrderStatus = true;
    const id = 33; // ID de en espera para service
    const serviceOrderStatus = {
      ...new Catalog(),
      id,
      name: 'En espera',
    };

    const serviceOrder = {
      ...new ServiceOrder(),
      status: serviceOrderStatus,
      order: this.order,
      businessService: this.selectedBusinessService,
    };

    this.serviceOrderService.create(serviceOrder).subscribe((res: HttpResponse<IServiceOrder>) => {
      const newServiceOrder: IServiceOrder = res.body ?? {};
      //this.order!.totalCost = serviceOrder.businessService?.price;
      this.serviceOrders.push(newServiceOrder);
      this.recalculateOrderCost();
      this.isLoadingNewServiceOrderStatus = false;
      this.newServiceEditable = false;
    });
  }

  recalculateOrderCost(): void {
    let cost = 0;
    const so = this.serviceOrders;
    for (let i = 0; i < this.serviceOrders.length; i++) {
      cost += so[i].businessService!.price!;
    }
    this.order!.totalCost = cost;
    this.orderService.update(this.order!).subscribe();
  }

  changeOrderStatus(status: ICatalog): void {
    const order = this.order!;
    this.isLoadingOrderStatus = true;
    order.status = status;
    const now = dayjs();
    if (order.status.name === 'En proceso') {
      order.startDate = now;
    } else if (order.status.name === 'Terminado') {
      order.endDate = now;
    }
    this.orderService.update(order).subscribe((res: HttpResponse<IServiceOrder>) => {
      this.order = res.body ?? {};
      this.isLoadingOrderStatus = false;
    });
  }

  transformImage(imageUrl: string): string {
    const height = '300';
    const transformString = '/c_crop,h_' + height + ',w_' + height;
    const transformedImageUrl = imageUrl.slice(0, 54) + transformString + imageUrl.slice(54);
    return transformedImageUrl;
  }

  orderDropboxOnSelect(event: { addedFiles: any }): void {
    this.dropZoneFiles.push(...event.addedFiles);
    const o = this.order!;
    const image = this.dropZoneFiles[0];

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'squid_Proyecto3');
    data.append('cloud_name', 'squidproyecto3');

    this.fileService.uploadImageToCloudinary(data).subscribe(response => {
      const uRL = response.secure_url;
      const id = o.id;
      //New so it doesn't send all the so nested objects
      const order = {
        ...new Order(),
        id,
      };
      const file = {
        ...new FileWrapper(),
        uRL,
        order,
      };

      this.fileService.create(file).subscribe(res => {
        //Update in list of photos
        if (o.files === null) {
          o.files = [file];
        } else {
          o.files?.push(file);
        }
        //To hide the dropzone
        this.photoBtn?.nativeElement.click();
        this.dropZoneFiles = [];
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackVehicleById(index: number, item: IVehicle): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  trackCatalogById(index: number, item: ICatalog): number {
    return item.id!;
  }

  trackServiceOrderById(index: number, item: IServiceOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      startDate: order.startDate ? order.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: order.endDate ? order.endDate.format(DATE_TIME_FORMAT) : null,
      totalCost: order.totalCost,
      comission: order.comission,
      vehicle: order.vehicle,
      operator: order.operator,
      business: order.business,
      status: order.status,
    });

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing(this.vehiclesSharedCollection, order.vehicle);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, order.operator);
    this.businessesSharedCollection = this.businessService.addBusinessToCollectionIfMissing(
      this.businessesSharedCollection,
      order.business
    );
    this.catalogsSharedCollection = this.catalogService.addCatalogToCollectionIfMissing(this.catalogsSharedCollection, order.status);
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleService
      .query()
      .pipe(map((res: HttpResponse<IVehicle[]>) => res.body ?? []))
      .pipe(
        map((vehicles: IVehicle[]) => this.vehicleService.addVehicleToCollectionIfMissing(vehicles, this.editForm.get('vehicle')!.value))
      )
      .subscribe((vehicles: IVehicle[]) => (this.vehiclesSharedCollection = vehicles));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('operator')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.businessService
      .query()
      .pipe(map((res: HttpResponse<IBusiness[]>) => res.body ?? []))
      .pipe(
        map((businesses: IBusiness[]) =>
          this.businessService.addBusinessToCollectionIfMissing(businesses, this.editForm.get('business')!.value)
        )
      )
      .subscribe((businesses: IBusiness[]) => (this.businessesSharedCollection = businesses));

    this.catalogService
      .query()
      .pipe(map((res: HttpResponse<ICatalog[]>) => res.body ?? []))
      .pipe(
        map((catalogs: ICatalog[]) => this.catalogService.addCatalogToCollectionIfMissing(catalogs, this.editForm.get('status')!.value))
      )
      .subscribe((catalogs: ICatalog[]) => (this.catalogsSharedCollection = catalogs));

    // this.businessServiceService.findByBusiness(this.order?.business?.id!)
    //   .pipe(map((res: HttpResponse<IBusinessService[]>) => res.body ??[]))
    //   .subscribe((businessServices: IBusinessService[]) => (this.businessServicesCollection = businessServices));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      totalCost: this.editForm.get(['totalCost'])!.value,
      comission: this.editForm.get(['comission'])!.value,
      vehicle: this.editForm.get(['vehicle'])!.value,
      operator: this.editForm.get(['operator'])!.value,
      business: this.editForm.get(['business'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
