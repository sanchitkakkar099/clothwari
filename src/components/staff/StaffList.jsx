import React, { useEffect, useState } from "react";
import {
  DateSearchFilter,
  DropdownFilter,
  SessionDropDown,
  TextSearchFilter,
} from "../common/Filter";
import DataTable from "../common/DataTable";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteDesignerMutation,
  useDesignerListMutation,
  useLoginAsAdminMutation,
  useManageStaffSessionByAdminMutation,
} from "../../service";
import { getDesigner } from "../../redux/designerSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import Cookies from "universal-cookie";
import { setUserInfo, setUserToken } from "../../redux/authSlice";
import StaffView from "./StaffView";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit, Eye, Key, MoreVertical, Trash } from "react-feather";
import ChangePassowardModal from "../common/ChangePassowardModal";
const cookies = new Cookies();

function StaffList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqDesigner, resDesigner] = useDesignerListMutation();
  const [reqDelete, resDelete] = useDeleteDesignerMutation();
  const [loginAsAdminReq, loginAsAdminRes] = useLoginAsAdminMutation();
  const [reqManageSession, resManageSession] =
    useManageStaffSessionByAdminMutation();

  const designerList = useSelector(
    (state) => state?.designerState.designerList
  );
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [modal, setModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [sessionsArr, setSessionsArr] = useState([]);

  const [pwdUser, setPwdUser] = useState(null);
  const [pwdText,setPwdText] = useState(null)

  useEffect(() => {
    reqDesigner({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resDesigner?.isSuccess) {
      const filterRes =
        resDesigner?.data?.data?.docs &&
        Array.isArray(resDesigner?.data?.data?.docs) &&
        resDesigner?.data?.data?.docs?.length > 0
          ? resDesigner?.data?.data?.docs?.map((el) => ({
              ...el,
              permissions: el?.permissions?.map((pm) => ({ label: pm?.label })),
            }))
          : [];

      const recommended = filterRes?.map((el) => ({
        userId: el?._id,
        isDel: el?.isDel,
      }));
      if (
        recommended?.flat()?.filter((el) => el !== undefined) &&
        Array.isArray(recommended?.flat()?.filter((el) => el !== undefined)) &&
        recommended?.flat()?.filter((el) => el !== undefined)?.length > 0
      ) {
        setSessionsArr(recommended?.flat()?.filter((el) => el !== undefined));
      }
      dispatch(getDesigner(filterRes));
    }
  }, [resDesigner]);

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/staff-form", {
      state: {
        designerID: st?.row?.original?._id,
        isEdit: true,
      },
    });
  };

  const onViewAction = (e, st) => {
    e.preventDefault();
    setModal(true);
    setViewData(st?.row?.original);
  };

  const handleDelete = (e, st) => {
    e.preventDefault();
    setModalDetails({
      title: st?.row?.original?.name,
      id: st?.row?.original?._id,
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (resDelete?.isSuccess) {
      toast.success(resDelete?.data?.message, {
        position: "top-center",
      });
      reqDesigner({
        page: 0,
        limit: 0,
        search: "",
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

  const loginAsStaff = (e, staffId, aId) => {
    e.preventDefault();
    setAdminId(aId);
    loginAsAdminReq({
      designerById: staffId,
    });
  };

  useEffect(() => {
    if (loginAsAdminRes?.isSuccess && loginAsAdminRes?.data?.data) {
      cookies.set("clothwari", loginAsAdminRes?.data?.data?.token, {
        path: "/",
      });
      cookies.set(
        "clothwari_user",
        { ...loginAsAdminRes?.data?.data, adminId: adminId, asAdminFlag: true },
        { path: "/" }
      );
      dispatch(setUserToken(loginAsAdminRes?.data?.data?.token));
      dispatch(
        setUserInfo({
          ...loginAsAdminRes?.data?.data,
          adminId: adminId,
          asAdminFlag: true,
        })
      );
      navigate("/dashboard");
    }
  }, [loginAsAdminRes]);

  const handleActiveInactive = (e, st) => {
    e.preventDefault();
    if (sessionsArr?.some((el) => el?.userId === st?.row?.original?._id)) {
      const sessionsFilter = sessionsArr?.map((el) =>
        el?.userId === st?.row?.original?._id
          ? { ...el, isDel: el?.isDel ? false : true }
          : { ...el }
      );
      setSessionsArr(sessionsFilter);
      setSelectedStaff({
        userId: st?.row?.original?._id,
        isDel: sessionsFilter?.some((ws) => ws?.userId === st?.row?.original?._id && ws?.isDel)
      });
      reqManageSession({
        userId: st?.row?.original?._id,
        isDel: sessionsFilter?.some((ws) => ws?.userId === st?.row?.original?._id && ws?.isDel)
      });
    }else{
      reqManageSession({
        userId: st?.row?.original?._id,
        isDel: st?.row?.original?.isDel ? false : true,
      });
    }
  };

  useEffect(() => {
    if (resManageSession?.isSuccess) {
      toast.success(
        `Successfully ${
          selectedStaff?.isDel ? "Deactivate" : "Activate"
        } Designer`,
        {
          position: "top-center",
        }
      );
      // reqDesigner({
      //   page: 0,
      //   limit: 0,
      //   search: "",
      // });
      setSelectedStaff(null);
    }
  }, [resManageSession]);


  const onChangePWDAction = (e, st) => {
    e.preventDefault();
    setPwdUser(st?.row?.original)
  }

  const onChangePWDCloseAction = (e) => {
    e.preventDefault();
    setPwdUser(null)
    setPwdText(null)
  }

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      Filter: TextSearchFilter,
      filter: "rankedMatchSorter",
      Cell: (row) =>
        ((userInfo?.role === 'Super Admin')) ? (
          <div>
            <Link
              to=""
              onClick={(e) =>
                loginAsStaff(e, row?.row?.original?._id, userInfo?._id)
              }
            >
              {row?.row?.original?.name}
            </Link>
          </div>
        ) : (
          <div>
            <span>{row?.row?.original?.name}</span>
          </div>
        ),
    },
    {
      Header: "Email",
      accessor: "email",
      Filter: TextSearchFilter,
    },
    {
      Header: "Permissions",
      accessor: "permissions",
      Filter: TextSearchFilter,
      filter: (rows, columnIds, filterValue) => {
        return rows.filter(row => {
          if (row?.original?.permissions && Array.isArray(row?.original?.permissions)) {
            return row?.original?.permissions?.some(permission => permission?.label?.toLowerCase()?.includes(filterValue?.toLowerCase()));
          } else {
            return false;
          }
        });
      },
      Cell: ({ row }) =>
        row?.original?.permissions &&
        Array.isArray(row?.original?.permissions) &&
        row?.original?.permissions?.length > 0 ? (
          <li className="list-group-item">
            {row?.original?.permissions?.map((el) => el?.label)?.join(", ")}
          </li>
        ) : (
          "No Permissions"
        ),
    },
    {
      Header: "Session",
      accessor: "isDel",
      Filter: SessionDropDown,
      Cell: (row) =>
        userInfo?.role === "Super Admin" || userInfo?.role === "Admin" ? (
          <Button
            color="primary"
            style={{
              background: sessionsArr?.some(
                (ws) => ws?.userId === row?.row?.original?._id && ws?.isDel
              )
                ? "#FF6666"
                : "#0080FF",
              color: "#fff",
            }}
            className="btn"
            onClick={(e) => handleActiveInactive(e, row)}
          >
            {sessionsArr?.some(
              (ws) => ws?.userId === row?.row?.original?._id && ws?.isDel
            )
              ? "In-Active"
              : "Active"}
          </Button>
        ) : (
          "No Permission"
        ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) =>
        userInfo?.role === "Super Admin" ||
        userInfo?.permissions?.some(
          (el) =>
            el === "Staff View" || el === "Staff Edit" || el === "Staff Delete"
        ) ? (
          <UncontrolledDropdown>
            <DropdownToggle
              className="icon-btn hide-arrow moreOption"
              color="transparent"
              size="sm"
              caret
            >
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu>
              {(userInfo?.role === "Super Admin" ||
                userInfo?.permissions?.includes("Staff View")) && (
                <DropdownItem href="#!" onClick={(e) => onViewAction(e, row)}>
                  <Eye className="me-50" size={15} />{" "}
                  <span className="align-middle">View</span>
                </DropdownItem>
              )}
              {(userInfo?.role === "Super Admin" ||
                userInfo?.permissions?.includes("Staff Edit")) && (
                <DropdownItem href="#!" onClick={(e) => onEditAction(e, row)}>
                  <Edit className="me-50" size={15} />{" "}
                  <span className="align-middle">Edit</span>
                </DropdownItem>
              )}
              {(userInfo?.role === "Super Admin" ||
                userInfo?.permissions?.includes("Staff Delete")) && (
                <DropdownItem href="#!" onClick={(e) => handleDelete(e, row)}>
                  <Trash className="me-50" size={15} />{" "}
                  <span className="align-middle">Delete</span>
                </DropdownItem>
              )}
              {(userInfo?.role === "Super Admin" &&
              <DropdownItem href="#!" onClick={(e) => onChangePWDAction(e, row)}>
              <Key className="me-50" size={15} />{" "}
              <span className="align-middle">Change Password</span>
              </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          "No Action Permission"
        ),
    },
  ];
  // <div>
  //         <button onClick={(e) => onViewAction(e,row)}>View</button>
  //         <button onClick={(e) => onEditAction(e,row)} className='ms-2'>Edit</button>
  //         <button onClick={(e) => handleDelete(e,row)} className='ms-2'>Delete</button>
  //       </div>
  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin') ?
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Staff</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">Staff</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {(userInfo?.role === "Super Admin" ||
                    userInfo?.permissions?.includes("Staff Create")) && (
                    <div className="position-relative">
                      <div className="modal-button modal-button-s mt-2">
                        <button
                          type="button"
                          className="btn btn-success waves-effect waves-light mb-4 me-2"
                          data-bs-toggle="modal"
                          data-bs-target=".add-new-order"
                          onClick={() => navigate("/staff-form")}
                        >
                          <i className="mdi mdi-plus me-1"></i> Create Staff
                        </button>
                      </div>
                    </div>
                  )}
                  {/* <div id="table-ecommerce-orders"></div> */}
                  {/* {Array.isArray(designList) && designList?.length > 0 && ( */}
                  <DataTable data={designerList} columns={(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el => el === 'Staff Active/Deactive')) ? columns : columns?.filter(el => el?.accessor  !== "session")} />
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StaffView modal={modal} setModal={setModal} viewData={viewData} />
      <VerifyDeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalDetails={modalDetails}
        confirmAction={reqDelete}
      />
    </>
    :
    <Navigate to={"/dashboard"}/>
    }
    <ChangePassowardModal
      pwdUser={pwdUser}
      onChangePWDCloseAction={onChangePWDCloseAction}
      setPwdUser={setPwdUser}
      pwdText={pwdText}
      setPwdText={setPwdText}
    />
    </>
  );
}

export default StaffList;
