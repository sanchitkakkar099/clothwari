import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input, Progress } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {   useEditDriveMutation, useUploadCreateDriveMutation, useUploadMarketingPDFFileMutation, useDeleteDriveUnsubmittedFileMutation } from "../../service";
import toast from "react-hot-toast";
import { setUploadProgress, setUploadTag } from "../../redux/designUploadSlice";
import { X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import PDFICON from "../../assets/images/pdf_icon.svg";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_URL
    :  import.meta.env.VITE_APP_PROD_URL;
    

function DriveForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const { state: locationState } = location;
  // const resDriveById = useDriveByIdQuery(locationState?.driveID, {
  //   skip: !locationState?.driveID,
  // });
  const [reqUploadDrive, resDriveUpload] = useUploadCreateDriveMutation();
  const [reqEditDrive, resEditDrive] = useEditDriveMutation();
  const [reqDeleteUnsubmittedFile, resDeleteUnsubmittedFile] = useDeleteDriveUnsubmittedFileMutation();

  const uploadProgress = useSelector(
    (state) => state?.designUploadState.uploadProgress
  );
  const uploadTag= useSelector(
    (state) => state?.designUploadState.uploadTag
  );
  const [mainFile, setMainFile] = useState(null);
  const [key, setKey] = useState('');
  const [reqFile,resFile] = useUploadMarketingPDFFileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError
  } = useForm();

  const onNext = (state) => {
    if(locationState?.isEdit){
      reqEditDrive({
        _id:locationState?.data?._id,
        pdfName:state?.pdfName
      })
    }else{
      reqUploadDrive({
        ...state,
        key:key,
        data:[],
      });
    }
  };

  useEffect(() => {
    if (locationState?.isEdit && locationState?.data) {
      reset({
        _id:locationState?.data?._id,
        pdfName:locationState?.data?.pdfName,
        pdfurl:locationState?.data?.pdfurl
      });
      setMainFile(locationState?.data?.pdfurl);
    }
  }, [locationState]);

  useEffect(() => {
    if (resDriveUpload?.isSuccess) {
      toast.success("Uploaded SuccessFully", {
        position: "top-center",
      });
      reset()
      navigate("/drive-list");
    }
    if (resDriveUpload?.isError) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  }, [resDriveUpload?.isSuccess,resDriveUpload?.isError]);


  useEffect(() => {
    if (resEditDrive?.isSuccess) {
      toast.success("Drive Name Updated SuccessFully", {
        position: "top-center",
      });
      reset()
      if(location?.state?.isEdit){
        navigate("/drive-list",{
          state:{
            currentPage:location?.state?.currentPage
          }
        });
      }else{
        navigate("/drive-list")
      }
    }
    if (resEditDrive?.isError) {
      toast.error(resEditDrive?.error?.data?.message ? 
        resEditDrive?.error?.data?.message : "Something went wrong", {
        position: "top-center",
      });
    }
  }, [resEditDrive?.isSuccess,resEditDrive?.isError,location])

  useEffect(() => {
    if (resDeleteUnsubmittedFile?.isSuccess) {
      toast.success("Deleted SuccessFully", {
        position: "top-center",
      });
      setValue('pdfurl', "");
      setMainFile(null)
      setKey(null);
    }
    if (resDeleteUnsubmittedFile?.isError) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  }, [resDeleteUnsubmittedFile?.isSuccess,resDeleteUnsubmittedFile?.isError]);

  const handleFile = async (e, name) => {
    if (name === "pdfurl" && e.target.files) {
      dispatch(setUploadTag({pdf_file:true}))
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const reqData = {
        file: formData,
        type: 99,
      };
      const fileResponse =  await reqFile({ url:`${baseUrl}/uploads/drive/pdf/?type=${reqData?.type}`, data:reqData?.file });
      if(fileResponse?.data?.code === 200 && fileResponse?.data?.data){
      if (fileResponse?.data?.data) {
              setValue(name, fileResponse?.data?.data?.pdfurl);
              setError(name, "");
              setKey(fileResponse?.data?.data?.key)
              setMainFile(fileResponse?.data?.data?.pdfurl);
              dispatch(setUploadProgress(null))
              dispatch(setUploadTag(null))
            }
          }else{
            toast.error('Something went wrong',{
              position:"top-center"
            })
            dispatch(setUploadProgress(null))
            dispatch(setUploadTag(null))
          }
    }
  };

  const removeFile = (e, name) => {
    if(!key){
      return 
    };
    reqDeleteUnsubmittedFile({
      key:key
    }) 
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
                        <Label className="form-label" for="pdfName">
                            Name
                        </Label>
                        <Controller
                          id="pdfName"
                          name="pdfName"
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
                        {errors.pdfName && (
                          <FormFeedback>{errors?.pdfName?.message}</FormFeedback>
                        )}
                      </div>
                      </div>
                      {!locationState?.isEdit &&
                      <div className="col-md-12">
                        <div className="mb-3">
                          <Label className="form-label" for="pdfurl">
                            Upload PDF
                          </Label>
                          <div className="border-top">
                        <Controller
                          id="pdfurl"
                          name="pdfurl"
                          control={control}
                          rules={{ required: "PDF is required" }}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => {
                                onChange(e.target.files);
                                handleFile(e, "pdfurl");
                              }}
                            />
                          )}
                        />
                        {errors.pdfurl && (
                        <FormFeedback>{errors?.pdfurl?.message}</FormFeedback>
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
                                          removeFile(e, "pdfurl")
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
                      }
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
