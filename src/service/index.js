import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_URL
    :  import.meta.env.VITE_APP_PROD_URL;

export const authApi = createApi({
  tagTypes: ["auth"],
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`
  }),
  endpoints: (builder) => ({
    loginAuth: builder.mutation({
      query: (payload) => ({
        url: "user/admin/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
    loginAsAdmin: builder.mutation({
      query: (payload) => ({
        url: "designer/login/byadmin",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});
export const {
  useLoginAuthMutation,
  useLoginAsAdminMutation
} = authApi;  

export const adminApi = createApi({
  tagTypes: ["admin"],
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    adminList: builder.mutation({
      query: (payload) => ({
        url: "admin/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["admin"],
    }),
    submitAdmin: builder.mutation({
      query: (payload) => ({
        url: "admin/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["admin"],
    }),
    adminById: builder.query({
      query: (id) => ({
        url: `admin/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `admin/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
    getAdminPermissionList: builder.query({
      query: (id) => ({
        url: `admin/permissions/list`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
  }),
});
export const {
 useAdminListMutation,
 useSubmitAdminMutation,
 useAdminByIdQuery,
 useDeleteAdminMutation,
 useGetAdminPermissionListQuery,
} = adminApi;

export const categoryApi = createApi({
  tagTypes: ["category"],
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    categoryList: builder.mutation({
      query: (payload) => ({
        url: "category/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["category"],
    }),
    categoryDropdownList: builder.query({
      query: () => ({
        url: "category/drop/dwon/list",
        method: "GET",
      }),
      providesTags: ["category"],
    }),
    submitCategory: builder.mutation({
      query: (payload) => ({
        url: "category/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["category"],
    }),
    categoryById: builder.query({
      query: (id) => ({
        url: `category/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});
export const {
  useCategoryListMutation,
  useCategoryDropdownListQuery,
  useSubmitCategoryMutation,
  useDeleteCategoryMutation,
  useCategoryByIdQuery
} = categoryApi;


export const designTagApi = createApi({
  tagTypes: ["designTag"],
  reducerPath: "designTagApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    tagList: builder.mutation({
      query: (payload) => ({
        url: "tag/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["designTag"],
    }),
    tagDropdownList: builder.query({
      query: () => ({
        url: "tag/drop/dwon/list",
        method: "GET",
      }),
      providesTags: ["designTag"],
    }),
    submitTag: builder.mutation({
      query: (payload) => ({
        url: "tag/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designTag"],
    }),
    tagById: builder.query({
      query: (id) => ({
        url: `tag/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["designTag"],
    }),
    deleteTag: builder.mutation({
      query: (id) => ({
        url: `tag/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["designTag"],
    }),
  }),
});
export const {
  useTagListMutation,
  useSubmitTagMutation,
  useDeleteTagMutation,
  useTagByIdQuery,
  useTagDropdownListQuery
} = designTagApi;


export const designUploadApi = createApi({
  tagTypes: ["designeUpload"],
  reducerPath: "designUploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    designUploadList: builder.mutation({
      query: (payload) => ({
        url: "designupload/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["designeUpload"],
    }),
    submitDesignUpload: builder.mutation({
      query: (payload) => ({
        url: "designupload/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designeUpload"],
    }),
    designUploadById: builder.query({
      query: (id) => ({
        url: `designupload/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["designeUpload"],
    }),
    deleteDesignUpload: builder.mutation({
      query: (id) => ({
        url: `designupload/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["designeUpload"],
    }),
  }),
});
export const {
  useDesignUploadListMutation,
  useSubmitDesignUploadMutation,
  useDesignUploadByIdQuery,
  useDeleteDesignUploadMutation
} = designUploadApi;

export const fileApi = createApi({
  tagTypes: ["fileUpload"],
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    fileUpload: builder.mutation({
      query: (payload) => ({
        url: `uploads?type=${payload?.type}`,
        method: "POST",
        body: payload?.file,
      }),
      invalidatesTags: ["file"],
    }),
    multipleFileUpload: builder.mutation({
      query: (payload) => ({
        url: `uploads/multiple?type=${payload?.type}`,
        method: "POST",
        body: payload?.file,
      }),
      invalidatesTags: ["file"],
    }),
  }),
});

export const { useFileUploadMutation,useMultipleFileUploadMutation } = fileApi;


export const designerApi = createApi({
  tagTypes: ["designer"],
  reducerPath: "designerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    designerList: builder.mutation({
      query: (payload) => ({
        url: "designer/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["designer"],
    }),
    submitDesigner: builder.mutation({
      query: (payload) => ({
        url: "designer/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designer"],
    }),
    designerById: builder.query({
      query: (id) => ({
        url: `designer/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["designer"],
    }),
    deleteDesigner: builder.mutation({
      query: (id) => ({
        url: `designer/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["designer"],
    }),
    getDesignerPermissionList: builder.query({
      query: (id) => ({
        url: `designer/permissions/list`,
        method: "GET",
      }),
      providesTags: ["designer"],
    }),
  }),
});
export const {
  useDesignerListMutation,
  useSubmitDesignerMutation,
  useDesignerByIdQuery,
  useDeleteDesignerMutation,
  useGetDesignerPermissionListQuery
} = designerApi;


export const clientApi = createApi({
  tagTypes: ["client"],
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      if(getState()?.authState?.userToken){
        headers.set('Authorization', getState()?.authState?.userToken);
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    clientList: builder.mutation({
      query: (payload) => ({
        url: "client/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["client"],
    }),
    submitClient: builder.mutation({
      query: (payload) => ({
        url: "client/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["client"],
    }),
    clientById: builder.query({
      query: (id) => ({
        url: `client/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["client"],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `client/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["client"],
    }),
  }),
});
export const {
 useClientListMutation,
 useSubmitClientMutation,
 useClientByIdQuery,
 useDeleteClientMutation
} = clientApi;