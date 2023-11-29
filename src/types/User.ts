export type UserDetails = {
  jwt: string;
  user: User;
};

export type User = {
  blocked: boolean | string;
  confirmed: boolean;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  id: number;
  provider: string;
  recoveryToken: string;
  updatedAt: Date;
  role: Role
};

export type Role = {
  createdAt: Date
  description: string
  id: number
  name: string
  type: string
  updatedAt: Date
  label?: string
  value?: string | number
}

export type UserPayload = {
  email: string;
  firstName: string;
  role: string;
  lastName: string;
  recoveryToken?: string;
}

export type loginPayload = {
  identifier: string;
  password: string;
};

export interface UserModalstate {
  visible: boolean;
  editing: User | null
}
export interface ISnackbar {
  open: boolean
  message: string
  severity?: "success" | "error"
}

export type Roles = {
  roles: Role[]
}

export type EditUserPayload = {user: UserPayload | {}, id: number}
export type SetPasswordPayload = {password: string, id: number}


export type DeleteUserReduxPayload = {
  flag: boolean
  mailId?: string
}
export type DeleteRecordReduxPayload = {
  flag: boolean,
  isAssociatedToPlacesOrEvents?: boolean,
}
