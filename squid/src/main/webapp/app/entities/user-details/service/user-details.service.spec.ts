import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { IUserDetails, UserDetails } from '../user-details.model';

import { UserDetailsService } from './user-details.service';

describe('Service Tests', () => {
  describe('UserDetails Service', () => {
    let service: UserDetailsService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserDetails;
    let expectedResult: IUserDetails | IUserDetails[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserDetailsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        identification: 'AAAAAAA',
        phone: 'AAAAAAA',
        status: Status.Pending,
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

      it('should create a UserDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UserDetails()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            identification: 'BBBBBB',
            phone: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserDetails', () => {
        const patchObject = Object.assign({}, new UserDetails());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            identification: 'BBBBBB',
            phone: 'BBBBBB',
            status: 'BBBBBB',
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

      it('should delete a UserDetails', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserDetailsToCollectionIfMissing', () => {
        it('should add a UserDetails to an empty array', () => {
          const userDetails: IUserDetails = { id: 123 };
          expectedResult = service.addUserDetailsToCollectionIfMissing([], userDetails);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userDetails);
        });

        it('should not add a UserDetails to an array that contains it', () => {
          const userDetails: IUserDetails = { id: 123 };
          const userDetailsCollection: IUserDetails[] = [
            {
              ...userDetails,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, userDetails);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserDetails to an array that doesn't contain it", () => {
          const userDetails: IUserDetails = { id: 123 };
          const userDetailsCollection: IUserDetails[] = [{ id: 456 }];
          expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, userDetails);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userDetails);
        });

        it('should add only unique UserDetails to an array', () => {
          const userDetailsArray: IUserDetails[] = [{ id: 123 }, { id: 456 }, { id: 30604 }];
          const userDetailsCollection: IUserDetails[] = [{ id: 123 }];
          expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, ...userDetailsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userDetails: IUserDetails = { id: 123 };
          const userDetails2: IUserDetails = { id: 456 };
          expectedResult = service.addUserDetailsToCollectionIfMissing([], userDetails, userDetails2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userDetails);
          expect(expectedResult).toContain(userDetails2);
        });

        it('should accept null and undefined values', () => {
          const userDetails: IUserDetails = { id: 123 };
          expectedResult = service.addUserDetailsToCollectionIfMissing([], null, userDetails, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userDetails);
        });

        it('should return initial array if no UserDetails is added', () => {
          const userDetailsCollection: IUserDetails[] = [{ id: 123 }];
          expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, undefined, null);
          expect(expectedResult).toEqual(userDetailsCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
