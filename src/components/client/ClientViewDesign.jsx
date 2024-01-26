import React, { useEffect, useState } from "react";
import { useDesignUploadListMutation } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
// import './clientView.scss'

function ClientViewDesign() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  console.log("userInfo", userInfo);
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  const [designID,setDesignId] = useState(null)
  const [variationImg,setVariationImg] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log('selectedOptions',selectedOptions);
  

   // pagination 
   const [TBLData, setTBLData] = useState([])
   const [currentPage, setCurrentPage] = useState(1)
   const pageSize = 9
   const [totalCount, setTotalCount] = useState(0)

   useEffect(() => {
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: "",
    });
  }, [currentPage]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs)
      setTotalCount(resDesign?.data?.data?.totalDocs)
    }
  }, [resDesign]);

  const handleSearch = (search) => {
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
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

  const handleDesignSelect = (e,value) => {
    // e.preventDefault()
    debugger
    console.log('value',value);
    if (selectedOptions.some(se => se?._id === value?._id)) {
      // If the value is already selected, remove it
      const res = selectedOptions.filter((option) => option?._id !== value?._id)
      setSelectedOptions(res);
    } else {
      // If the value is not selected, add it
      setSelectedOptions([...selectedOptions, value]);
    }
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
                    <a href="javascript: void(0);">View Designs</a>
                  </li>
                  <li className="breadcrumb-item active">Desings</li>
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
                    <div className="col-md-6">
                      <div className="form-inline float-md-end">
                        <div className="search-box ms-2">
                          <div className="position-relative">
                            <input
                              type="text"
                              onChange={(e) => handleSearch(e.target.value)}
                              className="form-control bg-light border-light rounded"
                              placeholder="Search..."
                            />
                            <i className="bx bx-search search-icon"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content p-3 text-muted">
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
                                    <Link
                                      to={""}
                                      className="btn btn-primary waves-effect waves-light"
                                      onClick={(e) => onAddDesignClick(e, el)}
                                    >
                                      Add Design
                                    </Link>
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
                   
        <div class="grid-wrapper grid-col-auto">
        {designUploadList &&
                        Array.isArray(designUploadList) &&
                        designUploadList?.length > 0 ? (
                          designUploadList?.map((el, i) => {
                            return(
          <label htmlFor={el?.name} class={"radio-card"} key={i}>
            <input 
            type="radio" 
            name={el?.name} 
            id={el?.name} 
            // value={el}
            checked={selectedOptions.some(se => se?._id === el?._id)}
            onChange={(e) => handleDesignSelect(e,el)} />
            <div class="card-content-wrapper">
              <span class="check-icon"></span>
              <div class="card-content">
              {Array.isArray(el?.thumbnail) && el?.thumbnail[0]?.pdf_extract_img &&
                <img
                  src={(variationImg && el?._id === designID) ? variationImg :  el?.thumbnail[0]?.pdf_extract_img}
                  alt="img"
                />
              }
                <h4>{el?.name}</h4>
                <h5>Category: {el?.category?.label}</h5>
                <div>
                <h5>Variation</h5>
                                                      <ul class="list-inline mb-0 text-muted product-color text-center">
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
          </label>
                            )})): (
                          <h4 className="text-center mt-5">No Design Found</h4>
                        )}

          
        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    TBLData={TBLData}
                  />
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

export default ClientViewDesign;
