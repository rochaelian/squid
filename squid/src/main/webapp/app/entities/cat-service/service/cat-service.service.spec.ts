import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { ICatService, CatService } from '../cat-service.model';

import { CatServiceService } from './cat-service.service';

describe('Service Tests', () => {
  describe('CatService Service', () => {
    let service: CatServiceService;
    let httpMock: HttpTestingController;
    let elemDefault: ICatService;
    let expectedResult: ICatService | ICatService[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CatServiceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        status: Status.Pending,
        category: 'AAAAAAA',
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

      it('should create a CatService', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new CatService()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CatService', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            status: 'BBBBBB',
            category: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CatService', () => {
        const patchObject = Object.assign(
          {
            status: 'BBBBBB',
            category: 'BBBBBB',
          },
          new CatService()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CatService', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            status: 'BBBBBB',
            category: 'BBBBBB',
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

      it('should delete a CatService', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCatServiceToCollectionIfMissing', () => {
        it('should add a CatService to an empty array', () => {
          const catService: ICatService = { id: 123 };
          expectedResult = service.addCatServiceToCollectionIfMissing([], catService);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(catService);
        });

        it('should not add a CatService to an array that contains it', () => {
          const catService: ICatService = { id: 123 };
          const catServiceCollection: ICatService[] = [
            {
              ...catService,
            },
            { id: 456 },
          ];
          expectedResult = service.addCatServiceToCollectionIfMissing(catServiceCollection, catService);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CatService to an array that doesn't contain it", () => {
          const catService: ICatService = { id: 123 };
          const catServiceCollection: ICatService[] = [{ id: 456 }];
          expectedResult = service.addCatServiceToCollectionIfMissing(catServiceCollection, catService);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(catService);
        });

        it('should add only unique CatService to an array', () => {
          const catServiceArray: ICatService[] = [{ id: 123 }, { id: 456 }, { id: 42303 }];
          const catServiceCollection: ICatService[] = [{ id: 123 }];
          expectedResult = service.addCatServiceToCollectionIfMissing(catServiceCollection, ...catServiceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const catService: ICatService = { id: 123 };
          const catService2: ICatService = { id: 456 };
          expectedResult = service.addCatServiceToCollectionIfMissing([], catService, catService2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(catService);
          expect(expectedResult).toContain(catService2);
        });

        it('should accept null and undefined values', () => {
          const catService: ICatService = { id: 123 };
          expectedResult = service.addCatServiceToCollectionIfMissing([], null, catService, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(catService);
        });

        it('should return initial array if no CatService is added', () => {
          const catServiceCollection: ICatService[] = [{ id: 123 }];
          expectedResult = service.addCatServiceToCollectionIfMissing(catServiceCollection, undefined, null);
          expect(expectedResult).toEqual(catServiceCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
