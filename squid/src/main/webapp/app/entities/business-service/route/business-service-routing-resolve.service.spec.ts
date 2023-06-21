jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBusinessService, Business_Service } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';

import { BusinessServiceRoutingResolveService } from './business-service-routing-resolve.service';

describe('Service Tests', () => {
  describe('BusinessService routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BusinessServiceRoutingResolveService;
    let service: BusinessServiceService;
    let resultBusinessService: IBusinessService | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BusinessServiceRoutingResolveService);
      service = TestBed.inject(BusinessServiceService);
      resultBusinessService = undefined;
    });

    describe('resolve', () => {
      it('should return IBusinessService returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBusinessService = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBusinessService).toEqual({ id: 123 });
      });

      it('should return new IBusinessService if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBusinessService = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBusinessService).toEqual(new Business_Service());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Business_Service })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBusinessService = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBusinessService).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
