export interface ILocation {
  id?: number;
  province?: string | null;
  canton?: string | null;
  district?: string | null;
  latitud?: string | null;
  longitude?: string | null;
  exactLocation?: string | null;
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public province?: string | null,
    public canton?: string | null,
    public district?: string | null,
    public latitud?: string | null,
    public longitude?: string | null,
    public exactLocation?: string | null
  ) {}
}

export function getLocationIdentifier(location: ILocation): number | undefined {
  return location.id;
}
