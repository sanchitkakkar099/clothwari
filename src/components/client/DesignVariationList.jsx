import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { addedBagItems, removeBagItems } from "../../redux/clientSlice";

function DesignVariationList() {
  const dispatch = useDispatch()
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const selectedBagItems = useSelector((state) => state?.clientState.selectedBagItems)
  console.log("location?.state?.data", location?.state?.data);
  const { data } = location?.state;

  const handleAddToBag = (el) => {
    dispatch(addedBagItems(el))
  }

  const handleRemoveFromBag = (el) => {
    const res = selectedBagItems?.filter(sb => sb?._id !== el?._id)
    dispatch(removeBagItems(res))
  }

  const handleAddToBagVariation = (el) => {
    dispatch(addedBagItems({
      _id:el?._id,
      name:el?.variation_name,
      designNo:el?.variation_designNo,
      thumbnail:el?.variation_image,
      designId:el?.designId,
      variation:true
    }))
  }

  return (
    <>
      {userInfo?.role === "Client" ? (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Select Designs</h4>
                </div>
              </div>
            </div>

            <div className="row ">
              <div className="col-lg-4 p-3">
                <div className="panel panel-white post panel-shadow">
                  <div className="post-image">
                    {Array.isArray(data?.image) &&
                    data?.image[0]?.tif_extract_img ? (
                      <img
                        src={data?.image[0]?.tif_extract_img}
                        // className="image"
                        alt="image post"
                        height={250}
                        width={"100%"}
                      />
                    ) : (
                      <img
                        src="https://www.bootdey.com/image/400x200/FFB6C1/000000"
                        alt="image post"
                        height={250}
                        width={"100%"}
                      />
                    )}
                  </div>
                  <div className="product_details">
                    <div className="post-description">
                      <h4>{data?.name}</h4>
                      <p>Design No : {data?.designNo}</p>
                    </div>
                    {selectedBagItems &&
                      Array.isArray(selectedBagItems) &&
                      selectedBagItems?.length > 0 &&
                      selectedBagItems?.some(
                        (sb) => sb?._id === data?._id
                      ) ? (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromBag(data)}
                          >
                            Remove From Bag
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToBag(data)}
                          >
                            Add To Bag
                          </button>
                        </div>
                      )}
                  
                  </div>
                </div>
              </div>
              {data?.variations && Array.isArray(data?.variations) && data?.variations?.length > 0 &&
              data?.variations?.map((ver,verInx) => {
                return(
                  <div className="col-lg-4 p-3" key={verInx}>
                <div className="panel panel-white post panel-shadow">
                  <div className="post-image">
                    {Array.isArray(ver?.variation_image) &&
                    ver?.variation_image[0]?.tif_extract_img ? (
                      <img
                        src={ver?.variation_image[0]?.tif_extract_img}
                        alt="image post"
                        height={250}
                        width={"100%"}
                      />
                    ) : (
                      <img
                        src="https://www.bootdey.com/image/400x200/FFB6C1/000000"
                        alt="image post"
                        height={250}
                        width={"100%"}
                      />
                    )}
                  </div>
                  <div className="product_details">
                    <div className="post-description">
                      <h4>{ver?.variation_name}</h4>
                      <p>Design No : {ver?.variation_designNo}</p>
                     
                    </div>
                    {selectedBagItems &&
                      Array.isArray(selectedBagItems) &&
                      selectedBagItems?.length > 0 &&
                      selectedBagItems?.some(
                        (sb) => sb?._id === ver?._id
                      ) ? (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromBag(ver)}
                          >
                            Remove From Bag
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToBagVariation(ver)}
                          >
                            Add To Bag
                          </button>
                        </div>
                      )}
                    
                  </div>
                </div>
              </div>
                )
              })
              }
              
            </div>
          </div>
        </div>
      ) : (
        "Page Not Found"
      )}
    </>
  );
}

export default DesignVariationList;
