import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAPP, getAPPIdentifier } from '../app.model';

export type EntityResponseType = HttpResponse<IAPP>;
export type EntityArrayResponseType = HttpResponse<IAPP[]>;

@Injectable({ providedIn: 'root' })
export class APPService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/apps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(aPP: IAPP): Observable<EntityResponseType> {
    return this.http.post<IAPP>(this.resourceUrl, aPP, { observe: 'response' });
  }

  update(aPP: IAPP): Observable<EntityResponseType> {
    return this.http.put<IAPP>(`${this.resourceUrl}/${getAPPIdentifier(aPP) as number}`, aPP, { observe: 'response' });
  }

  partialUpdate(aPP: IAPP): Observable<EntityResponseType> {
    return this.http.patch<IAPP>(`${this.resourceUrl}/${getAPPIdentifier(aPP) as number}`, aPP, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAPP>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAPP[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAPPToCollectionIfMissing(aPPCollection: IAPP[], ...aPPSToCheck: (IAPP | null | undefined)[]): IAPP[] {
    const aPPS: IAPP[] = aPPSToCheck.filter(isPresent);
    if (aPPS.length > 0) {
      const aPPCollectionIdentifiers = aPPCollection.map(aPPItem => getAPPIdentifier(aPPItem)!);
      const aPPSToAdd = aPPS.filter(aPPItem => {
        const aPPIdentifier = getAPPIdentifier(aPPItem);
        if (aPPIdentifier == null || aPPCollectionIdentifiers.includes(aPPIdentifier)) {
          return false;
        }
        aPPCollectionIdentifiers.push(aPPIdentifier);
        return true;
      });
      return [...aPPSToAdd, ...aPPCollection];
    }
    return aPPCollection;
  }
}
