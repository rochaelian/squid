import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISchedule, Schedule } from '../schedule.model';
import { IScheduleBusiness, ScheduleBusiness } from '../scheduleBusiness.model';
import { ScheduleService } from '../service/schedule.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../../../core/auth/account.model';
import Swal from 'sweetalert2';
import { Status } from '../../enumerations/status.model';

@Component({
  selector: 'jhi-schedule-update',
  templateUrl: './schedule-update.component.html',
})
export class ScheduleUpdateComponent implements OnInit {
  isSaving = false;
  isSpecialDate = true;
  businessSchedule: IBusiness | undefined;
  titulo = 'Agregar día feriado';
  account?: Account;
  resourceUrl = '/business';
  futureDateError = false;
  specialDate: dayjs.Dayjs | undefined;

  businessesSharedCollection: IBusiness[] = [];
  business: IBusiness[] = [];

  editForm = this.fb.group({
    id: [],
    monday: [],
    startTimeMonday: [],
    endTimeMonday: [],
    tuesday: [],
    startTimeTuesday: [],
    endTimeTuesday: [],
    wednesday: [],
    startTimeWednesday: [],
    endTimeWednesday: [],
    thursday: [],
    startTimeThursday: [],
    endTimeThursday: [],
    friday: [],
    startTimeFriday: [],
    endTimeFriday: [],
    saturday: [],
    startTimeSaturday: [],
    endTimeSaturday: [],
    sunday: [],
    startTimeSunday: [],
    endTimeSunday: [],
    isSpecial: [],
    specialDate: [],
    business: [],
  });

