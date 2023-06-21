import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusiness, getBusinessIdentifier } from './business.model';

export type EntityResponseType = HttpResponse<IBusiness>;
export type EntityArrayResponseType = HttpResponse<IBusiness[]>;

@Injectable({ providedIn: 'root' })
export class BusinessesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/businesses-enabled');
  protected resourseTallerUrl = this.applicationConfigService.getEndpointFor('api/businesses-category');
  protected resourseProvinceUrl = this.applicationConfigService.getEndpointFor('api/businesses-province');
  protected resourseServiceUrl = this.applicationConfigService.getEndpointFor('api/businesses-serv');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusiness[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryCategory(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusiness[]>(this.resourseTallerUrl, { params: options, observe: 'response' });
  }

  queryProvince(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusiness[]>(this.resourseProvinceUrl, { params: options, observe: 'response' });
  }

  /*  queryService(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusiness[]>(`${this.resourseServiceUrl}/${req}`, { params: options, observe: 'response' });
  }*/

  find(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusiness[]>(`${this.resourseServiceUrl}/${id}`, { observe: 'response' });
  }

  getPositionService(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resp => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
