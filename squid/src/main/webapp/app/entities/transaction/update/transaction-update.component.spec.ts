jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TransactionService } from '../service/transaction.service';
import { ITransaction, Transaction } from '../transaction.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { TransactionUpdateComponent } from './transaction-update.component';

describe('Component Tests', () => {
  describe('Transaction Management Update Component', () => {
    let comp: TransactionUpdateComponent;
    let fixture: ComponentFixture<TransactionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let transactionService: TransactionService;
    let userService: UserService;
    let businessService: BusinessService;
    let orderService: OrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TransactionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TransactionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransactionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      transactionService = TestBed.inject(TransactionService);
      userService = TestBed.inject(UserService);
      businessService = TestBed.inject(BusinessService);
      orderService = TestBed.inject(OrderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const transaction: ITransaction = { id: 456 };
        const source: IUser = { id: 30699 };
        transaction.source = source;

        const userCollection: IUser[] = [{ id: 9425 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [source];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Business query and add missing value', () => {
        const transaction: ITransaction = { id: 456 };
        const destination: IBusiness = { id: 84797 };
        transaction.destination = destination;

        const businessCollection: IBusiness[] = [{ id: 71865 }];
        jest.spyOn(businessService, 'query').mockReturnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [destination];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        jest.spyOn(businessService, 'addBusinessToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Order query and add missing value', () => {
        const transaction: ITransaction = { id: 456 };
        const order: IOrder = { id: 94588 };
        transaction.order = order;

        const orderCollection: IOrder[] = [{ id: 61369 }];
        jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
        const additionalOrders = [order];
        const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
        jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        expect(orderService.query).toHaveBeenCalled();
        expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, ...additionalOrders);
        expect(comp.ordersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const transaction: ITransaction = { id: 456 };
        const source: IUser = { id: 91238 };
        transaction.source = source;
        const destination: IBusiness = { id: 64859 };
        transaction.destination = destination;
        const order: IOrder = { id: 97637 };
        transaction.order = order;

        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(transaction));
        expect(comp.usersSharedCollection).toContain(source);
        expect(comp.businessesSharedCollection).toContain(destination);
        expect(comp.ordersSharedCollection).toContain(order);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Transaction>>();
        const transaction = { id: 123 };
        jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transaction }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(transactionService.update).toHaveBeenCalledWith(transaction);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Transaction>>();
        const transaction = new Transaction();
        jest.spyOn(transactionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transaction }));
        saveSubject.complete();

        // THEN
        expect(transactionService.create).toHaveBeenCalledWith(transaction);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Transaction>>();
        const transaction = { id: 123 };
        jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ transaction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(transactionService.update).toHaveBeenCalledWith(transaction);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
