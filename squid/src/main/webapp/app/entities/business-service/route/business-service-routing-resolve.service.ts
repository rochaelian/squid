import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessService, Business_Service } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';

@Injectable({ providedIn: 'root' })
export class BusinessServiceRoutingResolveService implements Resolve<IBusinessService> {
  constructor(protected service: BusinessServiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessService> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessService: HttpResponse<Business_Service>) => {
          if (businessService.body) {
            return of(businessService.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Business_Service());
  }
}
