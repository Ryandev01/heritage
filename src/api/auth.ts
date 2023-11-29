import {
  EditUserPayload,
  loginPayload,
  UserDetails,
} from "../types/User";
import {
  LoginData} from "../types/Login";
import client from "../utils/services/axiosClient";

export const login = (payload: loginPayload): Promise<UserDetails> =>
  client.post(`/api/auth/local/`, JSON.stringify(payload)).then((response) => response.data);

export const logout = (payload: EditUserPayload): Promise<UserDetails> =>
  client.put(`/api/custom/update-me`, JSON.stringify(payload)).then((response) => response.data);

export const loginScreenData = (): Promise<LoginData> =>
  client.get(`/api/login?populate[0]=button&populate[1]=input&populate[2]=backgroundImage.image&populate[4]=bottomText&populate[5]=logo.image`).then((response) => response.data);


