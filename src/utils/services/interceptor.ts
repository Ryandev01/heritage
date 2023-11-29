import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import { getToken } from "../storage/storage";

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (getToken() && config.headers) {
    config.headers['Authorization'] = `Bearer ${getToken()}`
  }
  return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  // console.error(`[response error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

export function graphQlHeaders() {
  return ({
    context: {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
})
}
