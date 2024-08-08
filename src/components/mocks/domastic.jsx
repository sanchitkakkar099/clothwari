/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import imagepath from "../../assets/images/CAD-with-Shirt-1.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { setPageStyle } from "../../utils/customPageSize";
import { Button, Col, Input, Label, Row } from "reactstrap";
import "./mock.css";
import { Plus, X } from "react-feather";
import Select from "react-select";
import {
  useDesignUploadListMutation,
  useUploadMarketingPDFFileMutation,
  useUploadCreateDriveMutation,
  useDriveByIdQuery,
} from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/logoww (1).jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_URL
    : import.meta.env.VITE_APP_PROD_URL;

const proxyUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_PROXYURL
    : import.meta.env.VITE_APP_PROD_PROXYURL;
function domastic() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const componentRef = useRef(null);
  const divRef = useRef();
  const dispatch = useDispatch();
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqUploadDrive, resDriveUpload] = useUploadCreateDriveMutation();
  const [reqFile, resFile] = useUploadMarketingPDFFileMutation();
  const resDriveById = useDriveByIdQuery(locationState?._id, {
    skip: !locationState?._id,
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      image_data: [
        {
          firstimage: "",
          secondimage: "",
          thirdimage: "",
          forthimage: "",
          fifthimage: "",
        },
      ],
    },
  });
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "image_data",
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [imageNames, setImageNames] = useState({});
  const [rowBackgrounds, setRowBackgrounds] = useState({});
  const [rowImageName, setRowImageName] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({});
  const [visibleDivs, setVisibleDivs] = useState({});
  const [productView, setProductView] = useState({});
  const [variationImg, setVariationImg] = useState(null);
  const [viewButton, setViewButton] = useState(false);

  // pagination
  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [totalCount, setTotalCount] = useState(0);

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
      const data = Object.keys(resDriveById?.data?.data?.rowBackgroundsData);
      const length = data.length;
      for (let i = 1; i <= length; i++) {
        if (i === 1) {
          continue;
        } else {
          append({
            firstimage: "",
            secondimage: "",
            thirdimage: "",
            forthimage: "",
            fifthimage: "",
          });
        }
      }
      setId(resDriveById?.data?.data?._id);
      setTitle(resDriveById?.data?.data?.title || "");
      setRowBackgrounds(resDriveById?.data?.data?.rowBackgroundsData || {});
      setImagePreviews(resDriveById?.data?.data?.ImagesPreviewsData || {});
    }
  }, [resDriveById]);

  useEffect(() => {
    if (resDriveUpload?.isSuccess) {
      toast.success("Uploaded SuccessFully", {
        position: "top-center",
      });
      navigate("/drive-list");
    }
    if (resDriveUpload?.isError) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  }, [resDriveUpload?.isSuccess, resDriveUpload?.isError]);

  const handleSearch = (search, index) => {
    setSearch((prevState) => ({
      ...prevState,
      [index]: search,
    }));
    reqDesign({
      search: search,
    });

    setVisibleDivs((prevState) => ({
      ...prevState,
      [index]: "search_all_data",
    }));
  };

  const handleSearchClick = (data, key) => {
    // console.log("data", data);
    setImagePreviews((prevState) => ({
      ...prevState,
      [key]: `${proxyUrl}${data?.thumbnail[0]?.pdf_extract_img}`,
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

  const handleChangeVariation = (e, variation, key) => {
    e.preventDefault();
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
        setVariationImg(variationObj?.variation_thumbnail[0]?.pdf_extract_img),
          setImagePreviews((prevState) => ({
            ...prevState,
            [key]: `${proxyUrl}${variationObj?.variation_thumbnail[0]?.pdf_extract_img}`,
          }));
      }
    }
  };
  useEffect(() => {
    console.log("id", id);
  }, [id]);

  const handleChangePrimary = (e) => {
    e.preventDefault();
    setVariationImg(null);
  };

  const handleSelectedImage = (fieldId) => {
    if (!fieldId?.value) return;
    const rowIndex = fieldId?.value.split("_")[1];
    setRowBackgrounds((prev) => ({
      ...prev,
      [rowIndex]: `${imagePreviews[fieldId?.value]}`,
    }));
    setRowImageName((prev) => ({
      ...prev,
      [rowIndex]: imageNames[fieldId?.value],
    }));
  };

  const handleRemove = (index) => {
    const newImagePreviews = { ...imagePreviews };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newImagePreviews[`${imgKey}_${index}`];
    });
    const newImageNames = { ...imageNames };
    [
      "firstimage",
      "secondimage",
      "thirdimage",
      "forthimage",
      "fifthimage",
    ].forEach((imgKey) => {
      delete newImageNames[`${imgKey}_${index}`];
    });

    Object.keys(newImagePreviews).forEach((key) => {
      const [imgKey, imgIndex] = key.split(".");
      if (parseInt(imgIndex) > index) {
        const newIndex = parseInt(imgIndex) - 1;
        newImagePreviews[`${imgKey}_${newIndex}`] = newImagePreviews[key];
        delete newImagePreviews[key];
      }
    });
    setImageNames(newImageNames);
    setImagePreviews(newImagePreviews);
    remove(index);
  };

  const onNext = (state) => {
    // console.log("state", state);
  };


  const handleGeneratePDF = async () => {
    if (componentRef.current) {
      setViewButton(true);
      componentRef.current.style.display = 'block';
      
      try {
        const canvas = await html2canvas(componentRef.current, {
          useCORS: true,
          logging: true,
          letterRendering: 1,
          allowTaint: false,
        });
        const imgData = canvas.toDataURL("image/png");
  
        const customPdfWidth = 13.33 * 72;  
        const customPdfHeight = 7.5 * 72;   
  
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: [customPdfWidth, customPdfHeight],
        });
  
        const imgWidth = customPdfWidth;
        const imgHeight = (canvas.height * customPdfWidth) / canvas.width;
  
        let position = 0;
        let heightLeft = imgHeight;
  
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= customPdfHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage([customPdfWidth, customPdfHeight]);
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= customPdfHeight;
        }
  
        const pdfBlob = pdf.output("blob");
        // await handleUpload(pdfBlob); 
        pdf.save(`${title}.pdf`);
      } catch (error) {
        toast.error("Something went wrong", {
          position: "top-center",
        });
        console.error("Error generating canvas:", error);
      } finally {
        setViewButton(false);
        componentRef.current.style.display = "";
      }
    }
  };

  const handleUpload = async (pdfBlob) => {
    const formData = new FormData();
    formData.append("file", pdfBlob, "document.pdf");

    const reqData = {
      file: formData,
      type: 99,
    };

    try {
      const fileResponse = await reqFile({
        url: `${baseUrl}/uploads/drive/pdf/?type=${reqData.type}`,
        data: reqData.file,
      });

      if (fileResponse?.data?.code === 200 && fileResponse?.data?.data) {
        if(locationState?.isEdit  || id){
            reqUploadDrive({
                _id: id,
                pdfName: title ? title : "Default",
                pdfurl: fileResponse?.data?.data,
                ImagesPreviewsData: imagePreviews,
                rowBackgroundsData: rowBackgrounds,
                title: title,
                typeOfPdf: "Domestic",
                data: [],
            });
        }else{
            reqUploadDrive({
                pdfName: title ? title : "Default",
                pdfurl: fileResponse?.data?.data,
                ImagesPreviewsData: imagePreviews,
                rowBackgroundsData: rowBackgrounds,
                title: title,
                typeOfPdf: "Domestic",
                data: [],
            });
        }
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-center",
      });
      console.log("error", error);
    }
  };

  return (
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
                    <Input
                      type="text"
                      placeholder="Input Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="border-bottom border-dark border-2 pb-1 w-100 d-flex"
                      >
                        <Col md={5}>
                          <Row
                            key={field.id}
                            className="justify-content-between align-items-center"
                          >
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
                                            `${imgKey}_${index}`
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
                                {search[`${imgKey}_${index}`] &&
                                  (visibleDivs[`${imgKey}_${index}`] ===
                                  "search_all_data" ? (
                                    <div className="c-search-data mt-2 mb-2">
                                      <div className="row">
                                        {designUploadList &&
                                        Array.isArray(designUploadList) &&
                                        designUploadList?.length > 0 ? (
                                          designUploadList?.map((el, i) => {
                                            return (
                                              <div
                                                className="col-xl-11 col-sm-6 d-flex custom-hover"
                                                key={i}
                                              >
                                                <Link
                                                  to={""}
                                                  onClick={() =>
                                                    handleSearchClick(
                                                      el,
                                                      `${imgKey}_${index}`
                                                    )
                                                  }
                                                  className="text-dark font-size-16 ms-3"
                                                >
                                                  {el?.name}
                                                </Link>
                                              </div>
                                            );
                                          })
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
                                        <div className="post-description">
                                          <h4>
                                            {
                                              productView[`${imgKey}_${index}`]
                                                ?.name
                                            }
                                          </h4>
                                        </div>
                                        <div className="stats">
                                          {productView[`${imgKey}_${index}`]
                                            ?.primary_color_code && (
                                            <Link
                                              to=""
                                              className="stat-item"
                                              style={{
                                                backgroundColor:
                                                  productView[
                                                    `${imgKey}_${index}`
                                                  ]?.primary_color_code,
                                                fontSize: "18px",
                                                width: "17px",
                                                height: "17px",
                                                borderRadius: "50%",
                                                border: "1px solid #c7c7c7",
                                              }}
                                              onClick={(e) =>
                                                handleChangePrimary(
                                                  e,
                                                  `${imgKey}_${index}`
                                                )
                                              }
                                            >
                                              <span className="" />
                                            </Link>
                                          )}
                                          {productView[`${imgKey}_${index}`]
                                            ?.color &&
                                            Array.isArray(
                                              productView[`${imgKey}_${index}`]
                                                ?.color
                                            ) &&
                                            productView[`${imgKey}_${index}`]
                                              ?.color?.length > 0 &&
                                            productView[
                                              `${imgKey}_${index}`
                                            ]?.color?.map((cl, cinx) => {
                                              return (
                                                <Link
                                                  to=""
                                                  className="stat-item"
                                                  style={{
                                                    backgroundColor: cl?.value,
                                                    fontSize: "18px",
                                                    width: "17px",
                                                    height: "17px",
                                                    borderRadius: "50%",
                                                    border: "1px solid #c7c7c7",
                                                  }}
                                                  key={cinx}
                                                  onClick={(e) =>
                                                    handleChangeVariation(
                                                      e,
                                                      cl,
                                                      `${imgKey}_${index}`
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
                                id={`image${index}`}
                                name={`image${index}`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Select
                                    isClearable
                                    options={[
                                      {
                                        label: "Image 1",
                                        value: `firstimage_${index}`,
                                      },
                                      {
                                        label: "Image 2",
                                        value: `secondimage_${index}`,
                                      },
                                      {
                                        label: "Image 3",
                                        value: `thirdimage_${index}`,
                                      },
                                      {
                                        label: "Image 4",
                                        value: `forthimage_${index}`,
                                      },
                                      {
                                        label: "Image 5",
                                        value: `fifthimage_${index}`,
                                      },
                                    ]}
                                    className="react-select"
                                    classNamePrefix="select"
                                    onChange={(selectedOption) => {
                                      onChange(selectedOption);
                                      handleSelectedImage(selectedOption);
                                    }}
                                    value={value ? value : null}
                                  />
                                )}
                              />
                            </Col>
                            <Col
                              md={12}
                              className="md-0 mt-2 mb-2 d-flex justify-content-end"
                            >
                              <Button
                                className="btn-icon"
                                color="danger"
                                outline
                                onClick={() => handleRemove(index)}
                              >
                                <X size={14} />
                                <span className="align-middle ms-25"></span>
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        {/* {loading ? <LoaderComponet loading /> : " "} */}
                        <Col
                          md={7}
                          style={{ paddingLeft: "1rem", paddingTop: "1rem" }}
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
                                  style={{ marginTop: "0px", padding: "2px" }}
                                >
                                  <div>
                                    {imagePreviews[`${imgKey}_${index}`] && (
                                      <div className="img-dis">
                                        <img
                                          src={
                                            imagePreviews[`${imgKey}_${index}`]
                                          }
                                          alt={`Preview ${imgIndex + 1}`}
                                          style={{
                                            width: "100%",
                                            border: "1px solid black",
                                          }}
                                        />
                                        <p>
                                          {imageNames[`${imgKey}_${index}`]}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                {imgIndex === 0 &&
                                imagePreviews[`${imgKey}_${index}`] ? (
                                  <Col
                                    md={6}
                                    key={imgIndex + 1}
                                    style={{ marginTop: "5px", padding: "2px" }}
                                  >
                                    <div className="c-main_div img-dis">
                                      <img
                                        src={imagepath}
                                        alt=""
                                        className="c-mask-image"
                                        style={{ border: "1px solid black" }}
                                      />
                                      <div
                                        className="c-pattern-background-image-second"
                                        style={{
                                          backgroundImage: `url(${rowBackgrounds[index]})`,
                                        }}
                                      ></div>
                                      <p>{rowImageName[`${index}`]}</p>
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
                  </div>
                </div>
                <div className="mt-3">
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
                      <span className="align-middle ms-25">Add Section</span>
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={viewButton}
                      onClick={handleGeneratePDF}
                    >
                      <span className="align-middle d-sm-inline-block d-none">
                        Create PDF
                      </span>
                    </Button>
                  </div>
                </div>
                <div id="pdf" className="w-100 ">
                      <div ref={componentRef} style={{ display: "" }}>
                        <div
                          className="container-wrapper c-main-content"
                          style={{ height: "898px" }}
                        >
                          <div className="container text-center">
                            <div className="row">
                              <div className="col">
                                <h1>
                                  <img src={logo} alt="logo" width="20%" />
                                </h1>
                                <h1 className="c-text-style">Textile Design</h1>
                                <h2 className="c-text-style c-text-style-h2">
                                  {title}
                                </h2>
                              </div>
                            </div>
                          </div>
                          <span className="c-span_div-bott"></span>
                        </div>
                        {fields.map((field, index) => (
                          <Col
                            key={index}
                            md={12}
                            style={{
                              paddingLeft: "8rem",
                              paddingRight: "8rem",
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
                                  {imagePreviews[`${imgKey}_${index}`] && (
                                    <Col
                                      md={6}
                                      key={imgIndex}
                                      style={{
                                        marginTop: "15px",
                                        marginBottom: "10px",
                                        padding: "2px",
                                        width: "49.8%",
                                      }}
                                    >
                                      <div>
                                        <div className="img-dis c-img_cover">
                                          <img
                                            src={
                                              imagePreviews[
                                                `${imgKey}_${index}`
                                              ]
                                            }
                                            alt={`Preview ${imgIndex + 1}`}
                                            style={{
                                              width: "100%",
                                              border: "1px solid black",
                                            }}
                                            crossOrigin="anonymous"
                                          />
                                          <p>
                                            {imageNames[`${imgKey}_${index}`]}
                                          </p>
                                        </div>
                                      </div>
                                    </Col>
                                  )}
                                  {imgIndex === 0 &&
                                  imagePreviews[`${imgKey}_${index}`] ? (
                                    <Col
                                      md={6}
                                      key={imgIndex + 1}
                                      style={{
                                        marginTop: "20px",
                                        marginBottom: "10px",
                                        padding: "2px",
                                        width: "49.8%",
                                      }}
                                    >
                                      <div className="c-main_div img-dis c-img_cover">
                                        <img
                                          src={imagepath}
                                          alt=""
                                          className="c-mask-image"
                                          style={{ border: "1px solid black" }}
                                        />
                                        <div
                                          className="c-pattern-background-image-second"
                                          style={{
                                            backgroundImage: `url(${rowBackgrounds[index]})`,
                                          }}
                                        ></div>
                                        <p>{rowImageName[`${index}`]}</p>
                                      </div>
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ))}
                            </Row>
                          </Col>
                        ))}
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

export default domastic;
