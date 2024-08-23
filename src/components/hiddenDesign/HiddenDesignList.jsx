import React, { useEffect, useState } from "react";
import { useNavigate,Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteDesignUploadMutation, useDesignUploadHiddenListMutation, useDesignUploadListMutation, useMultipleFileUploadMutation } from "../../service";
import { getCurrentPageHidden, getDesignUpload } from "../../redux/designUploadSlice";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Download, Edit, Eye, Image, MoreVertical, Trash } from "react-feather";
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useRef } from "react";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import '../uploadDesign/dropdown-filter.css';

// Extend dayjs with the utc plugin
dayjs.extend(utc);

function HiddenDesignList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const [reqDesign,resDesign] = useDesignUploadHiddenListMutation()
  const latestCurrentPage = useSelector((state) => state?.designUploadState?.currentPageHidden);
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

  useEffect(() => {
    if (resDesign?.isSuccess) {
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

  const onEditAction = (e, ID) => {
    e.preventDefault();
    navigate("/upload-design-form", {
      state: {
        designID: ID,
        isEdit:true,
        isHiddenPage:true,
      },
    });
  };

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
    {(userInfo?.role === 'Super Admin' || (userInfo?.permissions?.some((el) => el === "Design View/Hide") && userInfo?.role === 'Admin')) ?
    <>
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Classified Designs</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Classified Designs</li>
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
                  </div>
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
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                      <tr>
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
                          <td>{(userInfo?.role === 'Super Admin' || (userInfo?.permissions?.some((el) => el === "Design View/Hide") && userInfo?.role === 'Admin')) ? <Link to={""} onClick={(e) => onEditAction(e,ele?._id)} >{ele?.name}</Link> : ele?.name}</td>
                          <td>{ele?.category?.label}</td>
                          <td>{ele?.uploadedBy?.name}</td>
                          <td>{ele?.createdAt ? dayjs.utc(ele?.createdAt).format("MM/DD/YYYY") : ""}</td>
                          <td>{handleCheckStatus(ele?.status)}</td>
                          <td>
                          {(userInfo?.role === 'Super Admin' || (userInfo?.permissions?.some((el) => el === "Design View/Hide") && userInfo?.role === 'Admin')) ?
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
                            {(userInfo?.role === 'Super Admin' || (userInfo?.permissions?.some((el) => el === "Design View/Hide") && userInfo?.role === 'Admin')) &&

                              <DropdownItem
                                href="#!"
                                onClick={(e) => onEditAction(e,ele?._id)}
                              >
                                <Edit className="me-50" size={15} />{" "}
                                <span className="align-middle">Edit</span>
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
                      dispatch(getCurrentPageHidden(page))
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
      </>
      :
      <Navigate to={"/dashboard"} />
    }
    </>
  );
}

export default HiddenDesignList;
