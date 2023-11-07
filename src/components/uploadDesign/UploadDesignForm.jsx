import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller,useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCategoryDropdownListQuery, useDesignUploadByIdQuery, useFileUploadMutation, useMultipleFileUploadMutation, useSubmitDesignUploadMutation, useTagDropdownListQuery } from "../../service";
import toast from "react-hot-toast";
import { Typeahead } from "react-bootstrap-typeahead";
import { alphaNumericPattern } from "../common/InputValidation";

function AddDesign() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { state: locationState } = location;
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const [reqDesignUpload, resDesignUpload] = useSubmitDesignUploadMutation();
  const resDesignById = useDesignUploadByIdQuery(locationState?.designID, {
    skip: !locationState?.designID,
  });
  const resCategoryListDropdown = useCategoryDropdownListQuery();
  const resTagListDropdown = useTagDropdownListQuery();

  console.log('resCategoryListDropdown',resCategoryListDropdown);

  const [reqFile] = useFileUploadMutation();
  const [mainFile, setMainFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [categoryDropdown, setCategoryDropdown] = useState([])
  const [tagDropdown, setTagDropdown] = useState([])

  console.log('mainFile',mainFile);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError
  } = useForm();

  useEffect(() => {
    if (resDesignById?.isSuccess && resDesignById?.data?.data) {
      console.log('resDesignById?.data?.data',resDesignById?.data?.data);
      reset({
        ...resDesignById.data.data,
        image:resDesignById?.data?.data?.image  ? resDesignById?.data?.data?.image : null,
        thumbnail:resDesignById?.data?.data?.thumbnail ? resDesignById?.data?.data?.thumbnail : null
      });
      if(resDesignById?.data?.data?.image){
        setMainFile(resDesignById?.data?.data?.image)
      }
      if(resDesignById?.data?.data?.thumbnail){
        setThumbnailFile(resDesignById?.data?.data?.thumbnail)
      }
    }
  }, [resDesignById]);

  useEffect(() => {
    if(resCategoryListDropdown?.isSuccess && resCategoryListDropdown?.data?.data){
      setCategoryDropdown(resCategoryListDropdown?.data?.data)
    }
  },[resCategoryListDropdown])

  useEffect(() => {
    if(resTagListDropdown?.isSuccess && resTagListDropdown?.data?.data){
      setTagDropdown(resTagListDropdown?.data?.data)
    }
  },[resTagListDropdown])
  
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
  
 const removeFile = (e) => {
  e.preventDefault()
  setMainFile(null)
 }

 const removeThumbnailFile = (e) => {
  e.preventDefault()
  setThumbnailFile(null)
 }

  const onNext = (state) => {
    console.log("state", state);
    reqDesignUpload({
      ...state,
      category: state?.category?.value,
      tag: state?.tag,
      image: mainFile ?  mainFile?._id : '',
      thumbnail: thumbnailFile ?  thumbnailFile?._id  : null,
    });
  };

  useEffect(() => {
    if (resDesignUpload?.isSuccess) {
      toast.success(resDesignUpload?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/design-list-v2");
    }
  }, [resDesignUpload?.isSuccess]);

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
                          <FormFeedback>{errors?.name?.message}</FormFeedback>
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
                                  validate:alphaNumericPattern
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
                                  options={
                                    categoryDropdown|| []
                                  }
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

                      <div className="mb-0">
                        <Label className="form-label" for="image">
                          Upload MainFile
                        </Label>
                        <div className="border-top">
                          <form action="#" className="dropzone img__upload">
                            <div className="fallback">
                              <Controller
                                id="image"
                                name="image"
                                control={control}
                                // rules={{ required: "Design File is required" }}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "image");
                                    }}
                                    disabled={locationState?.isEdit && userInfo?.onlyUpload}
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
                          {/* {errors.image && (
                            <FormFeedback>
                              {errors?.image?.message}
                            </FormFeedback>
                          )} */}
                          <div className="img_opc">
                            <div className="row">
                            {mainFile &&
                                <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src={mainFile?.filepath}
                                    alt=""
                                  />
                                  {locationState?.isEdit && !userInfo?.onlyUpload &&
                                  <span onClick={(e) => removeFile(e)}>x</span>
                                  }
                                </div>
                              </div>
                              }
                              {/* <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div>
                              <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div>
                              <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div>
                              <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div>
                              <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div>
                              <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div>
                              <div className="col-sm-2">
                                <div className="past_img">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPiOzT5S40iGQK4a5dlk5GoDetf2vVByrepiK4LLt8HGp_Yp0TPZfSDcjnvsGTvsUkjWI&usqp=CAU"
                                    alt=""
                                  />
                                  <span>x</span>
                                </div>
                              </div> */}
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
                                rules={{ required: "Design File is required" }}
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
                                  <span onClick={(e) => removeThumbnailFile(e)}>x</span>
                                </div>
                              </div>
                              }
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

export default AddDesign;
