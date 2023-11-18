import React, { useState } from "react";
import { Button, FormFeedback, Input, Table } from "reactstrap";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Select from "react-select";
import { Typeahead } from "react-bootstrap-typeahead";
import { useCategoryDropdownListQuery, useColorVariationDropdownListQuery, useFileUploadMutation, useSubmitMultipleDesignUploadMutation } from "../../service";
import toast from "react-hot-toast";

function UploadDesignMultipleForm() {
  const location = useLocation();
  const navigate = useNavigate()
  const { state: locationState } = location;
  const [reqFile] = useFileUploadMutation();
  const resCategoryListDropdown = useCategoryDropdownListQuery();
  const resColorListDropdown = useColorVariationDropdownListQuery();
  const [reqDesignUpload, resDesignUpload] = useSubmitMultipleDesignUploadMutation();


  const [categoryDropdown, setCategoryDropdown] = useState([])
  const [colorDropdown, setColorDropdown] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setValue,
    setError,
  } = useForm();
  console.log('errors',errors);

  const { fields, append, update } = useFieldArray({
    control,
    name: "multiple_design",
  });

  console.log("fields", fields);

  useEffect(() => {
    if (
      locationState &&
      Array.isArray(locationState) &&
      locationState?.length > 0
    ) {
      for (let i = 0; i < locationState.length; i++) {
        append({
          name: "",
          designNo: "",
          category: "",
          tag: [],
          color:[],
          image: locationState[i],
          thumbnail: "",
        });
      }
    }
  }, [locationState]);

  console.log("locationState", locationState);

   useEffect(() => {
    if(resCategoryListDropdown?.isSuccess && resCategoryListDropdown?.data?.data){
      setCategoryDropdown(resCategoryListDropdown?.data?.data)
    }
  },[resCategoryListDropdown])

  useEffect(() => {
    if(resColorListDropdown?.isSuccess && resColorListDropdown?.data?.data){
      setColorDropdown(resColorListDropdown?.data?.data)
    }
  },[resColorListDropdown])

  const onNext = (state) => {
    console.log("state", state);
    const res1 = state?.multiple_design?.map(el => ({
      ...el, 
      category: el?.category?.value,
      tag: el?.tag,
      image: el?.image ?  el?.image?._id : null,
      thumbnail: el?.thumbnail ?  el?.thumbnail?._id  : null,
    }))
    console.log('res1',res1);
    reqDesignUpload(res1)
  };

  const handleFile = (e, fld,index) => {
    console.log('index',index);
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
          console.log("res?.data?.data", res?.data?.data, index);
          update(index, {...fld,thumbnail: res?.data?.data});
          setError(`multiple_design.${index}.thumbnail`, "");
        }
      })
      .catch((err) => {
        console.log("err", err);
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
              <h4 className="mb-0">Upload Multiple Designs</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">
                    Upload Multiple Designs
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onNext)}>
          <Table   striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Design Number</th>
                <th>Image</th>
                <th>Thumbnail</th>
                <th>Category</th>
                <th>Color</th>
                <th>Tag</th>
                {/* <th>Variant</th> */}
              </tr>
            </thead>
            <tbody>
              {fields?.map((fld, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Controller
                      id={`multiple_design.${index}.name`}
                      name={`multiple_design.${index}.name`}
                      control={control}
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <Input
                          placeholder="Enter Name"
                          onChange={field.onChange}
                          {...field}
                          type="text"
                        />
                      )}
                    />
                    {errors.multiple_design && (
                      <FormFeedback>
                        {errors?.multiple_design[index]?.name?.message}
                      </FormFeedback>
                    )}
                  </td>
                  <td>
                    <Controller
                      id={`multiple_design.${index}.designNo`}
                      name={`multiple_design.${index}.designNo`}
                      control={control}
                      rules={{ required: "Design Number is required" }}
                      render={({ field }) => (
                        <Input
                          placeholder="Design Number"
                          onChange={field.onChange}
                          {...field}
                          type="text"
                        />
                      )}
                    />
                    {errors.multiple_design && (
                      <FormFeedback>
                        {errors?.multiple_design[index]?.designNo?.message}
                      </FormFeedback>
                    )}
                  </td>
                  <td>
                    <img
                      src={fld?.image?.filepath}
                      alt="img"
                      height={25}
                      width={25}
                    />
                  </td>
                  <td>
                  {console.log('ssss',`multiple_design.${index}.thumbnail`)}
                  {fld?.thumbnail ? <img
                      src={fld?.thumbnail?.filepath}
                      alt="img"
                      height={25}
                      width={25}
                    />
                    :
                  <Controller
                  id={`multiple_design.${index}.thumbnail`}
                      name={`multiple_design.${index}.thumbnail`}
                                
                                control={control}
                                // rules={{ required: "Design File is required" }}
                                render={({ field: { onChange, value } }) => (
                                  <Input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={(e) => {
                                      onChange();
                                      handleFile(e, fld,index);
                                    }}
                                  />
                                )}
                              />
                  }
                  </td>
                  <td>
                  <Controller
                  id={`multiple_design.${index}.category`}
                      name={`multiple_design.${index}.category`}
                            
                              control={control}
                              rules={{ required: "Category is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  options={
                                   categoryDropdown || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.multiple_design && (
                      <FormFeedback>
                        {errors?.multiple_design[index]?.category?.message}
                      </FormFeedback>
                    )}
                  </td>
                  <td>
                  <Controller
                  id={`multiple_design.${index}.color`}
                      name={`multiple_design.${index}.color`}
                            
                              control={control}
                              rules={{ required: "Color is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable
                                  isMulti
                                  options={
                                   colorDropdown || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={onChange}
                                  value={value ? value : null}
                                />
                              )}
                            />
                            {errors.multiple_design && (
                      <FormFeedback>
                        {errors?.multiple_design[index]?.color?.message}
                      </FormFeedback>
                    )}
                  </td>
                  <td>
                  <Controller
                             id={`multiple_design.${index}.tag`}
                      name={`multiple_design.${index}.tag`}
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
                            {errors.multiple_design && (
                      <FormFeedback>
                        {errors?.multiple_design[index]?.tag?.message}
                      </FormFeedback>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
          <Button className="" onClick={() => navigate('/design-list-v2')}>
            Cancel
          </Button>
          <Button className="ms-2" type="submit">
            Submit
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadDesignMultipleForm;
