
import { DefaultDataList } from "../types/DefaultTypes";
import client from "../utils/services/axiosClient";

export const fetchDefaultData = (): Promise<DefaultDataList> =>
  client.get(`/api/defaults`).then((response) => response.data);


