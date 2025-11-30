import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.REACT_APP_API_URL || "https://hms-api-ho1n.onrender.com/api";
export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Country", "State", "District", "City"],
  endpoints: (builder) => ({
    // Country
    getCountry: builder.query({
      query: () => "country",
      providesTags: ["Country"],
      transformResponse: (res) => res.data || [],
    }),
    createCountry: builder.mutation({
      query: (country) => ({
        url: "country",
        method: "POST",
        body: country,
      }),
      invalidatesTags: ["Country"],
    }),
    updateCountry: builder.mutation({
      query: ({ id, payload }) => ({
        url: `country/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Country"],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `country/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Country"],
    }),

    // State
    getStates: builder.query({
      query: (countryId) => `state?countryId=${countryId}`,
      providesTags: ["State"],
      transformResponse: (res) => res.data || [],
    }),
    createState: builder.mutation({
      query: (state) => ({
        url: "state",
        method: "POST",
        body: state,
      }),
      invalidatesTags: ["State"],
    }),
    updateState: builder.mutation({
      query: ({ id, payload }) => ({
        url: `state/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["State"],
    }),
    deleteState: builder.mutation({
      query: (id) => ({
        url: `state/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["State"],
    }),

    // District
    getDistricts: builder.query({
      query: (stateId) => `district?stateId=${stateId}`,
      providesTags: ["District"],
      transformResponse: (res) => res.data || [],
    }),
    createDistrict: builder.mutation({
      query: (district) => ({
        url: "district",
        method: "POST",
        body: district,
      }),
      invalidatesTags: ["District"],
    }),
    updateDistrict: builder.mutation({
      query: ({ id, payload }) => ({
        url: `district/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["District"],
    }),
    deleteDistrict: builder.mutation({
      query: (id) => ({
        url: `district/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["District"],
    }),

    // City
    getCities: builder.query({
      query: (districtId) => `city?districtId=${districtId}`,
      providesTags: ["City"],
      transformResponse: (res) => res || [],
    }),
    createCity: builder.mutation({
      query: (city) => ({
        url: "city",
        method: "POST",
        body: city,
      }),
      invalidatesTags: ["City"],
    }),
    updateCity: builder.mutation({
      query: ({ id, payload }) => ({
        url: `city/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["City"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({
        url: `city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["City"],
    }),
  }),
});

export const {
  useGetCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,

  useGetStatesQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,

  useGetDistrictsQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,

  useGetCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = locationApi;
