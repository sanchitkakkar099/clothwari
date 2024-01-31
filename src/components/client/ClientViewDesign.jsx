import React, { useEffect, useState } from "react";
import { useDesignUploadListMutation } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import { addedBagItems, removeBagItems } from "../../redux/clientSlice";

function ClientViewDesign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  console.log("designUploadList", designUploadList);
  const selectedBagItems = useSelector((state) => state?.clientState.selectedBagItems)
  console.log('selectedBagItems', selectedBagItems);
  const [designID, setDesignId] = useState(null);
  const [variationImg, setVariationImg] = useState(null);

  // pagination
  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [totalCount, setTotalCount] = useState(0);

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
      setTBLData(resDesign?.data?.data?.docs);
      setTotalCount(resDesign?.data?.data?.totalDocs);
    }
  }, [resDesign]);

  const handleSearch = (search) => {
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
    });
  };

  const handleChangeVariation = (e, variation, designObj) => {
    e.preventDefault();
    if (
      variation?.label &&
      designObj?.variations &&
      Array.isArray(designObj?.variations) &&
      designObj?.variations?.length > 0
    ) {
      const variationObj = designObj?.variations?.find(
        (el) => el?.color === variation?.label
      );
      if (variationObj?.variation_thumbnail[0]?.pdf_extract_img) {
        setVariationImg(variationObj?.variation_thumbnail[0]?.pdf_extract_img);
        setDesignId(designObj?._id);
      }
    }
    console.log("variation", variation);
  };

  const handleAddToBag = (el) => {
    dispatch(addedBagItems(el))
  }

  const handleRemoveFromBag = (el) => {
    const res = selectedBagItems?.filter(sb => sb?._id !== el?._id)
    dispatch(removeBagItems(res))
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
                                              class="col-xl-4 col-sm-6 d-flex"
                                              key={i}
                                            >
                                              <div class="product-box flex-fill d-flex flex-column">
                                                <div class="product-img pt-4 px-4">
                                                  {Array.isArray(
                                                    el?.thumbnail
                                                  ) &&
                                                  el?.thumbnail[0]
                                                    ?.pdf_extract_img ? (
                                                    <img
                                                      src={
                                                        variationImg &&
                                                        el?._id === designID
                                                          ? variationImg
                                                          : el?.thumbnail[0]
                                                              ?.pdf_extract_img
                                                      }
                                                      alt="image post"
                                                      height={200}
                                                      width={250}
                                                      class="image"
                                                    />
                                                  ) : (
                                                    <img
                                                      src="https://www.bootdey.com/image/250x200/FFB6C1/000000"
                                                      class="image"
                                                      alt="image post"
                                                      onClick={() =>
                                                        navigate(
                                                          `/product-view/${el?._id}`
                                                        )
                                                      }
                                                    />
                                                  )}
                                                </div>
                                                <div class="product-content p-4 d-flex flex-column flex-fill">
                                                  <div>
                                                    <div>
                                                      <h5 class="mb-1">
                                                        <Link
                                                          to={`/product-view/${el?._id}`}
                                                          href="ecommerce-product-detail.html"
                                                          class="text-dark font-size-16"
                                                        >
                                                          {el?.name}
                                                        </Link>
                                                      </h5>
                                                      <p class="text-muted font-size-13">
                                                        {el?.tag &&
                                                        Array.isArray(
                                                          el?.tag
                                                        ) &&
                                                        el?.tag?.length > 0
                                                          ? el?.tag
                                                              ?.map(
                                                                (el) =>
                                                                  el?.label
                                                              )
                                                              ?.join(",")
                                                          : ""}
                                                      </p>
                                                    </div>

                                                    <div>
                                                      <ul class="list-inline mb-0 text-muted product-color">
                                                        {el?.primary_color_code && (
                                                          <li class="list-inline-item">
                                                            <i
                                                              class="mdi mdi-circle"
                                                              style={{
                                                                color:
                                                                  el?.primary_color_code,
                                                              }}
                                                            ></i>
                                                          </li>
                                                        )}
                                                        {el?.color?.map(
                                                          (cl, cinx) => {
                                                            return (
                                                              <li
                                                                class="list-inline-item"
                                                                key={cinx}
                                                                onClick={(e) =>
                                                                  handleChangeVariation(
                                                                    e,
                                                                    cl,
                                                                    el
                                                                  )
                                                                }
                                                              >
                                                                <i
                                                                  class="mdi mdi-circle"
                                                                  style={{
                                                                    color:
                                                                      cl?.value,
                                                                  }}
                                                                ></i>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>

                                                  </div>
                                                  
                                                </div>
                                                {selectedBagItems && Array.isArray(selectedBagItems) && selectedBagItems?.length > 0 && selectedBagItems?.some(sb => sb?._id ===el?._id)  ?
                                                
                                                  <div className="d-flex justify-content-center mt-auto m-3">
                                                        <button 
                                                        className="btn btn-danger" 
                                                        onClick={() => handleRemoveFromBag(el)}
                                                  >Remove From Bag</button>
                                                    </div>:
                                                <div className="d-flex justify-content-center mt-auto m-3">
                                                        <button 
                                                        className="btn btn-primary" 
                                                        onClick={() => handleAddToBag(el)}
                                                  >Add To Bag</button>
                                                    </div>
                                                }
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
