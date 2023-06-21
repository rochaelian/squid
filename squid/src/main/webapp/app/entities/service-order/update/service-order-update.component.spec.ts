jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServiceOrderService } from '../service/service-order.service';
import { IServiceOrder, ServiceOrder } from '../service-order.model';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';

import { ServiceOrderUpdateComponent } from './service-order-update.component';

describe('Component Tests', () => {
  describe('ServiceOrder Management Update Component', () => {
    let comp: ServiceOrderUpdateComponent;
    let fixture: ComponentFixture<ServiceOrderUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let serviceOrderService: ServiceOrderService;
    let catalogService: CatalogService;
    let orderService: OrderService;
    let businessServiceService: BusinessServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ServiceOrderUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ServiceOrderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ServiceOrderUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      serviceOrderService = TestBed.inject(ServiceOrderService);
      catalogService = TestBed.inject(CatalogService);
      orderService = TestBed.inject(OrderService);
      businessServiceService = TestBed.inject(BusinessServiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Catalog query and add missing value', () => {
        const serviceOrder: IServiceOrder = { id: 456 };
        const status: ICatalog = { id: 46799 };
        serviceOrder.status = status;

        const catalogCollection: ICatalog[] = [{ id: 41994 }];
        jest.spyOn(catalogService, 'query').mockReturnValue(of(new HttpResponse({ body: catalogCollection })));
        const additionalCatalogs = [status];
        const expectedCollection: ICatalog[] = [...additionalCatalogs, ...catalogCollection];
        jest.spyOn(catalogService, 'addCatalogToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        expect(catalogService.query).toHaveBeenCalled();
        expect(catalogService.addCatalogToCollectionIfMissing).toHaveBeenCalledWith(catalogCollection, ...additionalCatalogs);
        expect(comp.catalogsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Order query and add missing value', () => {
        const serviceOrder: IServiceOrder = { id: 456 };
        const order: IOrder = { id: 8500 };
        serviceOrder.order = order;

        const orderCollection: IOrder[] = [{ id: 29487 }];
        jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
        const additionalOrders = [order];
        const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
        jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        expect(orderService.query).toHaveBeenCalled();
        expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, ...additionalOrders);
        expect(comp.ordersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call BusinessService query and add missing value', () => {
        const serviceOrder: IServiceOrder = { id: 456 };
        const businessService: IBusinessService = { id: 21926 };
        serviceOrder.businessService = businessService;

        const businessServiceCollection: IBusinessService[] = [{ id: 89763 }];
        jest.spyOn(businessServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: businessServiceCollection })));
        const additionalBusinessServices = [businessService];
        const expectedCollection: IBusinessService[] = [...additionalBusinessServices, ...businessServiceCollection];
        jest.spyOn(businessServiceService, 'addBusinessServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        expect(businessServiceService.query).toHaveBeenCalled();
        expect(businessServiceService.addBusinessServiceToCollectionIfMissing).toHaveBeenCalledWith(
          businessServiceCollection,
          ...additionalBusinessServices
        );
        expect(comp.businessServicesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const serviceOrder: IServiceOrder = { id: 456 };
        const status: ICatalog = { id: 87943 };
        serviceOrder.status = status;
        const order: IOrder = { id: 10259 };
        serviceOrder.order = order;
        const businessService: IBusinessService = { id: 97820 };
        serviceOrder.businessService = businessService;

        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(serviceOrder));
        expect(comp.catalogsSharedCollection).toContain(status);
        expect(comp.ordersSharedCollection).toContain(order);
        expect(comp.businessServicesSharedCollection).toContain(businessService);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ServiceOrder>>();
        const serviceOrder = { id: 123 };
        jest.spyOn(serviceOrderService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: serviceOrder }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(serviceOrderService.update).toHaveBeenCalledWith(serviceOrder);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ServiceOrder>>();
        const serviceOrder = new ServiceOrder();
        jest.spyOn(serviceOrderService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: serviceOrder }));
        saveSubject.complete();

        // THEN
        expect(serviceOrderService.create).toHaveBeenCalledWith(serviceOrder);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ServiceOrder>>();
        const serviceOrder = { id: 123 };
        jest.spyOn(serviceOrderService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ serviceOrder });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(serviceOrderService.update).toHaveBeenCalledWith(serviceOrder);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCatalogById', () => {
        it('Should return tracked Catalog primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCatalogById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackOrderById', () => {
        it('Should return tracked Order primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackBusinessServiceById', () => {
        it('Should return tracked BusinessService primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBusinessServiceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
