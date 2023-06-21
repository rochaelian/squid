import { IUser } from 'app/entities/user/user.model';
import { IFile } from 'app/entities/file/file.model';
import { IBusiness } from 'app/entities/business/business.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IUserDetails {
  id?: number;
  identification?: string | null;
  phone?: string | null;
  status?: Status | null;
  internalUser?: IUser | null;
  photograph?: IFile | null;
  business?: IBusiness | null;
}

export class UserDetails implements IUserDetails {
  constructor(
    public id?: number,
    public identification?: string | null,
    public phone?: string | null,
    public status?: Status | null,
    public internalUser?: IUser | null,
    public photograph?: IFile | null,
    public business?: IBusiness | null
  ) {}
}

export function getUserDetailsIdentifier(userDetails: IUserDetails): number | undefined {
  return userDetails.id;
}
