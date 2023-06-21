import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicle, Vehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';

@Injectable({ providedIn: 'root' })
export class VehicleRoutingResolveService implements Resolve<IVehicle> {
  constructor(protected service: VehicleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVehicle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vehicle: HttpResponse<Vehicle>) => {
          if (vehicle.body) {
            return of(vehicle.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Vehicle());
  }
}
