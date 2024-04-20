import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input, Progress } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useDesignUploadByIdQuery,
  useSubmitDesignUploadMutation,
  useSubmitDesigneImageMutation,
  useUploadDesignImageFileMutation,
} from "../../service";
import toast from "react-hot-toast";
import IMGICON from "../../assets/images/picture-circle.png";
import { ArrowDownCircle, X } from "react-feather";
import { setUploadProgress, setUploadTag } from "../../redux/designUploadSlice";
import { bulkMainFilesDownload, imageFilesDownload } from "../../utils/bulkFileDownload";
const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_URL
    : import.meta.env.VITE_APP_PROD_URL;

function DesignImageForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const uploadProgress = useSelector(
    (state) => state?.designUploadState.uploadProgress
  );
  const uploadTag = useSelector((state) => state?.designUploadState.uploadTag);
  const resDesignById = useDesignUploadByIdQuery(locationState?.designID, {
    skip: !locationState?.designID,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const [reqDesignImage, resDesignImage] = useSubmitDesigneImageMutation();
  const [reqFile] = useUploadDesignImageFileMutation();
  const [mainFile, setMainFile] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm();

  useEffect(() => {
    if (resDesignById?.isSuccess && resDesignById?.data?.data) {
      const designMainObj = {
        label: resDesignById?.data?.data?.designNo,
        value: (resDesignById?.data?.data?.thumbnail && Array.isArray(resDesignById?.data?.data?.thumbnail) && resDesignById?.data?.data?.thumbnail?.length > 0) ? resDesignById?.data?.data?.thumbnail[0]?._id : "",
        pdf_extract_img: (resDesignById?.data?.data?.thumbnail && Array.isArray(resDesignById?.data?.data?.thumbnail) && resDesignById?.data?.data?.thumbnail?.length > 0) ? resDesignById?.data?.data?.thumbnail[0]?.pdf_extract_img : ""
      };
      const desingVariation = resDesignById?.data?.data?.variations;
      let designOptions = designMainObj ? [designMainObj] : [];
      if (
        desingVariation &&
        Array.isArray(desingVariation) &&
        desingVariation?.length > 0
      ) {
        desingVariation?.forEach((el) => {
          designOptions?.push({
            label: el?.variation_designNo,
            value: (el?.variation_thumbnail && Array.isArray(el?.variation_thumbnail) && el?.variation_thumbnail?.length > 0) ? el?.variation_thumbnail[0]?._id : "",
            pdf_extract_img: (el?.variation_thumbnail && Array.isArray(el?.variation_thumbnail) && el?.variation_thumbnail?.length > 0) ? el?.variation_thumbnail[0]?.pdf_extract_img : "",
          });
        });
      }
      setOptions(designOptions);
    }
  }, [resDesignById?.isSuccess, resDesignById?.data?.data]);

  const handleFile = async (e, name) => {
    if (name === "image" && e.target.files) {
      dispatch(setUploadTag({ image: true }));
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const reqData = {
        file: formData,
        type: 3,
      };
      const fileResponse = await reqFile({
        url: `${baseUrl}/uploads/design/image/?type=${reqData?.type}`,
        data: reqData?.file,
      });
      if (fileResponse?.data?.code === 200 && fileResponse?.data?.data) {
        if (fileResponse?.data?.data) {
          setValue(name, fileResponse?.data?.data);
          setError(name, "");
          setMainFile(fileResponse?.data?.data);
          dispatch(setUploadProgress(null));
          dispatch(setUploadTag(null));
        }
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
        });
        dispatch(setUploadProgress(null));
        dispatch(setUploadTag(null));
      }
    }
  };

  const removeFile = (e, name) => {
    e.preventDefault()
    setValue(name, "");
    setMainFile(null);
  };

  const onNext = (state) => {
    reqDesignImage({
        thumbnailId:state?.selected_design?.value,
        pdf_extract_img:state?.image
    })
  };

  const handleSelectDesign = (val) => {
    // setSelectedOption(val)
  };

  useEffect(() => {
    if (resDesignImage?.isSuccess) {
      toast.success("Design Image Updated SuccessFully", {
        position: "top-center",
      });
      reset()
      navigate("/design-list-v2");
    }
    if (resDesignImage?.isError) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  }, [resDesignImage?.isSuccess,resDesignImage?.isError]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Design Image Upload</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link to="" onClick={(e) => e.preventDefault()}>
                      Design
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Design Image Upload
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              <div className="card">
                <Link
                  to=""
                  onClick={(e) => e.preventDefault()}
                  className="text-dark"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                >
                  <div className="p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-16 mb-1">
                          Design Image Upload Info
                        </h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all information below
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="collapse show">
                  <div className="p-4 border-top">
                    <Form onSubmit={handleSubmit(onNext)}>
                      <div className="row">
                        <div>
                          <div className="mb-3">
                            <Label for="selected_design" className="form-label">
                              Select Design
                            </Label>
                            <Controller
                              id="selected_design"
                              name="selected_design"
                              control={control}
                              rules={{ required: "Design is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    options &&
                                    Array.isArray(options) &&
                                    options?.length > 0
                                      ? options
                                      : []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={(val) => {
                                    onChange(val);
                                    handleSelectDesign(val);
                                  }}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.selected_design && (
                              <FormFeedback>
                                {errors?.selected_design?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div>
                          <div className="mb-3">
                            <Label className="form-label" for="image">
                              Upload Image
                            </Label>

                            <div className="border-top">
                              <Controller
                                id="image"
                                name="image"
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    multiple
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "image");
                                    }}
                                    disabled={uploadProgress}
                                  />
                                )}
                              />
                              <h6 style={{fontSize:'12px',padding:"5px",color:'#9e6319'}}>Note: Allowed only jpg,jpeg and png image format</h6>
                              {uploadProgress && uploadTag?.image && (
                                <div style={{ marginTop: "10px" }}>
                                  <Progress
                                    animated
                                    color="success"
                                    value={uploadProgress}
                                  />
                                  <p>Progress: {uploadProgress}%</p>
                                </div>
                              )}
                              {mainFile && (
                                <div className="image-gallery">
                                  <div className="image-item">
                                    <Link
                                      to=""
                                      download="image2.jpg"
                                      className="download-button"
                                    >
                                      <img src={IMGICON} alt="Image 2" />
                                      <ArrowDownCircle
                                        className="download-icon"
                                        size={"24px"}
                                          onClick={(e) =>
                                            imageFilesDownload(e, {filepath:mainFile})
                                          }
                                      />
                                      <div className="remove-wrapper">
                                        <X
                                          className="remove-icon"
                                          onClick={(e) =>
                                            removeFile(e, "image")
                                          }
                                        />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              )}
                              {errors.image && (
                                <FormFeedback>
                                  {errors?.image?.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="solid"></hr>

                      <div className="row">
                        <div className="col text-end">
                          <Link
                            to="/design-list-v2"
                            className="btn btn-danger m-1"
                          >
                            {" "}
                            <i className="bx bx-x mr-1"></i> Cancel{" "}
                          </Link>
                          <button type="submit" className="btn btn-success m-1">
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

export default DesignImageForm;
