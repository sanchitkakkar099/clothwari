import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input, Progress } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClientByIdQuery, useSubmitClientMutation, useUploadMarketingPDFFileMutation } from "../../service";
import toast from "react-hot-toast";
import { setUploadProgress, setUploadTag } from "../../redux/designUploadSlice";
import { X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";


function DriveForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  const [reqClient, resClient] = useSubmitClientMutation();
  const resClientById = useClientByIdQuery(locationState?.clientID, {
    skip: !locationState?.clientID,
  });
  const uploadProgress = useSelector(
    (state) => state?.designUploadState.uploadProgress
  );
  const uploadTag= useSelector(
    (state) => state?.designUploadState.uploadTag
  );
  const [mainFile, setMainFile] = useState(null);
  const [reqFile,resFile] = useUploadMarketingPDFFileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm();

  const onNext = (state) => {
    reqClient({...state});
  };

  useEffect(() => {
    if (resClient?.isSuccess) {
      toast.success(resClient?.data?.message, {
        position: "top-center",
      });
      reset()
      navigate("/drive-list");
    }
    // if (resClient?.isError) {
    //   setError("email", {
    //     type: "manual",
    //     message: resClient?.error?.data?.message,
    //   })
    // }
  }, [resClient?.isSuccess,resClient?.isError]);

  const handleFile = async (e, name) => {
    console.log("eeeee", name);
    // if (name === "pdf_file" && e.target.files) {
    //   dispatch(setUploadTag({pdf_file:true}))
    //   const formData = new FormData();
    //   formData.append("file", e.target.files[i]);
    //   const fileResponse =  await reqFile({ url:`${baseUrl}/uploads/multiple/pdf/?type=${reqData?.type}`, data:reqData?.file });
    //   if(fileResponse?.data?.code === 200 && fileResponse?.data?.data){
    //   if (fileResponse?.data?.data) {
    //           setValue(name, fileResponse?.data?.data);
    //           setError(name, "");
    //           setMainFile(fileResponse?.data?.data);
    //           dispatch(setUploadProgress(null))
    //           dispatch(setUploadTag(null))
    //         }
    //       }else{
    //         toast.error('Something went wrong',{
    //           position:"top-center"
    //         })
    //         dispatch(setUploadProgress(null))
    //         dispatch(setUploadTag(null))
    //       }
    // }
  };

  const removeFile = (e, name) => {
    setValue(name, "");
    setMainFile(null)
  }
  

   return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Upload PDF</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Drive</a>
                  </li>
                  <li className="breadcrumb-item active">Upload PDF</li>
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
                        <h5 className="font-size-16 mb-1">Upload PDF Info</h5>
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
                        <div className="col-md-12">
                          <div className="mb-3">
                            <Label className="form-label" for="pdf_file">
                              Upload PDF
                            </Label>
                            <div className="border-top">
                          <Controller
                            id="pdf_file"
                            name="pdf_file"
                            control={control}
                            rules={{ required: "PDF is required" }}
                            render={({ field: { onChange, value } }) => (
                              <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                  onChange(e.target.files);
                                  handleFile(e, "pdf_file");
                                }}
                              />
                            )}
                          />
                          {errors.pdf_file && (
                          <FormFeedback>{errors?.pdf_file?.message}</FormFeedback>
                        )}
                          {(uploadProgress && uploadTag?.pdf_file) &&
                                  <div style={{marginTop:'10px'}}>
                                    <Progress animated color="success" value={uploadProgress} />
                                    <p>Progress: {uploadProgress}%</p>
                                  </div>
                          }
                          {mainFile &&
                            
                                <div className="image-gallery">
                                  <div className="image-item">
                                    <Link
                                      to=""
                                      download="image2.jpg"
                                      className="download-button"
                                    >
                                      <img src={PDFICON} alt="Image 2" />
                                      
                                      <div className="remove-wrapper">
                                        <X
                                          className="remove-icon"
                                          onClick={(e) =>
                                            removeFile(e, "pdf_file")
                                          }
                                        />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              
                            }
                        </div>
                          </div>
                        </div>
                      </div>                      
                      <div className="row">
                        <div className="col text-end">
                          <Link to="/drive-list" className="btn btn-danger m-1">
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

export default DriveForm;
