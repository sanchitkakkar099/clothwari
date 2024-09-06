/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import imagepath from "../../assets/images/CAD-with-Shirt-1.png";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getDesignUpload } from "../../redux/designUploadSlice";
import {
  Button,
  Col,
  Input,
  Label,
  Row,
  Form,
  FormFeedback,
  Spinner,
} from "reactstrap";
import "./mock.css";
import { Plus, X } from "react-feather";
import Select from "react-select";
import {
  useDesignUploadListMutation,
  useDriveByIdQuery,
  useUploadDomesticDriveMutation,
} from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../hook/useDebpunce";

function domastic() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const dispatch = useDispatch();
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqUploadDriveDomestic, resDriveUploadDomestic] =
    useUploadDomesticDriveMutation();
  const resDriveById = useDriveByIdQuery(locationState?._id, {
    skip: !locationState?._id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({});
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imageSection",
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [id, setId] = useState("");
  const [imageNames, setImageNames] = useState({});
  const [selectedDesignNo, setSelectedDesignNo] = useState({});
  const [rowBackgrounds, setRowBackgrounds] = useState({});
  const [rowImageName, setRowImageName] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({});
  const [searchDb, setDearchDb] = useState(null);
  const [visibleDivs, setVisibleDivs] = useState({});
  const [productView, setProductView] = useState({});
  const [options, setOptions] = useState([]);

  // pagination
  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [totalCount, setTotalCount] = useState(0);

  const debounceValue1 = useDebounce(watch("imageSection"), 500);
  const debounceSearch = useDebounce(searchDb, 500);

  useEffect(() => {
    const transformedData = debounceValue1?.map((item, index) => {
      return Object.keys(item).reduce((accumulater, key) => {
        if (item[key] && item[key]?.pdf_extract_img) {
          accumulater.push({
            label: item[key]?.designNo,
            value: item[key]?.pdf_extract_img,
          });
        }
        return accumulater;
      }, []);
    });
    setOptions(transformedData);
  }, [debounceValue1]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      //   console.log("response data", resDesign?.data?.data?.docs);
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs);
      setTotalCount(resDesign?.data?.data?.totalDocs);
    }
  }, [resDesign]);

  useEffect(() => {
    if (resDriveById?.isSuccess && resDriveById?.data?.data) {
      reset({
        ...resDriveById?.data?.data,
      });
      resDriveById?.data?.data?.imageSection?.map((data, index) => {
        [
          "firstimage",
          "secondimage",
          "thirdimage",
          "forthimage",
          "fifthimage",
        ].map((imgKey) => {
          if (data[imgKey]) {
            const key = `imageSection_${index}_${imgKey}`;
            setImagePreviews((prevState) => ({
              ...prevState,
              [key]: data[imgKey]?.pdf_extract_img,
            }));
            setSelectedDesignNo((prevState) => ({
              ...prevState,
              [key]: data[imgKey]?.designNo,
            }));
            setImageNames((prevState) => ({
              ...prevState,
              [key]: data[imgKey]?.designNo,
            }));
            setSearch((prevState) => ({
              ...prevState,
              [key]: data[imgKey]?.designNo,
            }));
            setVisibleDivs((prevState) => ({
              ...prevState,
              [key]: "search_click_data",
            }));
          }
        });
        setRowImageName((prevState) => ({
          ...prevState,
          [`image_${index}`]:
            resDriveById?.data?.data?.rowBackgroundsData?.[`image_${index}`]
              ?.label,
        }));
        setValue(
          `image_${index}`,
          resDriveById?.data?.data?.rowBackgroundsData?.[`image_${index}`]
        );
      });
      setId(resDriveById?.data?.data?._id);
      setOptions(resDriveById?.data?.data?.rowBackgroundsData);
      setRowBackgrounds(resDriveById?.data?.data?.rowBackgroundsData || {});
    }
  }, [resDriveById]);

  useEffect(() => {
    if (resDriveUploadDomestic?.isSuccess) {
      toast.success("Uploaded SuccessFully", {
        position: "top-center",
      });
    }
    if (resDriveUploadDomestic?.isError) {
      console.log("resDriveUploadDomestic", resDriveUploadDomestic);
      toast.error(
        resDriveUploadDomestic?.error?.data?.message
          ? resDriveUploadDomestic?.error?.data?.message
          : "Something went wrong",
        {
          position: "top-center",
        }
      );
    }
  }, [resDriveUploadDomestic?.isSuccess, resDriveUploadDomestic?.isError]);

  useEffect(() => {
    reqDesign({
      search: debounceSearch || "",
    });
  }, [debounceSearch]);

  const handleSearch = (search, index) => {
    setSearch((prevState) => ({
      ...prevState,
      [index]: search,
    }));
    setDearchDb(search);
    setVisibleDivs((prevState) => ({
      ...prevState,
      [index]: "search_all_data",
    }));
  };

  const handleSearchClick = (e, data, key, index, imgKey, fields) => {
    e.preventDefault();
    const object = {
      pdf_extract_img: data?.thumbnail[0]?.pdf_extract_img,
      designNo: data?.designNo,
    };
    const existingVal = getValues("imageSection")[index];
    const variationCopys = getValues("imageSection");
    if (object) {
      const updatedFields = [...variationCopys];
      if (existingVal) {
        updatedFields[index] = {
          ...existingVal,
          [imgKey]: object,
        };

        setValue(`imageSection`, updatedFields);
      }
    }
    setSelectedDesignNo((prevState) => ({
      ...prevState,
      [key]: data?.designNo,
    }));
    setImageNames((prevState) => ({
      ...prevState,
      [key]: data?.designNo,
    }));

    setImagePreviews((prevState) => ({
      ...prevState,
      [key]: `${data?.thumbnail[0]?.pdf_extract_img}`,
    }));
    setProductView((prevState) => ({
      ...prevState,
      [key]: data,
    }));
    setVisibleDivs((prevState) => ({
      ...prevState,
      [key]: "search_click_data",
    }));
  };

  const handleChangeVariation = (e, variation, key, index, imgKey, fields) => {
    e.preventDefault();
    const existingVal = getValues("imageSection")[index];
    const variationCopys = getValues("imageSection");
    if (
      variation?.label &&
      productView[key]?.variations &&
      Array.isArray(productView[key]?.variations) &&
      productView[key]?.variations?.length > 0
    ) {
      const variationObj = productView[key]?.variations?.find(
        (el) => el?.color === variation?.label
      );
      if (variationObj?.variation_thumbnail[0]?.pdf_extract_img) {
        const object = {
          pdf_extract_img:
            variationObj?.variation_thumbnail[0]?.pdf_extract_img,
          designNo: variationObj?.variation_designNo,
        };
        if (object) {
          const updatedFields = [...variationCopys];
          if (existingVal) {
            updatedFields[index] = {
              ...existingVal,
              [imgKey]: object,
            };
            setValue(`imageSection`, updatedFields);
          }
        }
        setSelectedDesignNo((prevState) => ({
          ...prevState,
          [key]: variationObj?.variation_designNo,
        }));
        setImageNames((prevState) => ({
          ...prevState,
          [key]: variationObj?.variation_designNo,
        }));
        setImagePreviews((prevState) => ({
          ...prevState,
          [key]: `${variationObj?.variation_thumbnail[0]?.pdf_extract_img}`,
        }));
      }
    }
  };

  const handleChangePrimary = (e, data, key, index, imgKey, fields) => {
    e.preventDefault();
    const object = {
      pdf_extract_img: data?.thumbnail[0]?.pdf_extract_img,
      designNo: data?.designNo,
    };
    const existingVal = getValues("imageSection")[index];
    const variationCopys = getValues("imageSection");
    if (object) {
      const updatedFields = [...variationCopys];
      if (existingVal) {
        updatedFields[index] = {
          ...existingVal,
          [imgKey]: object,
        };

        setValue(`imageSection`, updatedFields);
      }
    }
    setSelectedDesignNo((prevState) => ({
      ...prevState,
      [key]: data?.name,
    }));
  };

  const handleSelectedImage = (field, key) => {
    if (!field?.value || !field?.label) return;
    setRowBackgrounds((prev) => ({
      ...prev,
      [key]: field,
    }));
    setRowImageName((prev) => ({
      ...prev,
      [key]: field?.label,
    }));
  };

  const handleRemove = (e, index) => {
    e.preventDefault();
    setValue(`image_${index}`, "");
    remove(index);
    const newSerach = { ...search };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newSerach[`imageSection_${index}_${imgKey}`];
    });
    const newImagePreviews = { ...imagePreviews };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newImagePreviews[`imageSection_${index}_${imgKey}`];
    });
    const newImageNames = { ...imageNames };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newImageNames[`imageSection_${index}_${imgKey}`];
    });
    const newDesignNumber = { ...selectedDesignNo };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newDesignNumber[`imageSection_${index}_${imgKey}`];
    });
    const newProductView = { ...productView };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newProductView[`imageSection_${index}_${imgKey}`];
    });

    const newVisibleDivs = { ...visibleDivs };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newVisibleDivs[`imageSection_${index}_${imgKey}`];
    });
    const newRowBackgrounds = { ...rowBackgrounds };
    delete newRowBackgrounds[`image_${index}`];
    // Object.keys(newImagePreviews).forEach((key) => {
    //   const [imgKey, imgIndex] = key.split(".");
    //   if (parseInt(imgIndex) > index) {
    //     const newIndex = parseInt(imgIndex) - 1;
    //     newImagePreviews[`imageSection_${index}_${imgKey}`] = newImagePreviews[key];
    //     delete newImagePreviews[key];
    //   }
    // });
    setSearch(newSerach);
    setVisibleDivs(newVisibleDivs);
    setProductView(newProductView);
    setSelectedDesignNo(newDesignNumber);
    setImageNames(newImageNames);
    setImagePreviews(newImagePreviews);
    setRowBackgrounds(newRowBackgrounds);
  };

  const handleRemoveSingle = (e, key, index, imgKey, fields) => {
    e.preventDefault();
    const existingVal = getValues("imageSection")[index];
    const selectDesign = getValues(`image_${index}`);
    const variationCopys = getValues("imageSection");
    const updatedFields = [...variationCopys];
    if (existingVal && existingVal[imgKey]) {
      if (selectDesign?.label === existingVal[imgKey]?.designNo) {
        setValue(`image_${index}`, "");
      }
      existingVal[imgKey] = "";
      updatedFields[index] = {
        ...existingVal,
      };
      setValue(`imageSection`, updatedFields);
    }
    setSearch((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setVisibleDivs((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setSelectedDesignNo((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setImageNames((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setImagePreviews((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setRowBackgrounds((prevState) => {
      const newState = { ...prevState };
      delete newState[`image_${index}`];
      return newState;
    });
  };

  const handleUplodPdf = (state) => {
    if (locationState?.isEdit) {
      delete state?.rowBackgroundsData;
    }
    console.log("After state", state);
    reqUploadDriveDomestic({
      ...state,
      rowBackgroundsData: rowBackgrounds,
    });
  };

  return (
    <>
      {userInfo?.role === "Super Admin" ||
      userInfo?.role === "Admin" ||
      userInfo?.role === "Designer" ? (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Domestic</h4>

                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="#!">Clothwari</a>
                      </li>
                      <li className="breadcrumb-item active">Domestic</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="position-relative">
                      <div className="modal-button modal-button-s mt-2">
                        <button
                          type="button"
                          className="btn btn-success waves-effect waves-light mb-4 me-2"
                          data-bs-toggle="modal"
                          data-bs-target=".add-new-order"
                          onClick={() => navigate("/view-mocks-international")}
                        >
                          Go To International
                        </button>
                      </div>
                      <div>
                        <Form onSubmit={handleSubmit(handleUplodPdf)}>
                          <Controller
                            id="pdfName"
                            name="pdfName"
                            control={control}
                            rules={{ required: "Title is required" }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Input Title"
                                {...field}
                                disabled={locationState?.isEdit}
                              />
                            )}
                          />
                          {errors?.pdfName && (
                            <FormFeedback>
                              {errors?.pdfName?.message}
                            </FormFeedback>
                          )}
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="border-bottom border-dark border-2 pb-1 w-100 d-flex"
                            >
                              <Col md={5}>
                                <Row className="justify-content-between align-items-center">
                                  {[
                                    "firstimage",
                                    "secondimage",
                                    "thirdimage",
                                    "forthimage",
                                    "fifthimage",
                                  ].map((imgKey, imgIndex) => (
                                    <Col md={12} key={imgIndex}>
                                      <div className="form-inline mt-2">
                                        <div className="search-box">
                                          <div className="position-relative">
                                            <input
                                              type="text"
                                              onChange={(e) =>
                                                handleSearch(
                                                  e.target.value,
                                                  `imageSection_${index}_${imgKey}`,
                                                  index,
                                                  fields
                                                )
                                              }
                                              className="form-control "
                                              placeholder={`Search Image ${
                                                imgIndex + 1
                                              }`}
                                              // value={search}
                                            />
                                            <i className="bx bx-search search-icon"></i>
                                          </div>
                                        </div>
                                      </div>
                                      {search[
                                        `imageSection_${index}_${imgKey}`
                                      ] &&
                                        (visibleDivs[
                                          `imageSection_${index}_${imgKey}`
                                        ] === "search_all_data" ? (
                                          <div className="c-search-data mt-2 mb-2">
                                            <div className="row">
                                              {designUploadList &&
                                              Array.isArray(designUploadList) &&
                                              designUploadList?.length > 0 ? (
                                                designUploadList?.map(
                                                  (el, i) => {
                                                    return (
                                                      <div
                                                        className="col-xl-11 col-sm-6 d-flex custom-hover"
                                                        key={i}
                                                      >
                                                        <Link
                                                          to={""}
                                                          onClick={(e) =>
                                                            handleSearchClick(
                                                              e,
                                                              el,
                                                              `imageSection_${index}_${imgKey}`,
                                                              index,
                                                              imgKey,
                                                              fields
                                                            )
                                                          }
                                                          className="text-dark font-size-16 ms-3"
                                                        >
                                                          {el?.name}
                                                        </Link>
                                                      </div>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <h4 className="text-center mt-5">
                                                  No Design Found
                                                </h4>
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="c-search-click-data mt-2 mb-2">
                                            <div className="product_details">
                                              <div className="pdf-remove-icon">
                                                <X
                                                  size={20}
                                                  onClick={(e) =>
                                                    handleRemoveSingle(
                                                      e,
                                                      `imageSection_${index}_${imgKey}`,
                                                      index,
                                                      imgKey,
                                                      fields
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div className="post-description">
                                                <h4>
                                                  {
                                                    selectedDesignNo[
                                                      `imageSection_${index}_${imgKey}`
                                                    ]
                                                  }
                                                </h4>
                                              </div>
                                              <div className="stats">
                                                {productView[
                                                  `imageSection_${index}_${imgKey}`
                                                ]?.primary_color_code && (
                                                  <Link
                                                    to=""
                                                    className="stat-item"
                                                    style={{
                                                      backgroundColor:
                                                        productView[
                                                          `imageSection${index}_${imgKey}`
                                                        ]?.primary_color_code,
                                                      fontSize: "18px",
                                                      width: "17px",
                                                      height: "17px",
                                                      borderRadius: "50%",
                                                      border:
                                                        "1px solid #c7c7c7",
                                                    }}
                                                    onClick={(e) =>
                                                      handleChangePrimary(
                                                        e,
                                                        productView[
                                                          `imageSection_${index}_${imgKey}`
                                                        ],
                                                        `imageSection_${index}_${imgKey}`,
                                                        index,
                                                        imgKey,
                                                        fields
                                                      )
                                                    }
                                                  >
                                                    <span className="" />
                                                  </Link>
                                                )}
                                                {productView[
                                                  `imageSection_${index}_${imgKey}`
                                                ]?.color &&
                                                  Array.isArray(
                                                    productView[
                                                      `imageSection_${index}_${imgKey}`
                                                    ]?.color
                                                  ) &&
                                                  productView[
                                                    `imageSection_${index}_${imgKey}`
                                                  ]?.color?.length > 0 &&
                                                  productView[
                                                    `imageSection_${index}_${imgKey}`
                                                  ]?.color?.map((cl, cinx) => {
                                                    return (
                                                      <Link
                                                        to=""
                                                        className="stat-item"
                                                        style={{
                                                          backgroundColor:
                                                            cl?.value,
                                                          fontSize: "18px",
                                                          width: "17px",
                                                          height: "17px",
                                                          borderRadius: "50%",
                                                          border:
                                                            "1px solid #c7c7c7",
                                                        }}
                                                        key={cinx}
                                                        onClick={(e) =>
                                                          handleChangeVariation(
                                                            e,
                                                            cl,
                                                            `imageSection_${index}_${imgKey}`,
                                                            index,
                                                            imgKey,
                                                            fields
                                                          )
                                                        }
                                                      >
                                                        <span className="" />
                                                      </Link>
                                                    );
                                                  })}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </Col>
                                  ))}
                                  <Col md="12" sm="12" className="mb-1">
                                    <Label for="role">Image Select</Label>
                                    <Controller
                                      id={`image_${index}`}
                                      name={`image_${index}`}
                                      control={control}
                                      rules={{
                                        required: "This field is required",
                                      }}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <Select
                                          isClearable
                                          options={options[index]}
                                          className="react-select"
                                          classNamePrefix="select"
                                          onChange={(selectedOption) => {
                                            onChange(selectedOption);
                                            handleSelectedImage(
                                              selectedOption,
                                              `image_${index}`
                                            );
                                          }}
                                          value={value ? value : null}
                                        />
                                      )}
                                    />
                                    {errors[`image_${index}`] && (
                                      <FormFeedback>
                                        {errors[`image_${index}`]?.message}
                                      </FormFeedback>
                                    )}
                                  </Col>
                                  {fields.length === index+1 && (
                                    <Col md={12} className="md-0 mt-2 mb-2 d-flex justify-content-end" >
                                      <Button className="btn-icon" color="danger" outline onClick={(e) => handleRemove(e,index)} >
                                        <X size={14} />
                                          <span className="align-middle ms-25"></span>
                                        </Button>
                                      </Col>
                                  )}
                                </Row>
                              </Col>
                              {/* {loading ? <LoaderComponet loading /> : " "} */}
                              <Col
                                md={7}
                                style={{
                                  paddingLeft: "1rem",
                                  paddingTop: "1rem",
                                }}
                              >
                                <Row
                                  key={field.id}
                                  className="justify-content-between align-items-center gy-1"
                                >
                                  {[
                                    "firstimage",
                                    "secondimage",
                                    "thirdimage",
                                    "forthimage",
                                    "fifthimage",
                                  ].map((imgKey, imgIndex) => (
                                    <>
                                      <Col
                                        md={6}
                                        key={imgIndex}
                                        style={{
                                          marginTop: "0px",
                                          padding: "2px",
                                        }}
                                      >
                                        <div>
                                          {imagePreviews[
                                            `imageSection_${index}_${imgKey}`
                                          ] && (
                                            <div className="img-dis">
                                              <img
                                                src={
                                                  imagePreviews[
                                                    `imageSection_${index}_${imgKey}`
                                                  ]
                                                }
                                                alt={`Preview ${imgIndex + 1}`}
                                                style={{
                                                  width: "100%",
                                                  border: "1px solid black",
                                                }}
                                              />
                                              <p>
                                                {
                                                  imageNames[
                                                    `imageSection_${index}_${imgKey}`
                                                  ]
                                                }
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      {imgIndex === 0 &&
                                      imagePreviews[
                                        `imageSection_${index}_${imgKey}`
                                      ] ? (
                                        <Col
                                          md={6}
                                          key={imgIndex + 1}
                                          style={{
                                            marginTop: "5px",
                                            padding: "2px",
                                          }}
                                        >
                                          <div className="c-main_div img-dis">
                                            <img
                                              src={imagepath}
                                              alt=""
                                              className="c-mask-image"
                                              style={{
                                                border: "1px solid black",
                                              }}
                                            />
                                            <div
                                              className="c-pattern-background-image-second"
                                              style={{
                                                backgroundImage: `url(${
                                                  rowBackgrounds[
                                                    `image_${index}`
                                                  ]?.value
                                                })`,
                                              }}
                                            ></div>
                                            <p>
                                              {rowImageName[`image_${index}`]}
                                            </p>
                                          </div>
                                        </Col>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ))}
                                </Row>
                              </Col>
                            </div>
                          ))}
                          <div className="mt-3">
                            {resDriveUploadDomestic?.isLoading ? (
                              <Button
                                className="btn btn-primary w-100 waves-effect waves-light "
                                color="primary"
                              >
                                <Spinner className="spinner-border-sm">
                                  Loading...
                                </Spinner>
                              </Button>
                            ) : (
                              <div className="d-flex justify-content-end">
                                <Button
                                  color="primary"
                                  className="me-5"
                                  onClick={() =>
                                    append({
                                      firstimage: "",
                                      secondimage: "",
                                      thirdimage: "",
                                      forthimage: "",
                                      fifthimage: "",
                                    })
                                  }
                                >
                                  <Plus size={14} />
                                  <span className="align-middle ms-25">
                                    Add Section
                                  </span>
                                </Button>
                                <Button type="submit" color="primary">
                                  <span className="align-middle d-sm-inline-block d-none">
                                    Create PDF
                                  </span>
                                </Button>
                              </div>
                            )}
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
      ) : (
        <Navigate to={"/dashboard"} />
      )}
    </>
  );
}

export default domastic;
