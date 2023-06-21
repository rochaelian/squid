import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SeoRecordService } from '../service/seo-record.service';

import { SeoRecordComponent } from './seo-record.component';

describe('Component Tests', () => {
  describe('SeoRecord Management Component', () => {
    let comp: SeoRecordComponent;
    let fixture: ComponentFixture<SeoRecordComponent>;
    let service: SeoRecordService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SeoRecordComponent],
      })
        .overrideTemplate(SeoRecordComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SeoRecordComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SeoRecordService);

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
      expect(comp.seoRecords?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
