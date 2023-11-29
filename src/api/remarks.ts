import client from "../utils/services/axiosClient";
import { RemarksPayload,Remark, RemarksEditPayload } from "../types/Remarks";

export const getRemarks = (payload: string): Promise<Remark[]> =>
  client.get(`/api/custom/remarks?uniqueId=${payload}`).then((response) => response.data);

export const addRemarks = (payload: RemarksPayload): Promise<Remark[]> =>
  client.post(`/api/custom/remarks`, JSON.stringify(payload)).then((response) => response.data);

export const editRemarks = (payload: RemarksEditPayload): Promise<Remark> =>
  client.put(`/api/custom/remarks/${payload.id}`, JSON.stringify({data: payload.data})).then((response) => response.data);


