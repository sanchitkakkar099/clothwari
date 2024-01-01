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
    logoutUser: builder.mutation({
      query: (payload) => ({
        url: "user/logout",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
    clientLastActiveTime: builder.mutation({
      query: (payload) => ({
        url: "user/lastactivetime",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});
export const {
  useLoginAuthMutation,
  useLoginAsAdminMutation,
  useLogoutUserMutation,
  useClientLastActiveTimeMutation,
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
    adminStaffApprovalList: builder.mutation({
      query: (payload) => ({
        url: "admin/staff/approval/list",
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
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "user/password/change",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});
export const {
 useAdminListMutation,
 useSubmitAdminMutation,
 useAdminByIdQuery,
 useDeleteAdminMutation,
 useGetAdminPermissionListQuery,
 useAdminStaffApprovalListMutation,
 useChangePasswordMutation
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
    submitMultipleDesignUpload: builder.mutation({
      query: (payload) => ({
        url: "designupload/create/bulk",
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
  useSubmitMultipleDesignUploadMutation,
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
        url: payload?.watermark ? `uploads?type=${payload?.type}&watermark=${payload?.watermark}` : `uploads?type=${payload?.type}`,
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
    multipleThumbnailUpload: builder.mutation({
      query: (payload) => ({
        url: `uploads/multiple/pdf/?type=${payload?.type}`,
        method: "POST",
        body: payload?.file,
      }),
      invalidatesTags: ["file"],
    }),
  }),
});

export const { useFileUploadMutation,useMultipleFileUploadMutation,useMultipleThumbnailUploadMutation } = fileApi;


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
    staffApprovalBySuperAdmin: builder.mutation({
      query: (payload) => ({
        url: "admin/staff/approved",
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
  useGetDesignerPermissionListQuery,
  useStaffApprovalBySuperAdminMutation
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


export const colorVariationApi = createApi({
  tagTypes: ["colorVariation"],
  reducerPath: "colorVariationApi",
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
    colorVariationList: builder.mutation({
      query: (payload) => ({
        url: "color/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["colorVariation"],
    }),
    colorVariationDropdownList: builder.query({
      query: () => ({
        url: "color/drop/down/list",
        method: "GET",
      }),
      providesTags: ["colorVariation"],
    }),
    submitColorVariation: builder.mutation({
      query: (payload) => ({
        url: "color/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["colorVariation"],
    }),
    colorVariationById: builder.query({
      query: (id) => ({
        url: `color/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["colorVariation"],
    }),
    deleteColorVariation: builder.mutation({
      query: (id) => ({
        url: `color/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["colorVariation"],
    }),
  }),
});
export const {
  useColorVariationListMutation,
  useSubmitColorVariationMutation,
  useColorVariationByIdQuery,
  useColorVariationDropdownListQuery,
  useDeleteColorVariationMutation
} = colorVariationApi;

export const dashboardApi = createApi({
  tagTypes: ["dashboard"],
  reducerPath: "dashboardApi",
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
    dashboardCount: builder.query({
      query: (id) => ({
        url: `admin/dashboard`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});
export const {
  useDashboardCountQuery
} = dashboardApi;