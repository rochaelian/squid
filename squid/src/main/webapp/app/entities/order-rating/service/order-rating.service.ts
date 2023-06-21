import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderRating, getOrderRatingIdentifier } from '../order-rating.model';

export type EntityResponseType = HttpResponse<IOrderRating>;
export type EntityArrayResponseType = HttpResponse<IOrderRating[]>;

@Injectable({ providedIn: 'root' })
export class OrderRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(orderRating: IOrderRating): Observable<EntityResponseType> {
    return this.http.post<IOrderRating>(this.resourceUrl, orderRating, { observe: 'response' });
  }

  update(orderRating: IOrderRating): Observable<EntityResponseType> {
    return this.http.put<IOrderRating>(`${this.resourceUrl}/${getOrderRatingIdentifier(orderRating) as number}`, orderRating, {
      observe: 'response',
    });
  }

  partialUpdate(orderRating: IOrderRating): Observable<EntityResponseType> {
    return this.http.patch<IOrderRating>(`${this.resourceUrl}/${getOrderRatingIdentifier(orderRating) as number}`, orderRating, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrderRating>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrderRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrderRatingToCollectionIfMissing(
    orderRatingCollection: IOrderRating[],
    ...orderRatingsToCheck: (IOrderRating | null | undefined)[]
  ): IOrderRating[] {
    const orderRatings: IOrderRating[] = orderRatingsToCheck.filter(isPresent);
    if (orderRatings.length > 0) {
      const orderRatingCollectionIdentifiers = orderRatingCollection.map(orderRatingItem => getOrderRatingIdentifier(orderRatingItem)!);
      const orderRatingsToAdd = orderRatings.filter(orderRatingItem => {
        const orderRatingIdentifier = getOrderRatingIdentifier(orderRatingItem);
        if (orderRatingIdentifier == null || orderRatingCollectionIdentifiers.includes(orderRatingIdentifier)) {
          return false;
        }
        orderRatingCollectionIdentifiers.push(orderRatingIdentifier);
        return true;
      });
      return [...orderRatingsToAdd, ...orderRatingCollection];
    }
    return orderRatingCollection;
  }
}
