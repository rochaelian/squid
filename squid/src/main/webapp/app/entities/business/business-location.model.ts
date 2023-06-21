import { ILocation } from 'app/entities/location/location.model';
import { IUser } from 'app/entities/user/user.model';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IBusinessLocation {
  id?: number;
  identification?: string | null;
  name?: string | null;
  taxRegime?: string | null;
  category?: string | null;
  rating?: number | null;
  status?: Status | null;
  capacity?: number | null;
  image?: string | null;
  location?: ILocation | null;
  idLocation?: number;
  province?: string | null;
  canton?: string | null;
  district?: string | null;
  latitud?: string | null;
  longitude?: string | null;
  exactLocation?: string | null;
  owner?: IUser | null;
  catalogs?: ICatalog[] | null;
}

export class BusinessLocation implements IBusinessLocation {
  constructor(
    public id?: number,
    public identification?: string | null,
    public name?: string | null,
    public taxRegime?: string | null,
    public category?: string | null,
    public rating?: number | null,
    public status?: Status | null,
    public capacity?: number | null,
    public image?: string | null,
    public location?: ILocation | null,
    public idLocation?: number,
    public province?: string | null,
    public canton?: string | null,
    public district?: string | null,
    public latitud?: string | null,
    public longitude?: string | null,
    public exactLocation?: string | null,
    public owner?: IUser | null,
    public catalogs?: ICatalog[] | null
  ) {}
}
