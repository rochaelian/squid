import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceOrder, ServiceOrder } from '../service-order.model';
import { ServiceOrderService } from '../service/service-order.service';

@Injectable({ providedIn: 'root' })
export class ServiceOrderRoutingResolveService implements Resolve<IServiceOrder> {
  constructor(protected service: ServiceOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceOrder: HttpResponse<ServiceOrder>) => {
          if (serviceOrder.body) {
            return of(serviceOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ServiceOrder());
  }
}
