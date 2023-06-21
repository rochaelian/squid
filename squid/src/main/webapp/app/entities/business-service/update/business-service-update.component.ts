import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBusinessService, Business_Service } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { CatService, ICatService } from 'app/entities/cat-service/cat-service.model';
import { CatServiceService } from 'app/entities/cat-service/service/cat-service.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../../../core/auth/account.model';
import { Business_Service_Personalized, IBusinessServicePersonalized } from '../business-service-personalized.model';
import Swal from 'sweetalert2';
import { Status } from '../../enumerations/status.model';
import { ILocation, Location } from '../../location/location.model';
import { EntityResponseType } from '../../app/service/app.service';

@Component({
  selector: 'jhi-business-service-update',
  templateUrl: './business-service-update.component.html',
})
export class BusinessServiceUpdateComponent implements OnInit {
  isSaving = false;
  account?: Account;
  myBusinesses?: IBusiness[];
  businessServices?: IBusinessService[];
  servicesByOwner?: IBusinessService[];
  selectedBusiness?: IBusiness;
  hideBusinessSelect = false;
  hideBusiness = true;
  hideService = true;
  hideServiceSelect = false;
  hideName = true;
  hideCategory = true;
  updateWithCat = false;
  update = false;

  catServ: HttpResponse<ICatService> = new HttpResponse<ICatService>();
  busServices: HttpResponse<IBusinessService> = new HttpResponse<IBusinessService>();
  businessesSharedCollection: IBusiness[] = [];
  catServicesSharedCollection: ICatService[] = [];
  allCatServices: ICatService[] = [];

  editForm = this.fb.group({
    id: [],
    price: ['', [Validators.required]],
    duration: ['', [Validators.required]],
    business: ['', [Validators.required]],
    service: [],
    idCat: [],
    name: [],
    status: [],
    category: [],
  });

