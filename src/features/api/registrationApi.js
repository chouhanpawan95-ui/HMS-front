import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const regBaseUrl = process.env.REACT_APP_API_URL || 'https://hms-api-x81r.onrender.com/api';

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
      query: () => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return 'registrations';
      },
    }),
    createProject: builder.mutation({
      query: (formData) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: 'registrations',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary for FormData
          formData: true,
        };
      },
    }),
  }),
});

export const { 
  useGetRegistrationsQuery, 
  useCreateProjectMutation,
} = registrationApi;
