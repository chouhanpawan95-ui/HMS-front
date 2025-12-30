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
export const packageApi = createApi({
  reducerPath: "packageApi",
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
   
    // pacakge Master
     getPackageMaster:builder.query({
      query:() => 'packagemaster',
      providesTags:['/packagemaster'],
      transformResponse:(res) => res.data || [],
    }),
    createPackageMaster:builder.mutation({
      query: (packagemaster) => ({
        url: '/packagemaster',
        method:'POST',
        body:packagemaster
      }), invalidatesTags: ['PackageMaster'],
    }),
    updatePackageMaster:builder.mutation({
      query:({id,payload}) => ({
        url:`/packagemaster/${id}`,
        method: 'PUT',
        body:payload         
      }), invalidatesTags:['PackageMaster'],
    }),
    deletePackageMaster:builder.mutation({
      query:(id) => ({
        url : `/packagedetail/${id}`,
        method:'DELETE',
      }),invalidatesTags:['PackageDetail'],
    }),
    // package detail
    getPackageDetail:builder.query({
      query: () => 'packagedetail',
      providesTags:['/packagedetail'],
      transformResponse:(res) => res.data || []
    }),
    createPackageDetail:builder.mutation({
      query: (packagedetail) => ({
        url: '/packagedetail',
        method:'POST',
        body:packagedetail
      }), invalidatesTags:['PackageDetail'],
    }),
    updatePackageDetail:builder.mutation({
      query:({id,payload}) => ({
        url : `packagedetail/${id}`,
        method: 'PUT',
        body:payload
      }),invalidatesTags:['PackageDetail'],
    }),
    deletePackageDetail:builder.mutation({
        query: ({id}) => ({
        url:`/packagedetail/${id}`,
        method:'DELETE',
      })
    }) 
  }),
});
// Export the auto-generated hooks
export const { 
  useGetPackageMasterQuery,
   useCreatePackageMasterMutation,
   useGetPackageDetailQuery,
   useCreatePackageDetailMutation,
   useUpdatePackageDetailMutation,
   useDeletePackageDetailMutation,
   useUpdatePackageMasterMutation,
} = packageApi;