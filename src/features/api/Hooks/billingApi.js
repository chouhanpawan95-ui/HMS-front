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
export const billingApi = createApi({
    reducerPath: "billingApi",
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

        createBill: builder.mutation({
            query: (patient) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: '/billmasters',
                    method: 'POST',
                    body: patient,
                };
            },
        }),
        createBilldetails: builder.mutation({
            query: (patient) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: '/billdetails',
                    method: 'POST',
                    body: patient,
                };
            },
        }),
        createReceiptMaster: builder.mutation({
            query: (payload) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: '/receiptmasters',
                    method: 'POST',
                    body: payload,
                };
            },
        }),
        createReceiptAdjustmentDetail: builder.mutation({
            query: (payload) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: '/receiptadjustmentdetail',
                    method: 'POST',
                    body: payload,
                };
            },
        }),
        getBillDetail: builder.query({
            query: () => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: '/billdetails',
                    method: 'GET',
                };
            },
        }),
        getBillMaster: builder.query({
            query: () => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: '/billmasters',
                    method: 'GET',
                };
            },
        }),
        // Fetch bills for a specific registration id (regid)
        getBillMasterByRegId: builder.query({
            query: (regid) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: `/billmasters/regid/${encodeURIComponent(regid)}`,
                    method: 'GET',
                };
            },
            transformResponse: (res) => res.data || res || [],
        }),
        // Fetch a single bill master by id (useful to load full bill details)
        getBillMasterById: builder.query({
            query: (id) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: `/billmasters/${id}`,
                    method: 'GET',
                };
            },
            transformResponse: (res) => res.data || res || {},
        }),
        getBillDetailById: builder.query({
            query: (id) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: `/billdetails/${id}`,
                    method: 'GET',
                };
            },
            transformResponse: (res) => res.data || res || {},
        }),
        getBillDetailByBillId: builder.query({
            query: (billid) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: `/billdetails/bill/${billid}`,
                    method: 'GET',
                };
            },
            transformResponse: (res) => res.data || res || {},
        }),
        // Fetch receipt adjustment details referencing a particular adjusted bill (fkAdjustedBillId)
        getReceiptAdjustmentsByAdjustedBillId: builder.query({
            query: (billid) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                return {
                    url: `/receiptadjustmentdetail?fkAdjustedBillId=${encodeURIComponent(billid)}`,
                    method: 'GET',
                };
            },
            transformResponse: (res) => res.data || res || [],
        }),
        getBillId: builder.query({
            // args is an object with optional query params
            query: (args = {}) => {
                // Check if token is available
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('Token not found. Please login first.');
                }
                const { patientId } = args;
                const params = {};
                if (patientId !== undefined) params.patientId = patientId;
                return {
                    url: 'patients/next-id',
                    method: 'GET',
                };
            }
        }),
    }),
});
// Export the auto-generated hooks
export const {
    useGetBillIdQuery,
    useGetBillMasterByIdQuery,
    useGetBillDetailByIdQuery,
    useGetBillDetailByBillIdQuery,
    useLazyGetBillDetailByBillIdQuery,

    useGetReceiptAdjustmentsByAdjustedBillIdQuery,
    useLazyGetReceiptAdjustmentsByAdjustedBillIdQuery,

    useCreateBillMutation,
    useCreateBilldetailsMutation,
    useCreateReceiptMasterMutation,
    useCreateReceiptAdjustmentDetailMutation,

    useGetBillMasterByRegIdQuery,
    useLazyGetBillMasterByRegIdQuery,
    useGetBillMasterQuery,
    useGetBillDetailQuery,


} = billingApi;