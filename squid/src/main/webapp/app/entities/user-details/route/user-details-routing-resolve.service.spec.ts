jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserDetails, UserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';

import { UserDetailsRoutingResolveService } from './user-details-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserDetails routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserDetailsRoutingResolveService;
    let service: UserDetailsService;
    let resultUserDetails: IUserDetails | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserDetailsRoutingResolveService);
      service = TestBed.inject(UserDetailsService);
      resultUserDetails = undefined;
    });

    describe('resolve', () => {
      it('should return IUserDetails returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserDetails).toEqual({ id: 123 });
      });

      it('should return new IUserDetails if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserDetails = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserDetails).toEqual(new UserDetails());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserDetails })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserDetails).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
