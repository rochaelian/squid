import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IServiceOrder, ServiceOrder } from '../service-order.model';

import { ServiceOrderService } from './service-order.service';

describe('Service Tests', () => {
  describe('ServiceOrder Service', () => {
    let service: ServiceOrderService;
    let httpMock: HttpTestingController;
    let elemDefault: IServiceOrder;
    let expectedResult: IServiceOrder | IServiceOrder[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ServiceOrderService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        startDate: currentDate,
        endDate: currentDate,
        deductible: 0,
        updatedCost: 0,
        comment: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ServiceOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.create(new ServiceOrder()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ServiceOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
            deductible: 1,
            updatedCost: 1,
            comment: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ServiceOrder', () => {
        const patchObject = Object.assign(
          {
            endDate: currentDate.format(DATE_FORMAT),
            deductible: 1,
            comment: 'BBBBBB',
          },
          new ServiceOrder()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ServiceOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
            deductible: 1,
            updatedCost: 1,
            comment: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ServiceOrder', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addServiceOrderToCollectionIfMissing', () => {
        it('should add a ServiceOrder to an empty array', () => {
          const serviceOrder: IServiceOrder = { id: 123 };
          expectedResult = service.addServiceOrderToCollectionIfMissing([], serviceOrder);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(serviceOrder);
        });

        it('should not add a ServiceOrder to an array that contains it', () => {
          const serviceOrder: IServiceOrder = { id: 123 };
          const serviceOrderCollection: IServiceOrder[] = [
            {
              ...serviceOrder,
            },
            { id: 456 },
          ];
          expectedResult = service.addServiceOrderToCollectionIfMissing(serviceOrderCollection, serviceOrder);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ServiceOrder to an array that doesn't contain it", () => {
          const serviceOrder: IServiceOrder = { id: 123 };
          const serviceOrderCollection: IServiceOrder[] = [{ id: 456 }];
          expectedResult = service.addServiceOrderToCollectionIfMissing(serviceOrderCollection, serviceOrder);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(serviceOrder);
        });

        it('should add only unique ServiceOrder to an array', () => {
          const serviceOrderArray: IServiceOrder[] = [{ id: 123 }, { id: 456 }, { id: 62661 }];
          const serviceOrderCollection: IServiceOrder[] = [{ id: 123 }];
          expectedResult = service.addServiceOrderToCollectionIfMissing(serviceOrderCollection, ...serviceOrderArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const serviceOrder: IServiceOrder = { id: 123 };
          const serviceOrder2: IServiceOrder = { id: 456 };
          expectedResult = service.addServiceOrderToCollectionIfMissing([], serviceOrder, serviceOrder2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(serviceOrder);
          expect(expectedResult).toContain(serviceOrder2);
        });

        it('should accept null and undefined values', () => {
          const serviceOrder: IServiceOrder = { id: 123 };
          expectedResult = service.addServiceOrderToCollectionIfMissing([], null, serviceOrder, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(serviceOrder);
        });

        it('should return initial array if no ServiceOrder is added', () => {
          const serviceOrderCollection: IServiceOrder[] = [{ id: 123 }];
          expectedResult = service.addServiceOrderToCollectionIfMissing(serviceOrderCollection, undefined, null);
          expect(expectedResult).toEqual(serviceOrderCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
