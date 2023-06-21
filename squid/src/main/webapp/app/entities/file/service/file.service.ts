import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFile, getFileIdentifier, File } from '../file.model';
import { IOrder, Order } from '../../order/order.model';
import { IServiceOrder } from '../../service-order/service-order.model';

export type EntityResponseType = HttpResponse<IFile>;
export type EntityArrayResponseType = HttpResponse<IFile[]>;

@Injectable({ providedIn: 'root' })
export class FileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/files');
  protected resourceByOrderIdUrl = this.applicationConfigService.getEndpointFor('api/filebyorderid');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(file: IFile): Observable<EntityResponseType> {
    return this.http.post<IFile>(this.resourceUrl, file, { observe: 'response' });
  }

  update(file: IFile): Observable<EntityResponseType> {
    return this.http.put<IFile>(`${this.resourceUrl}/${getFileIdentifier(file) as number}`, file, { observe: 'response' });
  }

  partialUpdate(file: IFile): Observable<EntityResponseType> {
    return this.http.patch<IFile>(`${this.resourceUrl}/${getFileIdentifier(file) as number}`, file, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByOrderId(id: number): Observable<EntityResponseType> {
    return this.http.get<IFile>(`${this.resourceByOrderIdUrl}/${id}`, { observe: 'response' });
  }

  findByServiceOrder(id: number): Observable<EntityResponseType> {
    const url = this.resourceUrl + '-by-service-order';
    return this.http.get<IFile>(`${url}/${id}`, { observe: 'response' });
  }
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFileToCollectionIfMissing(fileCollection: IFile[], ...filesToCheck: (IFile | null | undefined)[]): IFile[] {
    const files: IFile[] = filesToCheck.filter(isPresent);
    if (files.length > 0) {
      const fileCollectionIdentifiers = fileCollection.map(fileItem => getFileIdentifier(fileItem)!);
      const filesToAdd = files.filter(fileItem => {
        const fileIdentifier = getFileIdentifier(fileItem);
        if (fileIdentifier == null || fileCollectionIdentifiers.includes(fileIdentifier)) {
          return false;
        }
        fileCollectionIdentifiers.push(fileIdentifier);
        return true;
      });
      return [...filesToAdd, ...fileCollection];
    }
    return fileCollection;
  }
  uploadImageToCloudinary(vals: any): Observable<any> {
    const data = vals;
    return this.http.post('https://api.cloudinary.com/v1_1/squidproyecto3/image/upload/', data);
  }
}
