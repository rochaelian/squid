jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOrder, Order } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';

import { AppointmentRoutingResolveService } from './appointment-routing-resolve.service';

describe('Service Tests', () => {
  describe('Order routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AppointmentRoutingResolveService;
    let service: AppointmentService;
    let resultOrder: IOrder | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AppointmentRoutingResolveService);
      service = TestBed.inject(AppointmentService);
      resultOrder = undefined;
    });

    describe('resolve', () => {
      it('should return IOrder returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrder = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOrder).toEqual({ id: 123 });
      });

      it('should return new IOrder if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrder = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultOrder).toEqual(new Order());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Order })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrder = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOrder).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
