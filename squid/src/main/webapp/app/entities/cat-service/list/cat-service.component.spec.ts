import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CatServiceService } from '../service/cat-service.service';

import { CatServiceComponent } from './cat-service.component';

describe('Component Tests', () => {
  describe('CatService Management Component', () => {
    let comp: CatServiceComponent;
    let fixture: ComponentFixture<CatServiceComponent>;
    let service: CatServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CatServiceComponent],
      })
        .overrideTemplate(CatServiceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatServiceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CatServiceService);

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
      expect(comp.catServices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
