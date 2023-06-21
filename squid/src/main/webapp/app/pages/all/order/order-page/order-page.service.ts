import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrder, getOrderIdentifier } from './order-page.model';
import { IBusinessService } from '../../../../entities/business-service/business-service.model';

export type EntityResponseType = HttpResponse<IOrder>;
export type EntityArrayResponseType = HttpResponse<IOrder[]>;

@Injectable({ providedIn: 'root' })
export class OrderPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-page');
  protected resourceUserUrl = this.applicationConfigService.getEndpointFor('userId');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    // No usando
    return this.http.get<IBusinessService>(`${this.resourceUserUrl}/${id}`, { observe: 'response' });
  }
}
