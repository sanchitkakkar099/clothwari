import React from "react";
import { Button, FormFeedback, Input, Table } from "reactstrap";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Select from "react-select";
import { Typeahead } from "react-bootstrap-typeahead";



function UploadDesignMultipleForm() {
  const location = useLocation();
  const navigate = useNavigate()
  const { state: locationState } = location;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setValue,
    setError,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
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
          image: locationState[i],
          thumbnail: "",
        });
      }
    }
  }, [locationState]);

  console.log("locationState", locationState);

  const onNext = (state) => {
    console.log("state", state);
  };

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
          <Table dark responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Design Number</th>
                <th>Image</th>
                <th>Thumbnail</th>
                <th>Category</th>
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
                        <input
                          placeholder="Entare Name"
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
                        <input
                          placeholder="Design Number"
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
                                      onChange(e.target.files);
                                    }}
                                  />
                                )}
                              />
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
                                    [{
                                        label:'Category 1',
                                        value:'1'
                                    }]|| []
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
