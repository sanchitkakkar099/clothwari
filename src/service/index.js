import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { setUploadProgress } from "../redux/designUploadSlice";
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
    superAdminLoginAsLogin: builder.mutation({
      query: (payload) => ({
        url: "admin/login/byadmin",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["auth"],
    }),
    superAdminLoginAsClient: builder.mutation({
      query: (payload) => ({
        url: "client/login/byadmin",
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
  useSuperAdminLoginAsLoginMutation,
  useSuperAdminLoginAsClientMutation,
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
    changePasswordBySuperAdmin: builder.mutation({
      query: (payload) => ({
        url: "admin/user/password/changes",
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
 useChangePasswordMutation,
 useChangePasswordBySuperAdminMutation
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
    categoryListV2: builder.mutation({
      query: (payload) => ({
        url: "category/list/v2",
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
    uniqueCategoryCheck: builder.mutation({
      query: (payload) => ({
        url: "category/check",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["category"],
    }),
    mergeCategory: builder.mutation({
      query: (payload) => ({
        url: "category/merge",
        method: "POST",
        body: payload,
      }),
      providesTags: ["category"],
    }),
  }),
});
export const {
  useCategoryListMutation,
  useCategoryListV2Mutation,
  useCategoryDropdownListQuery,
  useSubmitCategoryMutation,
  useDeleteCategoryMutation,
  useCategoryByIdQuery,
  useUniqueCategoryCheckMutation,
  useMergeCategoryMutation
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
    tagListV2: builder.mutation({
      query: (payload) => ({
        url: "tag/list/v2",
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
    searchTag: builder.mutation({
      query: (payload) => ({
        url: "tag/search",
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
    mergeTag: builder.mutation({
      query: (payload) => ({
        url: "tag/merge",
        method: "POST",
        body: payload,
      }),
      providesTags: ["designTag"],
    }),
  }),
});
export const {
  useTagListMutation,
  useTagListV2Mutation,
  useSubmitTagMutation,
  useSearchTagMutation,
  useDeleteTagMutation,
  useTagByIdQuery,
  useTagDropdownListQuery,
  useMergeTagMutation
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
    reportDesignUploadList: builder.mutation({
      query: (payload) => ({
        url: "designupload/report/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["designeUpload"],
    }),
    designUploadList2: builder.mutation({
      query: (payload) => ({
        url: "designupload/list/v2",
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
    uniqueDesignNameCheck: builder.mutation({
      query: (payload) => ({
        url: "designupload/name/check",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designeUpload"],
    }),
    uniqueDesignNumberCheck: builder.mutation({
      query: (payload) => ({
        url: "designupload/designNo/check",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designeUpload"],
    }),
    updateUploadedBy: builder.mutation({
      query: (payload) => ({
        url: "designupload/uploadedBy/update",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designeUpload"],
    }),
  }),
});
export const {
  useDesignUploadListMutation,
  useReportDesignUploadListMutation,
  useDesignUploadList2Mutation,
  useSubmitDesignUploadMutation,
  useSubmitMultipleDesignUploadMutation,
  useDesignUploadByIdQuery,
  useDeleteDesignUploadMutation,
  useUniqueDesignNameCheckMutation,
  useUniqueDesignNumberCheckMutation,
  useUpdateUploadedByMutation
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
      queryFn: async ({ url, data}, api) => {
          try {
              const result = await axios.post(url, data, {
                  onUploadProgress: upload => {
                    let uploadloadProgress = Math.round((100 * upload.loaded) / upload.total);                         
                    api.dispatch(setUploadProgress(uploadloadProgress ));
                  },
              });
          return { data: result.data }
    } catch (axiosError) {
          let err = axiosError
          return {
                error: {
                  status: err?.response?.status,
                  data: err?.response?.data || err?.message,
                },
          }
    }
    }
    }),
    multipleThumbnailUpload: builder.mutation({
      queryFn: async ({ url, data}, api) => {
        try {
            const result = await axios.post(url, data, {
                onUploadProgress: upload => {
                  let uploadloadProgress = Math.round((100 * upload.loaded) / upload.total);                         
                  api.dispatch(setUploadProgress(uploadloadProgress ));
                },
            });
        return { data: result.data }
  } catch (axiosError) {
        let err = axiosError
        return {
              error: {
                status: err?.response?.status,
                data: err?.response?.data || err?.message,
              },
        }
  }
  }
    }),
    uploadMarketingPDFFile: builder.mutation({
      queryFn: async ({ url, data}, api) => {
        try {
            const result = await axios.post(url, data, {
                onUploadProgress: upload => {
                  let uploadloadProgress = Math.round((100 * upload.loaded) / upload.total);                         
                  api.dispatch(setUploadProgress(uploadloadProgress ));
                },
            });
        return { data: result.data }
        } catch (axiosError) {
              let err = axiosError
              return {
                    error: {
                      status: err?.response?.status,
                      data: err?.response?.data || err?.message,
                    },
              }
        }
      }
    }),
    uploadDesignImageFile: builder.mutation({
      queryFn: async ({ url, data}, api) => {
        try {
            const result = await axios.post(url, data, {
                onUploadProgress: upload => {
                  let uploadloadProgress = Math.round((100 * upload.loaded) / upload.total);                         
                  api.dispatch(setUploadProgress(uploadloadProgress ));
                },
            });
        return { data: result.data }
        } catch (axiosError) {
              let err = axiosError
              return {
                    error: {
                      status: err?.response?.status,
                      data: err?.response?.data || err?.message,
                    },
              }
        }
      }
    }),
    newTiffUpload: builder.mutation({
      query: (payload) => ({
        url: 'uploads/save',
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["file"],
    }),
  }),
});

export const { 
  useFileUploadMutation,
  useMultipleFileUploadMutation,
  useMultipleThumbnailUploadMutation,
  useUploadMarketingPDFFileMutation,
  useUploadDesignImageFileMutation,
  useNewTiffUploadMutation
} = fileApi;


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
    designerDropDownList: builder.query({
      query: (id) => ({
        url: `designer/list/drop/down`,
        method: "GET",
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
    manageStaffSessionByAdmin: builder.mutation({
      query: (payload) => ({
        url: "admin/user/deactivate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designer"],
    }),
    submitDesigneImage: builder.mutation({
      query: (payload) => ({
        url: "designupload/design/image",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["designer"],
    }),
  }),
});
export const {
  useDesignerListMutation,
  useSubmitDesignerMutation,
  useDesignerByIdQuery,
  useDeleteDesignerMutation,
  useGetDesignerPermissionListQuery,
  useStaffApprovalBySuperAdminMutation,
  useManageStaffSessionByAdminMutation,
  useDesignerDropDownListQuery,
  useSubmitDesigneImageMutation
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
    clientDropDownList: builder.query({
      query: () => ({
        url: `client/drop/down/list`,
        method: "GET",
      }),
      providesTags: ["client"],
    }),
    saveCartItem: builder.mutation({
      query: (payload) => ({
        url: "client/cart/save",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["client"],
    }),
    clientOrderById: builder.query({
      query: (payload) => ({
        url: (payload?.role === 'Super Admin' || payload?.role === 'SalesPerson' || payload?.role === 'Admin') ? `client/design/edit/byId/${payload?.id}` : `client/my/design/byId/${payload?.id}`,
        method: "GET",
      }),
      providesTags: ["client"],
    }),
    clientOrderByIdV2: builder.query({
      query: (id) => ({
        url: `client/order/detail/${id}`,
        method: "GET",
      }),
      providesTags: ["client"],
    }),
    approveOrder: builder.mutation({
      query: (payload) => ({
        url: "client/edit/status",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["client"],
    }),
    approveClient: builder.mutation({
      query: (payload) => ({
        url: "client/order/approved/reject",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["client"],
    }),
  }),
});
export const {
 useClientListMutation,
 useSubmitClientMutation,
 useClientByIdQuery,
 useDeleteClientMutation,
 useClientDropDownListQuery,
 useSaveCartItemMutation,
 useClientOrderByIdQuery,
 useClientOrderByIdV2Query,
 useApproveOrderMutation,
 useApproveClientMutation
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


export const clientBagApi = createApi({
  tagTypes: ["clientBag"],
  reducerPath: "clientBagApi",
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
    clientBagListByAdmin: builder.mutation({
      query: (payload) => ({
        url: "admin/client/cart/data",
        method: "POST",
        body: payload,
      }),
      providesTags: ["clientBag"],
    }),
    myBagList: builder.mutation({
      query: (payload) => ({
        url: "client/my/design",
        method: "POST",
        body: payload,
      }),
      providesTags: ["clientBag"],
    }),
    addToBagByClient: builder.mutation({
      query: (payload) => ({
        url: "client/add/cart",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["clientBag"],
    }),
    getBagNotification: builder.query({
      query: () => ({
        url: `admin/notication/count`,
        method: "GET",
      }),
      providesTags: ["clientBag"],
    }),
    myBagCounting: builder.query({
      query: () => ({
        url: `admin/notication/count`,
        method: "GET",
      }),
      providesTags: ["clientBag"],
    }),
    myAllOrders: builder.mutation({
      query: (payload) => ({
        url: "client/my/design",
        method: "POST",
        body: payload,
      }),
      providesTags: ["clientBag"],
    }),
    notificationRead: builder.mutation({
      query: (payload) => ({
        url: "admin/read/notification",
        method: "POST",
        body: payload,
      }),
      providesTags: ["clientBag"],
    }),
    clientEditById: builder.query({
      query: (id) => ({
        url: `client/design/edit/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["clientBag"],
    }),
    orderUpdateByMarketer: builder.mutation({
      query: (payload) => ({
        url: "client/order/update/marketer",
        method: "POST",
        body: payload,
      }),
      providesTags: ["clientBag"],
    }),
    requestOrderList: builder.mutation({
      query: (payload) => ({
        url: "client/order/edit/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["clientBag"],
    }),
  }),
});
export const {
 useClientBagListByAdminMutation,
 useGetBagNotificationQuery,
 useAddToBagByClientMutation,
 useMyBagListMutation,
 useMyBagCountingQuery,
 useMyAllOrdersMutation,
 useNotificationReadMutation,
 useClientEditByIdQuery,
 useOrderUpdateByMarketerMutation,
 useRequestOrderListMutation
} = clientBagApi;



export const salesPersonApi = createApi({
  tagTypes: ["salesPerson"],
  reducerPath: "salesPersonApi",
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
    salesPersonList: builder.mutation({
      query: (payload) => ({
        url: "market/salesperson/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["salesPerson"],
    }),
    submitSalesPerson: builder.mutation({
      query: (payload) => ({
        url: "market/salesperson/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["salesPerson"],
    }),
    salesPersonById: builder.query({
      query: (id) => ({
        url: `market/salesperson/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["salesPerson"],
    }),
    deleteSalesPerson: builder.mutation({
      query: (id) => ({
        url: `market/salesperson/byId/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["salesPerson"],
    }),
    getSalesPermissionList: builder.query({
      query: (id) => ({
        url: `market/salesperson/permission/list`,
        method: "GET",
      }),
      providesTags: ["salesPerson"],
    }),
    salesPersonDropDown: builder.query({
      query: () => ({
        url: `market/salesperson/drop/down/list`,
        method: "GET",
      }),
      providesTags: ["salesPerson"],
    }),
  }),
});
export const {
  useSalesPersonListMutation,
  useSalesPersonByIdQuery,
  useSubmitSalesPersonMutation,
  useDeleteSalesPersonMutation,
  useGetSalesPermissionListQuery,
  useSalesPersonDropDownQuery
} = salesPersonApi;


export const driveApi = createApi({
  tagTypes: ["drive"],
  reducerPath: "driveApi",
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
    driveList: builder.mutation({
      query: (payload) => ({
        url: "market/drive/list",
        method: "POST",
        body: payload,
      }),
      providesTags: ["drive"],
    }),
    driveById: builder.query({
      query: (id) => ({
        url: `market/drive/byId/${id}`,
        method: "GET",
      }),
      providesTags: ["drive"],
    }),
    createDrive: builder.mutation({
      query: (payload) => ({
        url: "market/drive/create",
        method: "POST",
        body: payload,
      }),
      providesTags: ["drive"],
    }),
    uploadCreateDrive: builder.mutation({
      query: (payload) => ({
        url: "market/drive/upload/create",
        method: "POST",
        body: payload,
      }),
      providesTags: ["drive"],
    }),
    deleteDrive: builder.mutation({
      query: (id) => ({
        url: `market/drive/delete`,
        method: "POST",
        body: {id},
      }),
      invalidatesTags: ["drive"],
    }),
    editDrive: builder.mutation({
      query: (payload) => ({
        url: `market/drive/edit`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["drive"],
    }),
  }),
});
export const {
  useDriveListMutation,
  useDriveByIdQuery,
  useCreateDriveMutation,
  useUploadCreateDriveMutation,
  useDeleteDriveMutation,
  useEditDriveMutation
} = driveApi;