import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';
import { IVehicle } from '../../vehicle/vehicle.model';
import { VehicleService } from '../../vehicle/service/vehicle.service';
import { IUserDetails, UserDetails } from '../../user-details/user-details.model';
import { UserDetailsService } from '../../user-details/service/user-details.service';
import { OrderDeleteDialogComponent } from '../delete/order-delete-dialog.component';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { BusinessService } from '../../business/service/business.service';
import { IBusiness } from '../../business/business.model';

@Component({
  selector: 'jhi-order',
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  orders?: IOrder[] = [];
  allOrders?: IOrder[] = [];
  myVehicules?: any = [];
  ordersByOwner?: IOrder[];
  ordersByUser?: IOrder[];
  businesses?: any = [];
  operatorInfo?: IUserDetails;
  isLoading = false;
  account?: Account;
  isSaving = false;
  rollOperator = false;
  rollAdmin = false;
  rollUser = false;

  constructor(
    protected orderService: OrderService,
    protected modalService: NgbModal,
    protected userDetailsService: UserDetailsService,
    protected businessService: BusinessService,
    protected accountService: AccountService,
    protected vehicleService: VehicleService
  ) {}

  loadAll(): void {
    this.isLoading = true;

    const user = this.account;

    if (this.account?.authorities[0] === 'ROLE_OPERATOR') {
      this.rollOperator = true;
      this.getOperatorInfo(Number(user?.id));
      this.orderService.query().subscribe(
        (res: HttpResponse<IOrder[]>) => {
          this.isLoading = false;
          this.orders = res.body ?? [];
          console.warn('todas las ordenes', this.orders);
          this.orders = this.orders.filter(function (orders) {
            return orders.status?.name !== 'En avalúo';
          });
          const idBus = this.operatorInfo?.business?.id;
          console.warn('idBus2', idBus);
          this.orders = this.orders.filter(function (orders) {
            return orders.business?.id === idBus;
          });
          console.warn('ordenes por comercio', this.orders);
        },
        () => {
          this.isLoading = false;
        }
      );
    } else if (this.account?.authorities[0] === 'ROLE_BUSINESS_ADMIN') {
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
    } else if (this.account?.authorities[0] === 'ROLE_ADMIN') {
      this.rollAdmin = true;
      this.orderService.query().subscribe(
        (res: HttpResponse<IOrder[]>) => {
          this.isLoading = false;
          this.orders = res.body ?? [];
          this.orders = this.orders.filter(function (orders) {
            return orders.status?.name !== 'En avalúo';
          });
        },
        () => {
          this.isLoading = false;
        }
      );
    } else if (this.account?.authorities[0] === 'ROLE_USER') {
      this.rollUser = true;
      this.orderService.query().subscribe(
        (res: HttpResponse<IOrder[]>) => {
          this.isLoading = false;
          this.allOrders = res.body ?? [];
          console.warn('ordenes', this.orders);
          this.allOrders = this.allOrders.filter(function (orders) {
            return orders.status?.name !== 'En avalúo';
          });
          this.getVehiculesByUser(Number(user?.id));
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }

  getOperatorInfo(id: number | undefined): void {
    this.userDetailsService.queryByInternalUser({ internalUserId: id }).subscribe((res: HttpResponse<IUserDetails>) => {
      if (res.body) {
        this.operatorInfo = res.body;
      }
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.loadAll();
  }

  getBusinessByOwner(idOwner: number): void {
    this.businessService.queryByOwner(idOwner).subscribe(business => {
      this.businesses = business.body;
      this.getOrdersByOwner(this.businesses);
    });
  }

  getVehiculesByUser(idUser: number): void {
    this.vehicleService.queryMyVehicles(idUser).subscribe(vehicules => {
      this.myVehicules = vehicules.body;
      this.getOrdersByUser(this.myVehicules);
    });
  }

  getOrdersByUser(vehicules: IVehicle[]): void {
    console.warn('vehiculos por usuario final: ', vehicules);
    this.ordersByUser = [];
    let busOrder: IOrder[] = [];
    if (this.allOrders) {
      const ords = this.allOrders;
      for (const vehicule of vehicules) {
        busOrder = ords.filter(function (orders) {
          return orders.vehicle?.id === vehicule.id;
        });
        if (busOrder.length !== 0) {
          if (this.ordersByUser.length === 0) {
            this.ordersByUser = busOrder;
          } else {
            this.ordersByUser = this.ordersByUser.concat(busOrder);
          }
        }
      }
      console.warn('ordenes por usuario: ', this.ordersByUser);
      this.orders = this.ordersByUser;
    }
  }

  getOrdersByOwner(businesses: IBusiness[]): void {
    console.warn('comercios por dueno: ', businesses);
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
      console.warn('ordenes por dueno: ', this.ordersByOwner);
      this.orders = this.ordersByOwner;
    }
  }

  getUser(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  trackId(index: number, item: IOrder): number {
    return item.id!;
  }
}
