import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "react-hook-form";

// Configure the base query with the API URL
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Create the API slice
export const billingMasterApi = createApi({
  reducerPath: "billingMasterApi",
  baseQuery,
  tagTypes: [
    "ServiceDepartmentMaster",
    "ServiceCategoryMaster",
    "RateList",
    "Service",
    "RateListDetail",
  ],
  endpoints: (builder) => ({
    getService: builder.query({
      query: () => "service",
      providesTags: ["Service"],
      transformResponse: (res) => res.data || [],
    }),
    createService: builder.mutation({
      query: (service) => ({
        url: "/service",
        method: "POST",
        body: service,
      }),
    }),

    // Rate list master
    getRateList: builder.query({
      query: () => "ratelistmaster",
      providesTags: ["RateList"],
      transformResponse: (res) => res.data || [],
    }),

    createRateList: builder.mutation({
      query: (rateList) => ({
        url: "/ratelistmaster",
        method: "POST",
        body: rateList,
      }),
    }),
    updateRateList: builder.mutation({
      query: ({ id, payload }) => ({
        url: `ratelistmaster/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["RateList"],
    }),

    // service department master
    getServiceDepartmentMaster: builder.query({
      query: () => "servicedepartmentmaster",
      providesTags: ["ServiceDepartmentMaster"],
      transformResponse: (res) => res.data || [],
    }),

    createServiceDepartmentMaster: builder.mutation({
      query: (servicedepartmentController) => ({
        url: "/servicedepartmentmaster",
        method: "POST",
        body: servicedepartmentController,
      }),
      invalidatesTags: ["ServiceDepartmentMaster"],
    }),

    updateServiceDepartmentMaster: builder.mutation({
      query: ({ id, payload }) => ({
        url: `servicedepartmentmaster/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ServiceDepartmentMaster"],
    }),

    deleteServiceDepartmentMaster: builder.mutation({
      query: (id) => ({
        url: `servicedepartmentmaster/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceDepartmentMaster"],
    }),

    // service category master

    getServiceCategoryMaster: builder.query({
      query: () => "servicecategorymaster",
      providesTags: ["ServiceCategoryMaster"],
      transformResponse: (res) => res.data || [],
    }),

    createServiceCategoryMaster: builder.mutation({
      query: (servicecategorymaster) => ({
        url: "servicecategorymaster",
        method: "POST",
        body: servicecategorymaster,
      }),
      invalidatesTags: ["ServiceCategoryMaster"],
    }),

    updateServiceCategoryMaster: builder.mutation({
      query: ({ id, payload }) => ({
        url: `servicecategorymaster/${id}`,
        method: "PUT",
        body: payload,
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
