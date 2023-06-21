import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicle } from '../vehicle.model';
import { VehicleService } from '../service/vehicle.service';
import { VehicleDeleteDialogComponent } from '../delete/vehicle-delete-dialog.component';
import { AccountService } from '../../../core/auth/account.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ICatalog, CatalogConstants } from '../../catalog/catalog.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'jhi-vehicle',
  templateUrl: './vehicle.component.html',
})
export class VehicleComponent implements OnInit {
  vehicles?: IVehicle[];
  isLoading = false;
  isSaving = false;

  constructor(protected vehicleService: VehicleService, private accountService: AccountService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      this.vehicleService.query().subscribe(
        (res: HttpResponse<IVehicle[]>) => {
          this.isLoading = false;
          this.vehicles = res.body ?? [];
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      this.vehicleService.queryMyVehicles().subscribe(
        (res: HttpResponse<IVehicle[]>) => {
          this.isLoading = false;
          this.vehicles = res.body ?? [];
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }

  delete(vehicle: IVehicle): void {
    const modalRef = this.modalService.open(VehicleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vehicle = vehicle;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVehicle): number {
    return item.id!;
  }
  updateStatusButton(vehicle: any): void {
    this.isSaving = true;
    const actualVehicle = vehicle;

    if (actualVehicle.status === 'Enabled') {
      actualVehicle.status = 'Disabled';
    } else {
      actualVehicle.status = 'Enabled';
    }
    this.subscribeToSaveResponse(this.vehicleService.update(actualVehicle), actualVehicle.status === 'Enabled');
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatalog>>, habilitado: boolean): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => {
        if (habilitado) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Vehículo habilitado',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Vehículo deshabilitado',
            showConfirmButton: false,
            timer: 1500,
          });
        }

        this.onSaveSuccess();
      },
      () => this.onSaveError()
    );
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    // Api for inheritance.
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
