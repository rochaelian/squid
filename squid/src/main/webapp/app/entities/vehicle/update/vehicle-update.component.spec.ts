jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VehicleService } from '../service/vehicle.service';
import { IVehicle, Vehicle } from '../vehicle.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';

import { VehicleUpdateComponent } from './vehicle-update.component';

describe('Component Tests', () => {
  describe('Vehicle Management Update Component', () => {
    let comp: VehicleUpdateComponent;
    let fixture: ComponentFixture<VehicleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vehicleService: VehicleService;
    let userService: UserService;
    let catalogService: CatalogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehicleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VehicleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehicleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vehicleService = TestBed.inject(VehicleService);
      userService = TestBed.inject(UserService);
      catalogService = TestBed.inject(CatalogService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const vehicle: IVehicle = { id: 456 };
        const user: IUser = { id: 89457 };
        vehicle.user = user;

        const userCollection: IUser[] = [{ id: 88955 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Catalog query and add missing value', () => {
        const vehicle: IVehicle = { id: 456 };
        const insurer: ICatalog = { id: 51367 };
        vehicle.insurer = insurer;
        const motorType: ICatalog = { id: 70312 };
        vehicle.motorType = motorType;
        const vehicleType: ICatalog = { id: 83208 };
        vehicle.vehicleType = vehicleType;
        const brand: ICatalog = { id: 29534 };
        vehicle.brand = brand;

        const catalogCollection: ICatalog[] = [{ id: 23890 }];
        jest.spyOn(catalogService, 'query').mockReturnValue(of(new HttpResponse({ body: catalogCollection })));
        const additionalCatalogs = [insurer, motorType, vehicleType, brand];
        const expectedCollection: ICatalog[] = [...additionalCatalogs, ...catalogCollection];
        jest.spyOn(catalogService, 'addCatalogToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(catalogService.query).toHaveBeenCalled();
        expect(catalogService.addCatalogToCollectionIfMissing).toHaveBeenCalledWith(catalogCollection, ...additionalCatalogs);
        expect(comp.catalogsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vehicle: IVehicle = { id: 456 };
        const user: IUser = { id: 3063 };
        vehicle.user = user;
        const insurer: ICatalog = { id: 58572 };
        vehicle.insurer = insurer;
        const motorType: ICatalog = { id: 87837 };
        vehicle.motorType = motorType;
        const vehicleType: ICatalog = { id: 3668 };
        vehicle.vehicleType = vehicleType;
        const brand: ICatalog = { id: 1192 };
        vehicle.brand = brand;

        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vehicle));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.catalogsSharedCollection).toContain(insurer);
        expect(comp.catalogsSharedCollection).toContain(motorType);
        expect(comp.catalogsSharedCollection).toContain(vehicleType);
        expect(comp.catalogsSharedCollection).toContain(brand);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Vehicle>>();
        const vehicle = { id: 123 };
        jest.spyOn(vehicleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicle }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vehicleService.update).toHaveBeenCalledWith(vehicle);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Vehicle>>();
        const vehicle = new Vehicle();
        jest.spyOn(vehicleService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicle }));
        saveSubject.complete();

        // THEN
        expect(vehicleService.create).toHaveBeenCalledWith(vehicle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Vehicle>>();
        const vehicle = { id: 123 };
        jest.spyOn(vehicleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vehicleService.update).toHaveBeenCalledWith(vehicle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCatalogById', () => {
        it('Should return tracked Catalog primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCatalogById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