  constructor(
    protected scheduleService: ScheduleService,
    protected businessService: BusinessService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedule }) => {
      if (schedule.id === undefined) {
        const today = dayjs().startOf('day');
        schedule.startTime = today;
        schedule.endTime = today;
      }

      this.accountService.identity().subscribe(account => {
        if (account) {
          this.account = account;
        }
      });
      this.getBusinessByOwner();

      if (schedule.id === undefined) {
        this.updateForm(schedule);
      }
    });

    this.activatedRoute.queryParamMap.subscribe(business => {
      this.businessSchedule = {
        id: Number(business.get('id')),
        taxRegime: business.get('taxRegime'),
        identification: business.get('identification'),
        name: business.get('name'),
        category: business.get('category'),
        rating: Number(business.get('rating')),
        status: Status.Enabled,
        capacity: Number(business.get('capacity')),
        image: business.get('image'),
      };
      console.warn('business: ', this.businessSchedule);
      if (this.businessSchedule.id !== 0) {
        this.createFormSchedule();
      }
    });
  }

  futureDateValidator(date: string): void {
    this.specialDate = dayjs(date);
    this.futureDateError = this.specialDate.isBefore(dayjs());
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    let schedule = this.createFromForm();
    if (this.isSpecialDate === true) {
      schedule = this.saveSpecialDate(schedule);
      if (schedule.id === undefined) {
        this.subscribeToSaveResponse(this.scheduleService.create(schedule));
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El día feriado se registró exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        this.subscribeToSaveResponse(this.scheduleService.update(schedule));
      }
    } else {
      const scheduleBusiness: ISchedule[] = this.createArrayScheduleBusiness();
      for (let i = 0; i < 7; i++) {
        if (scheduleBusiness[i].id === undefined) {
          if (scheduleBusiness[i].startTime?.isValid() || scheduleBusiness[i].endTime?.isValid()) {
            this.subscribeToSaveResponseBusinessSchedule(this.scheduleService.create(scheduleBusiness[i]));
          }
          if (i === 6) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'El horario registró con éxito',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigateByUrl(`${this.resourceUrl}`);
          }
        } else {
          this.subscribeToSaveResponse(this.scheduleService.update(schedule));
        }
      }
    }
  }

  saveSpecialDate(schedule: IScheduleBusiness): ISchedule {
    const today = dayjs().startOf('day');
    return {
      ...new Schedule(),
      id: undefined,
      day: 'Dia feriado',
      startTime: today,
      endTime: today,
      isSpecial: true,
      specialDate: schedule.specialDate,
      business: schedule.business,
    };
  }

  getBusinessByOwner(): void {
    const idOwner = this.account?.id;
    this.businessService.queryByOwner(Number(this.account?.id)).subscribe((res: HttpResponse<IBusiness[]>) => {
      this.business = res.body ?? [];
      this.businessesSharedCollection = this.business.filter(function (bus) {
        return bus.owner?.id === idOwner;
      });
    });
  }

  trackBusinessById(index: number, item: IBusiness): number {
    return item.id!;
  }

  // setEndTime(endTime: string | null): string | undefined {
  //   let correctEndTime: string | undefined = '';
  //   if (endTime !== null) {
  //     const strTimeArr = endTime.split(':');
  //     let hour = Number(strTimeArr[0]);
  //     hour = hour - 6;
  //     switch (hour) {
  //       case -1:
  //         hour = 23;
  //         break;
  //       case -2:
  //         hour = 22;
  //         break;
  //       case -3:
  //         hour = 21;
  //         break;
  //       case -4:
  //         hour = 20;
  //         break;
  //       case -5:
  //         hour = 19;
  //         break;
  //     }
  //     let endTimeStr = hour.toString();
  //     endTimeStr += ':';
  //     endTimeStr += strTimeArr[1];
  //     correctEndTime = '2021-08-21T';
  //     correctEndTime += endTimeStr;
  //   } else {
  //     correctEndTime = undefined;
  //   }
  //
  //   return correctEndTime;
  // }

  // setStartTime(starTime: string | null): string | undefined {
  //   let correctStartTime: string | undefined = '';
  //   if (starTime !== null) {
  //     const strTimeArr = starTime.split(':');
  //     let hour = Number(strTimeArr[0]);
  //     hour = hour - 6;
  //     switch (hour) {
  //       case -1:
  //         hour = 23;
  //         break;
  //       case -2:
  //         hour = 22;
  //         break;
  //       case -3:
  //         hour = 21;
  //         break;
  //       case -4:
  //         hour = 20;
  //         break;
  //       case -5:
  //         hour = 19;
  //         break;
  //     }
  //     let startTimeStr = hour.toString();
  //     startTimeStr += ':';
  //     startTimeStr += strTimeArr[1];
  //     correctStartTime = '2021-08-21T';
  //     correctStartTime += startTimeStr;
  //   } else {
  //     correctStartTime = undefined;
  //   }
  //   return correctStartTime;
  // }

  protected subscribeToSaveResponseBusinessSchedule(result: Observable<HttpResponse<ISchedule>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccessBusinessSchedule(),
      () => this.onSaveError()
    );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISchedule>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveSuccessBusinessSchedule(): void {
    // None.
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(schedule: ISchedule): void {
    this.editForm.patchValue({
      id: schedule.id,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isSpecial: schedule.isSpecial,
      specialDay: schedule.specialDate,
      business: schedule.business,
    });
  }

  protected createArrayScheduleBusiness(): ISchedule[] {
    const scheduleBusiness: IScheduleBusiness = this.createFromForm();
    const schedule: ISchedule[] = [];

    schedule[0] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.monday,
      startTime: scheduleBusiness.startTimeMonday,
      endTime: scheduleBusiness.endTimeMonday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    schedule[1] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.tuesday,
      startTime: scheduleBusiness.startTimeTuesday,
      endTime: scheduleBusiness.endTimeTuesday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    schedule[2] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.wednesday,
      startTime: scheduleBusiness.startTimeWednesday,
      endTime: scheduleBusiness.endTimeWednesday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    schedule[3] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.thursday,
      startTime: scheduleBusiness.startTimeThursday,
      endTime: scheduleBusiness.endTimeThursday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    schedule[4] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.friday,
      startTime: scheduleBusiness.startTimeFriday,
      endTime: scheduleBusiness.endTimeFriday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    schedule[5] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.saturday,
      startTime: scheduleBusiness.startTimeSaturday,
      endTime: scheduleBusiness.endTimeSaturday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    schedule[6] = {
      ...new Schedule(),
      id: scheduleBusiness.id,
      day: scheduleBusiness.sunday,
      startTime: scheduleBusiness.startTimeSunday,
      endTime: scheduleBusiness.endTimeSunday,
      isSpecial: false,
      specialDate: null,
      business: this.businessSchedule,
    };

    return schedule;
  }

  protected createFormSchedule(): void {
    this.isSpecialDate = false;
    this.titulo = 'Agregar horario';
    this.editForm.patchValue({
      id: undefined,
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo',
      business: this.businessSchedule?.name,
    });
  }

  protected createFromForm(): IScheduleBusiness {
    if (this.isSpecialDate === false) {
      const starTimeMonday = this.editForm.get(['startTimeMonday'])!.value;
      let correctStartTimeMonday = '2021-08-21T';
      correctStartTimeMonday += starTimeMonday;
      const endTimeMonday = this.editForm.get(['endTimeMonday'])!.value;
      let correctEndTimeMonday = '2021-08-21T';
      correctEndTimeMonday += endTimeMonday;

      const starTimeTuesday = this.editForm.get(['startTimeTuesday'])!.value;
      let correctStartTimeTuesday = '2021-08-21T';
      correctStartTimeTuesday += starTimeTuesday;
      const endTimeTuesday = this.editForm.get(['endTimeTuesday'])!.value;
      let correctEndTimeTuesday = '2021-08-21T';
      correctEndTimeTuesday += endTimeTuesday;

      const starTimeWednesday = this.editForm.get(['startTimeWednesday'])!.value;
      let correctStartTimeWednesday = '2021-08-21T';
      correctStartTimeWednesday += starTimeWednesday;
      const endTimeWednesday = this.editForm.get(['endTimeWednesday'])!.value;
      let correctEndTimeWednesday = '2021-08-21T';
      correctEndTimeWednesday += endTimeWednesday;

      const starTimeThursday = this.editForm.get(['startTimeThursday'])!.value;
      let correctStartTimeThursday = '2021-08-21T';
      correctStartTimeThursday += starTimeThursday;
      const endTimeThursday = this.editForm.get(['endTimeThursday'])!.value;
      let correctEndTimeThursday = '2021-08-21T';
      correctEndTimeThursday += endTimeThursday;

      const starTimeFriday = this.editForm.get(['startTimeFriday'])!.value;
      let correctStartTimeFriday = '2021-08-21T';
      correctStartTimeFriday += starTimeFriday;
      const endTimeFriday = this.editForm.get(['endTimeFriday'])!.value;
      let correctEndTimeFriday = '2021-08-21T';
      correctEndTimeFriday += endTimeFriday;

      const starTimeSaturday = this.editForm.get(['startTimeSaturday'])!.value;
      let correctStartTimeSaturday = '2021-08-21T';
      correctStartTimeSaturday += starTimeSaturday;
      const endTimeSaturday = this.editForm.get(['endTimeSaturday'])!.value;
      let correctEndTimeSaturday = '2021-08-21T';
      correctEndTimeSaturday += endTimeSaturday;

      const starTimeSunday = this.editForm.get(['startTimeSunday'])!.value;
      let correctStartTimeSunday = '2021-08-21T';
      correctStartTimeSunday += starTimeSunday;
      const endTimeSunday = this.editForm.get(['endTimeSunday'])!.value;
      let correctEndTimeSunday = '2021-08-21T';
      correctEndTimeSunday += endTimeSunday;

      return {
        ...new ScheduleBusiness(),
        id: this.editForm.get(['id'])!.value,
        monday: this.editForm.get(['monday'])!.value,
        startTimeMonday: dayjs(correctStartTimeMonday, DATE_TIME_FORMAT),
        endTimeMonday: dayjs(correctEndTimeMonday, DATE_TIME_FORMAT),
        tuesday: this.editForm.get(['tuesday'])!.value,
        startTimeTuesday: dayjs(correctStartTimeTuesday, DATE_TIME_FORMAT),
        endTimeTuesday: dayjs(correctEndTimeTuesday, DATE_TIME_FORMAT),
        wednesday: this.editForm.get(['wednesday'])!.value,
        startTimeWednesday: dayjs(correctStartTimeWednesday, DATE_TIME_FORMAT),
        endTimeWednesday: dayjs(correctEndTimeWednesday, DATE_TIME_FORMAT),
        thursday: this.editForm.get(['thursday'])!.value,
        startTimeThursday: dayjs(correctStartTimeThursday, DATE_TIME_FORMAT),
        endTimeThursday: dayjs(correctEndTimeThursday, DATE_TIME_FORMAT),
        friday: this.editForm.get(['friday'])!.value,
        startTimeFriday: dayjs(correctStartTimeFriday, DATE_TIME_FORMAT),
        endTimeFriday: dayjs(correctEndTimeFriday, DATE_TIME_FORMAT),
        saturday: this.editForm.get(['saturday'])!.value,
        startTimeSaturday: dayjs(correctStartTimeSaturday, DATE_TIME_FORMAT),
        endTimeSaturday: dayjs(correctEndTimeSaturday, DATE_TIME_FORMAT),
        sunday: this.editForm.get(['sunday'])!.value,
        startTimeSunday: dayjs(correctStartTimeSunday, DATE_TIME_FORMAT),
        endTimeSunday: dayjs(correctEndTimeSunday, DATE_TIME_FORMAT),
        isSpecial: this.editForm.get(['isSpecial'])!.value,
        specialDate: this.editForm.get(['specialDate'])!.value,
        business: this.editForm.get(['business'])!.value,
      };
    }
    return {
      ...new ScheduleBusiness(),
      id: undefined,
      day: null,
      startTime: null,
      endTime: null,
      isSpecial: null,
      specialDate: this.editForm.get(['specialDate'])!.value,
      business: this.editForm.get(['business'])!.value,
    };
  }
}
