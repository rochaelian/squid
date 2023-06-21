import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISchedule } from '../schedule.model';

@Component({
  selector: 'jhi-schedule-detail',
  templateUrl: './schedule-detail.component.html',
})
export class ScheduleDetailComponent implements OnInit {
  schedule: ISchedule | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedule }) => {
      this.schedule = schedule;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
