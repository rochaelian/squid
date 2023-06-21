import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';
import { Profile } from '../../../pages/client/userProfile/userProfile.model';
import { IOrder } from '../../order/order.model';
import { OrderService } from '../../order/service/order.service';
import { IVehicle } from '../../vehicle/vehicle.model';
import { VehicleService } from '../../vehicle/service/vehicle.service';
import { IBusinessService } from '../../business-service/business-service.model';
import { BusinessServiceService } from '../../business-service/service/business-service.service';
import { IOrderRating } from '../../order-rating/order-rating.model';
import { OrderRatingService } from '../../order-rating/service/order-rating.service';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { IRatingComment, RatingComment } from '../ratingComments.model';
import { SeoRecordService } from '../../seo-record/service/seo-record.service';
import { booleanReturn } from '../../service-order/service-order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-business-detail',
  templateUrl: './business-detail.component.html',
})
export class BusinessDetailComponent implements OnInit {
  businessServices?: IBusinessService[] = [];
  allBusinessServices?: IBusinessService[] = [];
  orderRatings?: IOrderRating[];
  ratComements?: IRatingComment[] = [];
  ratingComement?: IRatingComment;
  business?: IBusiness;
  orders?: IOrder[] = [];
  vehicule?: IVehicle;
  vehicules?: IVehicle[] = [];
  showDropZone = false;
  isLoadingOrders = false;
  isLoadingBusiness = false;
  lat = 9.7489;
  lng = -83.7534;
  myBooleanVal?: booleanReturn;
  pendingStatus?: booleanReturn;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected orderService: OrderService,
    protected vehicleService: VehicleService,
    protected businessService: BusinessService,
    protected orderRatingService: OrderRatingService,
    protected businessServiceService: BusinessServiceService,
    protected seoRecordService: SeoRecordService,
    protected modalService: NgbModal,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ business }) => {
      this.business = business;
      const idBusiness = business.id;
      localStorage.setItem('business', idBusiness);
      this.lat = Number(this.business?.location?.latitud);
      this.lng = Number(this.business?.location?.longitude);
    });

    this.getServices();
    this.getRatings();
    this.getSeoStatus();
    this.getSeoStatusPending();
  }

  getServices(): void {
    this.businessServiceService.query().subscribe((res: HttpResponse<IBusinessService[]>) => {
      this.allBusinessServices = res.body ?? [];
      this.filterServicesByBusiness();
    });
  }

  getSeoStatus(): void {
    if (this.business?.id !== undefined) {
      this.seoRecordService.getActivatedStatus(this.business.id).subscribe(x => {
        this.myBooleanVal = x;
        console.warn('SEO status', this.myBooleanVal);
      });
    }
  }

  getSeoStatusPending(): void {
    if (this.business?.id !== undefined) {
      this.seoRecordService.getPendingStatus(this.business.id).subscribe(x => {
        this.pendingStatus = x;
        console.warn('pending status', this.pendingStatus); // this prints "true"
      });
    }
  }

  filterServicesByBusiness(): void {
    const idBusiness = this.business?.id;
    if (this.allBusinessServices) {
      this.businessServices = this.allBusinessServices.filter(function (busServs) {
        const id = busServs.business?.id;
        return id === idBusiness;
      });
    }
  }

  getRatings(): void {
    const businessId = this.business?.id;
    this.orderRatingService.query().subscribe(
      (res: HttpResponse<IOrderRating[]>) => {
        this.isLoadingOrders = false;
        this.orderRatings = res.body ?? [];
        this.orderRatings = this.orderRatings.filter(function (ratcomments) {
          return ratcomments.order?.business?.id === businessId;
        });

        console.warn('comentarios 1', this.orderRatings);
        this.getOrders();
        console.warn('comentarios 2', this.orderRatings);
      },
      () => {
        this.isLoadingOrders = false;
      }
    );
  }

  getOrders(): void {
    if (this.orderRatings) {
      for (let i = 0; i < this.orderRatings.length; i++) {
        const id = Number(this.orderRatings[i].order?.id);

        this.orderService.find(id).subscribe(order => {
          const newOrder = order.body;
          this.getVehicleData(Number(newOrder?.vehicle?.id), newOrder);
          if (newOrder) {
            this.orders!.push(newOrder);
          }
        });
      }
    }
  }

  getVehicleData(idVehicule: number, order: IOrder | null): void {
    this.vehicleService.find(idVehicule).subscribe(vehicule => {
      this.vehicule = vehicule.body!;
      const user: any = this.vehicule.user;
      let rating = 0;
      if (order?.orderRating?.rating) {
        rating = order.orderRating.rating;
      }
      let comment = '';
      if (order?.orderRating?.comment) {
        comment = order.orderRating.comment;
      }
      this.createRatingComment(user.imageUrl, user.login, rating, comment);
      this.vehicules!.push(this.vehicule);
    });
  }

  createRatingComment(pImage: string, pUserName: string, pRating: number, pComment: string): void {
    const ratingComement = { ...new RatingComment(), image: pImage, userName: pUserName, rating: pRating, comment: pComment };
    this.ratComements!.push(ratingComement);
  }

  updateSeoStatus(valueActivated: boolean): void {
    console.warn('valor enviado', valueActivated);
    if (this.business?.id !== undefined) {
      this.seoRecordService.updateActivatedStatus(this.business.id, { value: valueActivated }).subscribe(x => {
        this.myBooleanVal = x;
        this.pendingStatus = {
          retData: false,
        };
        if (!valueActivated) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Su SEO se activará por el 3% de su próxima venta.',
            showConfirmButton: false,
            timer: 3500,
          });
        }
      });
    }
  }
}
