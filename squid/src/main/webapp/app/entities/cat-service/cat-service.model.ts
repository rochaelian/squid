import { IBusiness } from 'app/entities/business/business.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ICatService {
  id?: number;
  name?: string | null;
  status?: Status | null;
  category?: string | null;
  business?: IBusiness | null;
}

export class CatService implements ICatService {
  constructor(
    public id?: number,
    public name?: string | null,
    public status?: Status | null,
    public category?: string | null,
    public business?: IBusiness | null
  ) {}
}

export function getCatServiceIdentifier(catService: ICatService): number | undefined {
  return catService.id;
}
