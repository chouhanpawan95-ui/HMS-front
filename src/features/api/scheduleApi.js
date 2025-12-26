import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.REACT_APP_API_URL || "https://hms-api-ho1n.onrender.com/api";

export const scheduleApi = createApi ({
  reducerPath : "scheduleApi",
  baseQuery:fetchBaseQuery({baseUrl:BASE_URL}),
  tagTypes:[
    'OPDSchedule','OPDScheduleTimeDetail', 'OPDAppointment'
  ],
  endpoints:(builder)=>({

    // doctor opd schedule
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

    // opd schedule time detail
    getOPDScheduleTimeDetail:builder.query({
      query:() => 'DoctorOpdScheduleTimeDetail',
      providesTags:['OPDScheduleTimeDetail'],
      transformResponse:(res) => res.data || [],
    }),
    createOPDScheduleTimeDetail:builder.mutation({
      query:(DoctorOpdScheduleTimeDetail) => ({
        url:'DoctorOpdScheduleTimeDetail',
        method:'POST',
        body:DoctorOpdScheduleTimeDetail
      }), invalidatesTags:['OPDScheduleTimeDetail']
    }),

    // opd appointment
    getOPDAppointment:builder.query({
      query:() => 'opdappointments',
      providesTags:['OPDAppointment'],
      transformResponse:(res) => res.data || [],
    }),
    createOPDAppointment:builder.mutation({
      query:(opdappointments) => ({
        url:'opdappointments',
        method:'POST',
        body:opdappointments,
      }), invalidatesTags:['OPDAppointment'],
    }),
    updateOPDAppointment:builder.mutation({
      query:({id,payload}) => ({
        url:`opdappointments/${id}`,
        method:'PUT',
        body:payload,
      }),invalidatesTags:['OPDAppointment'],
    }),
    deleteOPDAppointment:builder.mutation({
      query:({id}) => ({
        method:'DELETE',
        url:`opdappointments/${id}`
      }),invalidatesTags:['OPDAppointment']
    }),

  })
});
export const {
  useGetOPDScheduleQuery,
  useCreateOPDScheduleMutation,
  useUpdateOPDScheduleMutation,
  useDeleteOPDScheduleMutation,

  useGetOPDScheduleTimeDetailQuery,
  useCreateOPDScheduleTimeDetailMutation,

  useGetOPDAppointmentQuery,
  useCreateOPDAppointmentMutation,
  useUpdateOPDAppointmentMutation,
  useDeleteOPDAppointmentMutation,


} = scheduleApi;