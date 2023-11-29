import { DefaultData } from "../../types/DefaultTypes";

const TOKEN = 'token';
const UID = 'UID';
const ROLE = 'role';
const RESETLINK = 'reset';
const PAGINATION_RECORDS = 'PAGINATION_RECORDS';
const SUPPORT_EMAIL = 'SUPPORT_EMAIL';
const SESSION_TIMEOUT = 'SESSION_TIMEOUT';
/**
 * Handles setting and getting data from localStorage
 */
export const getToken = () => localStorage.getItem(TOKEN) || null;
export const getId = () => localStorage.getItem(UID) || null;
export const getRole = () => localStorage.getItem(ROLE) || null;
export const getResetLink = () => localStorage.getItem(RESETLINK) || null;
export const getLimit = () => localStorage.getItem(PAGINATION_RECORDS) || null;
export const getSupportEmail = () => localStorage.getItem(SUPPORT_EMAIL) || null;
export const getSessionTimeout = () => localStorage.getItem(SESSION_TIMEOUT) || null;

// remove the token and user from the session storage
export const removeSession = async () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(UID);
  localStorage.removeItem(ROLE);
};

// set the token and user on the session storage
export const setSession = (token: string, uid: string) => {
  localStorage.setItem(TOKEN, `${token}`);
  localStorage.setItem(UID, uid);
};

// set the role on the session storage
export const setRole = (role: string) => {
  localStorage.setItem(ROLE, role);
};

// set the resetPassword on the session storage
export const setResetLink = (str: string) => {
  localStorage.setItem(RESETLINK, str);
};

export const setDefaultData = (arr: DefaultData[]) => {
  if (arr.length > 0) {
    localStorage.setItem('SESSION_TIMEOUT', arr.find((x: DefaultData) => x.attributes.key === "SESSION_TIMEOUT")?.attributes.value || '');
    localStorage.setItem('SUPPORT_EMAIL', arr.find(x => x.attributes.key === "SUPPORT_EMAIL")?.attributes.value || '');
    localStorage.setItem('PAGINATION_RECORDS', arr.find(x => x.attributes.key === "PAGINATION_RECORDS")?.attributes.value || '');
    localStorage.setItem('MAP_TOKEN', arr.find(x => x.attributes.key === "MAP_TOKEN")?.attributes.value || '');
  }
}
