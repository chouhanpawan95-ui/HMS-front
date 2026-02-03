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
export const serviceApi = createApi({
  reducerPath: "serviceApi",
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

    getService: builder.query({
      query: () => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return "service";
      },
      providesTags: ["Service"],
      transformResponse: (res) => res.data || [],
    }),
    createService: builder.mutation({
      query: (service) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: "/service",
          method: "POST",
          body: service,
        };
      },
    }), 

    // service department master
    getServiceDepartmentMaster: builder.query({
      query: () => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return "servicedepartmentmaster";
      },
      providesTags: ["ServiceDepartmentMaster"],
      transformResponse: (res) => res.data || [],
    }),

    createServiceDepartmentMaster: builder.mutation({
      query: (servicedepartmentController) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: "/servicedepartmentmaster",
          method: "POST",
          body: servicedepartmentController,
        };
      },
      invalidatesTags: ["ServiceDepartmentMaster"],
    }),

    updateServiceDepartmentMaster: builder.mutation({
      query: ({ id, payload }) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: `servicedepartmentmaster/${id}`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["ServiceDepartmentMaster"],
    }),

    deleteServiceDepartmentMaster: builder.mutation({
      query: (id) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: `servicedepartmentmaster/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ServiceDepartmentMaster"],
    }),
    // service category master
    getServiceCategoryMaster: builder.query({
      query: () => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return "servicecategorymaster";
      },
      providesTags: ["ServiceCategoryMaster"],
      transformResponse: (res) => res.data || [],
    }),
    createServiceCategoryMaster: builder.mutation({
      query: (servicecategorymaster) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: "servicecategorymaster",
          method: "POST",
          body: servicecategorymaster,
        };
      },
      invalidatesTags: ["ServiceCategoryMaster"],
    }),

    updateServiceCategoryMaster: builder.mutation({
      query: ({ id, payload }) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: `servicecategorymaster/${id}`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["ServiceCategoryMaster"],
    }),

    deleteServiceCategoryMaster: builder.mutation({
      query: (id) => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: `servicecategorymaster/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ServiceCategoryMaster"],
    }),
    ///Service name
    getServiceName: builder.query({
      query: () => {
        // Check if token is available
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please login first.');
        }
        return {
          url: '/service',
          method: 'GET',
        };
      },
    }),   
  }),
});
// Export the auto-generated hooks
export const { 
  useGetServiceQuery,
  useCreateServiceMutation,

  useGetServiceNameQuery,

  useGetServiceDepartmentMasterQuery,
  useCreateServiceDepartmentMasterMutation,

  useGetServiceCategoryMasterQuery,
  useCreateServiceCategoryMasterMutation,

} = serviceApi;