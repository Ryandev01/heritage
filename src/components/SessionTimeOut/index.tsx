
import { useState, useEffect } from 'react';
import { addEventListeners,  removeEventListeners } from './sessionTimeOutUtil'
import useLogout from "../../hooks/useLogout";
import { getSessionTimeout } from '../../utils/storage/storage';

const SessionTimeOut = () => {
    const { clientLogout } = useLogout();
    const [timeOutStatus, setTimeOutStatus] = useState(false);
    const sessionTime = Number(getSessionTimeout() || 60000);
  useEffect(() => {
    let timeout = setTimeout(() => {
        clientLogout();
    },sessionTime)

    const listener = () => {
      setTimeOutStatus(!timeOutStatus);
      clearTimeout(timeout);
    } 
    // Initialization
    addEventListeners(listener);
    // Cleanup
    return () => {
      removeEventListeners(listener);
      clearTimeout(timeout);
    }
  },[timeOutStatus])
  return (
    <>
    </>
  );
};

export default SessionTimeOut;

