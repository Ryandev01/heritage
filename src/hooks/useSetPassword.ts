import {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {resetPassword} from '../api/setPassword';
import dayjs from "dayjs";
import { useMutation } from 'react-query';
import { User } from '../types/User';
import useAlert from './useAlert';
import { ResetPaswordStateInput } from '../types/Login';
import useLogin from './useLogin';

const useSetPassword = () => {
  const [state, setState] = useState<ResetPaswordStateInput>({
    confirmPassword: "",
    password: "",
    error: '',
    success: '',
    isNew: false,
    expired: false
  });
  const [data, setData] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const {handleAlert} = useAlert();
  const {clientLogin} = useLogin();

  // decrypt the hashkey
  function decryptUser(str: string) {
    return decodeURIComponent(window.atob(str));
  }

  /**
   * Get the user hashkey with has the usercrendentials which we uses to internal login
   * @returns 
   */
  const getUserDetails = () => {
    const key = location.search.replace('?key=', '');
    try {
      if (key) {
        if (params.new === 'true') {
          setState({
            ...state,
            isNew: true
          });
        }
        const user = JSON.parse(decryptUser(key));
        // check the xpiration if expiry date is greater than the current
        if (dayjs().isBefore(user.exp)) {
          setData(user);
          navigate('/set-password/new');
        } else {
          setState({
            ...state,
            expired: true
          })
        }
        return user;
      }
    } catch (error) {
      console.log('error 1', error);
      handleAlert('Invalid Link', 'error');
      handleAlert('Please contact your administrator', 'error');
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  const {mutate: resetPasswordMutation} = useMutation(['resetPassword'], resetPassword, {
    onSuccess: async (data: User) => {
      await clientLogin({identifier: data.email, password: state.password});
      await navigate('/');
    },
    onError: () => {
      handleAlert('Error Occured', 'error');
      navigate('/');
    }
  })
  

  return {
    query: {data},
    resetPasswordMutation,
    setState,
    state
  };
};

export default useSetPassword;
