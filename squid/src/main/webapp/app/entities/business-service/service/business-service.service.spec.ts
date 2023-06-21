import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessService, Business_Service } from '../business-service.model';

import { BusinessServiceService } from './business-service.service';

describe('Service Tests', () => {
  describe('BusinessService Service', () => {
    let service: BusinessServiceService;
    let httpMock: HttpTestingController;
    let elemDefault: IBusinessService;
    let expectedResult: IBusinessService | IBusinessService[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BusinessServiceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        price: 0,
        duration: 0,
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

      it('should create a BusinessService', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Business_Service()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BusinessService', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            price: 1,
            duration: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BusinessService', () => {
        const patchObject = Object.assign(
          {
            duration: 1,
          },
          new Business_Service()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BusinessService', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            price: 1,
            duration: 1,
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

      it('should delete a BusinessService', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBusinessServiceToCollectionIfMissing', () => {
        it('should add a BusinessService to an empty array', () => {
          const businessService: IBusinessService = { id: 123 };
          expectedResult = service.addBusinessServiceToCollectionIfMissing([], businessService);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(businessService);
        });

        it('should not add a BusinessService to an array that contains it', () => {
          const businessService: IBusinessService = { id: 123 };
          const businessServiceCollection: IBusinessService[] = [
            {
              ...businessService,
            },
            { id: 456 },
          ];
          expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, businessService);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BusinessService to an array that doesn't contain it", () => {
          const businessService: IBusinessService = { id: 123 };
          const businessServiceCollection: IBusinessService[] = [{ id: 456 }];
          expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, businessService);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(businessService);
        });

        it('should add only unique BusinessService to an array', () => {
          const businessServiceArray: IBusinessService[] = [{ id: 123 }, { id: 456 }, { id: 54274 }];
          const businessServiceCollection: IBusinessService[] = [{ id: 123 }];
          expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, ...businessServiceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const businessService: IBusinessService = { id: 123 };
          const businessService2: IBusinessService = { id: 456 };
          expectedResult = service.addBusinessServiceToCollectionIfMissing([], businessService, businessService2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(businessService);
          expect(expectedResult).toContain(businessService2);
        });

        it('should accept null and undefined values', () => {
          const businessService: IBusinessService = { id: 123 };
          expectedResult = service.addBusinessServiceToCollectionIfMissing([], null, businessService, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(businessService);
        });

        it('should return initial array if no BusinessService is added', () => {
          const businessServiceCollection: IBusinessService[] = [{ id: 123 }];
          expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, undefined, null);
          expect(expectedResult).toEqual(businessServiceCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
