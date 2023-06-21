import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BusinessService } from '../service/business.service';

import { BusinessComponent } from './business.component';

describe('Component Tests', () => {
  describe('Business Management Component', () => {
    let comp: BusinessComponent;
    let fixture: ComponentFixture<BusinessComponent>;
    let service: BusinessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessComponent],
      })
        .overrideTemplate(BusinessComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BusinessService);

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
      expect(comp.businesses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
