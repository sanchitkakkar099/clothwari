import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, set, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleValidatePhone } from "../../constant/formConstant";
import { useAdminByIdQuery, useSubmitAdminMutation } from "../../service";
import toast from "react-hot-toast";

function AdminForm() {
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  const [reqAdmin, resAdmin] = useSubmitAdminMutation();
  const resAdminById = useAdminByIdQuery(locationState?.adminID, {
    skip: !locationState?.adminID,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (resAdminById?.isSuccess && resAdminById?.data?.data) {
      reset({
        _id: resAdminById?.data?.data?._id,
        name: resAdminById?.data?.data?.name,
        email: resAdminById?.data?.data?.email,
      });
    }
  }, [resAdminById]);

  const onNext = (state) => {
    console.log("state", state);
    reqAdmin(state);
  };

  useEffect(() => {
    if (resAdmin?.isSuccess) {
      toast.success(resAdmin?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/admin-list");
    }
  }, [resAdmin?.isSuccess]);
  

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
                    <a href="javascript: void(0);">Admin</a>
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
                              placeholder="Entare Name"
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
                                  placeholder="Entare Email"
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
                                  placeholder="Entare Password"
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
                        {/* <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="permision" className="form-label">
                              Permision
                            </Label>
                            <Controller
                              id="permision"
                              name="permision"
                              control={control}
                              rules={{ required: "Permision is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  isMulti
                                  options={
                                    [
                                      {label:'Staff',value:'staff'},
                                      {label:'Client',value:'client'},
                                      {label:'Design',value:'design'},
                                      {label:'Category',value:'category'}
                                    
                                    ]|| []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.permision && (
                              <FormFeedback>
                                {errors?.permision?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div> */}
                        
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
