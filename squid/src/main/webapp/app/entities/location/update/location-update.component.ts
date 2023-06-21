import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ILocation, Location } from '../location.model';
import { LocationService } from '../service/location.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html',
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;
  lat = 9.7489;
  lng = -83.7534;
  zoom = 9;

  editForm = this.fb.group({
    id: [],
    province: [],
    canton: [],
    district: [],
    latitud: this.lat,
    longitude: this.lng,
    exactLocation: [],
  });

  constructor(protected locationService: LocationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);
    });
  }

  previousState(): void {
    window.history.back();
  }

  markerDragEnd($event: any): void {
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
  }

  saveLocation(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    location.latitud = this.lat.toString();
    location.longitude = this.lng.toString();

    if (location.id == null) {
      this.subscribeToSaveResponse(this.locationService.create(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.update(location));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      response => this.onSaveSuccess(response),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(response: HttpResponse<ILocation>): void {
    const idNuevo = response.body?.id;
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(location: ILocation): void {
    this.editForm.patchValue({
      id: location.id,
      province: location.province,
      canton: location.canton,
      district: location.district,
      latitud: location.latitud,
      longitude: location.longitude,
      exactLocation: location.exactLocation,
    });
  }

  protected createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      province: this.editForm.get(['province'])!.value,
      canton: this.editForm.get(['canton'])!.value,
      district: this.editForm.get(['district'])!.value,
      latitud: this.editForm.get(['latitud'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      exactLocation: this.editForm.get(['exactLocation'])!.value,
    };
  }
}
