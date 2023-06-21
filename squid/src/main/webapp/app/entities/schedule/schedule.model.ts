import * as dayjs from 'dayjs';
import { IBusiness } from 'app/entities/business/business.model';

export interface ISchedule {
  id?: number;
  day?: string | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  isSpecial?: boolean | null;
  specialDate?: dayjs.Dayjs | null;
  business?: IBusiness | null;
}

export class Schedule implements ISchedule {
  constructor(
    public id?: number,
    public day?: string | null,
    public startTime?: dayjs.Dayjs | null,
    public endTime?: dayjs.Dayjs | null,
    public isSpecial?: boolean | null,
    public specialDate?: dayjs.Dayjs | null,
    public business?: IBusiness | null
  ) {
    this.isSpecial = this.isSpecial ?? false;
  }
}

export function getScheduleIdentifier(schedule: ISchedule): number | undefined {
  return schedule.id;
}
