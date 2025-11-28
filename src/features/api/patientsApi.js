import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Configure the base query with the API URL
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Create the API slice
export const patientsApi = createApi({
  reducerPath: 'patientsApi',
  baseQuery,
  endpoints: (builder) => ({
    // Query to get all patients
    // Accepts optional params: { page, limit, q, sort }
    getPatients: builder.query({
      // args is an object with optional query params
      query: (args = {}) => {
        const { page, limit, q, sort } = args;
        const params = {};
        if (page !== undefined) params.page = page;
        if (limit !== undefined) params.limit = limit;
        if (q) params.q = q;
        if (sort) params.sort = sort;

        return {
          url: '/patients',
          params,
        };
      },
    }),
    // Mutation to create a new patient
    createPatient: builder.mutation({
      query: (patient) => ({
        url: '/patients',
        method: 'POST',
        body: patient,
      }),
    }),
      // Mutation to create a new Bill
    createBill: builder.mutation({
      query: (patient) => ({
        url: '/billmasters',
        method: 'POST',
        body: patient,
      }),
    }),
        // To get patient id wise bill
     getPatientId: builder.query({
      // args is an object with optional query params
      query: (args = {}) => {
        const { patientId } = args;
        const params = {};
        if (patientId !== undefined) params.patientId = patientId;
        return {
          url: 'patients/next-id',
          method: 'GET',
        };
      }
    }),
      createService: builder.mutation({
      query: (patient) => ({
        url: '/service',
        method: 'POST',
        body: patient,
      }),
    }),
  }),
});

// Export the auto-generated hooks
export const { useGetPatientsQuery,useGetPatientIdQuery,useCreateServiceMutation, useCreatePatientMutation,useCreateBillMutation } = patientsApi;
