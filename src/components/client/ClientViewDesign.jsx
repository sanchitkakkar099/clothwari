import React, { useEffect } from "react";
import { useDesignUploadListMutation } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link } from "react-router-dom";

function ClientViewDesign() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  console.log("userInfo", userInfo);
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  useEffect(() => {
    reqDesign({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
    }
  }, [resDesign]);

  const onAddDesignClick = (e, designInfo) => {
    console.log("infoooooo", {
      userId: userInfo?._id,
      userName: userInfo?.name,
      userEmail: userInfo?.email,
      designId: designInfo?._id,
      designName: designInfo?.name,
      designCategory: designInfo?.category?.label,
    });
  };

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
                      <div className="row">
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

export default ClientViewDesign;
