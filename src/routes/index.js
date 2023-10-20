import { lazy } from "react";

import LoginComponent from "../components/auth/login";
import Dashboard from "../components/dashboard";
import DesignList from "../components/design/designList";
import DesignListV2 from "../components/design/designListV2";
import UploadDesign from "../components/design/uploadDesign";
import AddDesigner from "../components/designer/addDesigner";
import DesignerList from "../components/designer/designerList";




export const privateRoutes = [
  { path: "/dashboard", Component: Dashboard },
  { path: "/design-list-v1", Component: DesignList },
  { path: "/design-list-v2", Component: DesignListV2 },
  { path: "/upload-design", Component: UploadDesign },
  { path: "/designer-list", Component: DesignerList },
  { path: "/add-designer", Component: AddDesigner },


  // { path: "/course-list", Component: CourseList },
  // { path: "/course-form", Component: CourseForm },
  // { path: "/course-view/:id", Component: CourseView },
  // { path: "/category-list", Component: CategoryList },
  // { path: "/category-form", Component: CategoryForm },
  // { path: "/category-view/:id", Component: CategoryView },
  // { path: "/batch-list", Component: BatchList },
  // { path: "/batch-form", Component: BatchForm },
  // { path: "/batch-view/:id", Component: BatchView },
  // { path: "/center-list", Component: CenterList },
  // { path: "/center-form", Component: CenterForm },
  // { path: "/center-view/:id", Component: CenterView },
  // { path: "/enquiry-list", Component: EnquiryList },
  // { path: "/enquiry-form", Component: EnquiryForm },
  // { path: "/enquiry-view/:id", Component: EnquiryView },

  // { path: "/client-list", Component: ClientList },
  // { path: "/client-form", Component: ClientForm },
  // { path: "/client-view/:id", Component: ClientView },

  // { path: "/gallary-list", Component: GallaryList },
  // { path: "/gallary-form", Component: GallaryForm },
  // { path: "/gallary-view/:id", Component: GallaryView },

  // { path: "/testimonial-list", Component: TesttimonialList },
  // { path: "/testimonial-form", Component: TestimonialForm },
  // { path: "/testimonial-view/:id", Component: TestimonialView },

  // { path: "/drive-list", Component: DriveList },
  // { path: "/drive-form", Component: DriveForm },
  // { path: "/drive-view/:id", Component: DriveView },

  // { path: "/placed-student-list", Component: PlaceStudentList },
  // { path: "/placed-student-form", Component: PlaceStudentForm },
  // { path: "/placed-student-view/:id", Component: PlaceStudentView },

  // { path: "/student-reg-list", Component: StudentRegList },
  // { path: "/student-reg-form", Component: StudentRegForm },
  // { path: "/student-reg-view/:id", Component: StudentRegView },

  // { path: "/contactUs-list", Component: ContactUsList },
  // { path: "/contactUs-form", Component: ContactUsForm },
  // { path: "/contactUs-view/:id", Component: ContactUsView },

  // { path: "/faq-list", Component: FaqList },
  // { path: "/faq-form", Component: FaqForm },
  // { path: "/faq-view/:id", Component: FaqView },

  // { path: "/faq-category-list", Component: FaqCategoryList },
  // { path: "/faq-category-form", Component: FaqCategoryForm },
  // { path: "/faq-category-view/:id", Component: FaqCategoryView },

  // { path: "/blog-list", Component: BlogList },
  // { path: "/blog-form", Component: BlogForm },
  // { path: "/blog-view/:id", Component: BlogView },

  // { path: "/blog-category-list", Component: BlogCategoryList },
  // { path: "/blog-category-form", Component: BlogCategoryForm },
  // { path: "/blog-category-view/:id", Component: BlogCategoryView },

  // { path: "/certificate-req-list", Component: CertificateList },
  // { path: "/certificate-req-form", Component: CertificateForm },
  // { path: "/certificate-req-view/:id", Component: CertificateView },

  // { path: "/aboutUs-form", Component: AboutUsForm },
  // { path: "/privacy-policy", Component: PrivacyPolicyForm },
  // { path: "/refund-policy", Component: RefundPolicyForm },
  // { path: "/term-condition", Component: TermConditionForm },

  // { path: "/banner-list", Component: BannerList },
  // { path: "/banner-form", Component: BannerForm },
  // { path: "/banner-view/:id", Component: BannerView },


];

export const publicRoutes = [
  { path: "/login", Component: LoginComponent },
]
