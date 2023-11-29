import {removeSession, getId} from '../utils/storage/storage';
import { logout } from "../api/auth";

const useLogout = () => {

  /**
   * get user session details
   */
  const logoutUser = async () => {
    const id = getId();
    try {
      const data = logout({user: {}, id: Number(id)});
      return data;
    } catch (error) {
      // console.log('error', error)
    }
  }

  /**
   * Logout of the user
   */
  const clientLogout = async () => {
    await logoutUser();
    await removeSession();
    window.location.reload();
  }


  return {
    clientLogout
  };
};

export default useLogout;
