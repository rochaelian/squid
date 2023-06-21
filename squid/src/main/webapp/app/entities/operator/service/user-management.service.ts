import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUser } from '../operator-management.model';
import { Registration } from '../../../account/register/register.model';
import { Operator } from '../operator.model';
import { Profile } from '../../../pages/client/userProfile/userProfile.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');
  private resourceUrlOperators = this.applicationConfigService.getEndpointFor('api/admin/operators');
  private updresourceUrlOperators = this.applicationConfigService.getEndpointFor('api/admin/update-operator');
  private UrlOperators = this.applicationConfigService.getEndpointFor('api/admin/operators-owner');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  createOperator(operator: Operator, req?: any): Observable<{}> {
    const options = createRequestOption(req);
    const url = this.applicationConfigService.getEndpointFor('api/register-operator');
    console.warn(operator);
    console.warn(options);
    return this.http.post(url, operator, { params: options, observe: 'response' });
    //return this.http.get<IUserDetails>(this.resourceUrl, { params: options, observe: 'response' });
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.resourceUrl, user);
  }

  updateStatus(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.updresourceUrlOperators, user);
  }

  saveWithUserDetails(id: string, profile: Profile, req?: any): Observable<{}> {
    const options = createRequestOption(req);
    const url = this.applicationConfigService.getEndpointFor('api/update-operator');

    console.warn(url);
    console.warn(profile);
    return this.http.put(`${url}/${id}`, profile, { params: options, observe: 'response' });
    //return this.http.get<IUserDetails>(this.resourceUrl, { params: options, observe: 'response' });
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrlOperators, { params: options, observe: 'response' });
  }

  getAllOperators(id: number, req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(`${this.UrlOperators}/${id}`, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }

  uploadImage(vals: any): Observable<any> {
    const data = vals;
    return this.http.post('https://api.cloudinary.com/v1_1/squidproyecto3/image/upload', data);
  }
}
