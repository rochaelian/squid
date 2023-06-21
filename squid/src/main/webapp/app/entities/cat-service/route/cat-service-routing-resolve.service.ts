import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICatService, CatService } from '../cat-service.model';
import { CatServiceService } from '../service/cat-service.service';

@Injectable({ providedIn: 'root' })
export class CatServiceRoutingResolveService implements Resolve<ICatService> {
  constructor(protected service: CatServiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICatService> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((catService: HttpResponse<CatService>) => {
          if (catService.body) {
            return of(catService.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CatService());
  }
}
