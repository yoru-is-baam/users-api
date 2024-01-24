import { Role } from '../enums';

export type Payload = {
  sub: number;
  email: string;
  role: Role;
};
