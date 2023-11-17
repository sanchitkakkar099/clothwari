import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useColorVariationByIdQuery, useSubmitColorVariationMutation } from "../../service";
import { toast } from "react-hot-toast";

function ColorVariationForm() {
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  const [reqColorVariation, resColorVariation] = useSubmitColorVariationMutation();
  const resColorVariationById = useColorVariationByIdQuery(locationState?.variationID, {
    skip: !locationState?.variationID,
  });
  console.log('resColorVariationById',resColorVariationById);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  useEffect(() => {
    if (resColorVariationById?.isSuccess && resColorVariationById?.data?.data) {
      reset({
        ...resColorVariationById.data.data,
      });
    }
  }, [resColorVariationById]);

  const onNext = (state) => {
    console.log("state", state);
    reqColorVariation(state);
  };

  
  useEffect(() => {
    if (resColorVariation?.isSuccess) {
      toast.success(resColorVariation?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/color-variation-list");
    }
  }, [resColorVariation?.isSuccess]);
  

   return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Create Color Variation</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Color Variation</a>
                  </li>
                  <li className="breadcrumb-item active">Create Color Variation</li>
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
                        <h5 className="font-size-16 mb-1">Color Variation Info</h5>
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
                      <div className="col-md-12">
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
                      <div className="mb-3">
                        <Label className="form-label" for="code">
                            Color
                        </Label>
                        <Controller
                          id="code"
                          name="code"
                          control={control}
                          rules={{ required: "Color Code is required" }}
                          render={({ field }) => (
                            <Input
                              placeholder="Entare Color Code"
                              className="form-control"
                              {...field}
                              type="color"
                              style={{height:100}}
                            />
                          )}
                        />
                        {errors.code && (
                          <FormFeedback>{errors?.code?.message}</FormFeedback>
                        )}
                      </div>
                      </div>
                      </div>
                      <div className="row">
                        <div className="col text-end">
                          <Link to="/color-variation-list" className="btn btn-danger m-1">
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

export default ColorVariationForm;
