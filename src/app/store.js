import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { registrationApi } from '../features/api/registrationApi';
import { authApi } from '../features/api/authApi';
import { patientsApi } from '../features/api/patientsApi';
import {billingApi} from '../features/api/Hooks/billingApi';
import {rateListApi} from '../features/api/Hooks/ratelistApi';
import {serviceApi} from '../features/api/Hooks/serviceApi';
import {partyApi} from '../features/api/Hooks/partyApi';
import { locationApi } from "../features/api/locationApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [billingApi.reducerPath]: billingApi.reducer,
    [rateListApi.reducerPath]: rateListApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [partyApi.reducerPath]: partyApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      registrationApi.middleware,
      authApi.middleware,
      patientsApi.middleware,
      billingApi.middleware,
      serviceApi.middleware,
      rateListApi.middleware,
      partyApi.middleware,
      locationApi.middleware
    ),
});

export default store;
