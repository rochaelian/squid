import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessService, getBusinessServiceIdentifier } from '../business-service.model';
import { IBusiness } from '../../../pages/client/businesses/business.model';

export type EntityResponseType = HttpResponse<IBusinessService>;
export type EntityArrayResponseType = HttpResponse<IBusinessService[]>;

@Injectable({ providedIn: 'root' })
export class BusinessServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-services');
  protected resourceBusinessServUrl = this.applicationConfigService.getEndpointFor('api/businesses-serv-bus');
  protected resourceBusinessPServUrl = this.applicationConfigService.getEndpointFor('api/businesses-serv-business');
  protected resourceBusinessServUrlId = this.applicationConfigService.getEndpointFor('api/business-servicesServ');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(businessService: IBusinessService): Observable<EntityResponseType> {
    return this.http.post<IBusinessService>(this.resourceUrl, businessService, { observe: 'response' });
  }

  update(businessService: IBusinessService): Observable<EntityResponseType> {
    console.warn('el servicio a actualizar es : ', businessService);
    return this.http.put<IBusinessService>(
      `${this.resourceUrl}/${getBusinessServiceIdentifier(businessService) as number}`,
      businessService,
      { observe: 'response' }
    );
  }

  partialUpdate(businessService: IBusinessService): Observable<EntityResponseType> {
    return this.http.patch<IBusinessService>(
      `${this.resourceUrl}/${getBusinessServiceIdentifier(businessService) as number}`,
      businessService,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBusinessService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByBusiness(id: number): Observable<EntityArrayResponseType> {
    const url = this.resourceUrl + '-by-business';
    return this.http.get<IBusinessService[]>(`${url}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBusinessServiceToCollectionIfMissing(
    businessServiceCollection: IBusinessService[],
    ...businessServicesToCheck: (IBusinessService | null | undefined)[]
  ): IBusinessService[] {
    const businessServices: IBusinessService[] = businessServicesToCheck.filter(isPresent);
    if (businessServices.length > 0) {
      const businessServiceCollectionIdentifiers = businessServiceCollection.map(
        businessServiceItem => getBusinessServiceIdentifier(businessServiceItem)!
      );
      const businessServicesToAdd = businessServices.filter(businessServiceItem => {
        const businessServiceIdentifier = getBusinessServiceIdentifier(businessServiceItem);
        if (businessServiceIdentifier == null || businessServiceCollectionIdentifiers.includes(businessServiceIdentifier)) {
          return false;
        }
        businessServiceCollectionIdentifiers.push(businessServiceIdentifier);
        return true;
      });
      return [...businessServicesToAdd, ...businessServiceCollection];
    }
    return businessServiceCollection;
  }

  findServicesBus(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusiness[]>(`${this.resourceBusinessServUrl}/${id}`, { observe: 'response' });
  }

  findServicesBusPrices(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusiness[]>(`${this.resourceBusinessPServUrl}/${id}`, { observe: 'response' });
  }

  findBusinessesServiceByServiceId(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusiness[]>(`${this.resourceBusinessServUrlId}/${id}`, { observe: 'response' });
  }
}
