import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ScheduleService } from '../service/schedule.service';

import { ScheduleComponent } from './schedule.component';

describe('Component Tests', () => {
  describe('Schedule Management Component', () => {
    let comp: ScheduleComponent;
    let fixture: ComponentFixture<ScheduleComponent>;
    let service: ScheduleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ScheduleComponent],
      })
        .overrideTemplate(ScheduleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ScheduleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ScheduleService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.schedules?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
