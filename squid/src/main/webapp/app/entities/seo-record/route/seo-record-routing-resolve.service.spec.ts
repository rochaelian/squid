jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISeoRecord, SeoRecord } from '../seo-record.model';
import { SeoRecordService } from '../service/seo-record.service';

import { SeoRecordRoutingResolveService } from './seo-record-routing-resolve.service';

describe('Service Tests', () => {
  describe('SeoRecord routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SeoRecordRoutingResolveService;
    let service: SeoRecordService;
    let resultSeoRecord: ISeoRecord | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SeoRecordRoutingResolveService);
      service = TestBed.inject(SeoRecordService);
      resultSeoRecord = undefined;
    });

    describe('resolve', () => {
      it('should return ISeoRecord returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSeoRecord = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSeoRecord).toEqual({ id: 123 });
      });

      it('should return new ISeoRecord if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSeoRecord = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSeoRecord).toEqual(new SeoRecord());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SeoRecord })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSeoRecord = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSeoRecord).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
