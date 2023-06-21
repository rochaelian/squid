import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import 'jasmine';

import { CatalogService } from '../service/catalog.service';

import { CatalogComponent } from './catalog.component';

describe('Component Tests', () => {
  describe('Catalog Management Component', () => {
    let comp: CatalogComponent;
    let fixture: ComponentFixture<CatalogComponent>;
    let service: CatalogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CatalogComponent],
      })
        .overrideTemplate(CatalogComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatalogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CatalogService);

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
      expect(comp.catalogs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
