import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { IOrder } from 'app/entities/order/order.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IVehicle {
  id?: number;
  plate?: string | null;
  year?: string | null;
  rTV?: dayjs.Dayjs | null;
  status?: Status | null;
  user?: IUser | null;
  insurer?: ICatalog | null;
  motorType?: ICatalog | null;
  vehicleType?: ICatalog | null;
  brand?: ICatalog | null;
  orders?: IOrder[] | null;
}

export class Vehicle implements IVehicle {
  constructor(
    public id?: number,
    public plate?: string | null,
    public year?: string | null,
    public rTV?: dayjs.Dayjs | null,
    public status?: Status | null,
    public user?: IUser | null,
    public insurer?: ICatalog | null,
    public motorType?: ICatalog | null,
    public vehicleType?: ICatalog | null,
    public brand?: ICatalog | null,
    public orders?: IOrder[] | null
  ) {}
}

export function getVehicleIdentifier(vehicle: IVehicle): number | undefined {
  return vehicle.id;
}

export class User {
  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string,
    public activated?: boolean,
    public langKey?: string,
    public imageUrl?: string,
    public resetDate?: Date
  ) {}
}
