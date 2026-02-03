import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
const BASE_URL = process.env.REACT_APP_API_URL || "https://hms-api-ho1n.onrender.com/api";

export const usermasterApi = createApi({
  reducerPath: 'usermasterApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: [
    'UserMasters', "UserMastersNextId"
  ],
  endpoints: (builder) => ({
    getUserMaster: builder.query({
      query: () => 'usermasters',
      providesTags: ['UserMasters'],
      transformErrorResponse: (res) => res.data || [],
    }),
    createUserMaster: builder.mutation({
      query: (usermasters) => ({
        url: 'usermasters',
        method: 'POST',
        body: usermasters,
      }), invalidatesTags: ['UserMasters']
    }),
    updateUserMaster: builder.mutation({
      query: ({ id, payload }) => ({
        url: `usermaster/${id}`,
        method: 'PUT',
        body: payload,
      }), invalidatesTags: ['UserMasters']
    }),
    deleteUserMaster: builder.mutation({
      query: ({ id }) => ({
        url: `usermaster/${id}`,
        method: 'DELETE',
      }), invalidatesTags: ['UserMasters']
    }),

    getUserMasterNextId: builder.query({
      query: () => `usermasters/next-id`,
      transformResponse: (res) => res.PK_UserId,
    }),

  })
});
export const {
  useGetUserMasterQuery,
  useCreateUserMasterMutation,
  useUpdateUserMasterMutation,
  useDeleteUserMasterMutation,
  useGetUserMasterNextIdQuery,
  useLazyGetUserMasterNextIdQuery
} = usermasterApi;