import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { addedBagItems, addedPDFItems, removeBagItems, removePDFItems } from "../../redux/clientSlice";

function DesignVariationList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const selectedBagItems = useSelector((state) => state?.clientState.selectedBagItems)
  const selectedPDFItems = useSelector((state) => state?.clientState.selectedPDFItems)

  console.log("location?.state?.data", location?.state);
  const { data } = location?.state;
  console.log('selectedPDFItems',selectedPDFItems);

  const handleAddToBag = (el) => {
    dispatch(addedBagItems({
      _id:el?._id,
      name:el?.name,
      designNo:el?.designNo,
      thumbnail:el?.thumbnail,
      designId:el?.designId,
      variation:false
    }))
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
      thumbnail:el?.variation_thumbnail,
      designId:el?.designId,
      variation:true
    }))
  }



  const handleAddToPDF = (el) => {
    dispatch(addedPDFItems({
      id:el?._id,
      designNo:el?.designNo,
      thumbnail:el?.thumbnail,
      variation:false
    }))
  }

  const handleRemoveFromPDF = (el) => {
    const res = selectedPDFItems?.filter(sb => sb?.id !== el?._id)
    dispatch(removePDFItems(res))
  }

  const handleAddToPDFVariation = (el) => {
    dispatch(addedPDFItems({
      id:el?._id,
      designNo:el?.variation_designNo,
      thumbnail:el?.variation_thumbnail,
      variation:true
    }))
  }

  const backToDesign = (e) => {
    e.preventDefault()
    if(location?.state?.tag === "sales"){
      navigate('/sales-view-design',{
        state:{
          currentPage:location?.state?.currentPage,
          tagsSearch:location?.state?.tagsSearch,
          startDate:location?.state?.startDate,
          search:location?.state?.search,
        }
      })
    }
    if(location?.state?.tag === "client"){
      navigate('/client-view-design',{
        state:{
          currentPage:location?.state?.currentPage,
          tagsSearch:location?.state?.tagsSearch,
          startDate:location?.state?.startDate,
          search:location?.state?.search,
        }
      })
    }
   
  }
  return (
    <>
      {userInfo?.role === "Client" || userInfo?.role === "SalesPerson" ? (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Select Designs</h4>

                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => backToDesign(e)}>Back To View Design</button>
            </div>

            <div className="row ">
              <div className="col-lg-4 p-3">
                <div className="panel panel-white post panel-shadow">
                  <div className="post-image">
                    {Array.isArray(data?.thumbnail) &&
                    data?.thumbnail[0]?.pdf_extract_img ? (
                      <img
                        src={data?.thumbnail[0]?.pdf_extract_img}
                        // className="image"
                        alt="image post"
                        height={250}
                        width={"100%"}
                        style={{objectFit:'cover'}}
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
                    
                  </div>
                  <div className="product_action_button">

                  {selectedPDFItems &&
                      Array.isArray(selectedPDFItems) &&
                      selectedPDFItems?.length > 0 &&
                      selectedPDFItems?.some(
                        (sb) => sb?.id === data?._id
                      ) ? (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromPDF(data)}
                          >
                            Remove From PDF
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToPDF(data)}
                          >
                            Add To PDF
                          </button>
                        </div>
                      )}


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
                    {Array.isArray(ver?.variation_thumbnail) &&
                    ver?.variation_thumbnail[0]?.pdf_extract_img ? (
                      <img
                        src={ver?.variation_thumbnail[0]?.pdf_extract_img}
                        alt="image post"
                        height={250}
                        width={"100%"}
                        style={{objectFit:'cover'}}
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
                    
                    
                  </div>
                  <div className="product_action_button">

                  {selectedPDFItems &&
                      Array.isArray(selectedPDFItems) &&
                      selectedPDFItems?.length > 0 &&
                      selectedPDFItems?.some(
                        (sb) => sb?.id === ver?._id
                      ) ? (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromPDF(ver)}
                          >
                            Remove From PDF
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center  m-3">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToPDFVariation(ver)}
                          >
                            Add To PDF
                          </button>
                        </div>
                      )}

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
