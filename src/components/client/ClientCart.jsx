import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearBagItems, removeBagItems } from "../../redux/clientSlice";
import { useAddToBagByClientMutation } from "../../service";
import toast from "react-hot-toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFeedback, Input } from "reactstrap";
import ReactDatePicker from "react-datepicker";
import { XCircle } from "react-feather";

function ClientCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedBagItems = useSelector(
    (state) => state?.clientState.selectedBagItems
  );
  console.log("selectedBagItems", selectedBagItems);
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues:{
      cartItem:selectedBagItems
    }
  });
  const { fields,remove } = useFieldArray({
    control,
    name: "cartItem"
  });
  console.log('fields',fields);
  const quantityPerCombo = watch("quantityPerCombo", 0);

  const handleRemoveFromCart = (e, el,removeIndex) => {
    e.preventDefault();
    console.log("el", el,selectedBagItems);
    const res = selectedBagItems?.filter((sb) => sb?._id !== el?._id);
    dispatch(removeBagItems(res));
    remove(removeIndex)
  };

  const onSubmit = (data) => {
    console.log("onSubmit data",data);
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Cart</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              <div className="card">
                <a
                  href="#addproduct-productinfo-collapse"
                  className="text-dark"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="addproduct-productinfo-collapse"
                >
                  <div className="p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-16 mb-1">Cart Info</h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all information below
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                <div
                  id="addproduct-productinfo-collapse"
                  className="collapse show"
                  data-bs-parent="#addproduct-accordion"
                >
                  <div className="p-4 border-top">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="name">
                              Customer Name
                            </label>
                            <Controller
                              name="customerName"
                              control={control}
                              rules={{ required: "Customer Name is required" }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Customer Name"
                                />
                              )}
                            />
                            {errors.customerName && (
                              <span className="text-danger">
                                {errors.customerName.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="customerCode"
                            >
                              Customer Code
                            </label>
                            <Controller
                              name="customerCode"
                              control={control}
                              rules={{ required: "Customer Code is required" }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Customer Code"
                                />
                              )}
                            />
                            {errors.customerCode && (
                              <span className="text-danger">
                                {errors.customerCode.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="marketingPersonName"
                            >
                              Marketing Person Name
                            </label>
                            <Controller
                              name="marketingPersonName"
                              control={control}
                              rules={{
                                required: "Marketing Person Name is required",
                              }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Marketing Person Name"
                                />
                              )}
                            />
                            {errors.marketingPersonName && (
                              <span className="text-danger">
                                {errors.marketingPersonName.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="salesOrderNumber"
                            >
                              Sales Order Number
                            </label>
                            <Controller
                              name="salesOrderNumber"
                              control={control}
                              rules={{
                                required: "Sales Order Number is required",
                                pattern: {
                                  value: /^[a-zA-Z0-9_-]*$/, // Regular expression to allow alphanumeric characters
                                  message:
                                    "Please enter a valid Sales Order Number",
                                },
                              }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Sales Order Number"
                                />
                              )}
                            />
                            {errors.salesOrderNumber && (
                              <span className="text-danger">
                                {errors.salesOrderNumber.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <hr/>
                      {fields.map((design, index) => (
                      <div key={index}>
                      <h5>Design No: {design?.designNo}</h5>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor={`cartItem.${index}.quantityPerCombo`}
                            >
                              Quantity per Combo
                            </label>
                            <Controller
                              id={`cartItem.${index}.quantityPerCombo`}
                              name={`cartItem.${index}.quantityPerCombo`}
                              control={control}
                              rules={{
                                required: "Quantity per Combo is required",
                              }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  className="form-control"
                                  placeholder="Enter Quantity per Combo"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              )}
                            />
                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.quantityPerCombo?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="yardage">
                              Yardage
                            </label>
                            <Controller
                              id={`cartItem.${index}.yardage`}
                              name={`cartItem.${index}.yardage`}
                              control={control}
                              rules={{
                                required: "Yardage is required",
                                min: {
                                  value: 1,
                                  message: "Yardage must be at least 1",
                                },
                                max: {
                                  value: 100,
                                  message: "Yardage must be at most 100",
                                },
                              }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  className="form-control"
                                  placeholder="Enter Yardage"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              )}
                            />
                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.yardage?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                          <div className="col-md-6">
                              <div className="mb-3">
                                  <label className="form-label" htmlFor="totalQuantity" style={{display:'flex'}}>
                                      Image Design
                                  </label>
                                  {design?.thumbnail[0] && (
                                      <div style={{ position: "relative", display: "inline-block" }}>
                                          <img
                                              src={design?.thumbnail[0]?.pdf_extract_img}
                                              alt={`Design ${design?.designNo}`}
                                              width="100"
                                              height="100"
                                              style={{ display: "block" }} // Ensure the image is displayed as a block element
                                          />
                                          <div style={{ position: "absolute", top: "-10px", right: "-10px" }}>
                                              <XCircle
                                                  size={21}
                                                  style={{ color: "#000", cursor: "pointer" }}
                                                  onClick={(e) => handleRemoveFromCart(e, design,index)}
                                              />
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                          <div className="col-md-6">
                              <div className="mb-3">
                                  <label className="form-label" htmlFor="fabricDetails">
                                      Base Fabrics Details / Type of Fabric
                                  </label>
                                  <Controller
                                      id={`cartItem.${index}.fabricDetails`}
                                      name={`cartItem.${index}.fabricDetails`}
                                      control={control}
                                      rules={{
                                          required: "Base Fabrics Details / Type of Fabric is required",
                                      }}
                                      render={({ field }) => (
                                          <input
                                              {...field}
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Base Fabrics Details / Type of Fabric"
                                          />
                                      )}
                                  />
                                  {errors?.cartItem && (
                                    <FormFeedback>
                                      {
                                        errors?.cartItem[index]
                                          ?.fabricDetails?.message
                                      }
                                    </FormFeedback>
                                  )}
                              </div>
                          </div>
                      </div>


                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="strikeRequired"
                            >
                              Strike Required
                            </label>
                            <Controller
                              id={`cartItem.${index}.strikeRequired`}
                              name={`cartItem.${index}.strikeRequired`}
                              control={control}
                              rules={{
                                required:
                                  "Please select whether strike is required",
                              }}
                              render={({ field }) => (
                                <select {...field} className="form-select">
                                  <option value="">Select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              )}
                            />
                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.strikeRequired?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="sampleDeliveryDate"
                            >
                              Sample Delivery Date
                            </label>
                            <Controller
                              id={`cartItem.${index}.sampleDeliveryDate`}
                              name={`cartItem.${index}.sampleDeliveryDate`}
                              control={control}
                              rules={{
                                required: "Sample Delivery Date is required",
                              }}
                              render={({ field }) => (
                                <ReactDatePicker
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  onChange={(date) => field.onChange(date)}
                                  className="form-control"
                                  placeholderText="Select Sample Delivery Date"
                                  dateFormat="yyyy-MM-dd"
                                />
                              )}
                            />
                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.sampleDeliveryDate?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="pricePerMeter"
                            >
                              Price per Meter
                            </label>
                            <Controller
                              id={`cartItem.${index}.pricePerMeter`}
                              name={`cartItem.${index}.pricePerMeter`}
                              control={control}
                              rules={{
                                required: "Price per Meter is required",
                                pattern: {
                                  value: /^[0-9]+(\.[0-9]*)?$/, // Regular expression for numbers and optional decimal values
                                  message: "Enter a valid Price per Meter",
                                },
                              }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  className="form-control"
                                  placeholder="Enter Price per Meter"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              )}
                            />
                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.pricePerMeter?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="bulkOrderDeliveryDate"
                            >
                              Bulk Order Delivery Date
                            </label>

                            <Controller
                              id={`cartItem.${index}.bulkOrderDeliveryDate`}
                              name={`cartItem.${index}.bulkOrderDeliveryDate`}
                              control={control}
                              rules={{
                                required:
                                  "Bulk Order Delivery Date is required",
                              }}
                              render={({ field }) => (
                                <ReactDatePicker
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  onChange={(date) => field.onChange(date)}
                                  className="form-control"
                                  placeholderText="Select Bulk Order Delivery Date"
                                  dateFormat="yyyy-MM-dd"
                                />
                              )}
                            />

                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.bulkOrderDeliveryDate?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="shipmentSampleDate"
                            >
                              Shipment Sample Date
                            </label>
                            <Controller
                              id={`cartItem.${index}.shipmentSampleDate`}
                              name={`cartItem.${index}.shipmentSampleDate`}
                              control={control}
                              rules={{
                                required: "Shipment Sample Date is required",
                              }}
                              render={({ field }) => (
                                <ReactDatePicker
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  onChange={(date) => field.onChange(date)}
                                  className="form-control"
                                  placeholderText="Select Shipment Sample Date"
                                  dateFormat="yyyy-MM-dd"
                                />
                              )}
                            />
                            {errors?.cartItem && (
                              <FormFeedback>
                                {
                                  errors?.cartItem[index]
                                    ?.shipmentSampleDate?.message
                                }
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>
                      </div>
                      ))}

                      <div className="row">
                        <div className="col text-end">
                        <Link
                            className="btn btn-danger m-1"
                            to={"/client-view-design"}
                           
                          >
                            <i className="bx bx-x mr-1"></i> Cancel
                          </Link>
                          <button
                            type="submit"
                            className="btn btn-success m-1"
                            data-bs-toggle="modal"
                            data-bs-target="#success-btn"
                          >
                            <i className="bx bx-file me-1"></i> Save
                          </button>
                        </div>
                      </div>
                    </form>
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

export default ClientCart;
