import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAPP, APP } from '../app.model';
import { APPService } from '../service/app.service';

@Injectable({ providedIn: 'root' })
export class APPRoutingResolveService implements Resolve<IAPP> {
  constructor(protected service: APPService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAPP> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((aPP: HttpResponse<APP>) => {
          if (aPP.body) {
            return of(aPP.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new APP());
  }
}
