import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, set, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { setDesignList } from "../../redux/designSlice";
import { useNavigate } from "react-router-dom";

function AddDesign() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [multipleDesign, setMultipleDesign] = useState([])
  console.log('multipleDesign',multipleDesign);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();
  const onNext = (state) => {
    console.log("state", state);
    dispatch(setDesignList({...state,designs_file:multipleDesign}))
    navigate('/design-list-v2')
  };
  // console.log('file',watch('designs_file'),watch('designs_file') && Array.from(watch('designs_file'))?.map(el => URL.createObjectURL(el)));
 const handleFile  = (e,name) => {
  console.log('eeeee',e.target.files,name);
  if(e.target.files){
    const files = Array.from(e.target.files)
    const fileUrls = files?.map(el => URL.createObjectURL(el))
    setMultipleDesign([...multipleDesign, ...fileUrls])
  }
 } 
  
 const removeFile = (e,name) => {
  const filterUrls = multipleDesign?.filter(el => el !== name)
  setMultipleDesign(filterUrls)
 }

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
                    <a href="javascript: void(0);">Design</a>
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
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="designe_code">
                              Design Code
                            </Label>
                            <Controller
                              id="designe_code"
                              name="designe_code"
                              control={control}
                              rules={{ required: "Design Code is required" }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Entare Design Code"
                                  className="form-control"
                                  {...field}
                                  type="text"
                                />
                              )}
                            />
                            {errors.designe_code && (
                              <FormFeedback>
                                {errors?.designe_code?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="designe_number">
                              Design Number
                            </Label>
                            <Controller
                              id="designe_number"
                              name="designe_number"
                              control={control}
                              rules={{ required: "Design Number is required" }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Entare Design Number"
                                  className="form-control"
                                  {...field}
                                  type="number"
                                />
                              )}
                            />
                            {errors.designe_number && (
                              <FormFeedback>
                                {errors?.designe_number?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="varient" className="form-label">
                              Varient
                            </Label>
                            <Controller
                              id="varient"
                              name="varient"
                              control={control}
                              rules={{ required: "Varient is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    [
                                      {
                                        label: "Electronic",
                                        value: "Electronic",
                                      },
                                      { label: "Fashion", value: "Fashion" },
                                      { label: "Fitness", value: "Fitness" },
                                    ] || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.varient && (
                              <FormFeedback>
                                {errors?.varient?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="product" className="form-label">
                              Product
                            </Label>
                            <Controller
                              id="product"
                              name="product"
                              control={control}
                              rules={{ required: "Product is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    [
                                      {
                                        label: "Electronic",
                                        value: "Electronic",
                                      },
                                      { label: "Fashion", value: "Fashion" },
                                      { label: "Fitness", value: "Fitness" },
                                    ] || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.product && (
                              <FormFeedback>
                                {errors?.product?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="pattern" className="form-label">
                              Pattern
                            </Label>
                            <Controller
                              id="pattern"
                              name="pattern"
                              control={control}
                              rules={{ required: "Pattern is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    [
                                      {
                                        label: "Electronic",
                                        value: "Electronic",
                                      },
                                      { label: "Fashion", value: "Fashion" },
                                      { label: "Fitness", value: "Fitness" },
                                    ] || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.pattern && (
                              <FormFeedback>
                                {errors?.pattern?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="color" className="form-label">
                              Color
                            </Label>
                            <Controller
                              id="color"
                              name="color"
                              control={control}
                              rules={{ required: "Color is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    [
                                      {
                                        label: "Electronic",
                                        value: "Electronic",
                                      },
                                      { label: "Fashion", value: "Fashion" },
                                      { label: "Fitness", value: "Fitness" },
                                    ] || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
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

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="weave" className="form-label">
                              Weave
                            </Label>
                            <Controller
                              id="weave"
                              name="weave"
                              control={control}
                              rules={{ required: "Weave is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    [
                                      {
                                        label: "Electronic",
                                        value: "Electronic",
                                      },
                                      { label: "Fashion", value: "Fashion" },
                                      { label: "Fitness", value: "Fitness" },
                                    ] || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.weave && (
                              <FormFeedback>
                                {errors?.weave?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label for="blend" className="form-label">
                              Blend
                            </Label>
                            <Controller
                              id="blend"
                              name="blend"
                              control={control}
                              rules={{ required: "Blend is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                    [
                                      {
                                        label: "Electronic",
                                        value: "Electronic",
                                      },
                                      { label: "Fashion", value: "Fashion" },
                                      { label: "Fitness", value: "Fitness" },
                                    ] || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.blend && (
                              <FormFeedback>
                                {errors?.blend?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-0">
                        <Label className="form-label" for="article">
                          Article
                        </Label>
                        <Controller
                          id="article"
                          name="article"
                          control={control}
                          rules={{ required: "Article is required" }}
                          render={({ field }) => (
                            <Input
                              placeholder="Enter Article"
                              className="form-control mb-3"
                              {...field}
                              type="textarea"
                              rows="4"
                            />
                          )}
                        />
                        {errors.article && (
                          <FormFeedback>
                            {errors?.article?.message}
                          </FormFeedback>
                        )}
                      </div>
                      <div className="mb-0">
                        <Label className="form-label" for="designs_file">
                          Upload Design
                        </Label>
                        <div className="border-top">
                          <form action="#" className="dropzone img__upload">
                            <div className="fallback">
                              <Controller
                                id="designs_file"
                                name="designs_file"
                                control={control}
                                rules={{ required: "Design File is required" }}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleFile(e, "designs_file");
                                    }}
                                    multiple
                                  />
                                )}
                              />
                            </div>
                            <div className="dz-message needsclick">
                              <div className="mb-3">
                                <i className="display-4 text-muted mdi mdi-cloud-upload"></i>
                              </div>

                              <h4>Click to upload design.</h4>
                            </div>
                          </form>
                          {errors.designs_file && (
                            <FormFeedback>
                              {errors?.designs_file?.message}
                            </FormFeedback>
                          )}
                          <div className="img_opc">
                            <div className="row">
                            {multipleDesign && Array.isArray(multipleDesign) && 
                              multipleDesign?.length > 0 && 
                            multipleDesign?.map((el,i) => {
                              return(
                                <div className="col-sm-2" key={i}>
                                <div className="past_img">
                                  <img
                                    src={el}
                                    alt=""
                                  />
                                  <span onClick={(e) => removeFile(e,el)}>x</span>
                                </div>
                              </div>
                              )
                            })}
                            
                              
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
