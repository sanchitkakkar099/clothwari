import React, { useEffect } from "react";
import One from "../../assets/images/product/five.jpg";
import Two from "../../assets/images/product/seven.jpg";
import Three from "../../assets/images/product/four.jpg";
import Four from "../../assets/images/product/three.jpg";
import Five from "../../assets/images/product/one.jpg";
import Six from "../../assets/images/product/six.jpg";
import { useDesignUploadListMutation } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";

function UploadDesignListV1() {
  const dispatch = useDispatch();
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  console.log("designUploadList", designUploadList);

  useEffect(() => {
    reqDesign({
      page: 1,
      limit: 6,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
    }
  }, [resDesign]);

  const handleSearch = (search) => {
    reqDesign({
      page: 1,
      limit: 6,
      search: search,
    });
  };

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
          <div className="col-xl-3 col-lg-4">
            <div className="card">
              <div className="card-header bg-transparent border-bottom">
                <h5 className="mb-0">Filters</h5>
              </div>
              <div className="custom-accordion">
                <div className="p-4 border-top">
                  <div>
                    <h5 className="font-size-14 mb-0">
                      <a
                        href="#filterprodductcolor-collapse"
                        className="text-dark d-block"
                        data-bs-toggle="collapse"
                      >
                        Colors{" "}
                        <i className="mdi mdi-chevron-up float-end accor-down-icon"></i>
                      </a>
                    </h5>
                    <div
                      className="collapse show"
                      id="filterprodductcolor-collapse"
                    >
                      <div className="mt-4">
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck1"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck1"
                          >
                            <i className="mdi mdi-circle text-dark mx-1"></i>{" "}
                            Black
                          </label>
                        </div>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck3"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck3"
                          >
                            <i className="mdi mdi-circle text-secondary mx-1"></i>{" "}
                            Gray
                          </label>
                        </div>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck4"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck4"
                          >
                            <i className="mdi mdi-circle text-primary mx-1"></i>{" "}
                            Blue
                          </label>
                        </div>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck5"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck5"
                          >
                            <i className="mdi mdi-circle text-success mx-1"></i>{" "}
                            Green
                          </label>
                        </div>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck6"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck6"
                          >
                            <i className="mdi mdi-circle text-danger mx-1"></i>{" "}
                            Red
                          </label>
                        </div>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck7"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck7"
                          >
                            <i className="mdi mdi-circle text-warning mx-1"></i>{" "}
                            Yellow
                          </label>
                        </div>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="productcolorCheck8"
                          />
                          <label
                            className="form-check-label"
                            for="productcolorCheck8"
                          >
                            <i className="mdi mdi-circle text-purple mx-1"></i>{" "}
                            Purple
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-lg-8">
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
                        {designUploadList &&
                        Array.isArray(designUploadList) &&
                        designUploadList?.length > 0 ? (
                          designUploadList?.map((el, i) => {
                            return (
                              <div className="col-xl-4 col-sm-6" key={i}>
                                <div className="product-box">
                                  <div className="product-img pt-4 px-4">
                                    <img
                                      src={el?.thumbnail?.filepath}
                                      alt=""
                                      className="img-fluid mx-auto d-block"
                                    />
                                  </div>

                                  <div className="product-content p-4">
                                    <div className="d-flex justify-content-between align-items-end">
                                      <div>
                                        <h5 className="mb-1">
                                          <a
                                            href="#!"
                                            className="text-dark font-size-16"
                                          >
                                            {el?.name}
                                          </a>
                                        </h5>
                                        {/* <p className="text-muted font-size-13">Gray, Shoes</p> */}
                                        {/* <h5 className="mt-3 mb-0">$260</h5> */}
                                      </div>
                                      <div></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h4 className="text-center mt-5">No Design Found</h4>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
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

export default UploadDesignListV1;
