import { dbIdTypes, deleteRecordPayload } from "../types/Place";
import client from "../utils/services/axiosClient";

export const deleteRecord = (dbId: dbIdTypes, id: number): Promise<any> =>
    client.put(`/api/custom/delete/${dbId === 'library' ? 'media' : dbId }/${id}`).then((response) => response.data);
