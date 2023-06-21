import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SeoRecordDetailComponent } from './seo-record-detail.component';

describe('Component Tests', () => {
  describe('SeoRecord Management Detail Component', () => {
    let comp: SeoRecordDetailComponent;
    let fixture: ComponentFixture<SeoRecordDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SeoRecordDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ seoRecord: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SeoRecordDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SeoRecordDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load seoRecord on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.seoRecord).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
