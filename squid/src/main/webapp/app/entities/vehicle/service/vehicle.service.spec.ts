import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { IVehicle, Vehicle } from '../vehicle.model';

import { VehicleService } from './vehicle.service';

describe('Service Tests', () => {
  describe('Vehicle Service', () => {
    let service: VehicleService;
    let httpMock: HttpTestingController;
    let elemDefault: IVehicle;
    let expectedResult: IVehicle | IVehicle[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VehicleService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        plate: 'AAAAAAA',
        year: 'AAAAAAA',
        rTV: currentDate,
        status: Status.Pending,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            rTV: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Vehicle', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            rTV: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            rTV: currentDate,
          },
          returnedFromService
        );

        service.create(new Vehicle()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Vehicle', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            plate: 'BBBBBB',
            year: 'BBBBBB',
            rTV: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            rTV: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Vehicle', () => {
        const patchObject = Object.assign(
          {
            plate: 'BBBBBB',
            year: 'BBBBBB',
          },
          new Vehicle()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            rTV: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Vehicle', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            plate: 'BBBBBB',
            year: 'BBBBBB',
            rTV: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            rTV: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Vehicle', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVehicleToCollectionIfMissing', () => {
        it('should add a Vehicle to an empty array', () => {
          const vehicle: IVehicle = { id: 123 };
          expectedResult = service.addVehicleToCollectionIfMissing([], vehicle);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vehicle);
        });

        it('should not add a Vehicle to an array that contains it', () => {
          const vehicle: IVehicle = { id: 123 };
          const vehicleCollection: IVehicle[] = [
            {
              ...vehicle,
            },
            { id: 456 },
          ];
          expectedResult = service.addVehicleToCollectionIfMissing(vehicleCollection, vehicle);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Vehicle to an array that doesn't contain it", () => {
          const vehicle: IVehicle = { id: 123 };
          const vehicleCollection: IVehicle[] = [{ id: 456 }];
          expectedResult = service.addVehicleToCollectionIfMissing(vehicleCollection, vehicle);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vehicle);
        });

        it('should add only unique Vehicle to an array', () => {
          const vehicleArray: IVehicle[] = [{ id: 123 }, { id: 456 }, { id: 47846 }];
          const vehicleCollection: IVehicle[] = [{ id: 123 }];
          expectedResult = service.addVehicleToCollectionIfMissing(vehicleCollection, ...vehicleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const vehicle: IVehicle = { id: 123 };
          const vehicle2: IVehicle = { id: 456 };
          expectedResult = service.addVehicleToCollectionIfMissing([], vehicle, vehicle2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vehicle);
          expect(expectedResult).toContain(vehicle2);
        });

        it('should accept null and undefined values', () => {
          const vehicle: IVehicle = { id: 123 };
          expectedResult = service.addVehicleToCollectionIfMissing([], null, vehicle, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vehicle);
        });

        it('should return initial array if no Vehicle is added', () => {
          const vehicleCollection: IVehicle[] = [{ id: 123 }];
          expectedResult = service.addVehicleToCollectionIfMissing(vehicleCollection, undefined, null);
          expect(expectedResult).toEqual(vehicleCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
