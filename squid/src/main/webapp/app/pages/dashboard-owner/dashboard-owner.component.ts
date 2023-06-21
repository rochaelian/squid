import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../entities/order/order.model';
import { OrderService } from '../../entities/order/service/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService } from '../../entities/business/service/business.service';
import { AccountService } from '../../core/auth/account.service';
import { VehicleService } from '../../entities/vehicle/service/vehicle.service';
import { HttpResponse } from '@angular/common/http';
import { Account } from '../../core/auth/account.model';
import { IBusiness } from '../../entities/business/business.model';
import { IOrderByBusiness, OrderByBusiness } from './ordersByBusiness.model';

@Component({
  selector: 'jhi-dashboard-owner',
  templateUrl: './dashboard-owner.component.html',
  styleUrls: ['./dashboard-owner.component.scss'],
})
export class DashboardOwnerComponent implements OnInit {
  orders?: IOrder[] = [];
  ordersByBusiness?: IOrderByBusiness[];
  businessMoreProductive?: string = '';
  cantOrders?: number = 0;
  ratingTotal?: number = 0;
  cantOrdersByBusiness?: number;
  revenueByBusiness?: number;
  revenue?: number | null | undefined = 0;
  allOrders?: IOrder[] = [];
  ordersByOwner?: IOrder[] = [];
  businesses?: any = [];
  isLoading = false;
  account?: Account;

  constructor(
    protected orderService: OrderService,
    protected modalService: NgbModal,
    protected businessService: BusinessService,
    protected accountService: AccountService,
    protected vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    const user = this.account;

    this.orderService.query().subscribe(
      (res: HttpResponse<IOrder[]>) => {
        this.isLoading = false;
        this.allOrders = res.body ?? [];
        this.allOrders = this.allOrders.filter(function (orders) {
          return orders.status?.name !== 'En avalúo';
        });
        this.getBusinessByOwner(Number(user?.id));
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  getUser(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  getBusinessByOwner(idOwner: number): void {
    this.businessService.queryByOwner(idOwner).subscribe(business => {
      this.businesses = business.body;
      this.getOrdersByOwner(this.businesses);
    });
  }

  getOrdersByOwner(businesses: IBusiness[]): void {
    this.ordersByOwner = [];
    let busOrder: IOrder[] = [];
    if (this.allOrders) {
      const ords = this.allOrders;
      for (const business of businesses) {
        busOrder = ords.filter(function (orders) {
          return orders.business?.id === business.id;
        });
        if (busOrder.length !== 0) {
          if (this.ordersByOwner.length === 0) {
            this.ordersByOwner = busOrder;
          } else {
            this.ordersByOwner = this.ordersByOwner.concat(busOrder);
          }
        }
      }
      this.orders = this.ordersByOwner;
      this.completeData();
    }
  }

  completeData(): void {
    if (this.orders) {
      this.cantOrders = this.orders.length;
    }
    this.getIncome();
    this.getOrdersByBusiness();
    console.warn('infoBusiness', this.ordersByBusiness);
    this.getBusinessMoreProductive();
    this.getRatingTotal();
  }

  getIncome(): void {
    this.revenue = 0;
    if (this.orders) {
      for (let i = 0; i < this.orders.length; i++) {
        const totalCost = this.orders[i].totalCost;
        if (totalCost) {
          this.revenue += totalCost;
        }
      }
    }
  }

  getOrdersByBusiness(): void {
    this.ordersByBusiness = [];
    for (let i = 0; i < this.businesses.length; i++) {
      this.getInfoOrderByBusiness(this.businesses[i]);
      const infoBusiness = {
        ...new OrderByBusiness(),
        image: this.businesses[i].image,
        name: this.businesses[i].name,
        cantOrders: this.cantOrdersByBusiness,
        revenue: this.revenueByBusiness,
        rating: Number(this.businesses[i].rating.toFixed(1)),
      };
      this.ordersByBusiness.push(infoBusiness);
    }
  }

  getInfoOrderByBusiness(business: IBusiness): void {
    if (this.orders) {
      const infoBus = this.orders.filter(function (orders) {
        return orders.business?.id === business.id;
      });
      this.cantOrdersByBusiness = infoBus.length;
      this.getRevenueByBusiness(infoBus);
    }
  }

  getRevenueByBusiness(ordersByBus: IOrder[]): void {
    this.revenueByBusiness = 0;
    for (let i = 0; i < ordersByBus.length; i++) {
      const totalCost = ordersByBus[i].totalCost;
      if (totalCost) {
        this.revenueByBusiness += totalCost;
      }
    }
  }

  getBusinessMoreProductive(): void {
    let revenue = 0;
    if (this.ordersByBusiness) {
      for (let i = 0; i < this.ordersByBusiness.length; i++) {
        if (revenue < this.ordersByBusiness[i].revenue!) {
          revenue = this.ordersByBusiness[i].revenue!;
          this.businessMoreProductive = this.ordersByBusiness[i].name!;
        }
      }
    }
  }

  getRatingTotal(): void {
    let suma = 0;
    if (this.ordersByBusiness) {
      for (let i = 0; i < this.ordersByBusiness.length; i++) {
        suma += this.ordersByBusiness[i].rating!;
      }
      suma = suma / this.ordersByBusiness.length;
      suma = Number(suma.toFixed(1));
      this.ratingTotal = suma;
    }
  }
}
