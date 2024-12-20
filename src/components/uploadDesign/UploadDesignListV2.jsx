import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate,Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteDesignUploadMutation, useDesignUploadList2Mutation, useDesignUploadListMutation, useMultipleFileUploadMutation } from "../../service";
import { getCurrentPageV2, getDesignUpload } from "../../redux/designUploadSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import { downloadFile } from "../common/FileDownload";
import UploadDesignView from "./UploadDesignView";
import { ChevronDown, ChevronUp, Download, Edit, Eye, Image, MoreVertical, Trash } from "react-feather";
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useRef } from "react";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import './dropdown-filter.css';
import UpdateDesignerModal from "./UpdateDesignerModal";

// Extend dayjs with the utc plugin
dayjs.extend(utc);

function UploadDesignListV2() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state?.authState.userInfo)
  // const [reqDesign,resDesign] = useDesignUploadListMutation()
  const [reqDesign,resDesign] = useDesignUploadList2Mutation()
  const [reqDelete, resDelete] = useDeleteDesignUploadMutation();
  const [reqFile] = useMultipleFileUploadMutation();
  const designUploadList = useSelector((state) => state?.designUploadState.designUploadList)
  const latestCurrentPage = useSelector((state) => state?.designUploadState?.currentPageV2);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalView, setModalView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [mainFiles, setMainFiles] = useState([])
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(latestCurrentPage)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  // filter
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUploadedBy, setFilterUploadedBy] = useState('');

  const [sortConfig, setSortConfig] = useState(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    if(filterName || filterCategory || filterUploadedBy || (startDate && endDate)){
      reqDesign({
        page:currentPage,
        limit:pageSize,
        name:filterName,
        category:filterCategory,
        uploadedBy:filterUploadedBy,
        start_date:(startDate && endDate) ? dayjs(startDate).format() : "",
        end_date:(startDate && endDate) ? dayjs(endDate).format() : ""
      })
    }else{
      reqDesign({
        page: currentPage,
        limit: pageSize
      });
    }
  }, [currentPage,filterName,filterCategory,filterUploadedBy,startDate,endDate]);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // const sortData = (column) => {
  //   const sorted = [...TBLData].sort((a, b) => {
  //     if (sortOrder === 'asc') {
  //       return a[column] > b[column] ? 1 : -1;
  //     } else {
  //       return a[column] < b[column] ? 1 : -1;
  //     }
  //   });
  //   setTBLData(sorted);
  // };

  
  // useEffect(() => {
  //   if (sortColumn) {
  //     sortData(sortColumn);
  //   }
  // }, [sortColumn, sortOrder]);

  // const handleSort = (column) => {
  //   if (column === sortColumn) {
  //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortColumn(column);
  //     setSortOrder('asc');
  //   }
  // };

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs)
      setTotalCount(resDesign?.data?.data?.totalDocs)
      if(sortConfig?.key && sortConfig?.direction){
        setSortConfig({ key:sortConfig?.key, direction:sortConfig?.direction });
      }
    }
  }, [resDesign]);


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!sortConfig) {
      return TBLData;
    }

    return [...TBLData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };
  useEffect(() => {
    const sortedTableData = sortedData();
    setTBLData(sortedTableData)

  },[sortConfig])


  const handleDownload = (e, st) => {
    e.preventDefault();
  };

  const onEditAction = (e, ID) => {
    e.preventDefault();
    navigate("/upload-design-form", {
      state: {
        designID: ID,
        isEdit:true
      },
    });
  };

  const onViewAction = (e, ID) => {
    e.preventDefault();
    // setModalView(true)
    // setViewData(st?.row?.original)
    navigate(`/product-view/${ID}`)
  };

  const handleDelete = (e, st) => {
    e.preventDefault();
    setModalDetails({
      title: st?.name,
      id: st?._id,
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (resDelete?.isSuccess) {
      toast.success(resDelete?.data?.message, {
        position: "top-center",
      });
      reqDesign({
        page: 0,
        limit: 0,
        search: "",
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

  const hiddenFileInput = useRef(null);
  const handleClickBulkUpload = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChangeBulkUpload = (e) => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('file', e.target.files[i])
    }
      const reqData = {
        file: formData,
        type: 1,
      };
      reqFile(reqData)
        .then((res) => {
          if (res?.data?.data) {
              navigate('/upload-multiple-design-form',{state:res?.data?.data})
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
  }

  const handleNameFilter = (e) => {
    setFilterName(e.target.value)
  }

  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value)
  }

  const handleUploadedByFilter = (e) => {
    setFilterUploadedBy(e.target.value)
  }

  const handleDateFilter = (tag, date) => {
    if(tag === "start"){
      setStartDate(date)
    }else{
      setEndDate(date)
    }
  }

  const handleDesignImage = (e, ID) => {
    e.preventDefault();
    navigate("/upload-design-image", {
      state: {
        designID: ID,
        isEdit:true
      },
    });
  };

  const [selectedDesign,setSelectedDesign] = useState([])
  const [openUploadedByChange,setOpenUploadedByChange] = useState(false)

  console.log('selectedDesign',selectedDesign);

  const handleSelectDesign = (e, id) => {
    if (e.target.checked) {
      setSelectedDesign((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedDesign((prevSelected) =>
        prevSelected.filter((designId) => designId !== id)
      );
    }
  };

  const onCloseClick = () => {
    setOpenUploadedByChange(false)
    setSelectedDesign([])
  }

  const handleCheckStatus = (status) =>{
    if(status === 'Pending'){
      return <Badge color="danger" pill>Pending</Badge>
    }else if(status === 'Approved'){
      return <Badge color="success" pill >Approved</Badge>
    }else if(status === 'Rejected'){
      return <Badge color="info" pill >Rejected</Badge>
    }
  }

  

  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin' || userInfo?.role === 'Designer') ?
    <>
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Designs</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Designs</li>
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
                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Create")) &&
                  <div className="modal-button modal-button-s mt-2">
                  {/* <button
                      type="button"
                      className="btn btn-success waves-effect waves-light mb-4 me-2"
                      onClick={() => handleClickBulkUpload()}
                    >
                      <i className="mdi mdi-plus me-1"></i> Bulk upload
                    </button>
                    <input
                      type="file"
                      accept="image/png, image/jpeg,image/jpg"
                      ref={hiddenFileInput}
                      style={{ display: "none" }} // Make the file input element invisible
                      onChange={(e) => handleChangeBulkUpload(e)}
                      multiple
                    /> */}
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light mb-4 me-2"
                      data-bs-toggle="modal"
                      data-bs-target=".add-new-order"
                      onClick={() => navigate('/upload-design-form')}
                    >
                      <i className="mdi mdi-plus me-1"></i> Upload Design
                    </button>
                  </div>
                  }
                  {(selectedDesign && Array.isArray(selectedDesign) && selectedDesign?.length > 0) &&
                  <div className="modal-button modal-button-s mt-1">
                  
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light mb-4 me-1"
                      data-bs-toggle="modal"
                      data-bs-target=".add-new-order"
                      onClick={() => setOpenUploadedByChange(true)}
                    >
                      Change Uploaded By
                    </button>
                  </div>
                  }
                  </div>
                  {/* <div className="position-relative">
                    <div className="filter-dropdown" ref={dropdownRef}>
                        <Button onClick={() => setIsOpen(!isOpen)}> <i className="mdi mdi-filter me-1"></i> Filter</Button>
                        {isOpen && (
                        <div className="filter-dropdown-content" id="dropdownContent">
                          <div className="filter-section">
                          
                            <h4>Order</h4>
                            <label className="option">
                              <input type="radio" name="section1" value="option1"/> A TO Z
                            </label>
                            <label className="option">
                              <input type="radio" name="section2" value="option2"/> Z TO A
                            </label>
                          </div>
                          
                          <div className="filter-section">
                            <h3>Columns</h3>
                            <label className="option">
                              <input type="radio" name="section4" value="option4"/> Name
                            </label>
                            <label className="option">
                              <input type="radio" name="section5" value="option5"/> Category
                            </label>
                            <label className="option">
                              <input type="radio" name="section6" value="option6"/> Uploaded By
                            </label>
                            <label className="option">
                              <input type="radio" name="section6" value="option6"/> Created At
                            </label>
                          </div>
                        </div>
                        )}
                    </div>
                  </div> */}
                  {/* <DataTable data={designUploadList} columns={columns} /> */}
                  <table className="filter-table">
                    <thead>
                      <tr>
                      {userInfo?.role === 'Super Admin' &&  <th/>}
                        <th onClick={() => handleSort('name')}>Design Name
                        {sortConfig?.key === 'name' && (
                          sortConfig?.direction === 'asc' ? <ChevronDown /> : <ChevronUp />
                        )}
                        </th>
                        <th>Category</th>
                        <th>Uploaded By</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        {userInfo?.role === 'Super Admin' && <td></td>}
                        <td><input type="text" value={filterName} onChange={(e) => handleNameFilter(e)}/></td>
                        <td><input type="text" value={filterCategory} onChange={(e) => handleCategoryFilter(e)}/></td>
                        <td><input type="text" value={filterUploadedBy} onChange={(e) => handleUploadedByFilter(e)}/></td>
                        <td style={{display:'flex'}}><ReactDatePicker 
                              selected={startDate} 
                              onChange={(date) => handleDateFilter("start",date)}
                              placeholderText="Select From Date"
                              selectsStart
                              startDate={startDate}
                              endDate={endDate}
                              
                        /><ReactDatePicker 
                              selected={endDate} 
                              onChange={(date) => handleDateFilter("end",date)}
                              placeholderText="Select To Date"
                              selectsEnd
                              startDate={startDate}
                              endDate={endDate}
                              minDate={startDate}
                        /></td>
                        <td/>
                        <td/>
                        </tr>
                    </thead>
                    <tbody>
                    {(TBLData && Array.isArray(TBLData) && TBLData?.length > 0) ? 
                      TBLData?.map((ele) => {
                        return(
                          <tr key={ele?._id}>
                          {userInfo?.role === 'Super Admin' && <td><input type='checkbox' style={{width:'auto'}} checked={Array.isArray(selectedDesign) && selectedDesign?.some(sc => sc === ele?._id)}  onChange={(e) => handleSelectDesign(e,ele?._id)}/></td>}
                          <td>{(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Edit") || userInfo?.permissions?.includes("Uploaded Design Replace")) ? <Link to={""} onClick={(e) => onEditAction(e,ele?._id)} >{ele?.name}</Link> : ele?.name}</td>
                          <td>{ele?.category?.label}</td>
                          <td>{ele?.uploadedBy?.name}</td>
                          <td>{ele?.createdAt ? dayjs.utc(ele?.createdAt).format("MM/DD/YYYY") : ""}</td>
                          <td>{handleCheckStatus(ele?.status)}</td>
                          <td>
                          {((userInfo?.role === 'Super Admin') || userInfo?.permissions?.some(el => el === "Upload Design View" || el === "Upload Design Edit" || el === "Uploaded Design Replace")) ?
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
                            {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design View")) &&
                              <DropdownItem
                                href="#!"
                                onClick={(e) => onViewAction(e,ele?._id)}
                              >
                                <Eye className="me-50" size={15} />{" "}
                                <span className="align-middle">View</span>
                              </DropdownItem>
                            }
                            {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Edit") || userInfo?.permissions?.includes("Uploaded Design Replace")) &&

                              <DropdownItem
                                href="#!"
                                onClick={(e) => onEditAction(e,ele?._id)}
                              >
                                <Edit className="me-50" size={15} />{" "}
                                <span className="align-middle">Edit</span>
                              </DropdownItem>
                            }
                            {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Uploaded Design Download")) &&
                            <DropdownItem
                                href="#!"
                                onClick={(e) => onEditAction(e,ele?._id)}
                              >
                                <Download className="me-50" size={15} />{" "}
                                <span className="align-middle">Download</span>
                              </DropdownItem>
                            }
                            {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Delete")) &&
                                <DropdownItem
                                href="#!"
                                onClick={(e) => handleDelete(e,ele)}
                              >
                                <Trash className="me-50" size={15} />{" "}
                                <span className="align-middle">Delete</span>
                              </DropdownItem>
                            }
                            {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Design Image")) &&
                                <DropdownItem
                                href="#!"
                                onClick={(e) => handleDesignImage(e,ele?._id)}
                              >
                                <Image className="me-50" size={15} />{" "}
                                <span className="align-middle">Design Image</span>
                              </DropdownItem>
                            }
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
                      dispatch(getCurrentPageV2(page))
                      setCurrentPage(page)
                    }}
                    TBLData={TBLData}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UploadDesignView
      modal={modalView}
      setModal={setModalView}
      viewData={viewData}
    />
    <VerifyDeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalDetails={modalDetails}
        confirmAction={reqDelete}
      />
      <UpdateDesignerModal
        openUploadedByChange={openUploadedByChange}
        onCloseClick={onCloseClick}
        selectedDesign={selectedDesign}
        reqDesign={reqDesign}
        currentPage={currentPage}
        pageSize={pageSize}
        uploadedBy={filterUploadedBy}
        name={filterName}
      />
      </>
      :
      <Navigate to={"/dashboard"} />
    }
    </>
  );
}

export default UploadDesignListV2;
