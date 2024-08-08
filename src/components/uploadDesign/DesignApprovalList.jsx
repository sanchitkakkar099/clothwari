import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate,Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDesignUploadApprovalListMutation, useDesignUploadListMutation, useMultipleFileUploadMutation } from "../../service";
import { getDesignUploadApproval } from "../../redux/designUploadSlice";
import { getCurrentPage } from "../../redux/designApprovalSlice";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Download, Edit, Eye, Image, MoreVertical, Trash } from "react-feather";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from "reactstrap";
import { useRef } from "react";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import { getArrayDifferences } from '../../utils/compareEditDesign'
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Import UTC plugin

// Extend dayjs with the utc plugin
dayjs.extend(utc);

function DesignApprovalList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const latestCurrentPage = useSelector((state) => state?.designApprovalState?.currentPage);
  // const [reqDesign,resDesign] = useDesignUploadListMutation()
  const [reqDesign,resDesign] = useDesignUploadApprovalListMutation()
  const designUploadList = useSelector((state) => state?.designUploadState.getDesignUploadApprovalList)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // pagination 
  const [TBLData, setTBLData] = useState([]);
  const [TBLEditData, setTBLEditData] = useState([])
  const [currentPage, setCurrentPage] = useState(latestCurrentPage)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  // filter
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUploadedBy, setFilterUploadedBy] = useState('');
  const [displayFields, setDisplayFields] = useState({})
  const [displayVariations, setDisplayVariations] = useState([])

  const [sortConfig, setSortConfig] = useState(null);
  
  useEffect(() => {
    if(filterName || filterStatus || filterUploadedBy || (startDate && endDate)){
      reqDesign({
        page:currentPage,
        limit:pageSize,
        name:filterName,
        status:filterStatus,
        editedBy:filterUploadedBy,
        start_date:(startDate && endDate) ? dayjs(startDate).format() : "",
        end_date:(startDate && endDate) ? dayjs(endDate).format() : ""
      })
    }else{
      reqDesign({
        page: currentPage,
        limit: pageSize
      });
    }
  }, [currentPage,filterName,filterStatus,filterUploadedBy,startDate,endDate]);


  useEffect(() => {
    if (resDesign?.isSuccess) {
      // dispatch(getDesignUploadApproval(resDesign?.data?.data?.docs));
      setTBLEditData(resDesign?.data?.data?.editDesign?.docs);
      setTBLData(resDesign?.data?.data?.Design);
      setTotalCount(resDesign?.data?.data?.editDesign?.totalDocs)
      if(sortConfig?.key && sortConfig?.direction){
        setSortConfig({ key:sortConfig?.key, direction:sortConfig?.direction });
      }
    }
  }, [resDesign]);

  const compareArrayFields = (index, element, TBLData, TBLEditData) => {
    let originalArray = TBLData?.[element] || [];
    let editedArray = TBLEditData?.[element] || [];
    let flag = originalArray.length !== editedArray.length;

    for (let i = 0; !flag && i < originalArray.length; i++) {
        if (element === 'tag') {
            if (originalArray[i]?.label !== editedArray[i]?.label) {
              flag = true;
              break;
            }
          } else {
            if (originalArray[i]?._id !== editedArray[i]?._id) {
              flag = true;
              break;
            }
          }
    }

    if (flag) {
      setDisplayFields(prevState => ({
        ...prevState,
        [index]:{
          ...prevState[index],
          [element]: true
        }
      }));
    }else{
      setDisplayFields(prevState => ({
        ...prevState,
        [index]:{
          ...prevState[index],
          [element]: false
        }
      }));

    }
  };


  useEffect(()=>{
    if (!TBLData || !TBLEditData) return;
    const fields = ['name', 'designNo', 'primary_color_name', 'primary_color_code'];
    const arrayFields = ['category', 'tag', 'image','thumbnail'];
    const length = TBLData.length;
    for(let i=0;i<length;i++){
      fields.forEach(field => {
        setDisplayFields(prev => ({
            ...prev,
            [i]:{
              ...prev[i],
              [field]:(TBLData[i][field] && TBLEditData[i][field]) ? (TBLData[i][field] !== TBLEditData[i][field]) : false,
            }
          }));
    });
    arrayFields.forEach(element => {
        if (element === 'category') {
            setDisplayFields(prev => ({
              ...prev,
              [i]:{
                ...prev[i],
                [element]: (TBLData[i][element]?._id && TBLEditData[i][element]?._id) ? TBLData[i][element]?._id !== TBLEditData[i][element]?._id : false,
              }
            }));
          } else {
            compareArrayFields(i,element, TBLData[i], TBLEditData[i]);
          }
    }); 
    if(TBLData[i] && TBLEditData[i]){
      const differences = getArrayDifferences(TBLEditData[i]?.variations , TBLData[i]?.variations);
      // console.log("differences variations",differences);
      // setDisplayFields(prev => ({
      //   ...prev,
      //   [i]:{
      //     ...prev[i],
      //     "variations": differences.length>0 ? true : false,
      //   }
      // }));
      setDisplayVariations(prev => ({
        ...prev,
        [i]:{
          ...prev[i],
          ...differences,
        }
      }));
    }  
    }     
  },[TBLData, TBLEditData])

  // useEffect(()=>{
  //   console.log("displayFields",displayFields);
  // },[displayFields])
  // useEffect(()=>{
  //   console.log("displayVariations",displayVariations);
  // },[displayVariations])



  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!sortConfig) {
      return TBLEditData;
    }

    return [...TBLEditData].sort((a, b) => {
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
    setTBLEditData(sortedTableData)

  },[sortConfig])


  const onEditAction = (e, ID) => {
    e.preventDefault();
    navigate("/design-approval-form", {
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

  const getFieldLabels = (fields) => {
    const labels = [];
    if (fields?.name) labels.push('Design Name, ');
    if (fields?.designNo) labels.push('Design Number, ');
    if (fields?.category) labels.push('Category, ');
    if (fields?.tag) labels.push('Tags, ');
    if (fields?.image) labels.push('Image, ');
    if (fields?.thumbnail) labels.push('Thumbnail, ');
    if (fields?.primary_color_code) labels.push('Primary color code, ');
    if (fields?.primary_color_name) labels.push('primary color name, ');
    return labels;
  };

  const getFieldVariantLabels = (fields,index) => {
    const labels = [];
    if (fields?.color) labels.push(`Variant ${index+1} color, `);
    if (fields?.variation_designNo) labels.push(`Variant ${index+1} Design Number, `);
    if (fields?.variation_name) labels.push(`Variant ${index+1} Design Name, `);
    if (fields?.variation_image) labels.push(`Variant ${index+1} Image, `);
    if (fields?.variation_thumbnail) labels.push(`Variant ${index+1} Thumbmail,`);
    return labels;
  };

  const handleNameFilter = (e) => {
    setFilterName(e.target.value)
  }

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value)
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

  return (
    <>
    {(userInfo?.role === 'Super Admin'|| userInfo?.permissions?.some((el) => el === "Design Approval")) ?
    <>
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Designs Approval</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Designs Approval</li>
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
                  <div className="modal-button modal-button-s mt-1">
                  
                  </div>
                  }
                  
                  </div>
                  
                  {/* <DataTable data={designUploadList} columns={columns} /> */}
                  <table className="filter-table mb-5">
                    <thead>
                      <tr>
                      {userInfo?.role === 'Super Admin'}
                        <th onClick={() => handleSort('name')}>Design Name
                        {sortConfig?.key === 'name' && (
                          sortConfig?.direction === 'asc' ? <ChevronDown /> : <ChevronUp />
                        )}
                        </th>
                        <th>Status</th>
                        <th>Edited Req By</th>
                        <th>Created At</th>
                        <th>Changes</th>
                      </tr>
                      <tr>
                        {userInfo?.role === 'Super Admin'}
                        <td><input type="text" value={filterName} onChange={(e) => handleNameFilter(e)}/></td>
                        <td>
                        <Input 
                            name="select"
                            type="select"
                            style={{
                                borderColor: "#767676",
                                lineHeight:"1.1rem"
                            }}
                            onChange={(e) => handleStatusFilter(e)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="cancel">cancel</option>

                        </Input>
                        </td>
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
                        <td></td>
                        </tr>
                    </thead>
                    <tbody>
                    {(TBLEditData && Array.isArray(TBLEditData) && TBLEditData?.length > 0) ? 
                      TBLEditData?.map((ele,i) => {
                        return(
                          <tr key={ele?._id}>
                          {/* {userInfo?.role === 'Super Admin' && <td><input type='checkbox' style={{width:'auto'}} checked={Array.isArray(selectedDesign) && selectedDesign?.some(sc => sc === ele?._id)}  onChange={(e) => handleSelectDesign(e,ele?._id)}/></td>} */}
                          <td>{(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some((el) => el === "Design Approval")) ? <Link to={""} onClick={(e) => onEditAction(e,ele?._id)} >{ele?.name}</Link> : ele?.name}</td>
                          <td>{ele?.status}</td>
                          <td>{ele?.editReqId?.name}</td>
                          <td>{ele?.createdAt ? dayjs.utc(ele?.createdAt).format("MM/DD/YYYY") : ""}</td>
                          <td>{getFieldLabels(displayFields[i])} 
                          {displayVariations[i] && Object.keys(displayVariations[i]).length > 0 ? (
                            Object.keys(displayVariations[i]).map((key,index) => (
                            <span key={key}>{getFieldVariantLabels(displayVariations[i][key], index)}</span>
                              ))
                            ) : ''}
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
                      dispatch(getCurrentPage(page));
                      setCurrentPage(page)}
                    }
                    TBLData={TBLEditData}
                    setCurrentPage={setCurrentPage}
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

export default DesignApprovalList;
