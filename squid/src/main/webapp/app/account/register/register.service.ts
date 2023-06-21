import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';
import { createRequestOption } from '../../core/request/request-util';
import { IUserDetails } from '../../entities/user-details/user-details.model';
import { EntityResponseType } from '../../entities/user-details/service/user-details.service';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }

  saveWithUserDetails(registration: Registration, req?: any): Observable<{}> {
    const options = createRequestOption(req);
    const url = this.applicationConfigService.getEndpointFor('api/register');
    console.warn(registration);
    return this.http.post(url, registration, { params: options, observe: 'response' });
    //return this.http.get<IUserDetails>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
