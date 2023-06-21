import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { Business, IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';
import { ILocation, Location } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';
import { Status } from '../../enumerations/status.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { BusinessLocation, IBusinessLocation } from 'app/entities/business/business-location.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-business-update',
  templateUrl: './business-update.component.html',
  styleUrls: ['./business-update.component.css'],
})
export class BusinessUpdateComponent implements OnInit {
  isSaving = false;
  files: File[] = [];
  dueñoComercio?: IUser;
  account?: Account;
  lat = 9.7489;
  lng = -83.7534;
  zoom = 9;
  newLocation?: ILocation;
  update = false;

  catsCollection: ICatalog[] = [];
  locationsCollection: ILocation[] = [];
  usersSharedCollection: IUser[] = [];
  catalogsSharedCollection: ICatalog[] = [];
  catsInsurance: ICatalog[] = [];
  filteredCatalogs: ICatalog[] = [];

  editForm: FormGroup = this.fb.group({
    id: [],
    identification: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
    name: ['', [Validators.required]],
    taxRegime: ['', [Validators.required]],
    category: ['', [Validators.required]],
    rating: [],
    status: [],
    capacity: ['', [Validators.required]],
    image: [],
    location: [],
    idLocation: [],
    province: ['', [Validators.required]],
    canton: ['', [Validators.required]],
    district: ['', [Validators.required]],
    latitud: this.lat,
    longitude: this.lng,
    exactLocation: [],
    owner: [],
    catalogs: [],
  });

