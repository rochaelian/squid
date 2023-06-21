import { IBusiness } from 'app/entities/business/business.model';
import { ICatService } from 'app/entities/cat-service/cat-service.model';
import { Status } from '../enumerations/status.model';

export interface IBusinessServicePersonalized {
  id?: number;
  price?: number | null;
  duration?: number | null;
  business?: IBusiness | null;
  service?: ICatService | null;
  idCat?: number;
  name?: string | null;
  status?: Status | null;
  category?: string | null;
}

export class Business_Service_Personalized implements IBusinessServicePersonalized {
  constructor(
    public id?: number,
    public price?: number | null,
    public duration?: number | null,
    public business?: IBusiness | null,
    public service?: ICatService | null,
    public idCat?: number,
    public name?: string | null,
    public status?: Status | null,
    public category?: string | null
  ) {}
}

export function getBusinessServiceIdentifier(businessServicePersonalized: IBusinessServicePersonalized): number | undefined {
  return businessServicePersonalized.id;
}
