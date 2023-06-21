jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderRatingService } from '../service/order-rating.service';
import { IOrderRating, OrderRating } from '../order-rating.model';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { OrderRatingUpdateComponent } from './order-rating-update.component';

describe('Component Tests', () => {
  describe('OrderRating Management Update Component', () => {
    let comp: OrderRatingUpdateComponent;
    let fixture: ComponentFixture<OrderRatingUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderRatingService: OrderRatingService;
    let orderService: OrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderRatingUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderRatingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderRatingUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderRatingService = TestBed.inject(OrderRatingService);
      orderService = TestBed.inject(OrderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call order query and add missing value', () => {
        const orderRating: IOrderRating = { id: 456 };
        const order: IOrder = { id: 30797 };
        orderRating.order = order;

        const orderCollection: IOrder[] = [{ id: 54465 }];
        jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
        const expectedCollection: IOrder[] = [order, ...orderCollection];
        jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ orderRating });
        comp.ngOnInit();

        expect(orderService.query).toHaveBeenCalled();
        expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, order);
        expect(comp.ordersCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const orderRating: IOrderRating = { id: 456 };
        const order: IOrder = { id: 9864 };
        orderRating.order = order;

        activatedRoute.data = of({ orderRating });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(orderRating));
        expect(comp.ordersCollection).toContain(order);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<OrderRating>>();
        const orderRating = { id: 123 };
        jest.spyOn(orderRatingService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderRating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderRating }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderRatingService.update).toHaveBeenCalledWith(orderRating);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<OrderRating>>();
        const orderRating = new OrderRating();
        jest.spyOn(orderRatingService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderRating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderRating }));
        saveSubject.complete();

        // THEN
        expect(orderRatingService.create).toHaveBeenCalledWith(orderRating);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<OrderRating>>();
        const orderRating = { id: 123 };
        jest.spyOn(orderRatingService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderRating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderRatingService.update).toHaveBeenCalledWith(orderRating);
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
    });
  });
});
