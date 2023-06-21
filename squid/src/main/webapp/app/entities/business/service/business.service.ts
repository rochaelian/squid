import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusiness, getBusinessIdentifier } from '../business.model';

export type EntityResponseType = HttpResponse<IBusiness>;
export type EntityArrayResponseType = HttpResponse<IBusiness[]>;

@Injectable({ providedIn: 'root' })
export class BusinessService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/businesses');
  protected resourceUrlSearchByOwner = this.applicationConfigService.getEndpointFor('api/businesses-owner');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  uploadImage(vals: any): Observable<any> {
    const data = vals;
    return this.http.post('https://api.cloudinary.com/v1_1/squidproyecto3/image/upload', data);
  }

  create(business: IBusiness): Observable<EntityResponseType> {
    return this.http.post<IBusiness>(this.resourceUrl, business, { observe: 'response' });
  }

  update(business: IBusiness): Observable<EntityResponseType> {
    return this.http.put<IBusiness>(`${this.resourceUrl}/${getBusinessIdentifier(business) as number}`, business, { observe: 'response' });
  }

  partialUpdate(business: IBusiness): Observable<EntityResponseType> {
    return this.http.patch<IBusiness>(`${this.resourceUrl}/${getBusinessIdentifier(business) as number}`, business, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBusiness>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusiness[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryHighestBusiness(): Observable<HttpResponse<any>> {
    const url = 'api/businesses-highest-rated';
    return this.http.get<any>(url, { observe: 'response' });
  }

  queryByOwner(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusiness[]>(`${this.resourceUrlSearchByOwner}/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBusinessToCollectionIfMissing(businessCollection: IBusiness[], ...businessesToCheck: (IBusiness | null | undefined)[]): IBusiness[] {
    const businesses: IBusiness[] = businessesToCheck.filter(isPresent);
    if (businesses.length > 0) {
      const businessCollectionIdentifiers = businessCollection.map(businessItem => getBusinessIdentifier(businessItem)!);
      const businessesToAdd = businesses.filter(businessItem => {
        const businessIdentifier = getBusinessIdentifier(businessItem);
        if (businessIdentifier == null || businessCollectionIdentifiers.includes(businessIdentifier)) {
          return false;
        }
        businessCollectionIdentifiers.push(businessIdentifier);
        return true;
      });
      return [...businessesToAdd, ...businessCollection];
    }
    return businessCollection;
  }
}
