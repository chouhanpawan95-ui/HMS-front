import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.REACT_APP_API_URL || "https://hms-api-ho1n.onrender.com/api";

export const scheduleApi = createApi ({
  reducerPath : "scheduleApi",
  baseQuery:fetchBaseQuery({baseUrl:BASE_URL}),
  tagTypes:[
    'OPDSchedule',
  ],
  endpoints:(builder)=>({

    // opd schedule
    getOPDSchedule:builder.query({
      query:() => 'doctoropdschedulemaster',
      providesTags:['OPDSchedule'],
      transformErrorResponse:(res) => res.data || [],
    }),
    createOPDSchedule:builder.mutation({
      query:(doctoropdschedulemaster) => ({
        url:'doctoropdschedulemaster',
        method:'POST',
        body:doctoropdschedulemaster,
      }), invalidatesTags:['OPDSchedule'],
    }),
    updateOPDSchedule:builder.mutation({
      query:({id,payload}) => ({
        url:`doctoropdschedulemaster/${id}`,
        method:'PUT',
        body:payload
      }),invalidatesTags:['OPDSchedule'],
    }),
    deleteOPDSchedule:builder.mutation({
      query:({id}) => ({
        url:`doctoropdschedulemaster/${id}`,
        method:'DELETE'
      }),invalidatesTags:['OPDSchedule']
    }),

  })
});
export const {
  useGetOPDScheduleQuery,
  useCreateOPDScheduleMutation,
} = scheduleApi;