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
export const billingMasterApi = createApi({
  reducerPath: "billingMasterApi",
  baseQuery,
  tagTypes: [
    "ServiceDepartmentMaster",
    "ServiceCategoryMaster",
    "RateList",
    "Service",
    "RateListDetail",
    "PartyMaster",
    "PackageMaster",
    "PackageDetail"
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
      invalidatesTags: ["ServiceCategoryMaster"],
    }),

    deleteServiceCategoryMaster: builder.mutation({
      query: (id) => ({
        url: `servicecategorymaster/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceCategoryMaster"],
    }),

    // rate list Detail
    getRateListDetail: builder.query({
      query: () => "ratelistdetail",
      providesTags: ["RateListDetail"],
      transformErrorResponse: (res) => res.data || [],
    }),
    GetRatelistDetails: builder.query({
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

    // Party Master
    getPartyMaster : builder.query({
      query: () => "partymaster",
      providesTags:['PartyMaster'],
      transformResponse:(res) => res.data || [],
    }),
    createPartyMaster:builder.mutation({
      query:(partymaster) => ({
        url:"/partymaster",
        method:"POST",
        body:partymaster
      }),invalidatesTags:["PartyMaster"],
    }),
    updatePartyMaster:builder.mutation({
      query:(id,payload) => ({
        url:`/partymaster/${id}`,
        method:"PUT",
        body:payload
      }), invalidatesTags:["PartyMaster"]
    }),
    deletePartyMaster:builder.mutation({
      query:(id) => ({
        url:`/partymaster${id}`,
        method:'DELETE',
      }),invalidatesTags:["PartyMaster"]
    }),
    createBill: builder.mutation({
      query: (patient) => ({
        url: '/billmasters',
        method: 'POST',
        body: patient,
      }),
    }),
     createBilldetails: builder.mutation({
      query: (patient) => ({
        url: '/billdetails',
        method: 'POST',
        body: patient,
      }),
    }),   
    getbillDetail: builder.query({
    query: () => ({
      url: '/billmasters',
      method: 'GET',
      }),
    }),
    ///Service name
    getServiceName: builder.query({
    query: () => ({
      url: '/service',
      method: 'GET',
      }),
    }),
    // Fetch a single bill master by id (useful to load full bill details)
    getBillById: builder.query({
      query: (id) => ({
        url: `/billmasters/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res.data || res || {},
    }),
    getPartyName: builder.query({
    query: () => ({
    url: '/partymaster',
    method: 'GET',
      }),
    }),
    getBillId: builder.query({
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
    // package master
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
  useGetRateListQuery,
  useCreateRateListMutation,
  useUpdateRateListMutation,
  useGetBillIdQuery,
  useGetBillByIdQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useCreateBillMutation  ,
  useCreateBilldetailsMutation,
  useGetPartyNameQuery,
  useGetbillDetailQuery,
  useGetServiceNameQuery,
  useGetServiceDepartmentMasterQuery,
  useCreateServiceDepartmentMasterMutation,

  useGetServiceCategoryMasterQuery,
  useCreateServiceCategoryMasterMutation,

  useGetRateListDetailQuery,
  useCreateRateListDetailMutation,
  useGetRatelistDetailsQuery,
  useUpdateRateListDetailMutation,
  useDeleteRateListDetailMutation,

  useGetPartyMasterQuery,
  useCreatePartyMasterMutation,
  useUpdatePartyMasterMutation,
  useDeletePartyMasterMutation,

  useGetPackageDetailQuery,
  useGetPackageMasterQuery,
  useCreatePackageDetailMutation,
  useCreatePackageMasterMutation,
  useDeletePackageMasterMutation,
  useDeletePackageDetailMutation,
  useUpdatePackageDetailMutation,
  useUpdatePackageMasterMutation,
  
  
} = billingMasterApi;