import { Component, OnInit } from '@angular/core';
import { IBusiness } from '../../../entities/business/business.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../../../entities/location/service/location.service';
import { HttpResponse } from '@angular/common/http';
import { BusinessesService } from './businesses.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ICatalog } from '../../../entities/catalog/catalog.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ILocation } from '../../../entities/location/location.model';
import { IUser } from '../../../entities/user/user.model';
import { ICatService } from '../../../entities/cat-service/cat-service.model';
import { CatServiceService } from '../../../entities/cat-service/service/cat-service.service';

@Component({
  selector: 'jhi-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss'],
  providers: [NgbRatingConfig],
})
export class BusinessesComponent implements OnInit {
  businesses?: IBusiness[];
  busCategory?: IBusiness[];
  busFilter?: IBusiness[];
  catalogServiceSharedCollection?: ICatService[] = [];
  isSaving = false;
  isLoading = false;
  modal: any;
  radioData = '';
  resourceUrl = '/business';

  constructor(
    protected businessesService: BusinessesService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    protected locationService: LocationService,
    protected catServiceService: CatServiceService,
    private router: Router,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.loadAll();
    this.loadRelationshipsOptions();
  }

  loadAll(): void {
    this.isLoading = true;

    this.businessesService.query().subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businesses = res.body ?? [];
        console.warn('Comercios', this.businesses);
      },
      () => {
        this.isLoading = false;
      }
    );
    Swal.fire({
      title: 'Cargando comercios',
      html: 'Por favor espere...',
      iconHtml: '<i class="fas fa-car-alt"></i>',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }

  loadCategory(categoryFilter: any): void {
    this.businesses = [];
    this.isLoading = true;
    this.businessesService.queryCategory({ category: categoryFilter }).subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businesses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
    Swal.fire({
      title: 'Cargando comercios',
      html: 'Por favor espere...',
      iconHtml: '<i class="fas fa-car-alt"></i>',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }

  loadProvince(provinceFilter: any): void {
    this.businesses = [];
    this.isLoading = true;
    this.businessesService.queryProvince({ province: provinceFilter }).subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businesses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
    Swal.fire({
      title: 'Cargando comercios',
      html: 'Por favor espere...',
      iconHtml: '<i class="fas fa-car-alt"></i>',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }

  loadService(id: any): void {
    this.businesses = [];
    this.isLoading = true;
    this.businessesService.find(id).subscribe(
      (res: HttpResponse<IBusiness[]>) => {
        this.isLoading = false;
        this.businesses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
    Swal.fire({
      title: 'Cargando comercios',
      html: 'Por favor espere...',
      iconHtml: '<i class="fas fa-car-alt"></i>',
      timer: 3500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }

  trackId(index: number, item: IBusiness): number {
    return item.id!;
  }

  /*  getLocation(): void {
    this.businessesService.getPositionService().then(pos=>
    {
      console.warn(pos.lat);
      console.warn(pos.lng);

    });
  }*/

  profileBusiness(id: string): void {
    this.router.navigateByUrl(`${this.resourceUrl}/${id}/view`);
    //this.router.navigateByUrl(`${this.resourceUrl}/${id}`);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatalog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected loadRelationshipsOptions(): void {
    this.catServiceService
      .query()
      .pipe(map((res: HttpResponse<ICatService[]>) => res.body ?? []))
      .subscribe((catServices: ICatService[]) => (this.catalogServiceSharedCollection = catServices));
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    // Api for inheritance.
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
