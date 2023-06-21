import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVehicle, User } from '../vehicle.model';
import { UserManagementService } from '../../../admin/user-management/service/user-management.service';
import { HttpResponse } from '@angular/common/http';
import { IUserDetails } from '../../user-details/user-details.model';
import Swal from 'sweetalert2';
import { UserDetailsService } from '../../user-details/service/user-details.service';
import { IUser, IUserWithImage } from '../../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
})
export class VehicleDetailComponent implements OnInit {
  vehicle: IVehicle | null = null;
  user!: IUserWithImage;
  idUser = 70;
  userDetails?: IUserDetails;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private userDetailsService: UserDetailsService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicle }) => {
      this.vehicle = vehicle;
    });

    this.userManagementService.find(this.vehicle!.user!.login!).subscribe(user => {
      this.user = user;
      console.warn('user', this.user.email);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
