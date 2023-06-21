import { IBusiness } from 'app/entities/business/business.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ICatalog {
  id?: number;
  name?: string | null;
  type?: string | null;
  status?: Status | null;
  businesses?: IBusiness[] | null;
}

export class CatalogConstants {
  static readonly businessType = 'Tipo de comercio';
  static readonly motorType = 'Tipo de motor';
  static readonly vehicleType = 'Tipo de vehículo';
  static readonly insurer = 'Aseguradora';
  static readonly brand = 'Marca';
}

export class Catalog implements ICatalog {
  constructor(
    public id?: number,
    public name?: string | null,
    public type?: string | null,
    public status?: Status | null,
    public businesses?: IBusiness[] | null
  ) {}
}

export function getCatalogIdentifier(catalog: ICatalog): number | undefined {
  return catalog.id;
}
