import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Configure the base query with the API URL
const billingBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const baseQuery = fetchBaseQuery({
  baseUrl: billingBaseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Create the API slice
export const partyApi = createApi({
  reducerPath: "partyApi",
  baseQuery,
  tagTypes: [
    "ServiceDepartmentMaster",
    "ServiceCategoryMaster",
    "RateList",
    "Service",
    "RateListDetail",
    "PartyMaster",
  ],
  endpoints: (builder) => ({
   
    // Party Master
    getPartyMaster: builder.query({
      query: () => "partymaster",
      providesTags: ['PartyMaster'],
      transformResponse: (res) => res.data || [],
    }),
    createPartyMaster: builder.mutation({
      query: (partymaster) => ({
        url: "/partymaster",
        method: "POST",
        body: partymaster
      }), invalidatesTags: ["PartyMaster"],
    }),
    updatePartyMaster: builder.mutation({
      query: (id, payload) => ({
        url: `/partymaster/${id}`,
        method: "PUT",
        body: payload
      }), invalidatesTags: ["PartyMaster"]
    }),
    deletePartyMaster: builder.mutation({
      query: (id) => ({
        url: `/partymaster${id}`,
        method: 'DELETE',
      }), invalidatesTags: ["PartyMaster"]
    }),   
    getPartyName: builder.query({
      query: () => ({
        url: '/partymaster',
        method: 'GET',
      }),
    }),  
  }),
});
// Export the auto-generated hooks
export const { 
  useGetPartyNameQuery,
  useGetPartyMasterQuery,
  useCreatePartyMasterMutation,
  useUpdatePartyMasterMutation,
  useDeletePartyMasterMutation,
} = partyApi;