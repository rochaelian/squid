import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISeoRecord, SeoRecord } from '../seo-record.model';
import { SeoRecordService } from '../service/seo-record.service';

@Injectable({ providedIn: 'root' })
export class SeoRecordRoutingResolveService implements Resolve<ISeoRecord> {
  constructor(protected service: SeoRecordService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISeoRecord> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((seoRecord: HttpResponse<SeoRecord>) => {
          if (seoRecord.body) {
            return of(seoRecord.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SeoRecord());
  }
}
