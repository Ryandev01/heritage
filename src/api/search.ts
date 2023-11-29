
import client from "../utils/services/axiosClient";
import { DashboardResponse } from "../types/dashboard";

export const fetchSearchCount = (): Promise<DashboardResponse> =>
  client.get(`/api/custom/search`).then((response) => response.data);

  export const fetchRefinedSearchOptions = (): Promise<DashboardResponse> =>
  client.get(`/api/custom/options`).then((response) => response.data);


