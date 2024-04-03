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
  Pagination,
  UncontrolledDropdown,
} from "reactstrap";
import { Download, Edit, Eye, Key, MoreVertical, Trash } from "react-feather";
import ChangePassowardModal from "../common/ChangePassowardModal";
import { getSalesPerson } from "../../redux/salesPersonSlice";
import { getDrive } from "../../redux/driveSlice";
import PDFICON from "../../assets/images/pdf_icon.svg";


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

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)
  console.log('TBLData',TBLData);


  const [filterName, setFilterName] = useState('');
  const [filterUploadedBy, setFilterUploadedBy] = useState('');

  useEffect(() => {
    if(filterName || filterUploadedBy){
      reqDrive({
        page: 1,
        limit: 10,
        pdfName: filterName,
        uploadedBy: filterUploadedBy,
      });
    } else{
      reqDrive({
        page: 1,
        limit: 10,
        pdfName: "",
        uploadedBy: "",
      });
    }
  }, [filterName,filterUploadedBy]);

  useEffect(() => {
    if (resDrive?.isSuccess) {
      dispatch(getDrive(resDrive?.data?.data?.filter(el => el?.isgen)));
      setTBLData(resDrive?.data?.data?.filter(el => el?.isgen))
      setTotalCount(resDrive?.data?.data?.totalDocs)
    }
  }, [resDrive]);

  const handleNameFilter = (e) => {
    setFilterName(e.target.value)
  }

  const handleUploadedByFilter = (e) => {
    setFilterUploadedBy(e.target.value)
  }

  const pdfDownload = (e,file) =>  {
    e.preventDefault()
    const a = document.createElement('a');
    a.href = file?.pdfurl;
    a.download = `${new Date()}.pdf`;
    a.target = '_blank'
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'SalesPerson' || userInfo?.role === 'Client' || (userInfo?.role === 'Admin' && userInfo?.permissions?.includes("Drive"))) ?
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
                  {/* <DataTable data={driveList} columns={columns}/> */}
                  <table className="filter-table">
                    <thead>
                      <tr>
                        <th>PDF</th>
                        <th>Name</th>
                        <th>Uploaded By</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td></td>
                        <td><input type="text" value={filterName} onChange={(e) => handleNameFilter(e)}/> </td>
                        <td><input type="text" value={filterUploadedBy} onChange={(e) => handleUploadedByFilter(e)}/></td>
                        <td></td>

                      </tr>
                    </thead>
                    <tbody>
                    {(TBLData && Array.isArray(TBLData) && TBLData?.length > 0) ? 
                      TBLData?.map((ele) => {
                        return(
                          <tr key={ele?._id}>
                          <td><img src={PDFICON} alt="PDFICON" height={30} width={30}/></td>
                          <td>{ele?.pdfName}</td>
                          <td>{ele?.userId?.name}</td>
                          <td>
                          {((userInfo?.role === 'Super Admin' || userInfo?.role === 'Client' || userInfo?.role === 'SalesPerson') || userInfo?.permissions?.some(el => el === "Drive")) ?
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
                              

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => pdfDownload(e,ele)}
                                  >
                                    <Download className="me-50" size={15} />{" "}
                                    <span className="align-middle">Download</span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                              :'No Permission'}
                          </td>
                          </tr>
                        )
                      }):
                      <tr><td colSpan={4} className="text-center">No Data To Display</td></tr>
                    
                    }
                     
                    
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    TBLData={TBLData}
                  />
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
