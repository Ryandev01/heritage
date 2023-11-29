import {
  User,
  SetPasswordPayload,
} from "../types/User";
import client from "../utils/services/axiosClient";

export const resetPassword = (payload: SetPasswordPayload): Promise<User> =>
  client.put(`/api/custom/change-password/${payload.id}?password=${payload.password}`, {}).then((response) => response.data);

