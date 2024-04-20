import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, set, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleValidatePhone } from "../../constant/formConstant";
import {  useGetSalesPermissionListQuery, useSalesPersonByIdQuery, useSubmitSalesPersonMutation } from "../../service";
import toast from "react-hot-toast";

function SalesPersonForm() {
  const navigate = useNavigate()
  const location = useLocation();
  
  const { state: locationState } = location;
  const [reqSalesPerson, resSalesPerson] = useSubmitSalesPersonMutation();
  const resSalesPersonById = useSalesPersonByIdQuery(locationState?.salesPersonID, {
    skip: !locationState?.salesPersonID,
  });
  const permissionList = useGetSalesPermissionListQuery()

  const [permissionDropdown,setPermissionDropDown] = useState([])
  const userInfo = useSelector((state) => state?.authState.userInfo)


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm();

  useEffect(() => {
    if (resSalesPersonById?.isSuccess && resSalesPersonById?.data?.data) {
      reset({
        _id: resSalesPersonById?.data?.data?._id,
        name: resSalesPersonById?.data?.data?.name,
        email: resSalesPersonById?.data?.data?.email,
        phone: resSalesPersonById?.data?.data?.phone,
        permissions:resSalesPersonById?.data?.data?.permissions
      });
    }
  }, [resSalesPersonById]);

  useEffect(() => {
    if(permissionList?.isSuccess && permissionList?.data?.data && Array.isArray(permissionList?.data?.data) && permissionList?.data?.data?.length > 0){
      setPermissionDropDown(permissionList?.data?.data?.map(el => ({label:el?.label,value:el?._id})))
    }
  },[permissionList])


  const onNext = (state) => {
    reqSalesPerson({
      ...state,
      permissions:state?.permissions?.map(el => el?.value)
    });
  };

  useEffect(() => {
    if (resSalesPerson?.isSuccess) {
      toast.success(resSalesPerson?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/sales-person-list");
    }
    if (resSalesPerson?.isError && resSalesPerson?.error?.data?.message === 'Email Already Exists') {
      setError("email", {
        type: "manual",
        message: resSalesPerson?.error?.data?.message,
      })
    }
  }, [resSalesPerson?.isSuccess,resSalesPerson?.isError]);
  

   return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Create Marketing</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Marketing</a>
                  </li>
                  <li className="breadcrumb-item active">Create Marketing</li>
                </ol>
              </div>
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
                        <h5 className="font-size-16 mb-1">Marketing Info</h5>
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
                    <Form onSubmit={handleSubmit(onNext)}>
                      
                      <div className="row">
                      <div className="col-md-6">
                      <div className="mb-3">
                        <Label className="form-label" for="name">
                            Name
                        </Label>
                        <Controller
                          id="name"
                          name="name"
                          control={control}
                          rules={{ required: "Name is required" }}
                          render={({ field }) => (
                            <Input
                              placeholder="Enter Name"
                              className="form-control"
                              {...field}
                              type="text"
                            />
                          )}
                        />
                        {errors.name && (
                          <FormFeedback>{errors?.name?.message}</FormFeedback>
                        )}
                      </div>
                      </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="email">
                              Email
                            </Label>
                            <Controller
                              id="email"
                              name="email"
                              control={control}
                              rules={{
                                  required: "Email is required",
                                  validate: {
                                    matchPattern: (v) =>
                                      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v) ||
                                      "Email address must be a valid address",
                                  },
                                }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Email"
                                  className="form-control"
                                  {...field}
                                  type="text"
                                />
                              )}
                            />
                            {errors.email && (
                              <FormFeedback>
                                {errors?.email?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        {!locationState?.isEdit &&
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="password">
                              Password
                            </Label>
                            <Controller
                              id="password"
                              name="password"
                              control={control}
                              rules={{ required: "Password is required" }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Password"
                                  className="form-control"
                                  {...field}
                                  type="text"
                                />
                              )}
                            />
                            {errors.password && (
                              <FormFeedback>
                                {errors?.password?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        }
                        <div className="col-md-6">
                      <div className="mb-3">
                        <Label className="form-label" for="phone">
                            Phone
                        </Label>
                        <Controller
                          id="phone"
                          name="phone"
                          control={control}
                          rules={{ 
                                validate: (value) => handleValidatePhone(value)
                          }}
                          render={({ field }) => (
                            <Input
                              placeholder="Enter Phone"
                              className="form-control"
                              {...field}
                              type="text"
                            />
                          )}
                        />
                        {errors.phone && (
                          <FormFeedback>{errors?.phone?.message}</FormFeedback>
                        )}
                      </div>
                      </div>
                        
                      {userInfo?.role === 'Super Admin' &&
                      <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="permissions" className="form-label">
                              Permissions
                            </Label>
                            <Controller
                              id="permissions"
                              name="permissions"
                              control={control}
                              rules={{ required: "Permissions is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  isMulti
                                  options={permissionDropdown}
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }), // Set a high z-index
                                    menu: base => ({ ...base, zIndex: 9999 }), // Set a high z-index
                                  }}
                                />
                              )}
                            />
                            {errors.permissions && (
                              <FormFeedback>
                                {errors?.permissions?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      }
                      </div>
                      
                      
                      <div className="row">
                        <div className="col text-end">
                          <Link to="/sales-person-list" className="btn btn-danger m-1">
                            {" "}
                            <i className="bx bx-x mr-1"></i> Cancel{" "}
                          </Link>
                          <button
                            type="submit"
                            className="btn btn-success m-1"
                            data-bs-toggle="modal"
                            data-bs-target="#success-btn"
                          >
                            <i className=" bx bx-file me-1"></i> Save{" "}
                          </button>
                        </div>
                      </div>
                    </Form>
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

export default SalesPersonForm;
