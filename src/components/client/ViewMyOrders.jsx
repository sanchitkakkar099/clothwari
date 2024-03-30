import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  Link, useLocation } from "react-router-dom";
import { useMyAllOrdersMutation } from "../../service";


function ViewMyOrders() {
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  console.log('location?.state?.data',location?.state?.data);

  const [reqOrders, resOrders] = useMyAllOrdersMutation();

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [totalCount, setTotalCount] = useState(0)

  console.log('TBLData',TBLData);

  useEffect(() => {
      reqOrders({
        page: currentPage,
        limit: pageSize,
        search: "",
      });
    
  }, [currentPage]);

  useEffect(() => {
    if (resOrders?.isSuccess) {
      setTBLData(resOrders?.data?.data?.docs)
      setTotalCount(resOrders?.data?.data?.totalDocs)
    }
  }, [resOrders]);


  return (
    <>
    {userInfo?.role === 'Client' ?
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
            {location?.state?.data &&
            Array.isArray(location?.state?.data) &&
            location?.state?.data?.length > 0 ? (
              location?.state?.data?.map((el, i) => {
                return (
                  <div className="card border shadow-none" key={i}>
                    <div className="card-body">
                      <div className="d-flex align-items-start border-bottom pb-3">
                        <div className="me-4">
                          {Array.isArray(el?.designId?.image) &&
                          el?.designId?.image[0]?.tif_extract_img ? (
                            <img
                              src={el?.designId?.image[0]?.tif_extract_img}
                              alt="image post"
                              height={80}
                              width={80}
                            />
                          ) : (
                            <img
                              src="https://www.bootdey.com/image/80x80/FFB6C1/000000"
                              alt="image post"
                              onClick={() =>
                                navigate(`/product-view/${el?._id}`)
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
                              Tag :{" "}
                              <span className="fw-medium">
                                {el?.designId?.tag &&
                                Array.isArray(el?.designId?.tag) &&
                                el?.designId?.tag?.length > 0
                                  ? el?.designId?.tag?.map((el) => el?.label)?.join(",")
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
              })
            ) : (
              <div className="card border shadow-none">
                <div className="card-body">
                  <div className="d-flex justify-content-center pb-2">
                    No Order Item To Display
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    :
    "Page Not Found"
    }
    </>
  );
}

export default ViewMyOrders;
