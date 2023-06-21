jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICatalog, Catalog } from '../catalog.model';
import { CatalogService } from '../service/catalog.service';

import { CatalogRoutingResolveService } from './catalog-routing-resolve.service';

describe('Service Tests', () => {
  describe('Catalog routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CatalogRoutingResolveService;
    let service: CatalogService;
    let resultCatalog: ICatalog | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CatalogRoutingResolveService);
      service = TestBed.inject(CatalogService);
      resultCatalog = undefined;
    });

    describe('resolve', () => {
      it('should return ICatalog returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCatalog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCatalog).toEqual({ id: 123 });
      });

      it('should return new ICatalog if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCatalog = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCatalog).toEqual(new Catalog());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Catalog })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCatalog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCatalog).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
