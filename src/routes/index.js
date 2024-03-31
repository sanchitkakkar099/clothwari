import { lazy } from "react";

import LoginComponent from "../components/auth/login";
import Dashboard from "../components/dashboard";
import UploadDesignListV1 from "../components/uploadDesign/UploadDesignListV1";
import UploadDesignListV2 from "../components/uploadDesign/UploadDesignListV2";
import UploadDesignForm from "../components/uploadDesign/UploadDesignForm";
import StaffForm from "../components/staff/StaffForm";
import StaffList from "../components/staff/StaffList";
import CategoryList from "../components/designCategory/CategoryList";
import CategoryForm from "../components/designCategory/CategoryForm";
import TagList from "../components/tag/TagList";
import TagForm from "../components/tag/TagForm";
import ClientList from "../components/client/ClientList";
import ClientForm from "../components/client/ClientForm";
import ClientViewDesign from "../components/client/ClientViewDesign";
import TimeElapsedApp from "../components/TimeElapsed";
import AdmintList from "../components/admin/AdminList";
import AdminForm from "../components/admin/AdminForm";
import AdminView from "../components/admin/AdminView";
import UploadDesignMultipleForm from "../components/uploadDesign/UploadDesignMultipleForm";
import ColorVariationForm from "../components/colorVariation/ColorVariationForm";
import ColorVariationList from "../components/colorVariation/ColorVariationList";
import StaffApprovalList from "../components/staff/StaffApprovalList";
import ProductView from "../components/uploadDesign/ProductView";

import ChangePassword from "../components/auth/changePassword";
import ClientBagItem from "../components/client/BagItem";
import ClientCart from "../components/client/ClientCart";
import ViewOrders from "../components/client/ViewOrders";
import ViewMyOrders from "../components/client/ViewMyOrders";
import DesignVariationList from "../components/client/DesignVariationList";
import PDFDesign from "../components/common/PDFDesign";
import SalesPersonList from "../components/sales-person/SalesPersonList";
import SalesPersonForm from "../components/sales-person/SalesPersonForm";
import DriveList from "../components/drive/DriveList";
import SalesPersonViewDesign from "../components/sales-person/SalePersonViewDesing";


export const privateRoutes = [
  { path: "/dashboard", Component: Dashboard },

  { path: "/admin-list", Component: AdmintList },
  { path: "/admin-form", Component: AdminForm },
  { path: "/admin-view", Component: AdminView },

  { path: "/design-list-v1", Component: UploadDesignListV1 },
  { path: "/design-list-v2", Component: UploadDesignListV2 },
  { path: "/upload-design-form", Component: UploadDesignForm },
  { path: "/upload-multiple-design-form", Component: UploadDesignMultipleForm },
  { path: "/product-view/:id", Component: ProductView },


  { path: "/staff-form", Component: StaffForm },
  { path: "/staff-list", Component: StaffList },
  { path: "/staff-approval", Component: StaffApprovalList },

  { path: "/sales-person-form", Component: SalesPersonForm },
  { path: "/sales-person-list", Component: SalesPersonList },
  { path: "/sales-view-design", Component: SalesPersonViewDesign },


  { path: "/category-list", Component: CategoryList },
  { path: "/category-form", Component: CategoryForm },
  { path: "/tag-list", Component: TagList },
  { path: "/tag-form", Component: TagForm },
  { path: "/client-list", Component: ClientList },
  { path: "/client-form", Component: ClientForm },
  { path: "/client-view-design", Component: ClientViewDesign },
  { path: "/view-bag", Component: ClientBagItem },
  { path: "/cart-item", Component: ClientCart },
  { path: "/view-orders", Component: ViewOrders },
  { path: "/view-my-orders", Component: ViewMyOrders },
  { path: "/design-selection", Component: DesignVariationList },

  { path: "/color-variation-list", Component: ColorVariationList },
  { path: "/color-variation-form", Component: ColorVariationForm },

  { path: "/pdf-item", Component: PDFDesign },

  { path: "/drive-list", Component: DriveList },

];

export const publicRoutes = [
  { path: "/login", Component: LoginComponent },
  { path: "/time", Component: TimeElapsedApp },
  { path: "/change-password", Component: ChangePassword },
]