  constructor(
    protected businessService: BusinessService,
    protected locationService: LocationService,
    protected userService: UserService,
    protected catalogService: CatalogService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ business }) => {
      this.filterCategories(business);
      this.loadRelationshipsOptions();
    });
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  //Start location methods
  markerDragEnd($event: any): void {
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
  }

  saveLocation(urlImage: string): void {
    this.isSaving = true;
    const location = this.createFromFormLocation();
    location.latitud = this.lat.toString();
    location.longitude = this.lng.toString();

    if (location.id == null) {
      this.subscribeToSaveResponseLocation(this.locationService.create(location), urlImage);
    } else {
      this.subscribeToSaveResponseLocation(this.locationService.update(location), urlImage);
    }
  }

  createFromFormLocation(): ILocation {
    const businessLocation = this.createFromForm();
    return {
      ...new Location(),
      id: businessLocation.idLocation,
      province: businessLocation.province,
      canton: businessLocation.canton,
      district: businessLocation.district,
      latitud: businessLocation.latitud,
      longitude: businessLocation.longitude,
      exactLocation: businessLocation.exactLocation,
    };
  }
  //Finish location methods

  // Start business methods
  onSelect(event: { addedFiles: any }): void {
    //console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File): void {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpload(): void {
    console.warn('this.files.length', this.files.length);
    if (this.files.length !== 0) {
      let imageUrl = '';
      //Upload my image to cloudinary
      if (!this.files[0]) {
        alert('Agregue una imagen por favor!!');
      }

      const file_data = this.files[0];
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'squid_Proyecto3');
      data.append('cloud_name', 'squidproyecto3');

      this.businessService.uploadImage(data).subscribe(response => {
        const image = response;
        imageUrl = image.secure_url;
        this.saveLocation(imageUrl);
      });
    } else {
      if (this.update !== false) {
        this.saveLocation('');
      } else {
        alert('Agregue una imagen por favor!!');
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(urlImage: string, location: ILocation): void {
    this.isSaving = true;
    const business = this.createFromFormBusiness();
    if (this.files.length !== 0) {
      business.image = urlImage;
    }
    business.location = location;
    business.rating = 5;

    if (business.id !== undefined) {
      this.subscribeToSaveResponse(this.businessService.update(business));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El comercio se actualizó con éxito',
      });
    } else {
      this.subscribeToSaveResponse(this.businessService.create(business));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El comercio se registró con éxito',
        text: '¡Aprobación pendiente!',
      });
    }
  }

  createFromFormBusiness(): IBusiness {
    const businessLocation = this.createFromForm();
    const cat: any = businessLocation.category;
    return {
      ...new Business(),
      id: businessLocation.id,
      identification: businessLocation.identification,
      name: businessLocation.name,
      taxRegime: businessLocation.taxRegime,
      category: cat.name,
      rating: businessLocation.rating,
      status: Status.Pending,
      capacity: businessLocation.capacity,
      image: businessLocation.image,
      location: businessLocation.location,
      owner: {
        id: Number(this.account?.id),
        login: this.account?.login,
      },
      catalogs: businessLocation.catalogs,
    };
  }

  trackLocationById(index: number, item: ILocation): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCatalogById(index: number, item: ICatalog): number {
    return item.id!;
  }

  filterCategories(business: IBusiness): void {
    this.catalogService.query().subscribe((res: HttpResponse<ICatalog[]>) => {
      this.catalogsSharedCollection = res.body ?? [];
      this.catsInsurance = res.body ?? [];
      this.catalogsSharedCollection = this.catalogsSharedCollection.filter(function (cats) {
        return cats.type === 'Tipo de comercio';
      });
      this.catsInsurance = this.catsInsurance.filter(function (catInsurance) {
        return catInsurance.type === 'Aseguradora';
      });
      this.updateForm(business);
    });
  }

  getCategory(business: IBusiness): void {
    console.warn('catalogos', this.catalogsSharedCollection);
    this.catsCollection = this.catalogsSharedCollection.filter(function (cats) {
      return cats.name === business.category;
    });
    console.warn('cat', this.catsCollection);
  }

  getSelectedCatalog(option: ICatalog, selectedVals?: ICatalog[]): ICatalog {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusiness>>): void {
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

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'business-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsCollection = locations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('owner')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
  //Finish business methods

  protected subscribeToSaveResponseLocation(result: Observable<HttpResponse<ILocation>>, urlImage: string): void {
    result.pipe(finalize(() => this.onSaveFinalizeLocation())).subscribe(
      response => this.onSaveSuccessLocation(response, urlImage),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccessLocation(response: HttpResponse<ILocation>, urlImage: string): void {
    const newLocation = {
      ...new Location(),
      id: response.body?.id,
      province: response.body?.province,
      canton: response.body?.canton,
      district: response.body?.district,
      latitud: response.body?.latitud,
      longitude: response.body?.longitude,
      exactLocation: response.body?.exactLocation,
    };
    this.save(urlImage, newLocation);
  }

  protected onSaveFinalizeLocation(): void {
    this.isSaving = false;
  }

  // Shared methods
  protected createFromForm(): IBusinessLocation {
    return {
      ...new BusinessLocation(),
      id: this.editForm.get(['id'])!.value,
      identification: this.editForm.get(['identification'])!.value,
      name: this.editForm.get(['name'])!.value,
      taxRegime: this.editForm.get(['taxRegime'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      status: this.editForm.get(['status'])!.value,
      category: this.editForm.get(['category'])!.value,
      capacity: this.editForm.get(['capacity'])!.value,
      image: this.editForm.get(['image'])!.value,
      location: this.editForm.get(['location'])!.value,
      idLocation: this.editForm.get(['idLocation'])!.value,
      province: this.editForm.get(['province'])!.value,
      canton: this.editForm.get(['canton'])!.value,
      district: this.editForm.get(['district'])!.value,
      latitud: this.editForm.get(['latitud'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      exactLocation: this.editForm.get(['exactLocation'])!.value,
      owner: this.editForm.get(['owner'])!.value,
      catalogs: this.editForm.get(['catalogs'])!.value,
    };
  }

  protected updateForm(business: IBusiness): void {
    if (business.location !== undefined) {
      this.lat = Number(business.location?.latitud);
      this.lng = Number(business.location?.longitude);
      this.zoom = 16;
      this.update = true;
      this.getCategory(business);
    }

    this.editForm.patchValue({
      id: business.id,
      identification: business.identification,
      name: business.name,
      taxRegime: business.taxRegime,
      category: this.catsCollection[0],
      capacity: business.capacity,
      image: business.image,
      location: business.location,
      idLocation: business.location?.id,
      province: business.location?.province,
      canton: business.location?.canton,
      district: business.location?.district,
      latitud: this.lat,
      longitude: this.lng,
      exactLocation: business.location?.exactLocation,
      owner: business.owner,
      catalogs: business.catalogs,
    });

    this.locationsCollection = this.locationService.addLocationToCollectionIfMissing(this.locationsCollection, business.location);
  }
}
