import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CatServiceDetailComponent } from './cat-service-detail.component';

describe('Component Tests', () => {
  describe('CatService Management Detail Component', () => {
    let comp: CatServiceDetailComponent;
    let fixture: ComponentFixture<CatServiceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CatServiceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ catService: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CatServiceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CatServiceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load catService on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.catService).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
