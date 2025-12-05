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
  tagTypes:['ServiceDepartmentMaster', 'ServiceCategoryMaster'],
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
    
    // service department master
    getServiceDepartmentMaster:builder.query({
      query:() =>'servicedepartmentmaster',
      providesTags:['ServiceDepartmentMaster'],
      transformResponse:(res)=>res.data || [],      
    }),

    createServiceDepartmentMaster:builder.mutation({
      query: (servicedepartmentController) =>({
        url:'/servicedepartmentmaster',
        method:'POST',
        body:servicedepartmentController,
      }),
      invalidatesTags:['ServiceDepartmentMaster'],
    }),

    updateServiceDepartmentMaster:builder.mutation({
      query:({id,payload}) =>({
        url:`servicedepartmentmaster/${id}`,
        method:'PUT',
        body:payload,
      }),
      invalidatesTags:['ServiceDepartmentMaster'],
    }),

    deleteServiceDepartmentMaster:builder.mutation({
      query:(id) => ({
        url:`servicedepartmentmaster/${id}`,
        method:'DELETE',
      }),
      invalidatesTags:['ServiceDepartmentMaster']
    }),

    // service category master

    getServiceCategoryMaster:builder.query({
      query:()=>'servicecategorymaster',
      ProvidesTags:['ServiceCategoryMaster'],
      transformResponse:(res) => res.data || []
    }),

    createServiceCategoryMaster:builder.mutation({
      query:(servicecategorymaster) =>({
        url:'servicecategorymaster',
        method:'POST',
        body:servicecategorymaster
      }),
      invalidatesTags:['ServiceCategoryMaster'],
    }),

    updateServiceCategoryMaster:builder.mutation({
      query:({id,payload}) =>({
        url:`servicecategorymaster/${id}`,
        method:'PUT',
        body:payload,
      }),
      invalidatesTags:['ServiceCategoryMaster'],
    }),
    


    deleteServiceCategoryMaster:builder.mutation({
      query:(id) =>({
        url:`servicecategorymaster/${id}`,
        method:'DELETE',
      }),
      invalidatesTags:['ServiceCategoryMaster'],
    }),

  }),
});
// Export the auto-generated hooks
export const { useCreateServiceMutation,useCreateRatelistMutation,
  useGetServiceDepartmentMasterQuery,useCreateServiceDepartmentMasterMutation,
  useGetServiceCategoryMasterQuery, useCreateServiceCategoryMasterMutation,
  

} = billingMasterApi;
