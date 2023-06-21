import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrder, getOrderIdentifier, IOrderCalendar } from '../order.model';
import { booleanReturn } from '../../service-order/service-order.model';
import { IBusiness } from '../../business/business.model';
import { Profile } from '../../../pages/client/userProfile/userProfile.model';

export type EntityResponseType = HttpResponse<IOrder>;
export type EntityArrayResponseType = HttpResponse<IOrder[]>;

@Injectable({ providedIn: 'root' })
export class OrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orders');
  protected resourceUrlStatusInsurance = this.applicationConfigService.getEndpointFor('api/orderStatusInsurance');
  protected ratingUrl = this.applicationConfigService.getEndpointFor('api/order-ratings-status');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .post<IOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .put<IOrder>(`${this.resourceUrl}/${getOrderIdentifier(order) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  paymentupdate(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    const url = this.resourceUrl + '-payment';
    return this.http
      .put<IOrder>(`${url}/${getOrderIdentifier(order) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  queryOrderSumComission(): Observable<HttpResponse<any>> {
    const url = 'api/orders-sum';
    return this.http.get<any>(url, { observe: 'response' });
  }

  queryOrderPercentageByStatus(status: string): Observable<HttpResponse<any>> {
    const url = 'api/orders-percentage-by-status';
    const req = { status };
    const options = createRequestOption(req);
    return this.http.get<any>(url, { params: options, observe: 'response' });
  }

  queryPopularVehicles(): Observable<HttpResponse<any>> {
    const url = 'api/orders-sum-per-vehicle-brand';
    return this.http.get<any>(url, { observe: 'response' });
  }

  partialUpdate(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .patch<IOrder>(`${this.resourceUrl}/${getOrderIdentifier(order) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryCalendar(id: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    const url = this.resourceUrl + '-calendar';
    return this.http
      .get<IOrder[]>(`${url}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  ordersStatusInsurance(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IOrder[]>(`${this.resourceUrlStatusInsurance}/${id}`, { observe: 'response' });
  }

  getRatingStatus(id: number): Observable<booleanReturn> {
    return this.http.get<booleanReturn>(`${this.ratingUrl}/${id}`);
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrderToCollectionIfMissing(orderCollection: IOrder[], ...ordersToCheck: (IOrder | null | undefined)[]): IOrder[] {
    const orders: IOrder[] = ordersToCheck.filter(isPresent);
    if (orders.length > 0) {
      const orderCollectionIdentifiers = orderCollection.map(orderItem => getOrderIdentifier(orderItem)!);
      const ordersToAdd = orders.filter(orderItem => {
        const orderIdentifier = getOrderIdentifier(orderItem);
        if (orderIdentifier == null || orderCollectionIdentifiers.includes(orderIdentifier)) {
          return false;
        }
        orderCollectionIdentifiers.push(orderIdentifier);
        return true;
      });
      return [...ordersToAdd, ...orderCollection];
    }
    return orderCollection;
  }

  protected convertDateFromClient(order: IOrder): IOrder {
    console.warn('ORDEN QUE LLEGA ', order);
    return Object.assign({}, order, {
      startDate: order.startDate?.isValid() ? order.startDate.toJSON() : undefined,
      endDate: order.endDate?.isValid() ? order.endDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((order: IOrder) => {
        order.startDate = order.startDate ? dayjs(order.startDate) : undefined;
        order.endDate = order.endDate ? dayjs(order.endDate) : undefined;
      });
    }
    return res;
  }
}
