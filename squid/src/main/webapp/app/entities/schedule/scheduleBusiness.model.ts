import * as dayjs from 'dayjs';
import { IBusiness } from 'app/entities/business/business.model';

export interface IScheduleBusiness {
  id?: number;
  day?: string | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  monday?: string | null;
  startTimeMonday?: dayjs.Dayjs | null;
  endTimeMonday?: dayjs.Dayjs | null;
  tuesday?: string | null;
  startTimeTuesday?: dayjs.Dayjs | null;
  endTimeTuesday?: dayjs.Dayjs | null;
  wednesday?: string | null;
  startTimeWednesday?: dayjs.Dayjs | null;
  endTimeWednesday?: dayjs.Dayjs | null;
  thursday?: string | null;
  startTimeThursday?: dayjs.Dayjs | null;
  endTimeThursday?: dayjs.Dayjs | null;
  friday?: string | null;
  startTimeFriday?: dayjs.Dayjs | null;
  endTimeFriday?: dayjs.Dayjs | null;
  saturday?: string | null;
  startTimeSaturday?: dayjs.Dayjs | null;
  endTimeSaturday?: dayjs.Dayjs | null;
  sunday?: string | null;
  startTimeSunday?: dayjs.Dayjs | null;
  endTimeSunday?: dayjs.Dayjs | null;
  isSpecial?: boolean | null;
  specialDate?: dayjs.Dayjs | null;
  business?: IBusiness | null;
}

export class ScheduleBusiness implements IScheduleBusiness {
  constructor(
    public id?: number,
    public day?: string | null,
    public startTime?: dayjs.Dayjs | null,
    public endTime?: dayjs.Dayjs | null,
    public monday?: string | null,
    public startTimeMonday?: dayjs.Dayjs | null,
    public endTimeMonday?: dayjs.Dayjs | null,
    public tuesday?: string | null,
    public startTimeTuesday?: dayjs.Dayjs | null,
    public endTimeTuesday?: dayjs.Dayjs | null,
    public wednesday?: string | null,
    public startTimeWednesday?: dayjs.Dayjs | null,
    public endTimeWednesday?: dayjs.Dayjs | null,
    public thursday?: string | null,
    public startTimeThursday?: dayjs.Dayjs | null,
    public endTimeThursday?: dayjs.Dayjs | null,
    public friday?: string | null,
    public startTimeFriday?: dayjs.Dayjs | null,
    public endTimeFriday?: dayjs.Dayjs | null,
    public saturday?: string | null,
    public startTimeSaturday?: dayjs.Dayjs | null,
    public endTimeSaturday?: dayjs.Dayjs | null,
    public sunday?: string | null,
    public startTimeSunday?: dayjs.Dayjs | null,
    public endTimeSunday?: dayjs.Dayjs | null,
    public isSpecial?: boolean | null,
    public specialDate?: dayjs.Dayjs | null,
    public business?: IBusiness | null
  ) {
    this.isSpecial = this.isSpecial ?? false;
  }
}

export function getScheduleIdentifier(schedule: IScheduleBusiness): number | undefined {
  return schedule.id;
}
