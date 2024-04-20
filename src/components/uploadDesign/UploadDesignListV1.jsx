import React, { useEffect, useState } from "react";
import One from "../../assets/images/product/five.jpg";
import Two from "../../assets/images/product/seven.jpg";
import Three from "../../assets/images/product/four.jpg";
import Four from "../../assets/images/product/three.jpg";
import Five from "../../assets/images/product/one.jpg";
import Six from "../../assets/images/product/six.jpg";
import { useCategoryDropdownListQuery, useColorVariationDropdownListQuery, useDesignUploadListMutation, useDesignerDropDownListQuery, useTagListMutation } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DivideSquare } from "react-feather";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import dayjs from "dayjs";
// import utc from 'dayjs/plugin/utc'; // Import UTC plugin
// import timezone from 'dayjs/plugin/timezone'; // Import timezone plugin
import { getTag } from "../../redux/tagSlice";

// Extend Day.js with the plugins
// dayjs.extend(utc);
// dayjs.extend(timezone);
// Set the timezone to Indian Standard Time (IST)
// dayjs.tz.setDefault('Asia/Kolkata');


function UploadDesignListV1() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqTag,resTag] = useTagListMutation()
  const staffDropDownRes = useDesignerDropDownListQuery()
  const categoryDropdownRes = useCategoryDropdownListQuery();
  const colorListDropdown = useColorVariationDropdownListQuery();

  const tagList = useSelector((state) => state?.tagState.tagList)
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  const [staffDropdown,setStaffDropdown] = useState([])
  const [categoryDropdown,setCategoryDropdown] = useState([])
  const [colorDropdown, setColorDropdown] = useState([]);


  const [designID,setDesignId] = useState(null)
  const [variationImg,setVariationImg] = useState(null)

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [totalCount, setTotalCount] = useState(0)

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [search, setSearch] = useState('');
  const [tagsSearch, setTagSearch] = useState([]);
  const [categorySearch, setCategorySearch] = useState([]);
  const [colorSearch, setColorSearch] = useState([]);


  const [selectedStaff, setSelectedStaff] = useState(null);
  

  useEffect(() => {
    if(search || (startDate && endDate) || tagsSearch || selectedStaff || categorySearch || colorSearch){
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: search,
        // date_filter:startDate ?  dayjs(startDate).format() : '',
        start_date:(startDate && endDate) ? dayjs(startDate).format() : "",
        end_date:(startDate && endDate) ? dayjs(endDate).format() : "",
        tags:tagsSearch,
        uploadedBy:selectedStaff ? selectedStaff : '',
        category:Array.isArray(categorySearch) ? categorySearch?.map(el => el?.value) : [],
        color:Array.isArray(colorSearch) ? colorSearch?.map(el => el?._id) : []
      });
    }else{
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: "",
        // date_filter:'',
        start_date: "",
        end_date:"",
        tags:[],
        uploadedBy: '',
        category:[],
        color:[]
      });
    }
  }, [currentPage,search,startDate,endDate,tagsSearch,selectedStaff,categorySearch,colorSearch]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs)
      setTotalCount(resDesign?.data?.data?.totalDocs)
    }
  }, [resDesign]);


  useEffect(() => {
    if(staffDropDownRes?.isSuccess && Array.isArray(staffDropDownRes?.data?.data) && staffDropDownRes?.data?.data){
      const filterRes =  staffDropDownRes?.data?.data?.map((el) => ({label:el?.name,value:el?._id}))
      const filterRes2 = (userInfo?.role !== "Super Admin" && userInfo?.role !== "Admin") ? filterRes?.filter(el => el?.value === userInfo?._id) : filterRes
      setStaffDropdown(filterRes2)
    }
  },[staffDropDownRes?.isSuccess])

  useEffect(() => {
    if(categoryDropdownRes?.isSuccess && Array.isArray(categoryDropdownRes?.data?.data) && categoryDropdownRes?.data?.data){
      setCategoryDropdown(categoryDropdownRes?.data?.data)
    }
  },[categoryDropdownRes?.isSuccess])

  useEffect(() => {
    if (colorListDropdown?.isSuccess && colorListDropdown?.data?.data) {
      setColorDropdown(colorListDropdown?.data?.data);
    }
  }, [colorListDropdown]);

  const handleSearch = (search) => {
    setSearch(search)
    // reqDesign({
    //   page: currentPage,
    //   limit: pageSize,
    //   search: search,
    //   date_filter:startDate ?  dayjs(startDate).format() : '',
    //   tags:tagsSearch,
    //   uploadedBy:selectedStaff ? selectedStaff : ''
    // });
  };

  const handleChangeVariation = (e,variation,designObj) => {
    e.preventDefault()
    if(variation?.label && (designObj?.variations && Array.isArray(designObj?.variations) && designObj?.variations?.length > 0)){
      const variationObj = designObj?.variations?.find(el => el?.color === variation?.label)
      if(variationObj?.variation_thumbnail[0]?.pdf_extract_img){
        setVariationImg(variationObj?.variation_thumbnail[0]?.pdf_extract_img)
        setDesignId(designObj?._id)
      }
      
    }
  }

  
  const handleChangePrimary = (e) => {
    e.preventDefault()
    setVariationImg(null)
  }

  const handleDateFilter = (tag,date) => {
    if(tag === 'start'){
      setStartDate(date)
    }else{
      setEndDate(date)
    }
  }

  useEffect(() => {
    reqTag({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resTag?.isSuccess) {
      dispatch(getTag(resTag?.data?.data?.docs));
    }
  }, [resTag]);

  const handleTagSelection = (selected) => {
    setTagSearch(selected)
  }

  const handleCategorySelection = (selected) => {
    setCategorySearch(selected)
  }

  const handleColorSelection = (selected) => {
    setColorSearch(selected)
  }

  const handleStaffSelection = (selected) => {
    setSelectedStaff(selected[0]?.value)
  }

  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin' || userInfo?.role === 'Designer') ?
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
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              <div className="card-body">
                <div>
                  <div className="row">
                    <div className="col-md-6 mt-1">
                      <div>
                        <h5>Designs</h5>
                      </div>
                    </div>
                    
                  </div>
                  <div className="row m-4">
                  <div className="col-md-3">
                      <div className="form-inline">
                        <div className="search-box ms-2">
                          <div className="position-relative">
                            <input
                              type="text"
                              onChange={(e) => handleSearch(e.target.value)}
                              className="form-control "
                              placeholder="Search..."
                            />
                            <i className="bx bx-search search-icon"></i>
                          </div>
                          
                        </div>
                       
                       
                      </div>
                    </div>
                    <div className="col-md-3">
                    <div className="form-inline">
                        <div className="search-box ms-2">
                        <ReactDatePicker 
                              selected={startDate} 
                              onChange={(date) => handleDateFilter("start",date)}
                              placeholderText="Select From Date"
                              className="form-control "
                              selectsStart
                              startDate={startDate}
                              endDate={endDate}
                        />
                        </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                    <div className="form-inline">
                        <div className="search-box ms-2">
                        <ReactDatePicker 
                              selected={endDate} 
                              onChange={(date) => handleDateFilter("end",date)}
                              placeholderText="Select To Date"
                              className="form-control "
                              selectsEnd
                              startDate={startDate}
                              endDate={endDate}
                              minDate={startDate}
                        />
                        </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                    <div className="form-inline">
                        <div className="search-box ms-2">
                          
                        <Typeahead
                                  allowNew={false}
                                  id="custom-selections-example"
                                  labelKey={'label'}
                                  multiple
                                  options={(tagList && Array.isArray(tagList) && tagList?.length > 0) ? tagList?.map(el => el?.label) : []}
                                  placeholder="Search tags..."
                                  onChange={handleTagSelection}
                                />
                                </div>
                                </div>
                    </div>
                  </div>
                  <div className="row m-4">
                  <div className="col-md-4">
                    <div className="form-inline">
                        <div className="search-box ms-2">
                          
                        <Typeahead
                                  allowNew={false}
                                  id="custom-selections-example"
                                  labelKey={'label'}
                                  options={(staffDropdown && Array.isArray(staffDropdown) && staffDropdown?.length > 0) ? staffDropdown : []}
                                  placeholder="Search staff..."
                                  onChange={handleStaffSelection}
                                />
                                </div>
                                </div>
                    </div>
                    <div className="col-md-4">
                    <div className="form-inline">
                        <div className="search-box ms-2">
                          
                        <Typeahead
                                  allowNew={false}
                                  id="custom-selections-example"
                                  labelKey={'label'}
                                  multiple
                                  options={(categoryDropdown && Array.isArray(categoryDropdown) && categoryDropdown?.length > 0) ? categoryDropdown : []}
                                  placeholder="Search category..."
                                  onChange={handleCategorySelection}
                                />
                                </div>
                                </div>
                    </div>

                    <div className="col-md-4">
                    <div className="form-inline">
                        <div className="search-box ms-2">
                          
                        <Typeahead
                                  allowNew={false}
                                  id="custom-selections-example"
                                  labelKey={'label'}
                                  multiple
                                  options={(colorDropdown && Array.isArray(colorDropdown) && colorDropdown?.length > 0) ? colorDropdown : []}
                                  placeholder="Search color..."
                                  onChange={handleColorSelection}
                                />
                                </div>
                                </div>
                    </div>
                  </div>
                  <div className="tab-content text-muted">
                    <div
                      className="tab-pane active"
                      id="popularity"
                      role="tabpanel"
                    >
                      {/* <div className="row">
                        {designUploadList &&
                        Array.isArray(designUploadList) &&
                        designUploadList?.length > 0 ? (
                          designUploadList?.map((el, i) => {
                            return (
                              <div
                                className="col-md-6 col-xl-3"
                                style={{ cursor: "pointer" }}
                                key={i}
                              >
                                <div className="card">
                                  <img
                                    className="card-img-top img-fluid"
                                    src={el?.thumbnail?.filepath}
                                    alt="Card image cap"
                                  />
                                  <div className="card-body">
                                    <h4 className="card-title">{el?.name}</h4>
                                    <p className="card-text">
                                      {el?.category?.label}
                                    </p>
                                    
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h4 className="text-center mt-5">No Design Found</h4>
                        )}
                      </div> */}
                      <div className="row">
                      
                        <div className="col-xl-12 col-lg-8">
                        
                          <div className="card">
                            <div className="card-body">
                              <div>
                                <div className="tab-content p-3 text-muted">
                                  <div
                                    className="tab-pane active"
                                    id="popularity"
                                    role="tabpanel"
                                  >
                                   
                                   <h6 style={{display:'flex',justifyContent:'end',textTransform:'uppercase'}}>Total Designs: {totalCount}</h6>

                                    <div className="row">
                                      {designUploadList &&
                                      Array.isArray(designUploadList) &&
                                      designUploadList?.length > 0 ? (
                                        designUploadList?.map((el, i) => {
                                          return (
                                            <div
                                              className="col-xl-4 col-sm-6"
                                              key={i}
                                            >
                                              <div className="product-box">
                                                <div className="product-img pt-4 px-4">
                                                {el?.thumbnail && Array.isArray(el?.thumbnail) && el?.thumbnail?.length > 0 && el?.thumbnail[0]?.pdf_extract_img ?
                                                  <Link to={`/product-view/${el?._id}`}
                                                          target="_blank">
                                                  <img
                                                    src={
                                                      (variationImg && el?._id === designID) ? variationImg :  el?.thumbnail[0]?.pdf_extract_img
                                                    }
                                                    alt="image post"
                                                    height={200}
                                                    width={250}
                                                    className="image"
                                                    style={{objectFit:'cover'}}
                                                  />
                                                  </Link>
                                                :
                                                <Link to={`/product-view/${el?._id}`}
                                                          target="_blank">
                                                <img 
                                                    src="https://www.bootdey.com/image/250x200/FFB6C1/000000" 
                                                    className="image" 
                                                    alt="image post"
                                                    
                                                    // onClick={() => navigate(`/product-view/${el?._id}`)}
                                                    />
                                                    </Link>
                                                }

                                                {/* <img 
                                                    src={el?.thumbnail[0]?.tif_extract_img} 
                                                    className="image" 
                                                    alt="image post"
                                                    height={200}
                                                    width={250}
                                                    onClick={() => navigate(`/product-view/${el?._id}`)}
                                                    /> */}
                                                 
                                                  
                                                </div>

                                                <div className="product-content p-4">
                                                  <div>
                                                    <div>
                                                      <h5 className="mb-1">
                                                        <Link to={`/product-view/${el?._id}`}
                                                          target="_blank"
                                                          className="text-dark font-size-16"
                                                        >
                                                          {el?.name}
                                                        </Link>
                                                      </h5>
                                                      <p className="text-muted font-size-13">
                                                        {el?.tag && Array.isArray(el?.tag) && el?.tag?.length > 0 ? el?.tag?.map(el => el?.label)?.join(',') : ''}
                                                      </p>
                                                    </div>

                                                    <div>
                                                      <ul className="list-inline mb-0 text-muted product-color">
                                                      {el?.primary_color_code  &&
                                                      <li className="list-inline-item" style={{
                                                        backgroundColor:el?.primary_color_code,
                                                        width: '14px',
                                                        height: '14px',
                                                        borderRadius: '50%',
                                                        border: '1px solid #c7c7c7'
                                                        }} onClick={(e) => handleChangePrimary(e)}>
                                                                <span className="" ></span>
                                                        </li>
                                                      }
                                                        {el?.color?.map(
                                                          (cl, cinx) => {
                                                            return (
                                                              <li className="list-inline-item" 
                                                              style={{
                                                                backgroundColor:cl?.value,
                                                                width: '14px',
                                                                height: '14px',
                                                                borderRadius: '50%',
                                                                border: '1px solid #c7c7c7'}} 
                                                                key={cinx} onClick={(e) => handleChangeVariation(e,cl,el)}>
                                                                <span className="" ></span>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <h4 className="text-center mt-5">
                                          No Design Found
                                        </h4>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="row mt-4">
                                  <div className="col-sm-6">
                                    <div>
                                      <p className="mb-sm-0">Page 2 of 84</p>
                                    </div>
                                  </div>
                                  <div className="col-sm-6">
                                    <div className="float-sm-end">
                                      <ul className="pagination pagination-rounded mb-sm-0">
                                        <li className="page-item disabled">
                                          <a href="#" className="page-link">
                                            <i className="mdi mdi-chevron-left"></i>
                                          </a>
                                        </li>
                                        <li className="page-item active">
                                          <a href="#" className="page-link">
                                            1
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            2
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            3
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            4
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            5
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            <i className="mdi mdi-chevron-right"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div> */}
                              </div>
                            </div>
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

                  {/* <div className="row mt-4">
                    <div className="col-sm-6">
                      <div>
                        <p className="mb-sm-0">Page 1 of 1</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="float-sm-end">
                        <ul className="pagination pagination-rounded mb-sm-0">
                          <li className="page-item disabled">
                            <a href="#" className="page-link">
                              <i className="mdi mdi-chevron-left"></i>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a href="#" className="page-link">
                              1
                            </a>
                          </li>
                          <li className="page-item">
                            <a href="#" className="page-link">
                              <i className="mdi mdi-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    :
    <Navigate to={"/dashboard"}/>
                }
                </>
  );
}

export default UploadDesignListV1;
