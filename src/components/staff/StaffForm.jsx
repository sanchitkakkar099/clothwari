import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, set, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { handleValidatePhone } from "../../constant/formConstant";
import { useDesignerByIdQuery, useSubmitDesignerMutation } from "../../service";
import toast from "react-hot-toast";

function StaffForm() {
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  const [reqDesigner, resDesigner] = useSubmitDesignerMutation();
  const resDesignerById = useDesignerByIdQuery(locationState?.designerID, {
    skip: !locationState?.designerID,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (resDesignerById?.isSuccess && resDesignerById?.data?.data) {
      reset({
        _id: resDesignerById?.data?.data?._id,
        firstName: resDesignerById?.data?.data?.firstName,
        lastName: resDesignerById?.data?.data?.lastName,
        email: resDesignerById?.data?.data?.email,
        phone: resDesignerById?.data?.data?.phone,
        onlyUpload: resDesignerById?.data?.data?.onlyUpload,
      });
    }
  }, [resDesignerById]);

  const onNext = (state) => {
    console.log("state", state);
    reqDesigner(state);
  };

  useEffect(() => {
    if (resDesigner?.isSuccess) {
      toast.success(resDesigner?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/staff-list");
    }
  }, [resDesigner?.isSuccess]);
  

   return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Create Staff</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Staff</a>
                  </li>
                  <li className="breadcrumb-item active">Create Staff</li>
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
                        <h5 className="font-size-16 mb-1">Staff Info</h5>
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
                        <Label className="form-label" for="firstName">
                            First Name
                        </Label>
                        <Controller
                          id="firstName"
                          name="firstName"
                          control={control}
                          rules={{ required: "First Name is required" }}
                          render={({ field }) => (
                            <Input
                              placeholder="Entare First Name"
                              className="form-control"
                              {...field}
                              type="text"
                            />
                          )}
                        />
                        {errors.firstName && (
                          <FormFeedback>{errors?.firstName?.message}</FormFeedback>
                        )}
                      </div>
                      </div>
                      <div className="col-md-6">
                      <div className="mb-3">
                        <Label className="form-label" for="lastName">
                            Last Name
                        </Label>
                        <Controller
                          id="lastName"
                          name="lastName"
                          control={control}
                          rules={{ required: "Last Name is required" }}
                          render={({ field }) => (
                            <Input
                              placeholder="Entare Last Name"
                              className="form-control"
                              {...field}
                              type="text"
                            />
                          )}
                        />
                        {errors.lastName && (
                          <FormFeedback>{errors?.lastName?.message}</FormFeedback>
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
                              placeholder="Entare Phone"
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
                        
                      <div className="col-md-6">
                      <div className={locationState?.isEdit ? "py-1" : "py-5"}>
                        
                        <div class="form-check">
                                                            
                        <Controller
                          id="onlyUpload"
                          name="onlyUpload"
                          control={control}
                          render={({ field }) => (
                            <Input
                              className="form-check-input"
                              {...field}
                              type="checkbox"
                              defaultChecked={field?.value}
                            />
                          )}
                        />
                        <Label className="form-check-label" for="onlyUpload">
                          Only Upload
                        </Label>
                      </div>
                      </div>
                      </div>
                      </div>
                      
                      
                      <div className="row">
                        <div className="col text-end">
                          <a href="#" className="btn btn-danger m-1">
                            {" "}
                            <i className="bx bx-x mr-1"></i> Cancel{" "}
                          </a>
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

export default StaffForm;
