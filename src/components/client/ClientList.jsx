import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, SessionDropDown, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate,Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useClientListMutation, useDeleteClientMutation, useManageStaffSessionByAdminMutation, useSuperAdminLoginAsClientMutation } from "../../service";
import { getDesigner } from "../../redux/designerSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import { getClient } from "../../redux/clientSlice";
import ClientView from "./ClientView";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Edit, MoreVertical, Trash,Eye, Key } from "react-feather";
import Cookies from "universal-cookie";
import { setUserInfo, setUserToken } from "../../redux/authSlice";
import ChangePassowardModal from "../common/ChangePassowardModal";
const cookies = new Cookies();


function ClientList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const [reqClient,resClient] = useClientListMutation()
  const [reqDelete, resDelete] = useDeleteClientMutation();
  const designerList = useSelector((state) => state?.clientState.clientList)
  console.log('designerList',designerList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [modal, setModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [loginAsAdminReq, loginAsAdminRes] = useSuperAdminLoginAsClientMutation();
  const [reqManageSession, resManageSession] = useManageStaffSessionByAdminMutation();
  const [sessionsArr, setSessionsArr] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [adminId, setAdminId] = useState(null);

  const [pwdUser, setPwdUser] = useState(null);
  const [pwdText,setPwdText] = useState(null)

  useEffect(() => {
    reqClient({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resClient?.isSuccess) {
      dispatch(getClient(resClient?.data?.data?.docs));
      const recommended = resClient?.data?.data?.docs?.map((el) => ({
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
  }, [resClient]);

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/client-form", {
      state: {
        clientID: st?.row?.original?._id,
        isEdit:true
      },
    });
  };

  const onViewAction = (e, st) => {
    e.preventDefault();
    setModal(true)
    setViewData(st?.row?.original)
  };

  const handleDelete = (e, st) => {
    e.preventDefault();
    console.log("sssss", st?.row?.original);
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
      reqClient({
        page: 0,
        limit: 0,
        search: "",
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

  const loginAsClientBySuperAdmin = (e,adminId,aId) => {
    e.preventDefault();
    setAdminId(aId);
    loginAsAdminReq({
      clientId: adminId
    })
  }

  useEffect(() => {
    if(loginAsAdminRes?.isSuccess && loginAsAdminRes?.data?.data){
      console.log('loginAs',loginAsAdminRes?.data);
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
    console.log("st?.row?.original", st?.row?.original);
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
        } Client`,
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
        !userInfo?.asAdminFlag ?
        <div>
          <Link to="" onClick={(e) => loginAsClientBySuperAdmin(e,row?.row?.original?._id,userInfo?._id)}>{row?.row?.original?.name}</Link>
        </div>
         :
         <div>
         <span>{row?.row?.original?.name}</span>
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
      Cell: (row) => (
        ((userInfo?.role === 'Super Admin') || userInfo?.permissions?.some(el => el === "Client View" || el === "Client Edit" || el === "Client Delete")) ?
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
                                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Client View")) &&
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onViewAction(e,row)}
                                  >
                                    <Eye className="me-50" size={15} />{" "}
                                    <span className="align-middle">View</span>
                                  </DropdownItem>
                                }
                                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Client Edit")) &&

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onEditAction(e,row)}
                                  >
                                    <Edit className="me-50" size={15} />{" "}
                                    <span className="align-middle">Edit</span>
                                  </DropdownItem>
                                }
                                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Client Delete")) &&

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => handleDelete(e,row)}
                                  >
                                    <Trash className="me-50" size={15} />{" "}
                                    <span className="align-middle">Delete</span>
                                  </DropdownItem>
                                }
                                {(userInfo?.role === "Super Admin" &&
                                    <DropdownItem href="#!" onClick={(e) => onChangePWDAction(e, row)}>
                                    <Key className="me-50" size={15} />{" "}
                                    <span className="align-middle">Change Password</span>
                                    </DropdownItem>
                                    )}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                              :"No Permissions"
      
        
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
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Client</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Client</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
              {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Client Create")) &&

                <div className="position-relative">
                  <div className="modal-button modal-button-s mt-2">
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light mb-4 me-2"
                      data-bs-toggle="modal"
                      data-bs-target=".add-new-order"
                      onClick={() => navigate('/client-form')}
                    >
                      <i className="mdi mdi-plus me-1"></i> Create Client
                    </button>
                  </div>
                </div>
              }
                  <DataTable data={designerList} columns={(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el => el === 'Staff Active/Deactive')) ? columns : columns?.filter(el => el?.accessor  !== "session")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ClientView
      modal={modal}
      setModal={setModal}
      viewData={viewData}
    />
    <VerifyDeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalDetails={modalDetails}
        confirmAction={reqDelete}
      />
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

export default ClientList;
