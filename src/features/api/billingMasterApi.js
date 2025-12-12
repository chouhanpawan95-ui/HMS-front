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
export const billingMasterApi = createApi({
  reducerPath: 'billingMasterApi',
  baseQuery,
  endpoints: (builder) => ({  
      createService: builder.mutation({
      query: (patient) => ({
        url: '/service',
        method: 'GET',
        body: patient,
      }),
    }),
      createRatelist: builder.mutation({
      query: (patient) => ({
        url: '/ratelistmaster',
        method: 'GET',
        body: patient,
      }),
    }),  
    createRatelistDetails: builder.query({
    query: () => ({
    url: '/ratelistdetail',
    method: 'GET',
      }),
    }),
   getPartyName: builder.query({
    query: () => ({
    url: '/partymaster',
    method: 'GET',
      }),
    }),
    createBill: builder.mutation({
      query: (patient) => ({
        url: '/billmasters',
        method: 'POST',
        body: patient,
      }),
    }),
  }),
});
// Export the auto-generated hooks
export const { useCreateServiceMutation,useGetPartyNameQuery,useCreateRatelistMutation,useCreateBillMutation,useCreateRatelistDetailsQuery} = billingMasterApi;
