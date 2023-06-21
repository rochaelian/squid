import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrderRating, OrderRating } from '../order-rating.model';

import { OrderRatingService } from './order-rating.service';

describe('Service Tests', () => {
  describe('OrderRating Service', () => {
    let service: OrderRatingService;
    let httpMock: HttpTestingController;
    let elemDefault: IOrderRating;
    let expectedResult: IOrderRating | IOrderRating[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(OrderRatingService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        rating: 0,
        comment: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a OrderRating', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new OrderRating()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a OrderRating', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            rating: 1,
            comment: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a OrderRating', () => {
        const patchObject = Object.assign(
          {
            rating: 1,
          },
          new OrderRating()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of OrderRating', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            rating: 1,
            comment: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a OrderRating', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addOrderRatingToCollectionIfMissing', () => {
        it('should add a OrderRating to an empty array', () => {
          const orderRating: IOrderRating = { id: 123 };
          expectedResult = service.addOrderRatingToCollectionIfMissing([], orderRating);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(orderRating);
        });

        it('should not add a OrderRating to an array that contains it', () => {
          const orderRating: IOrderRating = { id: 123 };
          const orderRatingCollection: IOrderRating[] = [
            {
              ...orderRating,
            },
            { id: 456 },
          ];
          expectedResult = service.addOrderRatingToCollectionIfMissing(orderRatingCollection, orderRating);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a OrderRating to an array that doesn't contain it", () => {
          const orderRating: IOrderRating = { id: 123 };
          const orderRatingCollection: IOrderRating[] = [{ id: 456 }];
          expectedResult = service.addOrderRatingToCollectionIfMissing(orderRatingCollection, orderRating);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(orderRating);
        });

        it('should add only unique OrderRating to an array', () => {
          const orderRatingArray: IOrderRating[] = [{ id: 123 }, { id: 456 }, { id: 38664 }];
          const orderRatingCollection: IOrderRating[] = [{ id: 123 }];
          expectedResult = service.addOrderRatingToCollectionIfMissing(orderRatingCollection, ...orderRatingArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const orderRating: IOrderRating = { id: 123 };
          const orderRating2: IOrderRating = { id: 456 };
          expectedResult = service.addOrderRatingToCollectionIfMissing([], orderRating, orderRating2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(orderRating);
          expect(expectedResult).toContain(orderRating2);
        });

        it('should accept null and undefined values', () => {
          const orderRating: IOrderRating = { id: 123 };
          expectedResult = service.addOrderRatingToCollectionIfMissing([], null, orderRating, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(orderRating);
        });

        it('should return initial array if no OrderRating is added', () => {
          const orderRatingCollection: IOrderRating[] = [{ id: 123 }];
          expectedResult = service.addOrderRatingToCollectionIfMissing(orderRatingCollection, undefined, null);
          expect(expectedResult).toEqual(orderRatingCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
