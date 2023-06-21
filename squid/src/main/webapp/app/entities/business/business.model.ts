import { ILocation } from 'app/entities/location/location.model';
import { IUser } from 'app/entities/user/user.model';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IBusiness {
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
  owner?: IUser | null;
  catalogs?: ICatalog[] | null;
}

export class Business implements IBusiness {
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
    public owner?: IUser | null,
    public catalogs?: ICatalog[] | null
  ) {}
}

export function getBusinessIdentifier(business: IBusiness): number | undefined {
  return business.id;
}
