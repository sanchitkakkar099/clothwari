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
import { useAdminListMutation, useManageStaffSessionByAdminMutation, useSuperAdminLoginAsLoginMutation } from "../../service";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit, MoreVertical, Eye, Key } from "react-feather";
import { getAdmin } from "../../redux/adminSlice";
import { setUserInfo, setUserToken } from "../../redux/authSlice";
import Cookies from "universal-cookie";
import ChangePassowardModal from "../common/ChangePassowardModal";
import toast from "react-hot-toast";
const cookies = new Cookies();


function AdmintList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reqAdmin, resAdmin] = useAdminListMutation();
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const adminList = useSelector((state) => state?.adminState.adminList);
  const [reqManageSession, resManageSession] = useManageStaffSessionByAdminMutation();

  const [loginAsAdminReq, loginAsAdminRes] = useSuperAdminLoginAsLoginMutation();
  const [adminId, setAdminId] = useState(null);
  const [pwdUser, setPwdUser] = useState(null);
  const [pwdText,setPwdText] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [sessionsArr, setSessionsArr] = useState([]);



  useEffect(() => {
    reqAdmin({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resAdmin?.isSuccess) {
      dispatch(getAdmin(resAdmin?.data?.data?.docs));
      const recommended = resAdmin?.data?.data?.docs?.map((el) => ({
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
    }
  }, [resAdmin]);

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/admin-form", {
      state: {
        adminID: st?.row?.original?._id,
        isEdit: true,
      },
    });
  };

  const onViewAction = (e, st) => {
    e.preventDefault();
    navigate("/admin-view", {
      state: {
        adminID: st?.row?.original?._id,
      },
    });
  };

  const loginAsAdminBySuperAdmin = (e,adminId,aId) => {
    e.preventDefault();
    setAdminId(aId);
    loginAsAdminReq({
      adminId: adminId
    })
  }

  useEffect(() => {
    if(loginAsAdminRes?.isSuccess && loginAsAdminRes?.data?.data){
      cookies.set("clothwari", loginAsAdminRes?.data?.data?.token, { path: "/" });
      cookies.set("clothwari_user", {...loginAsAdminRes?.data?.data,adminId:adminId,asAdminFlag:true}, { path: "/" });
      dispatch(setUserToken(loginAsAdminRes?.data?.data?.token))
      dispatch(setUserInfo({...loginAsAdminRes?.data?.data,adminId:adminId,asAdminFlag:true}))
      navigate('/dashboard')
    }
  },[loginAsAdminRes])

  const onChangePWDAction = (e, st) => {
    e.preventDefault();
    setPwdUser(st?.row?.original)
  }

  const onChangePWDCloseAction = (e) => {
    e.preventDefault();
    setPwdUser(null)
    setPwdText(null)
  }

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
        } Admin`,
        {
          position: "top-center",
        }
      );
      setSelectedStaff(null);
    }
  }, [resManageSession]);

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      Filter: TextSearchFilter,
      filter: "rankedMatchSorter",
      Cell: (row) => (
        <div>
          <Link to="" onClick={(e) => loginAsAdminBySuperAdmin(e,row?.row?.original?._id,userInfo?._id)}>{row?.row?.original?.name}</Link>
        </div>
      ),
    },
    {
      Header: "Email",
      accessor: "email",
      Filter: TextSearchFilter,
      filter: "rankedMatchSorter",
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
      Cell: ({row}) => (row?.original?.permissions && Array.isArray(row?.original?.permissions) && row?.original?.permissions?.length > 0) ? 
      <li className="list-group-item">{row?.original?.permissions?.map(el => el?.label)?.join(", ")}</li>
     : 'No Permissions',
    },
    {
      Header: "Zones",
      accessor: "tag",
      Filter: TextSearchFilter,
      filter: (rows, columnIds, filterValue) => {
        return rows.filter(row => {
          if (row?.original?.tag && Array.isArray(row?.original?.tag)) {
            return row?.original?.tag?.some(tg => tg?.label?.toLowerCase()?.includes(filterValue?.toLowerCase()));
          } else {
            return false;
          }
        });
      },
      Cell: ({row}) => (row?.original?.tag && Array.isArray(row?.original?.tag) && row?.original?.tag?.length > 0) ? 
      <li className="list-group-item">{row?.original?.tag?.map(el => el?.label)?.join(", ")}</li>
     : '',
    },
    {
      Header: "Session",
      accessor: "isDel",
      Filter: SessionDropDown,
      Cell: (row) =>
        userInfo?.role === "Super Admin" ? (
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
      Cell: (row) => (
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
            <DropdownItem href="#!" onClick={(e) => onViewAction(e, row)}>
              <Eye className="me-50" size={15} />{" "}
              <span className="align-middle">View</span>
            </DropdownItem>
            <DropdownItem href="#!" onClick={(e) => onEditAction(e, row)}>
              <Edit className="me-50" size={15} />{" "}
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem href="#!" onClick={(e) => onChangePWDAction(e, row)}>
              <Key className="me-50" size={15} />{" "}
              <span className="align-middle">Change Password</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];
  return (
    <>
    {(userInfo?.role === 'Super Admin') ?
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Admin</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">Admin</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="position-relative">
                    <div className="modal-button modal-button-s mt-2">
                      <button
                        type="button"
                        className="btn btn-success waves-effect waves-light mb-4 me-2"
                        data-bs-toggle="modal"
                        data-bs-target=".add-new-order"
                        onClick={() => navigate("/admin-form")}
                      >
                        <i className="mdi mdi-plus me-1"></i> Create Admin
                      </button>
                    </div>
                  </div>
                  <DataTable data={adminList} columns={columns} view="admin" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default AdmintList;
