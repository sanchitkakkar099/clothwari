import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {  clearBagItems, removeBagItems } from "../../redux/clientSlice";
import { useAddToBagByClientMutation, useGetBagNotificationQuery } from "../../service";
import toast from "react-hot-toast";

function ClientBagItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [reqAdd,resAdd] = useAddToBagByClientMutation()

  const selectedBagItems = useSelector(
    (state) => state?.clientState.selectedBagItems
  );

  const saveBagItems = () => {
    if(selectedBagItems && Array.isArray(selectedBagItems) && selectedBagItems?.length > 0){
      reqAdd({designId:selectedBagItems?.map((el) => el?._id)})
    }
  };

  useEffect(() => {
    if (resAdd?.isSuccess) {
      toast.success("Design Orders save successfully", {
        position: "top-center",
      });
      navigate("/client-view-design");
      setTimeout(() => {
        dispatch(clearBagItems([]))
      }, 2000);
    }
    if (resAdd?.isError) {
      toast.error('Failed to save', {
        position: "top-center",
      });
    }
  }, [resAdd?.isSuccess,resAdd?.isError]);

  const handleRemoveFromBag = (el) => {
    const res = selectedBagItems?.filter((sb) => sb?._id !== el?._id);
    dispatch(removeBagItems(res));
  };
  return (
    <div className="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-flex align-items-center justify-content-between">
              <h4 class="mb-0">BAG</h4>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xl-12">
            {selectedBagItems &&
            Array.isArray(selectedBagItems) &&
            selectedBagItems?.length > 0 ? (
              selectedBagItems?.map((el, i) => {
                return (
                  <div class="card border shadow-none" key={i}>
                    <div class="card-body">
                      <div class="d-flex align-items-start border-bottom pb-3">
                        <div class="me-4">
                          {Array.isArray(el?.thumbnail) &&
                          el?.thumbnail[0]?.pdf_extract_img ? (
                            <img
                              src={el?.thumbnail[0]?.pdf_extract_img}
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
                        <div class="flex-grow-1 align-self-center overflow-hidden">
                          <div>
                            <h5 class="text-truncate font-size-16">
                              <a
                                href="ecommerce-product-detail.html"
                                class="text-dark"
                              >
                                {el?.name}
                              </a>
                            </h5>
                            <p class="mb-1">
                              Tag :{" "}
                              <span class="fw-medium">
                                {el?.tag &&
                                Array.isArray(el?.tag) &&
                                el?.tag?.length > 0
                                  ? el?.tag?.map((el) => el?.label)?.join(",")
                                  : ""}
                              </span>
                            </p>
                            {/* <p>
                        Size : <span class="fw-medium">08</span>
                      </p> */}
                          </div>
                        </div>
                        <div class="flex-shrink-0 ms-2">
                          <ul class="list-inline mb-0 font-size-16">
                            <li class="list-inline-item">
                              <Link
                                to=""
                                class="text-muted px-1"
                                onClick={() => handleRemoveFromBag(el)}
                              >
                                <i class="mdi mdi-trash-can-outline"></i>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div class="card border shadow-none">
                <div class="card-body">
                  <div class="d-flex justify-content-center pb-2">
                    No Bag Item To Display
                  </div>
                </div>
              </div>
            )}
            {selectedBagItems &&
              Array.isArray(selectedBagItems) &&
              selectedBagItems?.length > 0 && (
                <div class="row my-4">
                  <div class="col-sm-6">
                    <div class="text-sm-end mt-2 mt-sm-0">
                      <Link
                        to=""
                        class="btn btn-success"
                        onClick={() => saveBagItems()}
                      >
                         Save{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientBagItem;
