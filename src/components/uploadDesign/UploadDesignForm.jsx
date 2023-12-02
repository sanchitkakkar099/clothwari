import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  useCategoryDropdownListQuery,
  useColorVariationDropdownListQuery,
  useDesignUploadByIdQuery,
  useFileUploadMutation,
  useMultipleFileUploadMutation,
  useSubmitDesignUploadMutation,
  useTagDropdownListQuery,
} from "../../service";
import toast from "react-hot-toast";
import { Typeahead } from "react-bootstrap-typeahead";
import { alphaNumericPattern } from "../common/InputValidation";
import PDFICON from '../../assets/images/pdf_icon.svg'
import IMGICON from '../../assets/images/image_icon.svg'
import { bulkMainFilesDownload,bulkThumbnailFilesDownload } from "../../utils/bulkFileDownload";


function AddDesign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqDesignUpload, resDesignUpload] = useSubmitDesignUploadMutation();
  const resDesignById = useDesignUploadByIdQuery(locationState?.designID, {
    skip: !locationState?.designID,
  });
  const resCategoryListDropdown = useCategoryDropdownListQuery();
  const resColorListDropdown = useColorVariationDropdownListQuery();

  const resTagListDropdown = useTagDropdownListQuery();

  console.log("resCategoryListDropdown", resCategoryListDropdown);

  const [reqFile] = useMultipleFileUploadMutation();
  const [mainFile, setMainFile] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState([]);
  const [variationMainFile, setVariationMainFile] = useState([]);
  const [variationThumbnailFile, setVariationThumbnailFile] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [colorDropdown, setColorDropdown] = useState([]);
  console.log('thumbnailFile',thumbnailFile);

  const [tagDropdown, setTagDropdown] = useState([]);

  console.log("mainFile", mainFile);
  console.log('variationMainFile',variationMainFile);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch,
    getValues
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  console.log("fields", fields);

  useEffect(() => {
    if (resDesignById?.isSuccess && resDesignById?.data?.data) {
      console.log("resDesignById?.data?.data", resDesignById?.data?.data);
      reset({
        ...resDesignById.data.data,
        image: resDesignById?.data?.data?.image
          ? resDesignById?.data?.data?.image
          : null,
        thumbnail: resDesignById?.data?.data?.thumbnail
          ? resDesignById?.data?.data?.thumbnail
          : null,
        variations:resDesignById?.data?.data?.variations
        ? resDesignById?.data?.data?.variations
        : null,
      });
      if (resDesignById?.data?.data?.image) {
        setMainFile(resDesignById?.data?.data?.image);
      }
      if (resDesignById?.data?.data?.thumbnail) {
        setThumbnailFile(resDesignById?.data?.data?.thumbnail);
      }
    }
  }, [resDesignById]);

  useEffect(() => {
    if (
      resCategoryListDropdown?.isSuccess &&
      resCategoryListDropdown?.data?.data
    ) {
      setCategoryDropdown(resCategoryListDropdown?.data?.data);
    }
  }, [resCategoryListDropdown]);

  useEffect(() => {
    if (resColorListDropdown?.isSuccess && resColorListDropdown?.data?.data) {
      setColorDropdown(resColorListDropdown?.data?.data);
    }
  }, [resColorListDropdown]);

  useEffect(() => {
    if (resTagListDropdown?.isSuccess && resTagListDropdown?.data?.data) {
      setTagDropdown(resTagListDropdown?.data?.data);
    }
  }, [resTagListDropdown]);

  const handleFile = (e, name) => {
    console.log("eeeee", name);
    if (name === "image" && e.target.files) {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('file', e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 1,
      };
      reqFile(reqData)
        .then((res) => {
          if (res?.data?.data) {
            setValue(name, res?.data?.data);
            setError(name, "");
            setMainFile([...mainFile, ...res?.data?.data]);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    if (name === "thumbnail" && e.target.files) {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('file', e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 1,
        watermark: true,
      };
      reqFile(reqData)
        .then((res) => {
          if (res?.data?.data) {
            setValue(name, res?.data?.data);
            setError(name, "");
            setThumbnailFile([...thumbnailFile, ...res?.data?.data]);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    setMainFile(null);
  };

  const removeThumbnailFile = (e) => {
    e.preventDefault();
    setThumbnailFile(null);
  };

  const onNext = (state) => {
    console.log("state", {
      ...state,
      category: state?.category?.value,
      tag: state?.tag,
      image: (mainFile && Array.isArray(mainFile) && mainFile?.length > 0) ? mainFile?.map(mf => mf?._id) : null,
      thumbnail: (thumbnailFile && Array.isArray(thumbnailFile) && thumbnailFile?.length > 0) ? thumbnailFile?.map(tf => tf?._id) : null,
      variations:(state?.variations && Array.isArray(state?.variations) && state?.variations?.length > 0) ? state?.variations?.map(el => ({...el,variation_image:el?.variation_image?.map(vi => vi?._id),variation_thumbnail:el?.variation_thumbnail?.map(vt => vt._id)})) : null
    });
    reqDesignUpload({
      ...state,
      category: state?.category?.value,
      tag: state?.tag,
      image: (mainFile && Array.isArray(mainFile) && mainFile?.length > 0) ? mainFile?.map(mf => mf?._id) : null,
      thumbnail: (thumbnailFile && Array.isArray(thumbnailFile) && thumbnailFile?.length > 0) ? thumbnailFile?.map(tf => tf?._id) : null,
      variations:(state?.variations && Array.isArray(state?.variations) && state?.variations?.length > 0) ? state?.variations?.map(el => ({...el,variation_image:el?.variation_image?.map(vi => vi?._id),variation_thumbnail:el?.variation_thumbnail?.map(vt => vt._id)})) : null
    });
  };

  useEffect(() => {
    if (resDesignUpload?.isSuccess) {
      toast.success(resDesignUpload?.data?.message, {
        position: "top-center",
      });
      reset();
      navigate("/design-list-v2");
    }
    if (resDesignUpload?.isError) {
      setError("name", {
        type: "manual",
        message:
          resDesignUpload?.error?.data?.message === "Already uploaded"
            ? "Design Name Already Exist"
            : "",
      });
    }
  }, [resDesignUpload?.isSuccess, resDesignUpload?.isError]);

  const handleVariationFile = (e, name,tag) => {
    e.preventDefault()
    if (tag === "image" && e.target.files) {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('file', e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 1,
      };
      reqFile(reqData)
        .then((res) => {
          if (res?.data?.data) {
            setValue(name, res?.data?.data);
            setError(name, "");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    if (tag === "thumbnail" && e.target.files) {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('file', e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 1,
        watermark: true,
      };
      reqFile(reqData)
        .then((res) => {
          if (res?.data?.data) {
            setValue(name, res?.data?.data);
            setError(name, "");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };


  const appendVariation = (element, context) => {
    console.log("context", context);
    if (context?.action === "select-option") {
      append({
        color: context?.option?.label,
        variation_name: "",
        variation_designNo: "",
        variation_image: null,
        variation_thumbnail: null,
      });
    }
    if (context?.action === "remove-value") {
      const fIndex = fields.findIndex(
        (fld) => fld?.color === context?.removedValue?.label
      );
      remove(fIndex);
      console.log("fIndex", fields, fIndex);
    }
  };

 

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Upload Design</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Design</a>
                  </li>
                  <li className="breadcrumb-item active">Upload Design</li>
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
                        <h5 className="font-size-16 mb-1">Design Info</h5>
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
                              Design Name
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
                              <FormFeedback>
                                {errors?.name?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
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
                                  placeholder="Entare Design Number"
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
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="category" className="form-label">
                              Category
                            </Label>
                            <Controller
                              id="category"
                              name="category"
                              control={control}
                              rules={{ required: "Category is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={categoryDropdown || []}
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.category && (
                              <FormFeedback>
                                {errors?.category?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="tag" className="form-label">
                              Tag
                            </Label>
                            <Controller
                              id="tag"
                              name="tag"
                              control={control}
                              rules={{ required: "Tag is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Typeahead
                                  allowNew
                                  id="custom-selections-example"
                                  multiple
                                  newSelectionPrefix="Add Tag: "
                                  options={[]}
                                  placeholder="Type anything..."
                                  onChange={onChange}
                                  selected={value}
                                />
                              )}
                            />
                            {errors.tag && (
                              <FormFeedback>
                                {errors?.tag?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label" for="image">
                          Upload MainFile
                        </Label>
                        
                        <div className="border-top">
                              <Controller
                                id="image"
                                name="image"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    multiple
                                    type="file"
                                    accept="image/tiff,.tif"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "image");
                                    }}
                                    disabled={
                                      locationState?.isEdit &&
                                      userInfo?.onlyUpload
                                    }
                                  />
                                )}
                              />
                            
                        {(userInfo?.role === 'Super Admin') &&
                        <Button 
                            color="primary" 
                            className="download-button" 
                            size="sm" 
                            type="button"
                            onClick={(e) => bulkMainFilesDownload(e,mainFile)}
                            >
                          Download MainFile
                        </Button>
                        }
                          <div className="uploaded_img">
                          {mainFile && Array.isArray(mainFile) && mainFile?.length > 0 &&
                          mainFile?.map((el,minx) => {
                            return(
                              <div key={minx}>
                          <img
                          key={minx}
                          src={IMGICON}
                          alt="File type icon"
                          className="image__icon"
                          height="80"
                          width="50"

                        />
                        {/* <h6>{el?.originalname}</h6> */}
                        </div>
                        
                        )})}
                        
                        </div>
                      </div>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label" for="thumbnail">
                          Upload Thumbnail
                        </Label>
                        <div className="border-top">
                              <Controller
                                id="thumbnail"
                                name="thumbnail"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    multiple
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "thumbnail");
                                    }}
                                  />
                                )}
                              />
                          {errors.thumbnail && (
                            <FormFeedback>
                              {errors?.thumbnail?.message}
                            </FormFeedback>
                          )}

                          {(userInfo?.role === 'Super Admin') &&
                        <Button
                          color="primary" 
                          className="download-button" 
                          size="sm" 
                          type="button"
                          onClick={(e) => bulkThumbnailFilesDownload(e,thumbnailFile)}
                          >
                          Download Thumbnail
                        </Button>
                        }
                          
                          <div className="uploaded_img">
                          {thumbnailFile && Array.isArray(thumbnailFile) && thumbnailFile?.length > 0 &&
                          thumbnailFile?.map((el,tinx) => {
                            return(
                              <div key={tinx}>
                              <img
                                key={tinx}
                                src={PDFICON}
                                alt="File type icon"
                                className=""
                                height="50"
                                width="50"
                            />
                            {/* <h6>{el?.originalname}</h6> */}
                            </div>
                            )
                          })
                          }
                          
                        
                        </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <Label for="color" className="form-label">
                              Variation
                            </Label>
                            <Controller
                              id="color"
                              name="color"
                              control={control}
                              rules={{ required: "Variation is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  isMulti
                                  options={colorDropdown || []}
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={(v, c) => {
                                    onChange(v);
                                    appendVariation(v, c);
                                  }}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.color && (
                              <FormFeedback>
                                {errors?.color?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>

                      <hr class="solid"></hr>

                      {fields?.map((fld, finx) => {
                        return (
                          <div key={fld?.color}>
                            <div className="row">
                              <h5 className="mb-2">{fld?.color}</h5>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    for={`variations.${finx}.variation_name`}
                                  >
                                    Name
                                  </Label>
                                  <Controller
                                    id={`variations.${finx}.variation_name`}
                                    name={`variations.${finx}.variation_name`}
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
                                  {errors.variations && (
                                    <FormFeedback>
                                      {errors?.variations[finx]?.variation_name?.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    for={`variations.${finx}.variation_designNo`}
                                  >
                                    Design Number
                                  </Label>
                                  <Controller
                                    id={`variations.${finx}.variation_designNo`}
                                    name={`variations.${finx}.variation_designNo`}
                                    control={control}
                                    rules={{
                                      required: "Design Number is required",
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        placeholder="Entare Design Number"
                                        className="form-control"
                                        {...field}
                                      />
                                    )}
                                  />
                                  {errors.variations && (
                                    <FormFeedback>
                                      {errors?.variations[finx]?.variation_designNo?.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    for={`variations.${finx}.variation_image`}
                                  >
                                    Upload MainFile
                                  </Label>
                                 
                                  <Controller
                                    id={`variations.${finx}.variation_image`}
                                    name={`variations.${finx}.variation_image`}
                                    control={control}
                                    render={({
                                      field: { onChange, value },
                                    }) => (
                                      <Input
                                        multiple
                                        type="file"
                                        accept="image/tiff,image/tif"
                                        onChange={(e) => {
                                          onChange(e.target.files);
                                          handleVariationFile(e, `variations.${finx}.variation_image`,"image");

                                        }}
                                      />
                                    )}
                                  />
                                  
                                  <div className="uploaded_img">
                                  {watch(`variations.${finx}.variation_image`) && Array.isArray(watch(`variations.${finx}.variation_image`)) && watch(`variations.${finx}.variation_image`)?.length > 0 &&
                          watch(`variations.${finx}.variation_image`)?.map((el,minx) => {
                            return(
                              <div key={minx}>
                          <img
                          src={IMGICON}
                          alt="File type icon"
                          className="image__icon"
                          height="80"
                          width="50"

                        />
                        </div>
                            )})}
                        </div>
                                </div>
                                
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label className="form-label" for={`variations.${finx}.variation_thumbnail`}>
                                    Upload Thumbnail
                                  </Label>
                                  
                                  <Controller
                                    id={`variations.${finx}.variation_thumbnail`}
                                    name={`variations.${finx}.variation_thumbnail`}
                                    control={control}
                                    render={({
                                      field: { onChange, value },
                                    }) => (
                                      <Input
                                        multiple
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                          onChange(e.target.files);
                                          handleVariationFile(e, `variations.${finx}.variation_thumbnail`,"thumbnail");
                                        }}
                                      />
                                    )}
                                  />
                                  <div className="uploaded_img">
                                  {watch(`variations.${finx}.variation_thumbnail`) && Array.isArray(watch(`variations.${finx}.variation_thumbnail`)) && watch(`variations.${finx}.variation_thumbnail`)?.length > 0 &&
                          watch(`variations.${finx}.variation_thumbnail`)?.map((el,minx) => {
                            return(
                              <div key={minx}>
                          <img
                          src={PDFICON}
                          alt="File type icon"
                          className=""
                          // height="50"
                          width="50"

                        />
                        </div>
                            )})}
                        
                        </div>
                                  {/* } */}
                                </div>
                              </div>
                            </div>

                            <hr class="solid"></hr>
                          </div>
                        );
                      })}

                      <div className="row">
                        <div className="col text-end">
                          <Link
                            to="/design-list-v2"
                            className="btn btn-danger m-1"
                          >
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

export default AddDesign;
