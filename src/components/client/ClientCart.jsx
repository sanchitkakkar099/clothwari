import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { addedBagItems, clearBagItems, removeBagItems } from "../../redux/clientSlice";
import {  useClientDropDownListQuery, useClientOrderByIdV2Query, useOrderUpdateByMarketerMutation, useSalesPersonDropDownQuery, useSaveCartItemMutation } from "../../service";
import toast from "react-hot-toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFeedback, Input } from "reactstrap";
import ReactDatePicker from "react-datepicker";
import { XCircle } from "react-feather";
import ReactSelect from "react-select";
import { generateOrderNumber } from "../../utils/orderNumberGenerator";
import dayjs from "dayjs";
import { useDebounce } from "../../hook/useDebpunce";

function ClientCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const resCartById = useClientOrderByIdV2Query(location?.state?.cartID, {
    skip: !location?.state?.cartID,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const selectedBagItems = useSelector(
    (state) => state?.clientState.selectedBagItems
  );
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues:{
      marketingPersonName:userInfo?.role === "SalesPerson" ? userInfo?.name : "",
      marketerId:userInfo?.role === "SalesPerson" ? userInfo?._id : "",
      customerName:userInfo?.role === "Client" ? userInfo?.name : "",
      clientId:userInfo?.role === "Client" ? userInfo?._id : "",
      salesOrderNumber:generateOrderNumber(userInfo?.name),
      customerCode: userInfo?.role === "Client" ? userInfo?.customerCode : "",
      cartItem:selectedBagItems
    }
  });
  console.log('selectedBagItems',selectedBagItems);
  const { fields,remove } = useFieldArray({
    control,
    name: "cartItem"
  });
  console.log('fields',fields);
  const [clientDropDown,setClientDropDown] = useState([])
  const [salesPersonDropDown,setSalesPersonDropDown] = useState([])

  const [reqSaveCartItem,resSaveCartItem] = useSaveCartItemMutation()
  const [reqUpdateCartItem,resUpdateCartItem] = useOrderUpdateByMarketerMutation()

  const resClientDropDown = useClientDropDownListQuery()
  const resSalesPersonDropDown = useSalesPersonDropDownQuery()

  const debounceValue1 = useDebounce(watch('customerName'),500)

  useEffect(() => {
    setValue('customerCode',debounceValue1?.customerCode)
  },[debounceValue1])

  useEffect(() => {
    if (resCartById?.isSuccess && resCartById?.data?.data) {
      reset({
        ...resCartById?.data?.data,
        marketingPersonName:userInfo?.role === "SalesPerson" ? userInfo?.name : {label:resCartById?.data?.data?.marketingPersonName,value:resCartById?.data?.data?.marketerId},
        marketerId:userInfo?.role === "SalesPerson" ? userInfo?._id : "",
        customerName:userInfo?.role === "Client" ? userInfo?.name : {label:resCartById?.data?.data?.customerName,value:resCartById?.data?.data?.clientId, customerCode:resCartById?.data?.data?.customerCode},
        clientId:userInfo?.role === "Client" ? userInfo?._id : resCartById?.data?.data?.clientId,
        cartItem:resCartById?.data?.data?.cartItem?.map(el => ({
          ...el,
          strikeRequired:{label:el?.strikeRequired === 'yes' ? "Yes" : 'No',value:el?.strikeRequired},
          thumbnail:[el?.thumbnail]
        }))
      })
      console.log('resCartById?.data?.data',resCartById?.data?.data);
    }
  },[resCartById?.isSuccess])
  useEffect(() => {
    if(resClientDropDown?.isSuccess && resClientDropDown?.data){
      const clientList = resClientDropDown?.data?.data?.map(el => ({label:el?.name,value:el?._id, customerCode:el?.customerCode}))
      setClientDropDown(clientList)
    }
  },[resClientDropDown?.isSuccess]) 
  
  useEffect(() => {
    if(resSalesPersonDropDown?.isSuccess && resSalesPersonDropDown?.data){
      const salesList = resSalesPersonDropDown?.data?.data?.map(el => ({label:el?.name,value:el?._id}))
      setSalesPersonDropDown(salesList)
    }
  },[resSalesPersonDropDown?.isSuccess]) 


  const handleRemoveFromCart = (e, el,removeIndex) => {
    e.preventDefault();
    const res = selectedBagItems?.filter((sb) => sb?.designId !== el?.designId);
    dispatch(removeBagItems(res));
    remove(removeIndex)
  };

  const onSubmit = (data) => {
    if(location?.state?.isEdit){
      const payload = { 
        ...data,
        customerName: (userInfo?.role === "SalesPerson" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.customerName?.label : data?.customerName,
        clientId: (userInfo?.role === "SalesPerson" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.customerName?.value : data?.clientId,
        marketerId: (userInfo?.role === "Client" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.marketingPersonName?.value : data?.marketerId,
        marketingPersonName: (userInfo?.role === "Client" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.marketingPersonName?.label : data?.marketingPersonName,
        cartItem:data?.cartItem?.map((el => ({
          ...el,
          bulkOrderDeliveryDate:dayjs(el?.bulkOrderDeliveryDate).format(),
          sampleDeliveryDate:dayjs(el?.sampleDeliveryDate).format(),
          shipmentSampleDate:dayjs(el?.shipmentSampleDate).format(),
          strikeRequired:el?.strikeRequired?.value,
          thumbnail:el?.thumbnail[0]?._id
        })))
      }
      reqUpdateCartItem(payload)
      console.log('payload',payload);
    }else{
      const payload = { 
        ...data,
        byClient: userInfo?.role === "Client" ? true : false,
        customerName: (userInfo?.role === "SalesPerson" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.customerName?.label : data?.customerName,
        clientId: (userInfo?.role === "SalesPerson" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.customerName?.value : data?.clientId,
        marketerId: (userInfo?.role === "Client" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.marketingPersonName?.value : data?.marketerId,
        marketingPersonName: (userInfo?.role === "Client" || userInfo?.role === "Admin" || userInfo?.role === "Super Admin") ? data?.marketingPersonName?.label : data?.marketingPersonName,
        cartItem:data?.cartItem?.map((el => ({
          ...el,
          bulkOrderDeliveryDate:dayjs(el?.bulkOrderDeliveryDate).format(),
          sampleDeliveryDate:dayjs(el?.sampleDeliveryDate).format(),
          shipmentSampleDate:dayjs(el?.shipmentSampleDate).format(),
          strikeRequired:el?.strikeRequired?.value,
          thumbnail:el?.thumbnail[0]?._id
        })))
      }
      reqSaveCartItem(payload)
    }
  };

  useEffect(() => {
    if (resSaveCartItem?.isSuccess) {
      toast.success("Order Success", {
        position: "top-center",
      });
      reset()
      if(userInfo?.role === 'SalesPerson'){
        navigate("/view-my-orders");
      }
      if(userInfo?.role === 'Client'){
        navigate("/view-my-orders");
      }
      dispatch(clearBagItems([]))
    }
    if (resSaveCartItem?.isError) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  }, [resSaveCartItem?.isSuccess,resSaveCartItem?.isError]);

  useEffect(() => {
    if (resUpdateCartItem?.isSuccess) {
      toast.success("Order Update Success", {
        position: "top-center",
      });
      reset()
      if(userInfo?.role === 'SalesPerson'){
        navigate("/view-my-orders");
      }
      if(userInfo?.role === 'Client'){
        navigate("/view-my-orders");
      }
      dispatch(clearBagItems([]))
    }
    if (resUpdateCartItem?.isError) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  }, [resUpdateCartItem?.isSuccess,resUpdateCartItem?.isError]);

  return (
    <>
    {location?.state?.isEdit || (selectedBagItems && Array.isArray(selectedBagItems) && selectedBagItems?.length > 0) ?            

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
                            {(userInfo?.role === "SalesPerson" || userInfo?.role === 'Super Admin' || ( userInfo?.role === 'Admin' && userInfo?.permissions?.includes("Order Create")) )?
                            <Controller
                              id={"customerName"}
                              name={"customerName"}
                              control={control}
                              rules={{
                                required:
                                  "Please Select Customer",
                              }}
                              render={({ field }) => (
                                <ReactSelect 
                                  {...field} 
                                  onChange={(val) => field.onChange(val)}
                                  options={clientDropDown || []}
                                  isDisabled={location?.state?.isEdit}
                                />
                              )}
                            />
                            :
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
                                  readOnly
                                />
                              )}
                            />
                            }
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
                                  disabled
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
                            {userInfo?.role === "SalesPerson" ?
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
                                  readOnly
                                />
                              )}
                            />
                            :
                            <Controller
                              id={"marketingPersonName"}
                              name={"marketingPersonName"}
                              control={control}
                              rules={userInfo?.role === 'SalesPerson' ? {
                                required:
                                  "Please Select Marketing Person",
                              } : {}}
                              render={({ field }) => (
                                <ReactSelect 
                                  {...field} 
                                  onChange={(val) => field.onChange(val)}
                                  options={salesPersonDropDown || []}
                                  
                                />
                              )}
                            />
                            }
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
                                  disabled
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
                              // rules={{
                              //   required: "Yardage is required",
                              //   min: {
                              //     value: 1,
                              //     message: "Yardage must be at least 1",
                              //   },
                              //   max: {
                              //     value: 100,
                              //     message: "Yardage must be at most 100",
                              //   },
                              // }}
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
                                          {!location?.state?.isEdit &&
                                          <div style={{ position: "absolute", top: "-10px", right: "-10px" }}>
                                              <XCircle
                                                  size={21}
                                                  style={{ color: "#000", cursor: "pointer" }}
                                                  onClick={(e) => handleRemoveFromCart(e, design,index)}
                                              />
                                          </div>
                                          }
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
                              Strike Off
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
                                <ReactSelect 
                                  {...field} 
                                  // className="form-select"
                                  onChange={(val) => field.onChange(val)}
                                  options={[
                                    {label:'Yes',value:'yes'},
                                    {label:'No',value:'no'}
                                  ]}
                                />
                                  
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
                              {userInfo?.role === 'SalesPerson' ? "Final Sample Date" : "Expected Sample Date"}
                            </label>
                            <Controller
                              id={`cartItem.${index}.sampleDeliveryDate`}
                              name={`cartItem.${index}.sampleDeliveryDate`}
                              control={control}
                              rules={{
                                required: `${userInfo?.role === 'SalesPerson' ? 'Final Sample Date' : 'Expected Sample Date'} is required`,
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
                            {userInfo?.role === 'SalesPerson' ? "Final Bulk Order Delivery Date" : "Expected Bulk Order Delivery Date"}
                            </label>

                            <Controller
                              id={`cartItem.${index}.bulkOrderDeliveryDate`}
                              name={`cartItem.${index}.bulkOrderDeliveryDate`}
                              control={control}
                              rules={{
                                required:
                                  `${userInfo?.role === 'SalesPerson' ? "Final Bulk Order Delivery Date" : "Expected Bulk Order Delivery Date"} is required`,
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
                        <div className="col-md-6">
                              <div className="mb-3">
                                  <label className="form-label" htmlFor="selvage">
                                    Selvage
                                  </label>
                                  <Controller
                                      id={`cartItem.${index}.selvage`}
                                      name={`cartItem.${index}.selvage`}
                                      control={control}
                                      rules={{
                                          required: "Selvage is required",
                                      }}
                                      render={({ field }) => (
                                          <input
                                              {...field}
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Selvage"
                                          />
                                      )}
                                  />
                                  {errors?.cartItem && (
                                    <FormFeedback>
                                      {
                                        errors?.cartItem[index]
                                          ?.selvage?.message
                                      }
                                    </FormFeedback>
                                  )}
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-md-6">
                              <div className="mb-3">
                                  <label className="form-label" htmlFor="remarks">
                                    Remarks
                                  </label>
                                  <Controller
                                      id={`cartItem.${index}.remarks`}
                                      name={`cartItem.${index}.remarks`}
                                      control={control}
                                      rules={{
                                          required: "Remarks is required",
                                      }}
                                      render={({ field }) => (
                                          <input
                                              {...field}
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Remarks"
                                          />
                                      )}
                                  />
                                  {errors?.cartItem && (
                                    <FormFeedback>
                                      {
                                        errors?.cartItem[index]
                                          ?.remarks?.message
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
                            to={userInfo?.role === "Client" ? "/client-view-design" : "/pdf-maker-view-design"}
                           
                          >
                            <i className="bx bx-x mr-1"></i> Cancel
                          </Link>
                          <button
                            type="submit"
                            className="btn btn-success m-1"
                            data-bs-toggle="modal"
                            data-bs-target="#success-btn"
                            disabled={resSaveCartItem?.isLoading || resUpdateCartItem?.isLoading}
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
    :
    <Navigate to="/dashboard"/>
    }
    </>
  );
}

export default ClientCart;
