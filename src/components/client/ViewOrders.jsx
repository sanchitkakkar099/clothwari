import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useClientBagListByAdminMutation } from "../../service";

function ViewOrders() {
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  console.log("location", location?.state);
  const { data: singleOrderData } = location?.state;

  const [allOrdersData, setAllOrdersData] = useState([]);

  const [reqBagListByAdmin, resBagListByAdmin] =
    useClientBagListByAdminMutation();

  useEffect(() => {
    reqBagListByAdmin({
      page: 1,
      limit: "",
      search: "",
    });
  }, []);

  useEffect(() => {
    if (
      location?.state?.from === "/dashboard" &&
      resBagListByAdmin?.isSuccess &&
      resBagListByAdmin?.data
    ) {
      const resData = resBagListByAdmin?.data?.data?.docs
        ?.map((el) => el?.design?.flat())
        ?.flat();
      console.log("resData", resData);
      if (resData && Array.isArray(resData) && resData?.length) {
        setAllOrdersData(resData);
      }
    }
  }, [location, resBagListByAdmin?.isSuccess]);

  return (
    <>
      {userInfo?.role === "Super Admin" &&
      singleOrderData &&
      Array.isArray(singleOrderData) &&
      singleOrderData?.length > 0 ? (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Orders</h4>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-12">
                {singleOrderData?.map((el, i) => {
                  return (
                    <div className="card border shadow-none" key={i}>
                      <div className="card-body">
                        <div className="d-flex align-items-start border-bottom pb-3">
                          <div className="me-4">
                            {Array.isArray(el?.designId?.thumbnail) &&
                            el?.designId?.thumbnail[0]?.pdf_extract_img ? (
                              <img
                                src={
                                  el?.designId?.thumbnail[0]?.pdf_extract_img
                                }
                                alt="image post"
                                height={80}
                                width={80}
                              />
                            ) : (
                              <img
                                src="https://www.bootdey.com/image/80x80/FFB6C1/000000"
                                alt="image post"
                                onClick={() =>
                                  navigate(`/product-view/${el?.designId?._id}`)
                                }
                              />
                            )}
                          </div>
                          <div className="flex-grow-1 align-self-center overflow-hidden">
                            <div>
                              <h5 className="text-truncate font-size-16">
                                <Link
                                  to={`/product-view/${el?.designId?._id}`}
                                  className="text-dark"
                                >
                                  {el?.designId?.name}
                                </Link>
                              </h5>
                              <p className="mb-1">
                                Design No :{" "}
                                <span className="fw-medium">
                                  {el?.designNo ? el?.designNo : ""}
                                </span>
                              </p>
                              <p className="mb-1">
                                Meter:{" "}
                                <span className="fw-medium">{el?.meter}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : userInfo?.role === "Super Admin" &&
        allOrdersData &&
        Array.isArray(allOrdersData) &&
        allOrdersData?.length > 0 ? (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Orders</h4>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-12">
                {allOrdersData?.map((el, i) => {
                  return (
                    <div className="card border shadow-none" key={i}>
                      <div className="card-body">
                        <div className="d-flex align-items-start border-bottom pb-3">
                          <div className="me-4">
                            {Array.isArray(el?.designId?.thumbnail) &&
                            el?.designId?.thumbnail[0]?.pdf_extract_img ? (
                              <img
                                src={
                                  el?.designId?.thumbnail[0]?.pdf_extract_img
                                }
                                alt="image post"
                                height={80}
                                width={80}
                              />
                            ) : (
                              <img
                                src="https://www.bootdey.com/image/80x80/FFB6C1/000000"
                                alt="image post"
                                onClick={() =>
                                  navigate(`/product-view/${el?.designId?._id}`)
                                }
                              />
                            )}
                          </div>
                          <div className="flex-grow-1 align-self-center overflow-hidden">
                            <div>
                              <h5 className="text-truncate font-size-16">
                                <Link
                                  to={`/product-view/${el?.designId?._id}`}
                                  className="text-dark"
                                >
                                  {el?.designId?.name}
                                </Link>
                              </h5>
                              <p className="mb-1">
                                Design No :{" "}
                                <span className="fw-medium">
                                  {el?.designId?.designNo
                                    ? el?.designId?.designNo
                                    : ""}
                                </span>
                              </p>
                              <p className="mb-1">
                                Meter:{" "}
                                <span className="fw-medium">{el?.meter}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border shadow-none">
          <div className="card-body">
            <div className="d-flex justify-content-center pb-2">
              No Order Item To Display
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewOrders;
