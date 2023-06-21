import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceOrder, getServiceOrderIdentifier } from '../service-order.model';

export type EntityResponseType = HttpResponse<IServiceOrder>;
export type EntityArrayResponseType = HttpResponse<IServiceOrder[]>;

@Injectable({ providedIn: 'root' })
export class ServiceOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-orders');
  protected resourceUrlByOrder = this.applicationConfigService.getEndpointFor('api/service-ordersOrder');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceOrder: IServiceOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceOrder);
    return this.http
      .post<IServiceOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(serviceOrder: IServiceOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceOrder);
    return this.http
      .put<IServiceOrder>(`${this.resourceUrl}/${getServiceOrderIdentifier(serviceOrder) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(serviceOrder: IServiceOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceOrder);
    return this.http
      .patch<IServiceOrder>(`${this.resourceUrl}/${getServiceOrderIdentifier(serviceOrder) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IServiceOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByOrderId(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IServiceOrder>(`${this.resourceUrlByOrder}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByOrder(id: number): Observable<EntityArrayResponseType> {
    const url = this.resourceUrl + '-by-order';
    return this.http
      .get<IServiceOrder[]>(`${url}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByVehicle(id: number): Observable<EntityArrayResponseType> {
    const url = this.resourceUrl + '-by-vehicle';
    return this.http
      .get<IServiceOrder[]>(`${url}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IServiceOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceOrderToCollectionIfMissing(
    serviceOrderCollection: IServiceOrder[],
    ...serviceOrdersToCheck: (IServiceOrder | null | undefined)[]
  ): IServiceOrder[] {
    const serviceOrders: IServiceOrder[] = serviceOrdersToCheck.filter(isPresent);
    if (serviceOrders.length > 0) {
      const serviceOrderCollectionIdentifiers = serviceOrderCollection.map(
        serviceOrderItem => getServiceOrderIdentifier(serviceOrderItem)!
      );
      const serviceOrdersToAdd = serviceOrders.filter(serviceOrderItem => {
        const serviceOrderIdentifier = getServiceOrderIdentifier(serviceOrderItem);
        if (serviceOrderIdentifier == null || serviceOrderCollectionIdentifiers.includes(serviceOrderIdentifier)) {
          return false;
        }
        serviceOrderCollectionIdentifiers.push(serviceOrderIdentifier);
        return true;
      });
      return [...serviceOrdersToAdd, ...serviceOrderCollection];
    }
    return serviceOrderCollection;
  }

  protected convertDateFromClient(serviceOrder: IServiceOrder): IServiceOrder {
    return Object.assign({}, serviceOrder, {
      startDate: serviceOrder.startDate?.isValid() ? serviceOrder.startDate.format(DATE_FORMAT) : undefined,
      endDate: serviceOrder.endDate?.isValid() ? serviceOrder.endDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((serviceOrder: IServiceOrder) => {
        serviceOrder.startDate = serviceOrder.startDate ? dayjs(serviceOrder.startDate) : undefined;
        serviceOrder.endDate = serviceOrder.endDate ? dayjs(serviceOrder.endDate) : undefined;
      });
    }
    return res;
  }
}
