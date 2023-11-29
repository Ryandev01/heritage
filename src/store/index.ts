import { configureStore } from '@reduxjs/toolkit';
import loginReducers  from './reducers/loginReducers';
import searchResultsReducer from './reducers/searchResultsReducer';
import refinedSearchReducer from './reducers/refinedSearchReducer';
import eventReducer from './reducers/eventReducer';
import tabEditReducer from './reducers/tabEditReducer';
import downloadReducer from './reducers/downloadReducer';

export const store = configureStore({
  reducer: {
    login: loginReducers,
    searchResults: searchResultsReducer,
    refinedSearch: refinedSearchReducer,
    event: eventReducer,
    tabEdit: tabEditReducer,
    download: downloadReducer
  },
  // Storing date in redux throwd cmd errors, hence to ignore those
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatch = typeof store.dispatch
