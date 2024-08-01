import { lazy } from "react";
import DriveForm from "../components/drive/DriveForm";
import DesignImageForm from "../components/uploadDesign/DesignImageForm";
import OrderDetials from "../components/client/OrderDetials";

const LoginComponent = lazy(() => import("../components/auth/login"));
const Dashboard = lazy(() => import("../components/dashboard"));
const UploadDesignListV1 = lazy(() => import("../components/uploadDesign/UploadDesignListV1"));
const UploadDesignListV2 = lazy(() => import("../components/uploadDesign/UploadDesignListV2"));
const UploadDesignForm = lazy(() => import("../components/uploadDesign/UploadDesignForm"));
const StaffForm = lazy(() => import("../components/staff/StaffForm"));
const StaffList = lazy(() => import("../components/staff/StaffList"));
const CategoryList = lazy(() => import("../components/designCategory/CategoryList"));
const CategoryForm = lazy(() => import("../components/designCategory/CategoryForm"));
const TagList = lazy(() => import("../components/tag/TagList"));
const TagForm = lazy(() => import("../components/tag/TagForm"));
const ClientList = lazy(() => import("../components/client/ClientList"));
const ClientForm = lazy(() => import("../components/client/ClientForm"));
const ClientViewDesign = lazy(() => import("../components/client/ClientViewDesign"));
const TimeElapsedApp = lazy(() => import("../components/TimeElapsed"));
const AdmintList = lazy(() => import("../components/admin/AdminList"));
const AdminForm = lazy(() => import("../components/admin/AdminForm"));
const AdminView = lazy(() => import("../components/admin/AdminView"));
const UploadDesignMultipleForm = lazy(() => import("../components/uploadDesign/UploadDesignMultipleForm"));
const ColorVariationForm = lazy(() => import("../components/colorVariation/ColorVariationForm"));
const ColorVariationList = lazy(() => import("../components/colorVariation/ColorVariationList"));
const StaffApprovalList = lazy(() => import("../components/staff/StaffApprovalList"));
const ProductView = lazy(() => import("../components/uploadDesign/ProductView"));
const DesignApprovalList = lazy(() => import("../components/uploadDesign/DesignApprovalList"));
const DesignApprovalForm = lazy(() => import("../components/uploadDesign/DesignApprovalForm"));

const ChangePassword = lazy(() => import("../components/auth/changePassword"));
const ClientBagItem = lazy(() => import("../components/client/BagItem"));
const ClientCart = lazy(() => import("../components/client/ClientCart"));
const ViewOrders = lazy(() => import("../components/client/ViewOrders"));
const ViewMyOrders = lazy(() => import("../components/client/ViewMyOrders"));
const OrdersApprovalList = lazy(() => import("../components/admin/OrderApprovalList"));
const DesignVariationList = lazy(() => import("../components/client/DesignVariationList"));
const PDFDesign = lazy(() => import("../components/common/PDFDesign"));
const SalesPersonList = lazy(() => import("../components/sales-person/SalesPersonList"));
const SalesPersonForm = lazy(() => import("../components/sales-person/SalesPersonForm"));
const DriveList = lazy(() => import("../components/drive/DriveList"));
const SalesPersonViewDesign = lazy(() => import("../components/sales-person/SalePersonViewDesing"));
const ReportList = lazy(()=>import("../components/report/ReportList"))

const Domatic = lazy(()=> import("../components/mocks/domastic"));
const International = lazy(()=> import("../components/mocks/international"))


export const privateRoutes = [
  { path: "/dashboard", Component: Dashboard },

  { path: "/admin-list", Component: AdmintList },
  { path: "/admin-form", Component: AdminForm },
  { path: "/admin-view", Component: AdminView },

  { path: "/design-list-v1", Component: UploadDesignListV1 },
  { path: "/design-list-v2", Component: UploadDesignListV2 },
  { path: "/upload-design-form", Component: UploadDesignForm },
  { path: "/upload-design-image", Component: DesignImageForm },
  { path: "/upload-multiple-design-form", Component: UploadDesignMultipleForm },
  { path: "/product-view/:id", Component: ProductView },
  { path: "/design-approval-list", Component: DesignApprovalList },
  { path: "/design-approval-form", Component: DesignApprovalForm },


  { path: "/staff-form", Component: StaffForm },
  { path: "/staff-list", Component: StaffList },
  { path: "/staff-approval", Component: StaffApprovalList },

  { path: "/sales-person-form", Component: SalesPersonForm },
  { path: "/sales-person-list", Component: SalesPersonList },
  { path: "/pdf-maker-view-design", Component: SalesPersonViewDesign },


  { path: "/category-list", Component: CategoryList },
  { path: "/category-form", Component: CategoryForm },
  { path: "/tag-list", Component: TagList },
  { path: "/tag-form", Component: TagForm },
  { path: "/client-list", Component: ClientList },
  { path: "/client-form", Component: ClientForm },
  { path: "/client-view-design", Component: ClientViewDesign },
  { path: "/order-details/:id", Component: OrderDetials },
  { path: "/view-bag", Component: ClientBagItem },
  { path: "/cart-item", Component: ClientCart },
  { path: "/view-orders", Component: ViewOrders },
  { path: "/view-my-orders", Component: ViewMyOrders },
  { path: "/view-orders-request", Component: OrdersApprovalList },
  { path: "/design-selection", Component: DesignVariationList },

  { path: "/color-variation-list", Component: ColorVariationList },
  { path: "/color-variation-form", Component: ColorVariationForm },

  { path: "/pdf-item", Component: PDFDesign },

  { path: "/drive-list", Component: DriveList },
  { path: "/pdf-upload-form", Component: DriveForm },

  { path: "/report-list", Component: ReportList},

  { path: "/view-mocks-domestic", Component: Domatic},
  { path: "/view-mocks-international", Component: International}


];

export const publicRoutes = [
  { path: "/login", Component: LoginComponent },
  { path: "/time", Component: TimeElapsedApp },
  { path: "/change-password", Component: ChangePassword },
]
