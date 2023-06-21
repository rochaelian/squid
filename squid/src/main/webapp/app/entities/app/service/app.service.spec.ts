import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAPP, APP } from '../app.model';

import { APPService } from './app.service';

describe('Service Tests', () => {
  describe('APP Service', () => {
    let service: APPService;
    let httpMock: HttpTestingController;
    let elemDefault: IAPP;
    let expectedResult: IAPP | IAPP[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(APPService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        type: 0,
        income: 0,
        comission: 0,
        sEOCost: 0,
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

      it('should create a APP', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new APP()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a APP', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 1,
            income: 1,
            comission: 1,
            sEOCost: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a APP', () => {
        const patchObject = Object.assign(
          {
            type: 1,
            sEOCost: 1,
          },
          new APP()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of APP', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 1,
            income: 1,
            comission: 1,
            sEOCost: 1,
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

      it('should delete a APP', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAPPToCollectionIfMissing', () => {
        it('should add a APP to an empty array', () => {
          const aPP: IAPP = { id: 123 };
          expectedResult = service.addAPPToCollectionIfMissing([], aPP);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(aPP);
        });

        it('should not add a APP to an array that contains it', () => {
          const aPP: IAPP = { id: 123 };
          const aPPCollection: IAPP[] = [
            {
              ...aPP,
            },
            { id: 456 },
          ];
          expectedResult = service.addAPPToCollectionIfMissing(aPPCollection, aPP);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a APP to an array that doesn't contain it", () => {
          const aPP: IAPP = { id: 123 };
          const aPPCollection: IAPP[] = [{ id: 456 }];
          expectedResult = service.addAPPToCollectionIfMissing(aPPCollection, aPP);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(aPP);
        });

        it('should add only unique APP to an array', () => {
          const aPPArray: IAPP[] = [{ id: 123 }, { id: 456 }, { id: 4710 }];
          const aPPCollection: IAPP[] = [{ id: 123 }];
          expectedResult = service.addAPPToCollectionIfMissing(aPPCollection, ...aPPArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const aPP: IAPP = { id: 123 };
          const aPP2: IAPP = { id: 456 };
          expectedResult = service.addAPPToCollectionIfMissing([], aPP, aPP2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(aPP);
          expect(expectedResult).toContain(aPP2);
        });

        it('should accept null and undefined values', () => {
          const aPP: IAPP = { id: 123 };
          expectedResult = service.addAPPToCollectionIfMissing([], null, aPP, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(aPP);
        });

        it('should return initial array if no APP is added', () => {
          const aPPCollection: IAPP[] = [{ id: 123 }];
          expectedResult = service.addAPPToCollectionIfMissing(aPPCollection, undefined, null);
          expect(expectedResult).toEqual(aPPCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
