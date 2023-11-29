import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { LoginData } from '../../types/Login';
import { CounterState } from '../types';

const initialState: CounterState = {
  data: null,
  screenData: null
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload
    },
    setScreenData: (state, action: PayloadAction<LoginData | null>) => {
      state.screenData = action.payload
    }
  },
})

export const { setUser, setScreenData } = loginSlice.actions

export default loginSlice.reducer
