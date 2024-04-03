import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate,Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteDesignUploadMutation, useDesignUploadList2Mutation, useDesignUploadListMutation, useMultipleFileUploadMutation } from "../../service";
import { getDesignUpload } from "../../redux/designUploadSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import { downloadFile } from "../common/FileDownload";
import UploadDesignView from "./UploadDesignView";
import { ChevronDown, ChevronUp, Download, Edit, Eye, MoreVertical, Trash } from "react-feather";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useRef } from "react";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import './dropdown-filter.css';

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
  console.log('designUploadList',designUploadList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalView, setModalView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [mainFiles, setMainFiles] = useState([])
  console.log('mainFiless',mainFiles);
  const [startDate, setStartDate] = useState(null);

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  // filter
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUploadedBy, setFilterUploadedBy] = useState('');
  // const [sortOrder, setSortOrder] = useState('');
  // const [sortColumn, setSortColumn] = useState(null);
  // console.log('sortColumn',sortColumn,'sortOrder',sortOrder);

  const [sortConfig, setSortConfig] = useState(null);
  console.log('sortConfig',sortConfig);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  console.log('isOpen',isOpen);

  

  useEffect(() => {
    if(filterName || filterCategory || filterUploadedBy || startDate){
      reqDesign({
        page:currentPage,
        limit:pageSize,
        name:filterName,
        category:filterCategory,
        uploadedBy:filterUploadedBy,
        date_filter:startDate ? dayjs(startDate).format() : ""
      })
    }else{
      reqDesign({
        page: currentPage,
        limit: pageSize
      });
    }
  }, [currentPage,filterName,filterCategory,filterUploadedBy,startDate]);

  
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
    console.log('sortedTableData',sortedTableData);
    setTBLData(sortedTableData)

  },[sortConfig])


  const handleDownload = (e, st) => {
    e.preventDefault();
    console.log("sssss", st.row.original);
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
    console.log("sssss", st);
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
    console.log('fooooo',e.target.files);
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

  const handleDateFilter = (date) => {
    setStartDate(date)
    // reqDesign({
    //   page:currentPage,
    //   limit:pageSize,
    //   name:filterName,
    //   category:filterCategory,
    //   uploadedBy:filterUploadedBy,
    //   date_filter:dayjs(date).format()
    // })
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
                        <th onClick={() => handleSort('name')}>Design Name
                        {sortConfig?.key === 'name' && (
                          sortConfig?.direction === 'asc' ? <ChevronDown /> : <ChevronUp />
                        )}
                        </th>
                        <th>Category</th>
                        <th>Uploaded By</th>
                        <th>Created At</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td><input type="text" value={filterName} onChange={(e) => handleNameFilter(e)}/></td>
                        <td><input type="text" value={filterCategory} onChange={(e) => handleCategoryFilter(e)}/></td>
                        <td><input type="text" value={filterUploadedBy} onChange={(e) => handleUploadedByFilter(e)}/></td>
                        <td><ReactDatePicker 
                              selected={startDate} 
                              onChange={(date) => handleDateFilter(date)}
                              placeholderText="Select Date"
                        /></td>
                        <td/>
                        </tr>
                    </thead>
                    <tbody>
                    {(TBLData && Array.isArray(TBLData) && TBLData?.length > 0) ? 
                      TBLData?.map((ele) => {
                        return(
                          <tr key={ele?._id}>
                          <td>{(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Edit")) ? <Link to={""} onClick={(e) => onEditAction(e,ele?._id)} >{ele?.name}</Link> : ele?.name}</td>
                          <td>{ele?.category?.label}</td>
                          <td>{ele?.uploadedBy?.name}</td>
                          <td>{ele?.createdAt ? dayjs.utc(ele?.createdAt).format("MM/DD/YYYY") : ""}</td>

                          <td>
                          {((userInfo?.role === 'Super Admin') || userInfo?.permissions?.some(el => el === "Upload Design View" || el === "Upload Design Edit")) ?
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
                                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Edit")) &&

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onEditAction(e,ele?._id)}
                                  >
                                    <Edit className="me-50" size={15} />{" "}
                                    <span className="align-middle">Edit</span>
                                  </DropdownItem>
                                }
                                {(userInfo?.role === 'Super Admin' && userInfo?.permissions?.includes("Upload Design Download")) &&
                                <DropdownItem
                                    href="#!"
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
      </>
      :
      <Navigate to={"/dashboard"} />
    }
    </>
  );
}

export default UploadDesignListV2;
