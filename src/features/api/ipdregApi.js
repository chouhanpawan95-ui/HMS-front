import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.REACT_APP_API_URL || "https://hms-api-ho1n.onrender.com/api";

export const ipdregApi = createApi({
  reducerPath:'ipdregApi',
  baseQuery:fetchBaseQuery({baseUrl:BASE_URL}),
  tagTypes:[
    'ipdredRegistration',
  ],
  endpoints:(builder) =>({
    // registration
    getIpdregRegistration:builder.query({
      query:() => 'ipdredRegistration',
      providesTags:['ipdredRegistration'],
      transformResponse:(res) => res.data || [],
    }),
    createIpdregRegistration:builder.mutation({
      query:(ipdredRegistration) => ({
        url:`ipdregmasters/${id}`,
        method:'POST',
        body:ipdredRegistration,
      }), invalidatesTags:['ipdredRegistration']
    })
  })
})