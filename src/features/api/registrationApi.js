import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const regBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const registrationApi = createApi({
  reducerPath: 'registrationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: regBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Attach token from auth slice if available
      const token = getState()?.auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRegistrations: builder.query({
      query: () => 'registrations',
    }),
    createProject: builder.mutation({
      query: (formData) => ({
        url: 'registrations',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, browser will set it with boundary for FormData
        formData: true,
      }),
    }),
    createEngineerVisit: builder.mutation({
      query: (formData) => ({
        url: 'engineer-visits',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
        formData: true,
      }),
    }),
  }),
});

export const { 
  useGetRegistrationsQuery, 
  useCreateProjectMutation,
  useCreateEngineerVisitMutation 
} = registrationApi;
