import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserDetails, getUserDetailsIdentifier } from '../user-details.model';

export type EntityResponseType = HttpResponse<IUserDetails>;
export type EntityArrayResponseType = HttpResponse<IUserDetails[]>;

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userDetails: IUserDetails): Observable<EntityResponseType> {
    return this.http.post<IUserDetails>(this.resourceUrl, userDetails, { observe: 'response' });
  }

  update(userDetails: IUserDetails): Observable<EntityResponseType> {
    return this.http.put<IUserDetails>(`${this.resourceUrl}/${getUserDetailsIdentifier(userDetails) as number}`, userDetails, {
      observe: 'response',
    });
  }

  partialUpdate(userDetails: IUserDetails): Observable<EntityResponseType> {
    return this.http.patch<IUserDetails>(`${this.resourceUrl}/${getUserDetailsIdentifier(userDetails) as number}`, userDetails, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryByInternalUser(req?: any): Observable<EntityResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserDetails>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserDetailsToCollectionIfMissing(
    userDetailsCollection: IUserDetails[],
    ...userDetailsToCheck: (IUserDetails | null | undefined)[]
  ): IUserDetails[] {
    const userDetails: IUserDetails[] = userDetailsToCheck.filter(isPresent);
    if (userDetails.length > 0) {
      const userDetailsCollectionIdentifiers = userDetailsCollection.map(userDetailsItem => getUserDetailsIdentifier(userDetailsItem)!);
      const userDetailsToAdd = userDetails.filter(userDetailsItem => {
        const userDetailsIdentifier = getUserDetailsIdentifier(userDetailsItem);
        if (userDetailsIdentifier == null || userDetailsCollectionIdentifiers.includes(userDetailsIdentifier)) {
          return false;
        }
        userDetailsCollectionIdentifiers.push(userDetailsIdentifier);
        return true;
      });
      return [...userDetailsToAdd, ...userDetailsCollection];
    }
    return userDetailsCollection;
  }
}
