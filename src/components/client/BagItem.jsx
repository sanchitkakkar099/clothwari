import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearBagItems, removeBagItems } from "../../redux/clientSlice";
import { useAddToBagByClientMutation } from "../../service";
import toast from "react-hot-toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFeedback, Input } from "reactstrap";

function ClientBagItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reqAdd, resAdd] = useAddToBagByClientMutation();

  const selectedBagItems = useSelector(
    (state) => state?.clientState.selectedBagItems
  );

  console.log("selectedBagItems", selectedBagItems);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { fields,remove } = useFieldArray({
    control,
    name: "design",
  });
  console.log("fields", fields, errors);

  useEffect(() => {
    // Set default values when component mounts
    const defaultValues = selectedBagItems?.map((el) => ({
      _id: el?._id,
      name: el?.name,
      thumbnail: el?.thumbnail,
      designNo:el?.designNo,
      variation:el?.variation ? el?.variation : false,
      designId:el?.designId ? el?.designId : '',
      meter: "",
    })); // Default values
    setValue("design", defaultValues);
  }, []);

  const saveBagItems = (state) => {
    console.log("state", state);
    reqAdd({
      design: state?.design?.map((el) => ({
        designId: el?._id,
        meter: Number(el?.meter),
      })),
    });
  };

  useEffect(() => {
    if (resAdd?.isSuccess) {
      toast.success("Design Orders save successfully", {
        position: "top-center",
      });
      navigate("/client-view-design");
      setTimeout(() => {
        dispatch(clearBagItems([]));
      }, 2000);
    }
    if (resAdd?.isError) {
      toast.error("Failed to save", {
        position: "top-center",
      });
    }
  }, [resAdd?.isSuccess, resAdd?.isError]);

  const handleRemoveFromBag = (e,el,inx) => {
    e.preventDefault()
    const res = selectedBagItems?.filter((sb) => sb?._id !== el?._id);
    dispatch(removeBagItems(res));
    remove(inx)
  };

  // const handleChangeMiter = () => {}
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">BAG</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            {fields && Array.isArray(fields) && fields?.length > 0 ? (
              fields?.map((el, i) => {
                return (
                  <div className="card border shadow-none" key={i}>
                    <div className="card-body">
                      <div className="d-flex align-items-start border-bottom pb-3">
                        <div className="me-4">
                          {Array.isArray(el?.thumbnail) &&
                          el?.image[0]?.tif_extract_img ? (
                            <img
                              src={el?.image[0]?.tif_extract_img}
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
                              <a
                                href="ecommerce-product-detail.html"
                                className="text-dark"
                              >
                                {el?.name}
                              </a>
                            </h5>
                            <p className="mb-1">
                              Design No :{" "}
                              <span className="fw-medium">
                                {el?.designNo ? el?.designNo : ""}
                              </span>
                            </p>
                            <p className="mb-1">
                              Meter
                              <Controller
                                id={`design.${i}.meter`}
                                name={`design.${i}.meter`}
                                control={control}
                                rules={{
                                  required: "Meter is required",
                                  min: {
                                    value: 0,
                                    message:
                                      "Meter must be greater than or equal to 0",
                                  },
                                  max: {
                                    value: 100,
                                    message:
                                      "Meter must be less than or equal to 100",
                                  },
                                }}
                                render={({ field }) => (
                                  <Input
                                    placeholder="Entare Meter"
                                    {...field}
                                    value={field?.value}
                                    type="number"
                                  />
                                )}
                              />
                              {errors?.design && (
                                <FormFeedback>
                                  {errors?.design[i]?.meter?.message}
                                </FormFeedback>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                          <ul className="list-inline mb-0 font-size-16">
                            <li className="list-inline-item">
                              <Link
                                to=""
                                className="text-muted px-1"
                                onClick={(e) => handleRemoveFromBag(e,el,i)}
                              >
                                <i className="mdi mdi-trash-can-outline"></i>
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
              <div className="card border shadow-none">
                <div className="card-body">
                  <div className="d-flex justify-content-center pb-2">
                    No Bag Item To Display
                  </div>
                </div>
              </div>
            )}
            {selectedBagItems &&
              Array.isArray(selectedBagItems) &&
              selectedBagItems?.length > 0 && (
                <div className="row my-4">
                  <div className="col-sm-6">
                    <div className="text-sm-end mt-2 mt-sm-0">
                      <button
                        type="submit"
                        className="btn btn-success"
                        onClick={handleSubmit(saveBagItems)}
                      >
                        Save{" "}
                      </button>
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
