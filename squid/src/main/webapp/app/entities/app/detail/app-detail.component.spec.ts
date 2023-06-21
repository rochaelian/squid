import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { APPDetailComponent } from './app-detail.component';

describe('Component Tests', () => {
  describe('APP Management Detail Component', () => {
    let comp: APPDetailComponent;
    let fixture: ComponentFixture<APPDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [APPDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ aPP: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(APPDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(APPDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load aPP on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.aPP).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
