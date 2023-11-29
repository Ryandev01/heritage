import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginPayload } from "../types/User";
import {setSession, setRole} from '../utils/storage/storage';
import { setUser, setScreenData } from "../store/reducers/loginReducers";
import { login, loginScreenData } from "../api/auth";
import { fetchMeUser } from "../api/user";

const useLogin = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    fetchLoginData();
  }, []);

  /**
   * get user session details
   */
  const fetchSession = async () => {
    try {
      
      const data = await fetchMeUser();
      await dispatch(setUser(data));
      setRole(data.role.name);
      return data;
    } catch (error) {
      // console.log('error', error)
    }
  }

 /**
  * Login of the user
  */
  const clientLogin = async (payload: loginPayload) => {
    try {
      
      const data = await login(payload);
      await setSession(data.jwt, JSON.stringify(data.user.id));
      await fetchSession();
      await dispatch(setUser(data.user))
      return data;
    } catch (error: any) {
      setError(error.response.data.error.message);
      setLoading(false);
    }
  }
  
   /**
  * Login page UI data with images and background
  * @returns Login state data
  */
    const fetchLoginData = async () => {
      try {
        const res = await loginScreenData();
        dispatch(setScreenData(res));
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) return error.message;
          else setError(JSON.stringify(error));
          setLoading(false); 
      }
    }
 
  return {
    loading,
    error,
    clientLogin,
    fetchSession
  };
};

export default useLogin;
