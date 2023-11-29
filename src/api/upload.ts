
import {PlaceApi} from '../types/Place';
import client from "../utils/services/axiosClient";

export const uploadMedia = (payload: any): Promise<PlaceApi> =>
  client.get(`/api/upload`).then((response) => response.data);

