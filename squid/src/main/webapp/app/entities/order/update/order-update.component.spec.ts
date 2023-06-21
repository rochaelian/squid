jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderService } from '../service/order.service';
import { IOrder, Order } from '../order.model';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Component Tests', () => {
  describe('Order Management Update Component', () => {
    let comp: OrderUpdateComponent;
    let fixture: ComponentFixture<OrderUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderService: OrderService;
    let vehicleService: VehicleService;
    let userService: UserService;
    let businessService: BusinessService;
    let catalogService: CatalogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderService = TestBed.inject(OrderService);
      vehicleService = TestBed.inject(VehicleService);
      userService = TestBed.inject(UserService);
      businessService = TestBed.inject(BusinessService);
      catalogService = TestBed.inject(CatalogService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vehicle query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const vehicle: IVehicle = { id: 44114 };
        order.vehicle = vehicle;

        const vehicleCollection: IVehicle[] = [{ id: 12010 }];
        jest.spyOn(vehicleService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleCollection })));
        const additionalVehicles = [vehicle];
        const expectedCollection: IVehicle[] = [...additionalVehicles, ...vehicleCollection];
        jest.spyOn(vehicleService, 'addVehicleToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(vehicleService.query).toHaveBeenCalled();
        expect(vehicleService.addVehicleToCollectionIfMissing).toHaveBeenCalledWith(vehicleCollection, ...additionalVehicles);
        expect(comp.vehiclesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const operator: IUser = { id: 95442 };
        order.operator = operator;

        const userCollection: IUser[] = [{ id: 55391 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [operator];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Business query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const business: IBusiness = { id: 87959 };
        order.business = business;

        const businessCollection: IBusiness[] = [{ id: 91022 }];
        jest.spyOn(businessService, 'query').mockReturnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        jest.spyOn(businessService, 'addBusinessToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Catalog query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const status: ICatalog = { id: 46535 };
        order.status = status;

        const catalogCollection: ICatalog[] = [{ id: 29615 }];
        jest.spyOn(catalogService, 'query').mockReturnValue(of(new HttpResponse({ body: catalogCollection })));
        const additionalCatalogs = [status];
        const expectedCollection: ICatalog[] = [...additionalCatalogs, ...catalogCollection];
        jest.spyOn(catalogService, 'addCatalogToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(catalogService.query).toHaveBeenCalled();
        expect(catalogService.addCatalogToCollectionIfMissing).toHaveBeenCalledWith(catalogCollection, ...additionalCatalogs);
        expect(comp.catalogsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const order: IOrder = { id: 456 };
        const vehicle: IVehicle = { id: 34549 };
        order.vehicle = vehicle;
        const operator: IUser = { id: 60405 };
        order.operator = operator;
        const business: IBusiness = { id: 50917 };
        order.business = business;
        const status: ICatalog = { id: 79436 };
        order.status = status;

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(order));
        expect(comp.vehiclesSharedCollection).toContain(vehicle);
        expect(comp.usersSharedCollection).toContain(operator);
        expect(comp.businessesSharedCollection).toContain(business);
        expect(comp.catalogsSharedCollection).toContain(status);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Order>>();
        const order = { id: 123 };
        jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: order }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderService.update).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Order>>();
        const order = new Order();
        jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: order }));
        saveSubject.complete();

        // THEN
        expect(orderService.create).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Order>>();
        const order = { id: 123 };
        jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderService.update).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVehicleById', () => {
        it('Should return tracked Vehicle primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVehicleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackBusinessById', () => {
        it('Should return tracked Business primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBusinessById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCatalogById', () => {
        it('Should return tracked Catalog primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCatalogById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
