import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderRating, OrderRating } from '../order-rating.model';
import { OrderRatingService } from '../service/order-rating.service';

@Injectable({ providedIn: 'root' })
export class OrderRatingRoutingResolveService implements Resolve<IOrderRating> {
  constructor(protected service: OrderRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orderRating: HttpResponse<OrderRating>) => {
          if (orderRating.body) {
            return of(orderRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrderRating());
  }
}
