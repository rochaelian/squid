jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CatalogService } from '../service/catalog.service';
import { ICatalog, Catalog } from '../catalog.model';

import { CatalogUpdateComponent } from './catalog-update.component';

describe('Component Tests', () => {
  describe('Catalog Management Update Component', () => {
    let comp: CatalogUpdateComponent;
    let fixture: ComponentFixture<CatalogUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let catalogService: CatalogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CatalogUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CatalogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatalogUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      catalogService = TestBed.inject(CatalogService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const catalog: ICatalog = { id: 456 };

        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(catalog));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Catalog>>();
        const catalog = { id: 123 };
        jest.spyOn(catalogService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: catalog }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(catalogService.update).toHaveBeenCalledWith(catalog);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Catalog>>();
        const catalog = new Catalog();
        jest.spyOn(catalogService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: catalog }));
        saveSubject.complete();

        // THEN
        expect(catalogService.create).toHaveBeenCalledWith(catalog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Catalog>>();
        const catalog = { id: 123 };
        jest.spyOn(catalogService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ catalog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(catalogService.update).toHaveBeenCalledWith(catalog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
