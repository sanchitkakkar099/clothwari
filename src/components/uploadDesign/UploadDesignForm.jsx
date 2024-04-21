import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input, Button, Progress } from "reactstrap";
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
  useMultipleThumbnailUploadMutation,
  useNewTiffUploadMutation,
  useSearchTagMutation,
  useSubmitDesignUploadMutation,
  useSubmitTagMutation,
  useTagDropdownListQuery,
  useUniqueDesignNameCheckMutation,
  useUniqueDesignNumberCheckMutation,
} from "../../service";
import toast from "react-hot-toast";
import { Typeahead } from "react-bootstrap-typeahead";
import { alphaNumericPattern } from "../common/InputValidation";
import PDFICON from "../../assets/images/pdf_icon.svg";
import IMGICON from "../../assets/images/picture-circle.png";
import {
  bulkMainFilesDownload,
  bulkThumbnailFilesDownload,
} from "../../utils/bulkFileDownload";
import { ArrowDownCircle, Download, X } from "react-feather";
import { setUploadProgress, setUploadTag } from "../../redux/designUploadSlice";
import { useDebounce } from "../../hook/useDebpunce";
// import AWS from 'aws-sdk';
const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_URL
    :  import.meta.env.VITE_APP_PROD_URL;

function AddDesign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const uploadProgress = useSelector(
    (state) => state?.designUploadState.uploadProgress
  );
  const uploadTag= useSelector(
    (state) => state?.designUploadState.uploadTag
  );
  const [reqDesignUpload, resDesignUpload] = useSubmitDesignUploadMutation();
  const resDesignById = useDesignUploadByIdQuery(locationState?.designID, {
    skip: !locationState?.designID,
    refetchOnMountOrArgChange:true,
    refetchOnReconnect:true,
  });
  const resCategoryListDropdown = useCategoryDropdownListQuery();
  const resColorListDropdown = useColorVariationDropdownListQuery();

  const resTagListDropdown = useTagDropdownListQuery();

  const [reqFile,resFile] = useMultipleFileUploadMutation();
  const [reqNewTiffFile] = useNewTiffUploadMutation();
  const [reqThunmbnailFile] = useMultipleThumbnailUploadMutation();

  const [reqUniqueNameCheck,resUniqueNameCheck] = useUniqueDesignNameCheckMutation();
  const [reqUniqueNumberCheck,resUniqueNumberCheck] = useUniqueDesignNumberCheckMutation();

  const [reqCreateTag, resCreateTag] = useSubmitTagMutation();
  const [reqSearchTag, resSearchTag] = useSearchTagMutation();

  const [mainFile, setMainFile] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState([]);
  const [variationMainFile, setVariationMainFile] = useState([]);
  const [variationThumbnailFile, setVariationThumbnailFile] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [colorDropdown, setColorDropdown] = useState([]);
  const [tagDropdown, setTagDropdown] = useState([]);
  // tag state
  const [tagOptions, setTagOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch,
    getValues,
  } = useForm();

  const debounceValue1 = useDebounce(watch('name'),500)
  const debounceValue2 = useDebounce(watch('designNo'),500)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  useEffect(() => {
    if(debounceValue1 && !locationState?.designID ){
      reqUniqueNameCheck({type:1,value:debounceValue1}).then(res => {
        if(res?.error?.status === 400 && res?.error?.data?.message === 'Already uploaded'){
          setError("name", {
            type: "manual",
            message:'Design name is already exist',
          })
        }else{
          setError('name','')
        }
      })
    }
    if(debounceValue2 && !locationState?.designID ){
      reqUniqueNumberCheck({type:2,value:debounceValue2}).then(res => {
        if(res?.error?.status === 400 && res?.error?.data?.message === 'Already uploaded'){
          setError("designNo", {
            type: "manual",
            message:'Design number is already exist',
          })
        }else{
          setError('designNo','')
        }
      })
    }
  },[debounceValue1,debounceValue2,locationState])

  useEffect(() => {
    if (resDesignById?.isSuccess && resDesignById?.data?.data) {
      reset({
        ...resDesignById.data.data,
        image: resDesignById?.data?.data?.image
          ? resDesignById?.data?.data?.image
          : null,
        thumbnail: resDesignById?.data?.data?.thumbnail
          ? resDesignById?.data?.data?.thumbnail
          : null,
        variations: resDesignById?.data?.data?.variations
          ? resDesignById?.data?.data?.variations
          : [],
      });
      if(resDesignById?.data?.data?.tag && Array.isArray(resDesignById?.data?.data?.tag) && resDesignById?.data?.data?.tag?.length > 0){
        setTags(resDesignById?.data?.data?.tag)
      }
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

  const handleFile = async (e, name) => {
    if (name === "image" && e.target.files) {
      dispatch(setUploadTag({image:true}))
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 1,
      };
      const fileResponse =  await reqFile({ url:`${baseUrl}/uploads/multiple/tiff/?type=${reqData?.type}`, data:reqData?.file });
      if(fileResponse?.data?.code === 200 && fileResponse?.data?.data){
        if (fileResponse?.data?.data) {
          setValue(name, fileResponse?.data?.data);
          setError(name, "");
          setMainFile([...mainFile, ...fileResponse?.data?.data]);
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
    if (name === "thumbnail" && e.target.files) {
      dispatch(setUploadTag({thumbnail:true}))
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 5,
        watermark: true,
      };
      const fileResponse =  await reqFile({ url:`${baseUrl}/uploads/multiple/pdf/?type=${reqData?.type}`, data:reqData?.file });
      if(fileResponse?.data?.code === 200 && fileResponse?.data?.data){
      if (fileResponse?.data?.data) {
              setValue(name, fileResponse?.data?.data);
              setError(name, "");
              setThumbnailFile([...thumbnailFile, ...fileResponse?.data?.data]);
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

  // const handleS3Upload = async (e,name) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   dispatch(setUploadTag({ image: true }));
  //   try {
  //       AWS.config.update({
  //           accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY_ID,
  //           secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESS_KEY,
  //           correctClockSkew: true,
  //       });
  //       const s3 = new AWS.S3({
  //           params: { Bucket: import.meta.env.VITE_APP_BUCKET },
  //           region: import.meta.env.VITE_APP_REGION,
  //       });
  //       const responses = [];
  //       for (const file of selectedFiles) {
  //           const params = {
  //               Bucket: import.meta.env.VITE_APP_BUCKET,
  //               Key: `design/${file.name}`,
  //               Body: file,
  //           };
  //           try {
  //               const res = await s3.putObject(params).on("httpUploadProgress", (evt) => {
  //                 dispatch(setUploadProgress(parseInt((evt.loaded * 100) / evt.total)))
  //               }).promise();
  //               if (res && res.$response.httpResponse.statusCode === 200) {
  //                   const location = `https://${import.meta.env.VITE_APP_BUCKET}.s3.${import.meta.env.VITE_APP_REGION}.amazonaws.com/${params.Key}`;
  //                   responses.push({
  //                       filename: file.name,
  //                       originalname: file.name,
  //                       mimetype: file.type,
  //                       size: file.size,
  //                       filepath: location,
  //                   });
  //               }
  //           } catch (error) {
  //               toast.error(error, {
  //                   position: 'top-center'
  //               });
  //           }
  //       }
  //       if (responses.length > 0) {
  //           try {
  //               const res = await reqNewTiffFile({ file: responses });
  //               if (res?.data?.code === 200 && res?.data?.data) {
  //                   setValue(name, res?.data?.data);
  //                   setError(name, "");
  //                   setMainFile([...mainFile, ...res?.data?.data]);
  //                   dispatch(setUploadProgress(null));
  //                   dispatch(setUploadTag(null));
  //               }
  //           } catch (err) {
  //               toast.error("Something went wrong while processing uploaded files", {
  //                   position: 'top-center'
  //               });
  //               dispatch(setUploadProgress(null));
  //               dispatch(setUploadTag(null));
  //           }
  //       }
  //   } catch (error) {
  //       toast.error("An error occurred while uploading files. Please try again later.", {
  //           position: 'top-center'
  //       });
  //       dispatch(setUploadProgress(null));
  //       dispatch(setUploadTag(null));
  //   }
  // };

  const onNext = (state) => {
    console.log("state", {
      ...state,
      category: state?.category?.value,
      tag: state?.tag,
      image:
        mainFile && Array.isArray(mainFile) && mainFile?.length > 0
          ? mainFile?.map((mf) => mf?._id)
          : null,
      thumbnail:
        thumbnailFile &&
        Array.isArray(thumbnailFile) &&
        thumbnailFile?.length > 0
          ? thumbnailFile?.map((tf) => tf?._id)
          : null,
      variations:
        state?.variations &&
        Array.isArray(state?.variations) &&
        state?.variations?.length > 0
          ? state?.variations?.map((el) => ({
              ...el,
              variation_image: el?.variation_image?.map((vi) => vi?._id),
              variation_thumbnail: el?.variation_thumbnail?.map((vt) => vt._id),
            }))
          : [],
    });
    reqDesignUpload({
      ...state,
      category: state?.category?.value,
      tag: state?.tag,
      image:
        mainFile && Array.isArray(mainFile) && mainFile?.length > 0
          ? mainFile?.map((mf) => mf?._id)
          : null,
      thumbnail:
        thumbnailFile &&
        Array.isArray(thumbnailFile) &&
        thumbnailFile?.length > 0
          ? thumbnailFile?.map((tf) => tf?._id)
          : null,
      variations:
        state?.variations &&
        Array.isArray(state?.variations) &&
        state?.variations?.length > 0
          ? state?.variations?.map((el) => ({
              ...el,
              variation_image: el?.variation_image?.map((vi) => vi?._id),
              variation_thumbnail: el?.variation_thumbnail?.map((vt) => vt._id),
            }))
          : [],
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

  const removeFile = (e, name, fld) => {
    e.preventDefault();
    if (name === "image") {
      setValue(name, "");
      const res1 = mainFile?.filter((el) => el?._id !== fld?._id);
      setMainFile(res1);
    }
    if (name === "thumbnail") {
      setValue(name, "");
      const res1 = thumbnailFile?.filter((el) => el?._id !== fld?._id);
      setThumbnailFile(res1);
    }
  };

  const handleVariationFile = async (e, name, tag, inx, fld) => {
    e.preventDefault();
    const existingVal = getValues("variations")[inx];
    const variationCopys = getValues("variations");
    if (tag === "image" && e.target.files) {
      dispatch(setUploadTag({variation_image:true,color:fld?.color}))
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 1,
      };
      const fileResponse =  await reqFile({ url:`${baseUrl}/uploads/multiple?type=${reqData?.type}`, data:reqData?.file });
      
      if(fileResponse?.data?.code === 200 && fileResponse?.data?.data){
        if (fileResponse?.data?.data) {
                const updatedFields = [...variationCopys]; // Create a copy of fields array
                if (existingVal) {
                  updatedFields[inx] = {
                    ...existingVal,
                    variation_image: !fld?.variation_image
                      ? fileResponse?.data?.data
                      : [...fld?.variation_image, ...fileResponse?.data?.data], // Add a new property to the field object
                  };
                  
                  setValue(`variations`, updatedFields);
                  setError(name, "");
                  dispatch(setUploadProgress(null))
                  dispatch(setUploadTag(null))
                }
              }
      }else{
        toast.error('Something went wrong',{
          position:"top-center"
        })
        dispatch(setUploadProgress(null))
        dispatch(setUploadTag(null))
      }
    }
    if (tag === "thumbnail" && e.target.files) {
      dispatch(setUploadTag({variation_thumbnail:true,color:fld?.color}))
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      const reqData = {
        file: formData,
        type: 5,
        watermark: true,
      };
      const fileResponse =  await reqFile({ url:`${baseUrl}/uploads/multiple/pdf/?type=${reqData?.type}`, data:reqData?.file });
      if(fileResponse?.data?.code === 200 && fileResponse?.data?.data){
        if (fileResponse?.data?.data) {
                const updatedFields = [...variationCopys]; // Create a copy of fields array
                if (existingVal) {
                  updatedFields[inx] = {
                    ...existingVal,
                    variation_thumbnail: !fld?.variation_thumbnail
                      ? fileResponse?.data?.data
                      : [...fld?.variation_thumbnail, ...fileResponse?.data?.data], // Add a new property to the field object
                  };
                  
                  setValue(`variations`, updatedFields);
                  setError(name, "");
                  dispatch(setUploadProgress(null))
                  dispatch(setUploadTag(null))
                }
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

  // const handleVariationFileS3 = async (e, name, tag, inx, fld) => {
  //   e.preventDefault();
  //   const selectedFiles = Array.from(e.target.files);
  //   const existingVal = getValues("variations")[inx];
  //   const variationCopys = getValues("variations");
  //   dispatch(setUploadTag({variation_image:true,color:fld?.color}))
  //   try {
  //     AWS.config.update({
  //         accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY_ID,
  //         secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESS_KEY,
  //         correctClockSkew: true,
  //     });
  //     const s3 = new AWS.S3({
  //         params: { Bucket: import.meta.env.VITE_APP_BUCKET },
  //         region: import.meta.env.VITE_APP_REGION,
  //     });
  //     const responses = [];
  //     for (const file of selectedFiles) {
  //         const params = {
  //             Bucket: import.meta.env.VITE_APP_BUCKET,
  //             Key: `design/${file.name}`,
  //             Body: file,
  //         };
  //         try {
  //             const res = await s3.putObject(params).on("httpUploadProgress", (evt) => {
  //               dispatch(setUploadProgress(parseInt((evt.loaded * 100) / evt.total)))
  //             }).promise();
  //             if (res && res.$response.httpResponse.statusCode === 200) {
  //                 const location = `https://${import.meta.env.VITE_APP_BUCKET}.s3.${import.meta.env.VITE_APP_REGION}.amazonaws.com/${params.Key}`;
  //                 responses.push({
  //                     filename: file.name,
  //                     originalname: file.name,
  //                     mimetype: file.type,
  //                     size: file.size,
  //                     filepath: location,
  //                 });
  //             }
  //         } catch (error) {
  //             toast.error(error, {
  //                 position: 'top-center'
  //             });
  //         }
  //     }
  //     if (responses.length > 0) {
  //         try {
  //             const res = await reqNewTiffFile({ file: responses });
  //             if (res?.data?.code === 200 && res?.data?.data) {
  //               const updatedFields = [...variationCopys]; // Create a copy of fields array
  //               if (existingVal) {
  //                 updatedFields[inx] = {
  //                   ...existingVal,
  //                   variation_image: !fld?.variation_image
  //                     ? res?.data?.data
  //                     : [...fld?.variation_image, ...res?.data?.data], // Add a new property to the field object
  //                 };
                  
  //                 setValue(`variations`, updatedFields);
  //                 setError(name, "");
  //                 dispatch(setUploadProgress(null))
  //                 dispatch(setUploadTag(null))
  //             }
  //           }
  //         } catch (err) {
  //             toast.error("Something went wrong while processing uploaded files", {
  //                 position: 'top-center'
  //             });
  //             dispatch(setUploadProgress(null))
  //             dispatch(setUploadTag(null))
  //         }
  //     }
  //   } catch (error) {
  //       toast.error("An error occurred while uploading files. Please try again later.", {
  //           position: 'top-center'
  //       });
  //       dispatch(setUploadProgress(null))
  //       dispatch(setUploadTag(null))
  //   }
  // };

  const appendVariation = (element, context) => {
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
      
    }
  };

  const removeVariationFile = (e, tag, inx, fld) => {
    e.preventDefault();
    const existingVal = getValues("variations")[inx];
    
    const variationCopys = getValues("variations");
  
    if (tag === "image") {
      const updatedFields = [...variationCopys]; // Create a copy of fields array
      if (existingVal) {
        updatedFields[inx] = {
          ...existingVal,
          variation_image: updatedFields[inx]?.variation_image?.filter(
            (el) => el?._id !== fld?._id
          ),
        };
   
        setValue(`variations`, updatedFields);
      }
    }
    if (tag === "thumbnail") {
      const updatedFields = [...variationCopys]; // Create a copy of fields array
      if (existingVal) {
        updatedFields[inx] = {
          ...existingVal,
          variation_thumbnail: updatedFields[inx]?.variation_thumbnail?.filter(
            (el) => el?._id !== fld?._id
          ), // Add a new property to the field object
        };
       
        setValue(`variations`, updatedFields);
      }
    }
  };



  const handleTagInputChange = (input) => {
    setTagInput(input);
    reqSearchTag({search:input}).then(res => {
      if(res.data?.data && res?.data?.data && res?.data?.data?.length > 0){
        if(tags && Array.isArray(tags) && tags?.length > 0){
         const res1 =  res?.data?.data?.filter(rs => !tags?.some(ts => ts?.label === rs?.label))
         setTagOptions(res1)
        }else{
         setTagOptions(res?.data?.data)
        }
      }else{
        setTagOptions([])
      }
    })
  };
  
  const handleTagSelection = (selected) => {
    if ((selected && Array.isArray(selected)) &&
        (tags && Array.isArray(tags)) &&
        (selected.length > tags.length)) {
        setValue('tag',selected)
        setError('tag','')
        setTags(selected);
        if(tagOptions && Array.isArray(tagOptions) && tagOptions?.length > 0){
          setTagOptions(tagOptions?.filter(el => !selected?.some(ts => ts?.label === el?.label)))
        }
        if(tagOptions && Array.isArray(tagOptions) && !tagOptions?.some(el => selected?.some(ts => ts?.label === el?.label))){
          reqCreateTag(selected[selected.length - 1])
        }
        setTagInput('');
    }else{
      setValue('tag',selected)
      setTags(selected);
      setTagInput(''); // Clear the input field after selection
    }
    if(Array.isArray(selected) && !selected.length){
      setError('tag', {
        type: 'manual',
        message: 'Tag is required',
      })
    }
  };

  const customStyles = { 
    multiValueRemove: (base, { data }) => ({
        ...base,
        display: (userInfo?.role !== "Super Admin" && resDesignById?.data?.data?.color && Array.isArray(resDesignById?.data?.data?.color) && resDesignById?.data?.data?.color?.length > 0 && resDesignById?.data?.data?.color?.some(option => option.value === data.value)) ? 'none' : 'block'
    })
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
                    <Link to="" onClick={(e) => e.preventDefault()}>Design</Link>
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
                        <h5 className="font-size-16 mb-1">Design Info</h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all information below
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div
                  className="collapse show"
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
                                  placeholder="Enter Name"
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
                                  allowNew={(tags && Array.isArray(tags) && !tags?.some(el => el?.label?.toLowerCase() === tagInput?.toLowerCase())) && (tagOptions && Array.isArray(tagOptions) && tagOptions?.length === 0)}
                                  id="custom-selections-example"
                                  labelKey={'label'}
                                  multiple
                                  newSelectionPrefix={(tags && Array.isArray(tags) && !tags?.some(el => el?.label?.toLowerCase() === tagInput?.toLowerCase())) && (tagOptions && Array.isArray(tagOptions) && tagOptions?.length === 0) ? "Add Tag: " : ""}
                                  options={tagOptions || []}
                                  placeholder="Type anything..."
                                  onChange={handleTagSelection}
                                  onInputChange={handleTagInputChange}
                                  selected={tags || []}
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
                          Upload Main File
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
                                  // handleS3Upload(e, "image");

                                }}
                                disabled={
                                  (locationState?.isEdit && userInfo?.onlyUpload) || uploadProgress
                                }
                              />
                            )}
                          />
                          {(uploadProgress && uploadTag?.image) &&
                                  <div style={{marginTop:'10px'}}>
                                    <Progress animated color="success" value={uploadProgress} />
                                    <p>Progress: {uploadProgress}%</p>
                                  </div>
                          }
                          {mainFile &&
                            Array.isArray(mainFile) &&
                            mainFile?.length > 0 &&
                        
                                <div className="image-gallery">
                                {mainFile?.map((el, tinx) => {
                              return (
                                  <div className="image-item"  key={tinx}>
                                    <Link
                                      to=""
                                      download={el?.originalname}
                                      className="download-button"
                                    >
                                      <img src={IMGICON} alt="Image 2" />
                                      {(userInfo?.role === "Super Admin" ||
                                        userInfo?.permissions?.some(
                                          (el) =>
                                            el === "Uploaded Design Download"
                                        )) && (
                                        <ArrowDownCircle
                                          className="download-icon"
                                          size={"24px"}
                                          onClick={(e) =>
                                            bulkMainFilesDownload(e, el)
                                          }
                                        />
                                      )}
                                      {(userInfo?.role === "Super Admin" || !locationState?.designID) &&
                                      <div className="remove-wrapper">
                                        <X
                                          className="remove-icon"
                                          onClick={(e) =>
                                            removeFile(e, "image", el)
                                          }
                                        />
                                      </div>
                                      }
                                    </Link>
                                  </div>
                                  );
                            })}
                                </div>
                             
                          }
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
                                disabled={uploadProgress}
                              />
                            )}
                          />
                          {errors.thumbnail && (
                            <FormFeedback>
                              {errors?.thumbnail?.message}
                            </FormFeedback>
                          )}

                          {(uploadProgress && uploadTag?.thumbnail) &&
                                  <div style={{marginTop:'10px'}}>
                                    <Progress animated color="success" value={uploadProgress} />
                                    <p>Progress: {uploadProgress}%</p>
                                  </div>
                          }

                          {thumbnailFile &&
                            Array.isArray(thumbnailFile) &&
                            thumbnailFile?.length > 0 &&
                            
                                <div className="image-gallery">
                                {thumbnailFile?.map((el, tinx) => {
                              return (
                                  <div className="image-item"  key={tinx}>
                                    <Link
                                      to=""
                                      download="image2.jpg"
                                      className="download-button"
                                    >
                                      <img src={PDFICON} alt="Image 2" />
                                      {(userInfo?.role === "Super Admin" ||
                                        userInfo?.permissions?.some(
                                          (el) =>
                                            el === "Uploaded Design Download"
                                        )) && (
                                        <ArrowDownCircle
                                          className="download-icon"
                                          size={"24px"}
                                          onClick={(e) =>
                                            bulkThumbnailFilesDownload(e, el)
                                          }
                                        />
                                      )}
                                      {(userInfo?.role === "Super Admin" || !locationState?.designID) &&
                                      <div className="remove-wrapper">
                                        <X
                                          className="remove-icon"
                                          onClick={(e) =>
                                            removeFile(e, "thumbnail", el)
                                          }
                                        />
                                      </div>
                                      }
                                    </Link>
                                  </div>
                                  );
                            })}
                                </div>
                              
                            }
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="primary_color_name">
                              Primary Color Name
                            </Label>
                            <Controller
                              id="primary_color_name"
                              name="primary_color_name"
                              control={control}
                              rules={{ required: "Primary Color Name is required" }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Primary Color Name"
                                  className="form-control"
                                  {...field}
                                  type="text"
                                />
                              )}
                            />
                            {errors.primary_color_name && (
                              <FormFeedback>
                                {errors?.primary_color_name?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="primary_color_code">
                            Primary Color Code
                            </Label>
                            <Controller
                              id="primary_color_code"
                              name="primary_color_code"
                              control={control}
                              rules={{
                                required: "Primary Color Code is required",
                                // validate:alphaNumericPattern
                              }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Primary Color Code"
                                  className="form-control"
                                  {...field}
                                  type="color"
                                  style={{height:38}}
                                />
                              )}
                            />
                            {errors.primary_color_code && (
                              <FormFeedback>
                                {errors?.primary_color_code?.message}
                              </FormFeedback>
                            )}
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
                              // rules={{ required: "Variation is required" }}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  isClearable={userInfo?.role === "Super Admin"}
                                  isMulti
                                  options={colorDropdown || []}
                                  styles={customStyles}
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

                      <hr className="solid"></hr>

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
                                        placeholder="Enter Name"
                                        className="form-control"
                                        {...field}
                                        type="text"
                                      />
                                    )}
                                  />
                                  {errors.variations && (
                                    <FormFeedback>
                                      {
                                        errors?.variations[finx]?.variation_name
                                          ?.message
                                      }
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
                                        placeholder="Enter Design Number"
                                        className="form-control"
                                        {...field}
                                      />
                                    )}
                                  />
                                  {errors.variations && (
                                    <FormFeedback>
                                      {
                                        errors?.variations[finx]
                                          ?.variation_designNo?.message
                                      }
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
                                    Upload Main File
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
                                           handleVariationFile(
                                            e,
                                            `variations.${finx}.variation_image`,
                                            "image",
                                            finx,
                                            fld
                                          );
                                          // handleVariationFileS3(
                                          //   e,
                                          //   `variations.${finx}.variation_image`,
                                          //   "image",
                                          //   finx,
                                          //   fld
                                          // );
                                        }}
                                        disabled={uploadProgress}
                                      />
                                    )}
                                  />
                                  {(uploadProgress && uploadTag?.variation_image && uploadTag?.color === fld?.color) &&
                                  <div style={{marginTop:'10px'}}>
                                    <Progress animated color="success" value={uploadProgress} />
                                    <p>Progress: {uploadProgress}%</p>
                                  </div>
                                  }
                                  <div className="uploaded_img">
                                    {watch(
                                      `variations.${finx}.variation_image`
                                    ) &&
                                      Array.isArray(
                                        watch(
                                          `variations.${finx}.variation_image`
                                        )
                                      ) &&
                                      watch(
                                        `variations.${finx}.variation_image`
                                      )?.length > 0 &&
                                     
                                        
                                          <div
                                            className="image-gallery"
                                           
                                          >
                                           {watch(
                                        `variations.${finx}.variation_image`
                                      )?.map((el, minx) => {
                                        return (
                                            <div className="image-item"  key={minx}>
                                              <Link
                                                to=""
                                                download="image2.jpg"
                                                className="download-button"
                                              >
                                                <img
                                                  src={IMGICON}
                                                  alt="Image 2"
                                                />
                                                {(userInfo?.role ===
                                                  "Super Admin" ||
                                                  userInfo?.permissions?.some(
                                                    (el) =>
                                                      el ===
                                                      "Uploaded Design Download"
                                                  )) && (
                                                  <ArrowDownCircle
                                                    className="download-icon"
                                                    size={"24px"}
                                                    onClick={(e) =>
                                                      bulkMainFilesDownload(
                                                        e,
                                                        el
                                                      )
                                                    }
                                                  />
                                                )}
                                                {(userInfo?.role === "Super Admin" || !locationState?.designID) &&
                                                <div className="remove-wrapper">
                                                  <X
                                                    className="remove-icon"
                                                    onClick={(e) =>
                                                      removeVariationFile(
                                                        e,
                                                        "image",
                                                        finx,
                                                        el
                                                      )
                                                    }
                                                  />
                                                </div>
                                                }
                                              </Link>
                                            </div>
                                            )
                                      })}
                                          </div>
                                       
                                      }
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    for={`variations.${finx}.variation_thumbnail`}
                                  >
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
                                          handleVariationFile(
                                            e,
                                            `variations.${finx}.variation_thumbnail`,
                                            "thumbnail",
                                            finx,
                                            fld
                                          );
                                        }}
                                        disabled={uploadProgress}
                                      />
                                    )}
                                  />
                                   {(uploadProgress && uploadTag?.variation_thumbnail && uploadTag?.color === fld?.color) &&
                                  <div style={{marginTop:'10px'}}>
                                    <Progress animated color="success" value={uploadProgress} />
                                    <p>Progress: {uploadProgress}%</p>
                                  </div>
                                  }
                                  <div className="uploaded_img">
                                    {watch(
                                      `variations.${finx}.variation_thumbnail`
                                    ) &&
                                      Array.isArray(
                                        watch(
                                          `variations.${finx}.variation_thumbnail`
                                        )
                                      ) &&
                                      watch(
                                        `variations.${finx}.variation_thumbnail`
                                      )?.length > 0 &&
                                      
                                          <div
                                            className="image-gallery"
                                            
                                          >
                                          {watch(
                                        `variations.${finx}.variation_thumbnail`
                                      )?.map((el, minx) => {
                                        return (
                                            <div className="image-item" key={minx}>
                                              <Link
                                                to=""
                                                download="image2.jpg"
                                                className="download-button"
                                              >
                                                <img
                                                  src={PDFICON}
                                                  alt="Image 2"
                                                />
                                                {(userInfo?.role ===
                                                  "Super Admin" ||
                                                  userInfo?.permissions?.some(
                                                    (el) =>
                                                      el ===
                                                      "Uploaded Design Download"
                                                  )) && (
                                                  <ArrowDownCircle
                                                    className="download-icon"
                                                    size={"24px"}
                                                    onClick={(e) =>
                                                      bulkThumbnailFilesDownload(
                                                        e,
                                                        el
                                                      )
                                                    }
                                                  />
                                                )}
                                                {(userInfo?.role === "Super Admin" || !locationState?.designID) &&
                                                <div className="remove-wrapper">
                                                  <X
                                                    className="remove-icon"
                                                    onClick={(e) =>
                                                      removeVariationFile(
                                                        e,
                                                        "thumbnail",
                                                        finx,
                                                        el
                                                      )
                                                    }
                                                  />
                                                </div>
                                                }
                                              </Link>
                                            </div>
                                            );
                                      })}
                                          </div>
                                        
                                      }
                                  </div>
                                  {/* } */}
                                </div>
                              </div>
                            </div>

                            <hr className="solid"></hr>
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
                            disabled={resDesignUpload?.isLoading}
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
