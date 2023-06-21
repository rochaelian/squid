jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAPP, APP } from '../app.model';
import { APPService } from '../service/app.service';

import { APPRoutingResolveService } from './app-routing-resolve.service';

describe('Service Tests', () => {
  describe('APP routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: APPRoutingResolveService;
    let service: APPService;
    let resultAPP: IAPP | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(APPRoutingResolveService);
      service = TestBed.inject(APPService);
      resultAPP = undefined;
    });

    describe('resolve', () => {
      it('should return IAPP returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAPP = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAPP).toEqual({ id: 123 });
      });

      it('should return new IAPP if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAPP = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAPP).toEqual(new APP());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as APP })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAPP = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAPP).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
