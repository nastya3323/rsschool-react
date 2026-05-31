import { configureStore } from '@reduxjs/toolkit';
import selectedReducer from './selectedSlice';
import { rickAndMortyApi } from '../api/rickAndMortyApi';
export const store = configureStore({
  reducer: {
    selected: selectedReducer,
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rickAndMortyApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
