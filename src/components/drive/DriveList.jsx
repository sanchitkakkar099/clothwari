import React, { useEffect, useState } from "react";
import {
  DateSearchFilter,
  DropdownFilter,
  TextSearchFilter,
} from "../common/Filter";
import DataTable from "../common/DataTable";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteDriveMutation,
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
import { Download, Edit, Eye, Key, MoreVertical, Trash, Share2 } from "react-feather";
import ChangePassowardModal from "../common/ChangePassowardModal";
import { getSalesPerson } from "../../redux/salesPersonSlice";
import { getCurrentPage, getDrive } from "../../redux/driveSlice";
import PDFICON from "../../assets/images/pdf_icon.svg";
import Pagination from "../common/Pagination";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; 
const cookies = new Cookies();
dayjs.extend(utc);

function DriveList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const latestCurrentPage = useSelector((state) => state?.driveState?.currentPage);
  const [reqDrive, resDrive] = useDriveListMutation();
  const [reqDelete, resDelete] = useDeleteDriveMutation();


  const driveList = useSelector(
    (state) => state?.driveState.driveList
  );
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [modal, setModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const [sessionsArr, setSessionsArr] = useState([]);

  const [pwdUser, setPwdUser] = useState(null);
  const [pwdText,setPwdText] = useState(null)

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(latestCurrentPage)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)


  const [filterName, setFilterName] = useState('');
  const [filterUploadedBy, setFilterUploadedBy] = useState('');

  useEffect(() => {
    if(filterName || filterUploadedBy){
      reqDrive({
        page: currentPage,
        limit: pageSize,
        pdfName: filterName,
        uploadedBy: filterUploadedBy,
      });
    } else{
      reqDrive({
        page:currentPage,
        limit: pageSize,
        pdfName: "",
        uploadedBy: "",
      });
    }
  }, [currentPage, filterName,filterUploadedBy]);

  useEffect(() => {
    if(location?.state?.currentPage){
      setCurrentPage(location?.state?.currentPage)
    }
  },[location])


  useEffect(() => {
    if (resDrive?.isSuccess) {
      dispatch(getDrive(resDrive?.data?.data?.docs));
      setTBLData(resDrive?.data?.data?.docs)
      setTotalCount(resDrive?.data?.data?.total)
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

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/pdf-upload-form", {
      state: {
        data: st,
        isEdit:true,
        currentPage:currentPage
      },
    });
  };

  const onEditPDFMockAction = (e, st) =>{
    e.preventDefault();
    console.log("st",st);
    if(st?.typeOfPdf === 'Domestic'){
      navigate("/view-mocks-domestic", {
        state: {
          _id: st?._id,
          isEdit:true,
        } 
      });
    }else if(st?.typeOfPdf === 'International'){
      navigate("/view-mocks-international", {
        state: {
          _id: st?._id,
          isEdit:true,
        }
      })
    }  
    else{
      navigate("/pdf-upload-form", {
        state: {
          data: st,
          isEdit:true,
          currentPage:currentPage
        },
      });
    }
  }

  const handleDelete = (e, st) => {
    e.preventDefault();
    setModalDetails({
      title: st?.pdfName,
      id: st?._id,
    });
    setShowModal(true);
  };

  const handleCopy = async (e, ele) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = ele?.pdfurl;
      textArea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge
      textArea.style.opacity = "0";  // Hide the element
      textArea.style.pointerEvents = "none";  // Prevent interaction
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success("Link copied", {
          position: "top-center",
        });
      } else {
        throw new Error("Copy command was unsuccessful");
      }
  
      document.body.removeChild(textArea);
    } catch (err) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
      console.error("Clipboard copy error:", err);
    }
  };

  useEffect(() => {
    if (resDelete?.isSuccess) {
      toast.success(resDelete?.data?.message, {
        position: "top-center",
      });
      reqDrive({
        page: currentPage,
        limit: pageSize,
        pdfName: "",
        uploadedBy: "",
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

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
                    userInfo?.permissions?.includes("Drive") || (userInfo?.role === "SalesPerson" && userInfo?.permissions?.includes("Upload PDF"))) && (
                    <div className="position-relative">
                      <div className="modal-button modal-button-s mt-2">
                        <button
                          type="button"
                          className="btn btn-success waves-effect waves-light mb-4 me-2"
                          data-bs-toggle="modal"
                          data-bs-target=".add-new-order"
                          onClick={() => navigate("/pdf-upload-form")}
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
                        <th>Created At</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td></td>
                        <td><input type="text" value={filterName} onChange={(e) => handleNameFilter(e)}/> </td>
                        <td><input type="text" value={filterUploadedBy} onChange={(e) => handleUploadedByFilter(e)}/></td>
                        <td>MM/DD/YYYY</td>
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
                          <td>{ele?.createdAt ? dayjs.utc(ele?.createdAt).format("MM/DD/YYYY") : ""}</td>
                          <td>
                          {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Client' || userInfo?.permissions?.some(el => el === "Drive") || (userInfo?.role === "SalesPerson" && userInfo?.permissions?.includes("Download PDF")))  ?
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
                                {userInfo?.role === 'Super Admin' &&
                                <DropdownItem
                                    href="#!"
                                    onClick={(e) => onEditAction(e,ele)}
                                  >
                                    <Edit className="me-50" size={15} />{" "}
                                    <span className="align-middle">Edit</span>
                                  </DropdownItem>
                                }
                                {userInfo?.role === 'Super Admin' &&
                                <DropdownItem
                                    href="#!"
                                    onClick={(e) => onEditPDFMockAction(e,ele)}
                                  >
                                    <Edit className="me-50" size={15} />{" "}
                                    <span className="align-middle">Edit Mock</span>
                                  </DropdownItem>
                                }
                                {userInfo?.role === 'Super Admin' &&
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => handleDelete(e,ele)}
                                  >
                                    <Trash className="me-50" size={15} />{" "}
                                    <span className="align-middle">Delete</span>
                                  </DropdownItem>
                                }
                              
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => pdfDownload(e,ele)}
                                  >
                                    <Download className="me-50" size={15} />{" "}
                                    <span className="align-middle">Download</span>
                                  </DropdownItem>

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => handleCopy(e,ele)}
                                  >
                                    <Share2 className="me-50" size={15} />{" "}
                                    <span className="align-middle">Share</span>
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
                    onPageChange={(page) => {
                      dispatch(getCurrentPage(page))
                      setCurrentPage(page)}}
                    TBLData={TBLData}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
}

export default DriveList;