  constructor(
    protected businessServiceService: BusinessServiceService,
    protected businessService: BusinessService,
    protected catServiceService: CatServiceService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessService }) => {
      if (businessService.service.id !== undefined) {
        this.getCatServiceForUpdating(businessService.service.id);
      }
      this.updateForm(businessService);
      // this.loadRelationshipsOptions();
    });

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
    this.getMyBusinesses();
    this.getCategories();
    this.getServices();
  }

  getMyBusinesses(): void {
    this.businessService.queryByOwner(Number(this.account?.id)).subscribe((res: HttpResponse<IBusiness[]>) => {
      this.myBusinesses = res.body ?? [];
      this.myBusinesses = this.getOnlyEnabledBusinesses();
    });
  }

  getCategories(): void {
    this.catServiceService.query().subscribe((res: HttpResponse<ICatService[]>) => {
      this.allCatServices = res.body ?? [];
      this.catServicesSharedCollection = this.allCatServices.filter(function (catServs) {
        return catServs.business == null;
      });
    });
  }

  getServices(): void {
    this.businessServiceService.query().subscribe((res: HttpResponse<IBusinessService[]>) => {
      this.businessServices = res.body ?? [];
    });
  }

  getServicesByOwner(id: number | undefined): void {
    if (this.businessServices) {
      this.servicesByOwner = this.businessServices.filter(function (serv) {
        return serv.business?.id === id;
      });
    }
  }

  getOnlyEnabledBusinesses(): IBusiness[] {
    let approvedBusinesses: IBusiness[] = [];
    if (this.myBusinesses) {
      approvedBusinesses = this.myBusinesses.filter(function (business) {
        return business.status === 'Enabled';
      });
    }
    return approvedBusinesses;
  }

  updateDisplayedServices(): void {
    const business = this.selectedBusiness;
    let catServices = this.catServicesSharedCollection;
    this.getServicesByOwner(business?.id);
    const businessServices = this.servicesByOwner;
    if (businessServices) {
      for (const services of businessServices) {
        catServices = this.catServicesSharedCollection.filter(function (cat) {
          return cat.name !== services.service?.name;
        });
        this.catServicesSharedCollection = catServices;
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  createPersonalizedService(): void {
    this.hideName = false;
    this.hideCategory = false;
    this.hideServiceSelect = true;
    this.hideService = false;
  }

  createFromFormServicePersonalized(): ICatService {
    const servPersonalized = this.createFromForm();
    return {
      ...new CatService(),
      id: servPersonalized.idCat,
      name: servPersonalized.name,
      status: Status.Enabled,
      category: servPersonalized.category,
      business: servPersonalized.business,
    };
  }

  createFromFormServicePredifined(): IBusinessService {
    const servPredefined = this.createFromForm();
    return {
      ...new Business_Service(),
      id: servPredefined.id,
      price: servPredefined.price,
      duration: servPredefined.duration,
      business: servPredefined.business,
      service: servPredefined.service,
    };
  }

  saveCatService(): void {
    this.isSaving = true;
    const catService = this.createFromFormServicePersonalized();

    if (catService.id == null) {
      this.subscribeToSaveResponseCatService(this.catServiceService.create(catService));
    } else {
      catService.business = this.busServices.body?.business;
      this.subscribeToSaveResponseCatService(this.catServiceService.update(catService));
    }
  }

  saveFirstStep(): void {
    this.isSaving = true;
    const service = this.createFromForm();
    const catServ = this.createFromFormServicePersonalized();
    if (service.service?.id == null || this.updateWithCat) {
      console.warn(' cat servs = ', this.catServ);
      this.saveCatService();
    } else {
      console.warn(' bus servs = ', this.busServices);
      this.save(catServ);
    }
  }

  save(catService: ICatService): void {
    this.isSaving = true;
    const servicePredifined = this.createFromFormServicePredifined();
    if (servicePredifined.service === null) {
      servicePredifined.service = catService;
    }
    if (servicePredifined.id != null) {
      servicePredifined.service = this.catServ.body;
      servicePredifined.business = this.busServices.body?.business;
      this.subscribeToSaveResponse(this.businessServiceService.update(servicePredifined));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El servicio se actualizó exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      this.subscribeToSaveResponse(this.businessServiceService.create(servicePredifined));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El servicio se registró exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  trackCatServiceById(index: number, item: ICatService): number {
    return item.id!;
  }

  getCatServiceForUpdating(idCat: number | undefined): any {
    if (idCat !== undefined) {
      this.catServiceService.find(idCat).subscribe(service => {
        this.catServ = service;
        console.warn('Servicio  a actualizar, cat service', this.catServ);
      });
    }
  }

  createUpdateForm(response: HttpResponse<IBusinessService>): void {
    this.busServices = response;
    const businessService = response.body;
    if (response.body?.id != null) {
      if (response.body.business) {
        if (this.catServ.body?.business == null) {
          this.hideBusinessSelect = true;
          this.hideServiceSelect = true;
          this.hideService = false;
          this.hideBusiness = false;
          this.update = true;
          this.editForm.patchValue({
            id: businessService?.id,
            price: businessService?.price,
            duration: businessService?.duration,
            business: businessService?.business?.name,
            idCat: businessService?.service?.id,
            service: businessService?.service?.name,
            name: businessService?.service?.name,
            category: businessService?.service?.category,
          });
        } else {
          this.hideBusinessSelect = true;
          this.hideServiceSelect = true;
          this.hideBusiness = false;
          this.hideName = false;
          this.hideCategory = false;
          this.updateWithCat = true;
          this.editForm.patchValue({
            id: businessService?.id,
            price: businessService?.price,
            duration: businessService?.duration,
            business: businessService?.business?.name,
            service: businessService?.service?.name,
            idCat: businessService?.service?.id,
            name: businessService?.service?.name,
            category: businessService?.service?.category,
          });
        }
      }
    }
  }

  protected subscribeToSaveResponseCatService(result: Observable<HttpResponse<ICatService>>): void {
    result.pipe(finalize(() => this.onSaveFinalizeCatService())).subscribe(
      response => this.onSaveSuccessCatService(response),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccessCatService(response: HttpResponse<ICatService>): void {
    const newCatService = {
      ...new CatService(),
      id: response.body?.id,
      name: response.body?.name,
      status: response.body?.status,
      category: response.body?.category,
      business: response.body?.business,
    };
    this.save(newCatService);
  }

  protected onSaveFinalizeCatService(): void {
    this.isSaving = false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessService>>): void {
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

  protected updateForm(businessService: IBusinessService): void {
    if (businessService.id) {
      this.businessServiceService.find(businessService.id).subscribe(service => {
        const serv = service;
        this.createUpdateForm(serv);
      });
    }
  }

  protected createFromForm(): IBusinessServicePersonalized {
    return {
      ...new Business_Service_Personalized(),
      id: this.editForm.get(['id'])!.value,
      price: this.editForm.get(['price'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      business: this.editForm.get(['business'])!.value,
      service: this.editForm.get(['service'])!.value,
      idCat: this.editForm.get(['idCat'])?.value,
      name: this.editForm.get(['name'])?.value,
      status: this.editForm.get(['status'])?.value,
      category: this.editForm.get(['category'])?.value,
    };
  }
}
