import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Profile } from './userProfile.model';
import { createRequestOption } from '../../../core/request/request-util';
import { IUserDetails } from '../../../entities/user-details/user-details.model';
import { EntityResponseType } from '../../../entities/user-details/service/user-details.service';
import { getOrderIdentifier } from '../../../entities/order/order.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(profile: Profile): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/update-user'), profile);
  }

  saveWithUserDetails(id: string, profile: Profile, req?: any): Observable<{}> {
    const options = createRequestOption(req);
    const url = this.applicationConfigService.getEndpointFor('api/update-user');

    console.warn(url);
    console.warn(profile);
    return this.http.put(`${url}/${id}`, profile, { params: options, observe: 'response' });
    //return this.http.get<IUserDetails>(this.resourceUrl, { params: options, observe: 'response' });
  }

  uploadImage(vals: any): Observable<any> {
    const data = vals;
    return this.http.post('https://api.cloudinary.com/v1_1/squidproyecto3/image/upload', data);
  }
}
