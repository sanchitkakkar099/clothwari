import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSubmitTagMutation, useTagByIdQuery } from "../../service";
import toast from "react-hot-toast";

function TagForm() {
  const navigate = useNavigate()
  const [reqTag, resTag] = useSubmitTagMutation();
  const location = useLocation();
  const { state: locationState } = location;
  const resTagById = useTagByIdQuery(locationState?.tagID, {
    skip: !locationState?.tagID,
  });
  console.log('resTagById',resTagById);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm();

  useEffect(() => {
    if (resTagById?.isSuccess && resTagById?.data?.data) {
      reset({
        ...resTagById.data.data,
      });
    }
  }, [resTagById]);

  const onNext = (state) => {
    console.log("state", state);
    reqTag(state);
  };

  useEffect(() => {
    if (resTag?.isSuccess) {
      toast.success(resTag?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/tag-list");
    }
    if (resTag?.isError) {
      setError("label", {
        type: "manual",
        message:
          resTag?.error?.data?.message === "Already Exists"
            ? "Tag Is Already Exist"
            : "",
      });
    }
  }, [resTag?.isSuccess,resTag?.isError]);
  
   return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Create Tag</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Tag</a>
                  </li>
                  <li className="breadcrumb-item active">Create Tag</li>
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
                        <h5 className="font-size-16 mb-1">Tag Info</h5>
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
                        <Label className="form-label" for="label">
                            Name
                        </Label>
                        <Controller
                          id="label"
                          name="label"
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
                        {errors.label && (
                          <FormFeedback>{errors?.label?.message}</FormFeedback>
                        )}
                      </div>
                      </div>
                      </div>
                      <div className="row">
                        <div className="col text-end">
                          <Link to="/tag-list" className="btn btn-danger m-1">
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

export default TagForm;
