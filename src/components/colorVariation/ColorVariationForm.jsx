import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useColorVariationByIdQuery, useFileUploadMutation, useSubmitColorVariationMutation } from "../../service";
import { toast } from "react-hot-toast";
import { alphaNumericPattern } from "../common/InputValidation";

function ColorVariationForm() {
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  const [reqFile] = useFileUploadMutation();
  const [reqColorVariation, resColorVariation] = useSubmitColorVariationMutation();
  const resColorVariationById = useColorVariationByIdQuery(locationState?.variationID, {
    skip: !locationState?.variationID,
  });
  console.log('resColorVariationById',resColorVariationById);
  const [mainFile, setMainFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError
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
    reqColorVariation({
      ...state,
      image: mainFile ?  mainFile?._id : null,
      thumbnail: thumbnailFile ?  thumbnailFile?._id  : null,
    });
  };

  
  useEffect(() => {
    if (resColorVariation?.isSuccess) {
      toast.success(resColorVariation?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/color-variation-list");
    }
    if (resColorVariation?.isError) {
      setError("name", {
        type: "manual",
        message:
        resColorVariation?.error?.data?.message
      });
    }
  }, [resColorVariation?.isSuccess,resColorVariation?.isError]);

  const handleFile  = (e,name) => {
    console.log('eeeee',name);
    if(name === 'image' && e.target.files){
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
        const reqData = {
          file: formData,
          type: 1,
        };
        reqFile(reqData)
          .then((res) => {
            if (res?.data?.data) {
              setValue(name, res?.data?.data);
              setError(name, "");
              setMainFile(res?.data?.data)
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
    }
    if(name === 'thumbnail' && e.target.files){
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
        const reqData = {
          file: formData,
          type: 1,
          watermark:true
        };
        reqFile(reqData)
          .then((res) => {
            if (res?.data?.data) {
              setValue(name, res?.data?.data);
              setError(name, "");
              setThumbnailFile(res?.data?.data)
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
    }
    
   } 

   useEffect(() => {
    if (resColorVariationById?.isSuccess && resColorVariationById?.data?.data) {
      reset({
        ...resColorVariationById.data.data,
        image:resColorVariationById?.data?.data?.image  ? resColorVariationById?.data?.data?.image : null,
        thumbnail:resColorVariationById?.data?.data?.thumbnail ? resColorVariationById?.data?.data?.thumbnail : null
      });
      if(resColorVariationById?.data?.data?.image){
        setMainFile(resColorVariationById?.data?.data?.image)
      }
      if(resColorVariationById?.data?.data?.thumbnail){
        setThumbnailFile(resColorVariationById?.data?.data?.thumbnail)
      }
    }
  }, [resColorVariationById]);
  

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
                          Color Name
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

                        {/* <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="designNo">
                              Design Number
                            </Label>
                            <Controller
                              id="designNo"
                              name="designNo"
                              control={control}
                              rules={{ 
                                  required: "Design Number is required",
                                  // validate:alphaNumericPattern
                              }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Design Number"
                                  className="form-control"
                                  {...field}
                                  // type="number"
                                />
                              )}
                            />
                            {errors.designNo && (
                              <FormFeedback>
                                {errors?.designNo?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div> */}
                      </div>
                    
                      {/* <div className="mb-0">
                        <Label className="form-label" for="image">
                          Upload Main File
                        </Label>
                        <div className="border-top">
                          <form action="#" className="dropzone img__upload">
                            <div className="fallback">
                              <Controller
                                id="image"
                                name="image"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "image");
                                    }}
                                    disabled={locationState?.isEdit}
                                  />
                                )}
                              />
                            </div>
                            <div className="dz-message needsclick">
                              <div className="mb-3">
                                <i className="display-4 text-muted mdi mdi-cloud-upload"></i>
                              </div>

                              <h4>Click to upload main file.</h4>
                            </div>
                          </form>
                          <div className="img_opc">
                            <div className="row">
                            {mainFile &&
                                <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src={mainFile?.filepath}
                                    alt=""
                                  />
                                  {!locationState?.isEdit && 
                                  <span onClick={(e) => removeFile(e)}>x</span>
                                  }
                                </div>
                              </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-0">
                        <Label className="form-label" for="thumbnail">
                          Upload Thumbnail
                        </Label>
                        <div className="border-top">
                          <form action="#" className="dropzone img__upload">
                            <div className="fallback">
                              <Controller
                                id="thumbnail"
                                name="thumbnail"
                                control={control}
                                // rules={{ required: "Design File is required" }}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "thumbnail");
                                    }}
                                  />
                                )}
                              />
                            </div>
                            <div className="dz-message needsclick">
                              <div className="mb-3">
                                <i className="display-4 text-muted mdi mdi-cloud-upload"></i>
                              </div>

                              <h4>Click to upload thumbnail file.</h4>
                            </div>
                          </form>
                          {errors.thumbnail && (
                            <FormFeedback>
                              {errors?.thumbnail?.message}
                            </FormFeedback>
                          )}
                          <div className="img_opc">
                            <div className="row">
                            {thumbnailFile &&
                                <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src={thumbnailFile?.filepath}
                                    alt=""
                                  />
                                  {!locationState?.isEdit &&
                                  <span onClick={(e) => removeThumbnailFile(e)}>x</span>
                                  }
                                </div>
                              </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div> */}

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

                      

                      <div className="row">
                        <div className="col text-end">
                          <Link to="/design-list-v2" className="btn btn-danger m-1">
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
