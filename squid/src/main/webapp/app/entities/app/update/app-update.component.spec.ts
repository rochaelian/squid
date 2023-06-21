jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { APPService } from '../service/app.service';
import { IAPP, APP } from '../app.model';

import { APPUpdateComponent } from './app-update.component';

describe('Component Tests', () => {
  describe('APP Management Update Component', () => {
    let comp: APPUpdateComponent;
    let fixture: ComponentFixture<APPUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let aPPService: APPService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [APPUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(APPUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(APPUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      aPPService = TestBed.inject(APPService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const aPP: IAPP = { id: 456 };

        activatedRoute.data = of({ aPP });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(aPP));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<APP>>();
        const aPP = { id: 123 };
        jest.spyOn(aPPService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ aPP });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: aPP }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(aPPService.update).toHaveBeenCalledWith(aPP);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<APP>>();
        const aPP = new APP();
        jest.spyOn(aPPService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ aPP });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: aPP }));
        saveSubject.complete();

        // THEN
        expect(aPPService.create).toHaveBeenCalledWith(aPP);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<APP>>();
        const aPP = { id: 123 };
        jest.spyOn(aPPService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ aPP });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(aPPService.update).toHaveBeenCalledWith(aPP);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
