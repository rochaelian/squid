jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FileService } from '../service/file.service';
import { IFile, File } from '../file.model';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IServiceOrder } from 'app/entities/service-order/service-order.model';
import { ServiceOrderService } from 'app/entities/service-order/service/service-order.service';

import { FileUpdateComponent } from './file-update.component';

describe('Component Tests', () => {
  describe('File Management Update Component', () => {
    let comp: FileUpdateComponent;
    let fixture: ComponentFixture<FileUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fileService: FileService;
    let orderService: OrderService;
    let serviceOrderService: ServiceOrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FileUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FileUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FileUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fileService = TestBed.inject(FileService);
      orderService = TestBed.inject(OrderService);
      serviceOrderService = TestBed.inject(ServiceOrderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Order query and add missing value', () => {
        const file: IFile = { id: 456 };
        const order: IOrder = { id: 23075 };
        file.order = order;

        const orderCollection: IOrder[] = [{ id: 59219 }];
        jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
        const additionalOrders = [order];
        const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
        jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ file });
        comp.ngOnInit();

        expect(orderService.query).toHaveBeenCalled();
        expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, ...additionalOrders);
        expect(comp.ordersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ServiceOrder query and add missing value', () => {
        const file: IFile = { id: 456 };
        const serviceOrder: IServiceOrder = { id: 52621 };
        file.serviceOrder = serviceOrder;

        const serviceOrderCollection: IServiceOrder[] = [{ id: 69238 }];
        jest.spyOn(serviceOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceOrderCollection })));
        const additionalServiceOrders = [serviceOrder];
        const expectedCollection: IServiceOrder[] = [...additionalServiceOrders, ...serviceOrderCollection];
        jest.spyOn(serviceOrderService, 'addServiceOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ file });
        comp.ngOnInit();

        expect(serviceOrderService.query).toHaveBeenCalled();
        expect(serviceOrderService.addServiceOrderToCollectionIfMissing).toHaveBeenCalledWith(
          serviceOrderCollection,
          ...additionalServiceOrders
        );
        expect(comp.serviceOrdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const file: IFile = { id: 456 };
        const order: IOrder = { id: 95190 };
        file.order = order;
        const serviceOrder: IServiceOrder = { id: 74871 };
        file.serviceOrder = serviceOrder;

        activatedRoute.data = of({ file });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(file));
        expect(comp.ordersSharedCollection).toContain(order);
        expect(comp.serviceOrdersSharedCollection).toContain(serviceOrder);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<File>>();
        const file = { id: 123 };
        jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ file });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: file }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fileService.update).toHaveBeenCalledWith(file);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<File>>();
        const file = new File();
        jest.spyOn(fileService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ file });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: file }));
        saveSubject.complete();

        // THEN
        expect(fileService.create).toHaveBeenCalledWith(file);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<File>>();
        const file = { id: 123 };
        jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ file });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fileService.update).toHaveBeenCalledWith(file);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackOrderById', () => {
        it('Should return tracked Order primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackServiceOrderById', () => {
        it('Should return tracked ServiceOrder primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackServiceOrderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
