import { dbIdTypes } from "../types/Place";
import client from "../utils/services/axiosClient";

export const updateKeywords = (payload: { keywords: string[] | [] }, dbId: dbIdTypes): Promise<any> =>
    client.post(`/api/custom/keywords/${dbId}`, payload).then((response) => response.data);

export const getKeywords = (dbId: dbIdTypes): Promise<any> =>
    client.get(`/api/custom/keywords/${dbId}`).then((response) => response.data);
