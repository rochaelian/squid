jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICatService, CatService } from '../cat-service.model';
import { CatServiceService } from '../service/cat-service.service';

import { CatServiceRoutingResolveService } from './cat-service-routing-resolve.service';

describe('Service Tests', () => {
  describe('CatService routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CatServiceRoutingResolveService;
    let service: CatServiceService;
    let resultCatService: ICatService | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CatServiceRoutingResolveService);
      service = TestBed.inject(CatServiceService);
      resultCatService = undefined;
    });

    describe('resolve', () => {
      it('should return ICatService returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCatService = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCatService).toEqual({ id: 123 });
      });

      it('should return new ICatService if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCatService = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCatService).toEqual(new CatService());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CatService })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCatService = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCatService).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
