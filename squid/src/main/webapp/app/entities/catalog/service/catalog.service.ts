import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICatalog, getCatalogIdentifier } from '../catalog.model';

export type EntityResponseType = HttpResponse<ICatalog>;
export type EntityArrayResponseType = HttpResponse<ICatalog[]>;

@Injectable({ providedIn: 'root' })
export class CatalogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/catalogs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(catalog: ICatalog): Observable<EntityResponseType> {
    return this.http.post<ICatalog>(this.resourceUrl, catalog, { observe: 'response' });
  }

  update(catalog: ICatalog): Observable<EntityResponseType> {
    return this.http.put<ICatalog>(`${this.resourceUrl}/${getCatalogIdentifier(catalog) as number}`, catalog, { observe: 'response' });
  }

  partialUpdate(catalog: ICatalog): Observable<EntityResponseType> {
    return this.http.patch<ICatalog>(`${this.resourceUrl}/${getCatalogIdentifier(catalog) as number}`, catalog, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICatalog>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByName(name: string): Observable<EntityResponseType> {
    return this.http.get<ICatalog>(`${this.resourceUrl}/?name=${name}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICatalog[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCatalogToCollectionIfMissing(catalogCollection: ICatalog[], ...catalogsToCheck: (ICatalog | null | undefined)[]): ICatalog[] {
    const catalogs: ICatalog[] = catalogsToCheck.filter(isPresent);
    if (catalogs.length > 0) {
      const catalogCollectionIdentifiers = catalogCollection.map(catalogItem => getCatalogIdentifier(catalogItem)!);
      const catalogsToAdd = catalogs.filter(catalogItem => {
        const catalogIdentifier = getCatalogIdentifier(catalogItem);
        if (catalogIdentifier == null || catalogCollectionIdentifiers.includes(catalogIdentifier)) {
          return false;
        }
        catalogCollectionIdentifiers.push(catalogIdentifier);
        return true;
      });
      return [...catalogsToAdd, ...catalogCollection];
    }
    return catalogCollection;
  }
}
