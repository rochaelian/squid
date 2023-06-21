import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { ISeoRecord, SeoRecord } from '../seo-record.model';

import { SeoRecordService } from './seo-record.service';

describe('Service Tests', () => {
  describe('SeoRecord Service', () => {
    let service: SeoRecordService;
    let httpMock: HttpTestingController;
    let elemDefault: ISeoRecord;
    let expectedResult: ISeoRecord | ISeoRecord[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SeoRecordService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        cost: 0,
        status: Status.Pending,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SeoRecord', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new SeoRecord()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SeoRecord', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            cost: 1,
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SeoRecord', () => {
        const patchObject = Object.assign(
          {
            cost: 1,
            status: 'BBBBBB',
          },
          new SeoRecord()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SeoRecord', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            cost: 1,
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SeoRecord', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSeoRecordToCollectionIfMissing', () => {
        it('should add a SeoRecord to an empty array', () => {
          const seoRecord: ISeoRecord = { id: 123 };
          expectedResult = service.addSeoRecordToCollectionIfMissing([], seoRecord);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(seoRecord);
        });

        it('should not add a SeoRecord to an array that contains it', () => {
          const seoRecord: ISeoRecord = { id: 123 };
          const seoRecordCollection: ISeoRecord[] = [
            {
              ...seoRecord,
            },
            { id: 456 },
          ];
          expectedResult = service.addSeoRecordToCollectionIfMissing(seoRecordCollection, seoRecord);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SeoRecord to an array that doesn't contain it", () => {
          const seoRecord: ISeoRecord = { id: 123 };
          const seoRecordCollection: ISeoRecord[] = [{ id: 456 }];
          expectedResult = service.addSeoRecordToCollectionIfMissing(seoRecordCollection, seoRecord);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(seoRecord);
        });

        it('should add only unique SeoRecord to an array', () => {
          const seoRecordArray: ISeoRecord[] = [{ id: 123 }, { id: 456 }, { id: 54912 }];
          const seoRecordCollection: ISeoRecord[] = [{ id: 123 }];
          expectedResult = service.addSeoRecordToCollectionIfMissing(seoRecordCollection, ...seoRecordArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const seoRecord: ISeoRecord = { id: 123 };
          const seoRecord2: ISeoRecord = { id: 456 };
          expectedResult = service.addSeoRecordToCollectionIfMissing([], seoRecord, seoRecord2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(seoRecord);
          expect(expectedResult).toContain(seoRecord2);
        });

        it('should accept null and undefined values', () => {
          const seoRecord: ISeoRecord = { id: 123 };
          expectedResult = service.addSeoRecordToCollectionIfMissing([], null, seoRecord, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(seoRecord);
        });

        it('should return initial array if no SeoRecord is added', () => {
          const seoRecordCollection: ISeoRecord[] = [{ id: 123 }];
          expectedResult = service.addSeoRecordToCollectionIfMissing(seoRecordCollection, undefined, null);
          expect(expectedResult).toEqual(seoRecordCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
