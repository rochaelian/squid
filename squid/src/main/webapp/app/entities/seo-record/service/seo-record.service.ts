import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISeoRecord, getSeoRecordIdentifier } from '../seo-record.model';
import { booleanReturn } from '../../service-order/service-order.model';

export type EntityResponseType = HttpResponse<ISeoRecord>;
export type EntityArrayResponseType = HttpResponse<ISeoRecord[]>;

@Injectable({ providedIn: 'root' })
export class SeoRecordService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/seo-records');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(seoRecord: ISeoRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(seoRecord);
    return this.http
      .post<ISeoRecord>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(seoRecord: ISeoRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(seoRecord);
    return this.http
      .put<ISeoRecord>(`${this.resourceUrl}/${getSeoRecordIdentifier(seoRecord) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(seoRecord: ISeoRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(seoRecord);
    return this.http
      .patch<ISeoRecord>(`${this.resourceUrl}/${getSeoRecordIdentifier(seoRecord) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  querySeoRecordSumCost(): Observable<HttpResponse<any>> {
    const url = 'api/seo-records-cost-sum';
    return this.http.get<any>(url, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISeoRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISeoRecord[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivatedStatus(id: number): Observable<booleanReturn> {
    const url = this.resourceUrl + '-by-business';
    return this.http.get<booleanReturn>(`${url}/${id}`);
  }

  getPendingStatus(id: number): Observable<booleanReturn> {
    const url = this.resourceUrl + '-pending';
    return this.http.get<booleanReturn>(`${url}/${id}`);
  }

  updateActivatedStatus(id: number, req?: any): Observable<booleanReturn> {
    const option = createRequestOption(req);
    const url = this.resourceUrl + '-updated';
    return this.http.get<booleanReturn>(`${url}/${id}`, { params: option });
  }

  addSeoRecordToCollectionIfMissing(
    seoRecordCollection: ISeoRecord[],
    ...seoRecordsToCheck: (ISeoRecord | null | undefined)[]
  ): ISeoRecord[] {
    const seoRecords: ISeoRecord[] = seoRecordsToCheck.filter(isPresent);
    if (seoRecords.length > 0) {
      const seoRecordCollectionIdentifiers = seoRecordCollection.map(seoRecordItem => getSeoRecordIdentifier(seoRecordItem)!);
      const seoRecordsToAdd = seoRecords.filter(seoRecordItem => {
        const seoRecordIdentifier = getSeoRecordIdentifier(seoRecordItem);
        if (seoRecordIdentifier == null || seoRecordCollectionIdentifiers.includes(seoRecordIdentifier)) {
          return false;
        }
        seoRecordCollectionIdentifiers.push(seoRecordIdentifier);
        return true;
      });
      return [...seoRecordsToAdd, ...seoRecordCollection];
    }
    return seoRecordCollection;
  }

  protected convertDateFromClient(seoRecord: ISeoRecord): ISeoRecord {
    return Object.assign({}, seoRecord, {
      date: seoRecord.date?.isValid() ? seoRecord.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((seoRecord: ISeoRecord) => {
        seoRecord.date = seoRecord.date ? dayjs(seoRecord.date) : undefined;
      });
    }
    return res;
  }
}
