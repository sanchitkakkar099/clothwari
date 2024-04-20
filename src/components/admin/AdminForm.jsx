import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, set, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleValidatePhone } from "../../constant/formConstant";
import { useAdminByIdQuery, useGetAdminPermissionListQuery, useSubmitAdminMutation } from "../../service";
import toast from "react-hot-toast";

function AdminForm() {
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  const [reqAdmin, resAdmin] = useSubmitAdminMutation();
  const permissionList = useGetAdminPermissionListQuery()
  const resAdminById = useAdminByIdQuery(locationState?.adminID, {
    skip: !locationState?.adminID,
  });
  const [permissionDropdown,setPermissionDropDown] = useState([])


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm();

  useEffect(() => {
    if (resAdminById?.isSuccess && resAdminById?.data?.data) {
      reset({
        _id: resAdminById?.data?.data?._id,
        name: resAdminById?.data?.data?.name,
        email: resAdminById?.data?.data?.email,
        permissions:resAdminById?.data?.data?.permissions,
      });
    }
  }, [resAdminById]);


  useEffect(() => {
    if(permissionList?.isSuccess && permissionList?.data?.data){
      setPermissionDropDown(permissionList?.data?.data)
    }
  },[permissionList])

  const onNext = (state) => {
    reqAdmin({...state,
      permissions:state?.permissions?.map(el => el?._id)
    });
  };

  useEffect(() => {
    if (resAdmin?.isSuccess) {
      toast.success(resAdmin?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/admin-list");
    }
    if (resAdmin?.isError) {
      setError("email", {
        type: "manual",
        message: resAdmin?.error?.data?.message,
      })
    }
  }, [resAdmin?.isSuccess,resAdmin?.isError]);
  

   return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Create Admin</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Admin</a>
                  </li>
                  <li className="breadcrumb-item active">Create Admin</li>
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
                        <h5 className="font-size-16 mb-1">Admin Info</h5>
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
                        
                      </div>                      
                      <div className="row">
                        <div className="col text-end">
                          <Link to="/admin-list" className="btn btn-danger m-1">
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

export default AdminForm;
