import {
  User,
  UserPayload,
  EditUserPayload,
  Roles,
} from "../types/User";
import client from "../utils/services/axiosClient";

export const fetchMeUser = (): Promise<User> =>
  client.get<User>("/api/users/me?populate=*").then((response) => response.data);

  export const fetchUser = (): Promise<User[]> =>
  client.get<User[]>("/api/users?populate=*").then((response) => response.data);

export const fetchUserRole = (): Promise<Roles> =>
  client
    .get<Roles>("/api/users-permissions/roles?populate=*")
    .then((response) => response.data);

export const postUser = (payload: UserPayload): Promise<User> =>
  client.post("/api/users", payload).then((response) => response.data);


export const editUser = (
  payload: EditUserPayload,
  
): Promise<User> =>
  client.put(`/api/users/${payload.id}`, payload.user).then((response) => response.data);

