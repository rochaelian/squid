import * as dayjs from 'dayjs';
import { IBusiness } from 'app/entities/business/business.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ISeoRecord {
  id?: number;
  date?: dayjs.Dayjs | null;
  cost?: number | null;
  status?: Status | null;
  business?: IBusiness | null;
}

export class SeoRecord implements ISeoRecord {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public cost?: number | null,
    public status?: Status | null,
    public business?: IBusiness | null
  ) {}
}

export function getSeoRecordIdentifier(seoRecord: ISeoRecord): number | undefined {
  return seoRecord.id;
}
