import { LoginData } from '../types/Login';
import {User} from '../types/User';
export interface IUserState {
  User: User;
}

export interface CounterState {
  data: User | null
  screenData: LoginData | null
}
