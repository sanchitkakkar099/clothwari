import React, { useEffect, useState } from "react";
import One from "../../assets/images/product/five.jpg";
import Two from "../../assets/images/product/seven.jpg";
import Three from "../../assets/images/product/four.jpg";
import Four from "../../assets/images/product/three.jpg";
import Five from "../../assets/images/product/one.jpg";
import Six from "../../assets/images/product/six.jpg";
import { useDesignUploadListMutation, useTagListMutation } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link, useNavigate } from "react-router-dom";
import { DivideSquare } from "react-feather";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import timezone plugin
import { getTag } from "../../redux/tagSlice";

// Extend Day.js with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);


function UploadDesignListV1() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqTag,resTag] = useTagListMutation()
  const tagList = useSelector((state) => state?.tagState.tagList)
  console.log('tagList',tagList);
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  console.log("designUploadList", designUploadList);
  const [designID,setDesignId] = useState(null)
  const [variationImg,setVariationImg] = useState(null)

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [totalCount, setTotalCount] = useState(0)

  const [startDate, setStartDate] = useState(null);
  const [search, setSearch] = useState('');
  const [tagsSearch, setTagSearch] = useState([]);




  useEffect(() => {
    if(search || startDate || tagsSearch){
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: search,
        date_filter:startDate ?  dayjs.utc(startDate).format() : '',
        tags:tagsSearch
      });
    }else{
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: "",
        date_filter:'',
        tags:[]
      });
    }
  }, [currentPage,search,startDate,tagsSearch]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs)
      setTotalCount(resDesign?.data?.data?.totalDocs)
    }
  }, [resDesign]);

  const handleSearch = (search) => {
    setSearch(search)
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
      date_filter:startDate ?  dayjs.utc(startDate).format() : '',
      tags:tagsSearch
    });
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
    console.log('variation',variation);
  }

  const handleDateFilter = (date) => {
    setStartDate(date)
    reqDesign({
      page:currentPage,
      limit:pageSize,
      search:search,
      date_filter:dayjs.utc(date).format(),
      tags:tagsSearch
    })
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
    console.log('selected',selected);
    setTagSearch(selected)
    reqDesign({
      page:currentPage,
      limit:pageSize,
      search:search,
      date_filter:dayjs.utc(startDate).format(),
      tags:selected
    })
  }

  return (
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
                  <div className="col-md-4">
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
                              onChange={(date) => handleDateFilter(date)}
                              placeholderText="Select Date"
                              className="form-control "

                        />
                        </div>
                        </div>
                    </div>
                    <div className="col-md-5">
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
                        <div class="col-xl-12 col-lg-8">
                          <div class="card">
                            <div class="card-body">
                              <div>
                                <div class="tab-content p-3 text-muted">
                                  <div
                                    class="tab-pane active"
                                    id="popularity"
                                    role="tabpanel"
                                  >
                                    <div class="row">
                                      {designUploadList &&
                                      Array.isArray(designUploadList) &&
                                      designUploadList?.length > 0 ? (
                                        designUploadList?.map((el, i) => {
                                          return (
                                            <div
                                              class="col-xl-4 col-sm-6"
                                              key={i}
                                            >
                                              <div class="product-box">
                                                <div class="product-img pt-4 px-4">
                                                {Array.isArray(el?.thumbnail) && el?.thumbnail[0]?.pdf_extract_img ?
                                                  
                                                  <img
                                                    src={
                                                      (variationImg && el?._id === designID) ? variationImg :  el?.thumbnail[0]?.pdf_extract_img
                                                    }
                                                    alt="image post"
                                                    height={200}
                                                    width={250}
                                                    class="image"
                                                  />
                                                :
                                                <img 
                                                    src="https://www.bootdey.com/image/250x200/FFB6C1/000000" 
                                                    class="image" 
                                                    alt="image post"
                                                    
                                                    onClick={() => navigate(`/product-view/${el?._id}`)}
                                                    />
                                                }

                                                {/* <img 
                                                    src={el?.thumbnail[0]?.pdf_extract_img} 
                                                    class="image" 
                                                    alt="image post"
                                                    height={200}
                                                    width={250}
                                                    onClick={() => navigate(`/product-view/${el?._id}`)}
                                                    /> */}
                                                 
                                                  
                                                </div>

                                                <div class="product-content p-4">
                                                  <div>
                                                    <div>
                                                      <h5 class="mb-1">
                                                        <Link to={`/product-view/${el?._id}`}
                                                          href="ecommerce-product-detail.html"
                                                          class="text-dark font-size-16"
                                                        >
                                                          {el?.name}
                                                        </Link>
                                                      </h5>
                                                      <p class="text-muted font-size-13">
                                                        {el?.tag && Array.isArray(el?.tag) && el?.tag?.length > 0 ? el?.tag?.map(el => el?.label)?.join(',') : ''}
                                                      </p>
                                                    </div>

                                                    <div>
                                                      <ul class="list-inline mb-0 text-muted product-color">
                                                      {el?.primary_color_code  &&
                                                      <li class="list-inline-item">
                                                                <i class="mdi mdi-circle" style={{color:el?.primary_color_code}}></i>
                                                        </li>
                                                      }
                                                        {el?.color?.map(
                                                          (cl, cinx) => {
                                                            return (
                                                              <li class="list-inline-item" key={cinx} onClick={(e) => handleChangeVariation(e,cl,el)}>
                                                                <i class="mdi mdi-circle" style={{color:cl?.value}}></i>
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

                                {/* <div class="row mt-4">
                                  <div class="col-sm-6">
                                    <div>
                                      <p class="mb-sm-0">Page 2 of 84</p>
                                    </div>
                                  </div>
                                  <div class="col-sm-6">
                                    <div class="float-sm-end">
                                      <ul class="pagination pagination-rounded mb-sm-0">
                                        <li class="page-item disabled">
                                          <a href="#" class="page-link">
                                            <i class="mdi mdi-chevron-left"></i>
                                          </a>
                                        </li>
                                        <li class="page-item active">
                                          <a href="#" class="page-link">
                                            1
                                          </a>
                                        </li>
                                        <li class="page-item">
                                          <a href="#" class="page-link">
                                            2
                                          </a>
                                        </li>
                                        <li class="page-item">
                                          <a href="#" class="page-link">
                                            3
                                          </a>
                                        </li>
                                        <li class="page-item">
                                          <a href="#" class="page-link">
                                            4
                                          </a>
                                        </li>
                                        <li class="page-item">
                                          <a href="#" class="page-link">
                                            5
                                          </a>
                                        </li>
                                        <li class="page-item">
                                          <a href="#" class="page-link">
                                            <i class="mdi mdi-chevron-right"></i>
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
  );
}

export default UploadDesignListV1;
