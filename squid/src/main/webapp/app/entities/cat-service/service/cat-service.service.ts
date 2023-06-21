import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICatService, getCatServiceIdentifier } from '../cat-service.model';

export type EntityResponseType = HttpResponse<ICatService>;
export type EntityArrayResponseType = HttpResponse<ICatService[]>;

@Injectable({ providedIn: 'root' })
export class CatServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cat-services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(catService: ICatService): Observable<EntityResponseType> {
    return this.http.post<ICatService>(this.resourceUrl, catService, { observe: 'response' });
  }

  update(catService: ICatService): Observable<EntityResponseType> {
    return this.http.put<ICatService>(`${this.resourceUrl}/${getCatServiceIdentifier(catService) as number}`, catService, {
      observe: 'response',
    });
  }

  partialUpdate(catService: ICatService): Observable<EntityResponseType> {
    return this.http.patch<ICatService>(`${this.resourceUrl}/${getCatServiceIdentifier(catService) as number}`, catService, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICatService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICatService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCatServiceToCollectionIfMissing(
    catServiceCollection: ICatService[],
    ...catServicesToCheck: (ICatService | null | undefined)[]
  ): ICatService[] {
    const catServices: ICatService[] = catServicesToCheck.filter(isPresent);
    if (catServices.length > 0) {
      const catServiceCollectionIdentifiers = catServiceCollection.map(catServiceItem => getCatServiceIdentifier(catServiceItem)!);
      const catServicesToAdd = catServices.filter(catServiceItem => {
        const catServiceIdentifier = getCatServiceIdentifier(catServiceItem);
        if (catServiceIdentifier == null || catServiceCollectionIdentifiers.includes(catServiceIdentifier)) {
          return false;
        }
        catServiceCollectionIdentifiers.push(catServiceIdentifier);
        return true;
      });
      return [...catServicesToAdd, ...catServiceCollection];
    }
    return catServiceCollection;
  }
}
