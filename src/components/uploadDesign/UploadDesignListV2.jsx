import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate,Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteDesignUploadMutation, useDesignUploadList2Mutation, useDesignUploadListMutation, useMultipleFileUploadMutation } from "../../service";
import { getDesignUpload } from "../../redux/designUploadSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import { downloadFile } from "../common/FileDownload";
import UploadDesignView from "./UploadDesignView";
import { Download, Edit, Eye, MoreVertical, Trash } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useRef } from "react";
import Pagination from "../common/Pagination";


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

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  // filter
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUploadedBy, setFilterUploadedBy] = useState('');

  useEffect(() => {
    reqDesign({
      page: currentPage,
      limit: pageSize
    });
  }, [currentPage]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs)
      setTotalCount(resDesign?.data?.data?.totalDocs)
    }
  }, [resDesign]);

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
    reqDesign({
      page:currentPage,
      limit:pageSize,
      name:e.target.value,
      category:filterCategory,
      uploadedBy:filterUploadedBy
    })
  }

  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value)
    reqDesign({
      page:currentPage,
      limit:pageSize,
      name:filterName,
      category:e.target.value,
      uploadedBy:filterUploadedBy
    })
  }

  const handleUploadedByFilter = (e) => {
    setFilterUploadedBy(e.target.value)
    reqDesign({
      page:currentPage,
      limit:pageSize,
      name:filterName,
      category:filterCategory,
      uploadedBy:e.target.value
    })
  }

  
  return (
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
                    <a href="javascript: void(0);">Clothwari</a>
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
                  <button
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
                    />
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
                  {/* <DataTable data={designUploadList} columns={columns} /> */}
                  <table className="filter-table">
                    <thead>
                      <tr>
                        <th>Design Name</th>
                        <th>Category</th>
                        <th>Uploaded By</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td><input type="text" value={filterName} onChange={(e) => handleNameFilter(e)}/></td>
                        <td><input type="text" value={filterCategory} onChange={(e) => handleCategoryFilter(e)}/></td>
                        <td><input type="text" value={filterUploadedBy} onChange={(e) => handleUploadedByFilter(e)}/></td>
                        <td/>
                        </tr>
                    </thead>
                    <tbody>
                    {(TBLData && Array.isArray(TBLData) && TBLData?.length > 0) ? 
                      TBLData?.map((ele) => {
                        return(
                          <tr key={ele?._id}>
                          <td><Link to={""} onClick={(e) => onEditAction(e,ele?._id)} >{ele?.name}</Link></td>
                          <td>{ele?.category?.label}</td>
                          <td>{ele?.uploadedBy?.name}</td>
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
                                  {/* <DropdownItem
                                    href="#!"
                                    onClick={(e) => handleDelete(e,ele)}
                                  >
                                    <Trash className="me-50" size={15} />{" "}
                                    <span className="align-middle">Delete</span>
                                  </DropdownItem> */}
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
  );
}

export default UploadDesignListV2;
