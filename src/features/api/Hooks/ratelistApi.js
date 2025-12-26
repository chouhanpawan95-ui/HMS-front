import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "react-hook-form";

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
export const rateListApi = createApi({
  reducerPath: "rateListApi",
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
    // Rate list details
   getRateListDetail: builder.query({
  query: () => "/ratelistdetail",
  providesTags: ["RateListDetail"],
  transformResponse: (res) =>
    Array.isArray(res) ? res : res?.data ?? [],
}),

    getRatelistDetails: builder.query({
      query: () => ({
        url: '/ratelistdetail',
        method: 'GET',
      }),
    }),
    createRateListDetail: builder.mutation({
      query: (ratelistdetail) => ({
        url: "/ratelistdetail",
        method: "POST",
        body: ratelistdetail,
      }),
      invalidatesTags: ["RateListDetail"],
    }),
    updateRateListDetail: builder.mutation({
      query: ({ id, payload }) => ({
        url: `ratelistdetail/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["RateListDetail"],
    }),
    deleteRateListDetail: builder.mutation({
      query: (id) => ({
        url: `ratelistdetail/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RateListDetail"],
    }), 
    // Rate list master
    getRateList: builder.query({
      query: () => ({
        url: '/ratelistmaster',
        method: 'GET',
      }),
      providesTags: ["RateList"],
      transformResponse: (res) => (Array.isArray(res) ? res : res?.data ?? []),
    }),
    createRateList: builder.mutation({
      query: (rateList) => ({
        url: "/ratelistmaster",
        method: "POST",
        body: rateList,
      }),
      invalidatesTags: ["RateList"],
    }),
    updateRateList: builder.mutation({
      query: ({ id, payload }) => ({
        url: `ratelistmaster/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["RateList"],
    }),
    deleteRateList: builder.mutation({
      query: (id) => ({
        url: `ratelistmaster/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RateList", "RateListDetail"],
    }), 
  }),
});
// Export the auto-generated hooks
export const {
  useGetRateListQuery,
  useCreateRateListMutation,
  useUpdateRateListMutation,
  useDeleteRateListMutation,
  useGetRateListDetailQuery,
  useCreateRateListDetailMutation,
  useGetRatelistDetailsQuery,
  useUpdateRateListDetailMutation,
  useDeleteRateListDetailMutation,
} = rateListApi;