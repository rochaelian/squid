import { IBusiness } from 'app/entities/business/business.model';
import { ICatService } from 'app/entities/cat-service/cat-service.model';

export interface IBusinessService {
  id?: number;
  price?: number | null;
  duration?: number | null;
  business?: IBusiness | null;
  service?: ICatService | null;
}

export class Business_Service implements IBusinessService {
  constructor(
    public id?: number,
    public price?: number | null,
    public duration?: number | null,
    public business?: IBusiness | null,
    public service?: ICatService | null
  ) {}
}

export function getBusinessServiceIdentifier(businessService: IBusinessService): number | undefined {
  return businessService.id;
}
