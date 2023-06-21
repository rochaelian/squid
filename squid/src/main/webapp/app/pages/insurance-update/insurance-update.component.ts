import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { IServiceOrder, IServiceOrderEditable, ServiceOrder } from '../../entities/service-order/service-order.model';
import { IOrder } from '../../entities/order/order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../entities/order/service/order.service';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../../config/input.constants';
import { IBusiness } from '../client/businesses/business.model';
import { IVehicle } from '../../entities/vehicle/vehicle.model';
import { ServiceOrderService } from '../../entities/service-order/service/service-order.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IBusinessService } from '../../entities/business-service/business-service.model';
import { BusinessServiceService } from '../../entities/business-service/service/business-service.service';
import { BusinessService } from '../../entities/business/service/business.service';
import { FileService } from '../../entities/file/service/file.service';
import { FileWrapper, IFile } from '../../entities/file/file.model';
import { ICatalog } from '../../entities/catalog/catalog.model';
import { CatalogService } from '../../entities/catalog/service/catalog.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './insurance-update.component.html',
  styleUrls: ['./insurance-update.component.scss'],
})
export class InsuranceUpdateComponent implements OnInit {
  file?: IFile | null;
  order?: IOrder;
  isSaving = false;
  isLoading = false;

  orderAvalId?: any;
  orderAval?: IOrder | null;
  resourceUrl = '/insurance';
  statusInsurance?: ICatalog | null;
  statusOfService?: ICatalog | null;

  // Components of the order
  imageUrlp?: '';
  files?: IFile[] | null;
  vehicle?: IVehicle | null | undefined;
  serviceOfTheOrder?: IServiceOrder | null;
  business?: IBusiness | null | undefined;
  bussinessServices?: IBusinessService[];
  bussinesOfService?: IBusinessService;

  bussinessServiceName: any;

  @Input()
  catalogsSharedCollection: ICatalog[] = [];
  dropZoneFiles: File[] = [];
  isLoadingOrderStatus = false;

  @Input()
  so?: IServiceOrderEditable | undefined;

  copySo?: IServiceOrderEditable | undefined;

  @ViewChild('template', { static: true }) template: any;
  @ViewChild('addPhotoButton', { static: false }) photoBtn: ElementRef | undefined;

  @Input()
  odd?: boolean;

  editForm = this.fb.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    deductible: ['', [Validators.required]],
    updatedCost: ['', [Validators.required]],
    comment: ['', [Validators.required]],
  });

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected fileService: FileService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected catalogService: CatalogService,
    protected businessService: BusinessService,
    protected viewContainerRef: ViewContainerRef,
    protected serviceOrderService: ServiceOrderService,
    protected bussinessServiceService: BusinessServiceService
  ) {}

  ngOnInit(): void {
    this.orderAvalId = localStorage.getItem('aval');

    this.loadThisOrder();
    this.loadStatusService();
    this.loadStatusInsurance();
    this.loadThisServiceOrder();
    this.viewContainerRef.createEmbeddedView(this.template);
    this.copySo = JSON.parse(JSON.stringify(this.so!));
  }

  routerPage(): void {
    this.router.navigateByUrl(`${this.resourceUrl}`);
  }

  loadThisOrder(): void {
    this.isLoading = true;
    this.orderService.find(this.orderAvalId).subscribe(
      (res: HttpResponse<IOrder>) => {
        this.isLoading = false;
        this.orderAval = res.body;
        this.loadFileByOrderId(this.orderAval?.id);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadFileByOrderId(id: any): void {
    this.isLoading = true;
    this.fileService.findByOrderId(id).subscribe(
      (res: HttpResponse<IFile>) => {
        this.isLoading = false;
        this.file = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadThisServiceOrder(): void {
    this.isLoading = true;
    this.serviceOrderService.findByOrderId(this.orderAvalId).subscribe(
      (res: HttpResponse<IServiceOrder>) => {
        this.isLoading = false;
        this.serviceOfTheOrder = res.body;
        this.vehicle = this.orderAval?.vehicle;
        this.business = this.orderAval?.business;
        this.loadBusinessServices();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadBusinessServices(): void {
    this.bussinessServiceService.findBusinessesServiceByServiceId(16).subscribe(
      (res: HttpResponse<IBusinessService[]>) => {
        this.isLoading = false;
        this.bussinessServices = res.body ?? [];
        this.loadServiceOfBusiness();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadServiceOfBusiness(): void {
    if (this.bussinessServices) {
      for (const businessServ of this.bussinessServices) {
        if (businessServ.business?.id === this.business?.id) {
          this.bussinesOfService = businessServ;
          this.bussinessServiceName = businessServ.service?.name;
        }
      }
    }
  }

  loadStatusInsurance(): void {
    this.isLoading = true;
    this.catalogService.find(58).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.statusInsurance = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae el status 5: Avalúo finalizado

  loadStatusService(): void {
    this.isLoading = true;
    this.catalogService.find(33).subscribe(
      (res: HttpResponse<IBusiness>) => {
        this.isLoading = false;
        this.statusOfService = res.body;
      },
      () => {
        this.isLoading = false;
      }
    );
  } // Trae el status 33: En espera, estado de servicio

  save(): void {
    this.isSaving = true;
    const serviceOrder = this.createFromForm();
    if (serviceOrder.id !== undefined) {
      if (this.orderAval?.status) {
        const upcost = this.editForm.get(['updatedCost'])!.value;
        const deduct = this.editForm.get(['deductible'])!.value;
        this.orderAval.totalCost = upcost - deduct;
        this.orderAval.status = this.statusInsurance;
        this.orderService.update(this.orderAval).subscribe(
          (res: HttpResponse<IOrder>) => {
            this.subscribeToSaveResponse(this.serviceOrderService.update(serviceOrder));
          },
          () => {
            this.isLoading = false;
          }
        );
      }
    }
  }

  soDropboxOnSelect(event: { addedFiles: any }): void {
    this.dropZoneFiles.push(...event.addedFiles);
    const so = this.serviceOfTheOrder!;
    const image = this.dropZoneFiles[0];

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'squid_Proyecto3');
    data.append('cloud_name', 'squidproyecto3');

    this.fileService.uploadImageToCloudinary(data).subscribe(response => {
      this.imageUrlp = response.secure_url;

      const file = {
        ...new FileWrapper(),
        uRL: this.imageUrlp,
        order: this.orderAval,
        serviceOrder: this.serviceOfTheOrder,
      };
      this.fileService.create(file).subscribe(res => {
        //Update in list of photos
        if (so.files === null) {
          this.files = [file];
        }
      });
    });
  }

  clearAval(order: any): void {
    localStorage.clear();
  }

  previousState(): void {
    window.history.back();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.routerPage();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected createFromForm(): IServiceOrder {
    const stDate = this.editForm.get(['startDate'])!.value;
    const eDate = this.editForm.get(['endDate'])!.value;
    return {
      ...new ServiceOrder(),
      id: this.serviceOfTheOrder?.id,
      startDate: dayjs(stDate, DATE_TIME_FORMAT),
      endDate: dayjs(eDate, DATE_TIME_FORMAT),
      deductible: this.editForm.get(['deductible'])!.value,
      updatedCost: this.editForm.get(['updatedCost'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      status: this.statusOfService,
      order: this.orderAval,
      businessService: this.bussinesOfService,
      files: this.files,
    };
  }

  /*  protected createFile(): IFile {
      return {
        ...new File(),
        uRL: this.imageUrlp,
        bLOBContentType: 'image/jpeg',
        order: this.orderAval,
        serviceOrder: this.serviceOfTheOrder,
      };
    }*/
} // END
