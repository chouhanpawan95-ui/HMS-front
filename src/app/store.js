import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { registrationApi } from '../features/api/registrationApi';
import { authApi } from '../features/api/authApi';
import { patientsApi } from '../features/api/patientsApi';
import {billingMasterApi} from '../features/api/billingMasterApi';
import { locationApi } from "../features/api/locationApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [billingMasterApi.reducerPath]: billingMasterApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      registrationApi.middleware,
      authApi.middleware,
      patientsApi.middleware,
      billingMasterApi.middleware
      locationApi.middleware
    ),
});

export default store;
