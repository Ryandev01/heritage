import { setupInterceptorsTo } from "./interceptor";
import axios from "axios";
import { baseUrl } from "./helpers";

export type Headers = {
  "Content-Type": "text/HTML" | "application/json"
  Accept: "text/HTML" | "application/json"
  "Access-Control-Allow-Origin": string,
  Authorization?: string,
  Language: 'English' | 'Arabic';
  // un-comment below for local run
  "ngrok-skip-browser-warning"?: string  
}

const headers: Headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  Language: 'English',
  // un-comment below for local run
  "ngrok-skip-browser-warning": "3243r"
};

const client = axios.create({
  baseURL: baseUrl,
  headers: headers,
});

setupInterceptorsTo(client);

export default client;
