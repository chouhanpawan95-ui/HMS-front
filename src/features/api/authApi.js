import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken } from '../auth/authSlice';

const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    // Try to register using multiple possible endpoints if necessary
    signup: builder.mutation({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        const endpoints = ['auth/signup', 'auth/register', 'register', 'auth/register'];
        let lastError = null;
        for (const ep of endpoints) {
          const result = await fetchWithBQ({ url: ep, method: 'POST', body: arg });
          if (result.error) {
            lastError = result.error;
            // try next
            continue;
          }
          return { data: result.data };
        }
        return { error: lastError || { status: 'CUSTOM_ERROR', error: 'Registration failed' } };
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            // update auth slice and persist token
            dispatch(setToken(data.token));
            localStorage.setItem('token', data.token);
          }
        } catch (err) {
          // noop - error will be surfaced to component
        }
      },
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
