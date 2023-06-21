import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { IBusiness, Business } from '../business.model';

import { BusinessService } from './business.service';

describe('Service Tests', () => {
  describe('Business Service', () => {
    let service: BusinessService;
    let httpMock: HttpTestingController;
    let elemDefault: IBusiness;
    let expectedResult: IBusiness | IBusiness[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BusinessService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        identification: 'AAAAAAA',
        name: 'AAAAAAA',
        taxRegime: 'AAAAAAA',
        category: 'AAAAAAA',
        rating: 0,
        status: Status.Pending,
        capacity: 0,
        image: 'AAAAAAA',
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

      it('should create a Business', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Business()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Business', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            identification: 'BBBBBB',
            name: 'BBBBBB',
            taxRegime: 'BBBBBB',
            category: 'BBBBBB',
            rating: 1,
            status: 'BBBBBB',
            capacity: 1,
            image: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Business', () => {
        const patchObject = Object.assign(
          {
            category: 'BBBBBB',
            status: 'BBBBBB',
            image: 'BBBBBB',
          },
          new Business()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Business', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            identification: 'BBBBBB',
            name: 'BBBBBB',
            taxRegime: 'BBBBBB',
            category: 'BBBBBB',
            rating: 1,
            status: 'BBBBBB',
            capacity: 1,
            image: 'BBBBBB',
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

      it('should delete a Business', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBusinessToCollectionIfMissing', () => {
        it('should add a Business to an empty array', () => {
          const business: IBusiness = { id: 123 };
          expectedResult = service.addBusinessToCollectionIfMissing([], business);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(business);
        });

        it('should not add a Business to an array that contains it', () => {
          const business: IBusiness = { id: 123 };
          const businessCollection: IBusiness[] = [
            {
              ...business,
            },
            { id: 456 },
          ];
          expectedResult = service.addBusinessToCollectionIfMissing(businessCollection, business);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Business to an array that doesn't contain it", () => {
          const business: IBusiness = { id: 123 };
          const businessCollection: IBusiness[] = [{ id: 456 }];
          expectedResult = service.addBusinessToCollectionIfMissing(businessCollection, business);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(business);
        });

        it('should add only unique Business to an array', () => {
          const businessArray: IBusiness[] = [{ id: 123 }, { id: 456 }, { id: 41673 }];
          const businessCollection: IBusiness[] = [{ id: 123 }];
          expectedResult = service.addBusinessToCollectionIfMissing(businessCollection, ...businessArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const business: IBusiness = { id: 123 };
          const business2: IBusiness = { id: 456 };
          expectedResult = service.addBusinessToCollectionIfMissing([], business, business2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(business);
          expect(expectedResult).toContain(business2);
        });

        it('should accept null and undefined values', () => {
          const business: IBusiness = { id: 123 };
          expectedResult = service.addBusinessToCollectionIfMissing([], null, business, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(business);
        });

        it('should return initial array if no Business is added', () => {
          const businessCollection: IBusiness[] = [{ id: 123 }];
          expectedResult = service.addBusinessToCollectionIfMissing(businessCollection, undefined, null);
          expect(expectedResult).toEqual(businessCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
