import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BusinessServiceService } from '../service/business-service.service';

import { BusinessServiceComponent } from './business-service.component';

describe('Component Tests', () => {
  describe('BusinessService Management Component', () => {
    let comp: BusinessServiceComponent;
    let fixture: ComponentFixture<BusinessServiceComponent>;
    let service: BusinessServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessServiceComponent],
      })
        .overrideTemplate(BusinessServiceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessServiceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BusinessServiceService);

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
      expect(comp.businessServices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
