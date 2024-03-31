import React, { useEffect, useState } from "react";
import {
  DateSearchFilter,
  DropdownFilter,
  TextSearchFilter,
} from "../common/Filter";
import DataTable from "../common/DataTable";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useDriveListMutation,
} from "../../service";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import Cookies from "universal-cookie";
import { setUserInfo, setUserToken } from "../../redux/authSlice";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit, Eye, Key, MoreVertical, Trash } from "react-feather";
import ChangePassowardModal from "../common/ChangePassowardModal";
import { getSalesPerson } from "../../redux/salesPersonSlice";
import { getDrive } from "../../redux/driveSlice";
const cookies = new Cookies();

function DriveList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqDrive, resDrive] = useDriveListMutation();

  const driveList = useSelector(
    (state) => state?.driveState.driveList
  );
  console.log("driveList", driveList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [modal, setModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const [sessionsArr, setSessionsArr] = useState([]);
  console.log("sessionsArr", sessionsArr);

  const [pwdUser, setPwdUser] = useState(null);
  const [pwdText,setPwdText] = useState(null)

  useEffect(() => {
    reqDrive({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resDrive?.isSuccess) {
      dispatch(getDrive(resDrive?.data?.data?.docs));
    }
  }, [resDrive]);


  const columns = [];

  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'SalesPerson' || (userInfo?.role === 'Admin' && userInfo?.permissions?.includes("Drive"))) ?
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Drive</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">Drive</li>
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
                    userInfo?.permissions?.includes("Drive")) && (
                    <div className="position-relative">
                      <div className="modal-button modal-button-s mt-2">
                        <button
                          type="button"
                          className="btn btn-success waves-effect waves-light mb-4 me-2"
                          data-bs-toggle="modal"
                          data-bs-target=".add-new-order"
                          // onClick={() => navigate("/sales-person-form")}
                        >
                          <i className="mdi mdi-plus me-1"></i> Upload Drive
                        </button>
                      </div>
                    </div>
                  )}
                  <DataTable data={driveList} columns={columns}/>
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
    </>
  );
}

export default DriveList;
