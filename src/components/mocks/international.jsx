/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import imagepath from "../../assets/images/international.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { setPageStyle } from "../../utils/customPageSize";
import { Button, Col, Input, Label, Row } from "reactstrap";
import "./mock.css";
import { Plus, X } from "react-feather";
import Select from "react-select";
import { useDesignUploadListMutation, useUploadCreateDriveMutation, useUploadMarketingPDFFileMutation,useDriveByIdQuery  } from "../../service";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from 'html2canvas';
import { toast } from "react-hot-toast";
import jsPDF from 'jspdf';
import logo from "../../assets/images/logoww (1).jpg";
import PdfGeneratorLoader from "../common/PdfGeneratorLoader";
const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_URL
    : import.meta.env.VITE_APP_PROD_URL;

const proxyUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_PROXYURL
    : import.meta.env.VITE_APP_PROD_PROXYURL;

function international() {
  const navigate = useNavigate();
  const componentRef = useRef();
  const location = useLocation();
  const { state: locationState } = location;
  const dispatch = useDispatch();
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqUploadDrive, resDriveUpload] = useUploadCreateDriveMutation();
  const [reqFile, resFile] = useUploadMarketingPDFFileMutation();


  const { control, handleSubmit } = useForm({
    defaultValues: {
      image_data: [
        { firstimage: "", secondimage: "", thirdimage: "", forthimage: "" },
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
  const resDriveById = useDriveByIdQuery(locationState?._id, {
    skip: !locationState?._id,
  });
  let temp = 0;

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
  }, [resDriveUpload?.isSuccess,resDriveUpload?.isError]);

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
    console.log("data", data);
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
    console.log("Images", imagePreviews);
  }, [imagePreviews]);

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
    ["firstimage", "secondimage", "thirdimage", "forthimage"].forEach(
      (imgKey) => {
        delete newImagePreviews[`${imgKey}_${index}`];
      }
    );
    const newImageNames = { ...imageNames };
    ["firstimage", "secondimage", "thirdimage", "forthimage"].forEach(
      (imgKey) => {
        delete newImageNames[`${imgKey}_${index}`];
      }
    );

    Object.keys(newImagePreviews).forEach((key) => {
      const [imgKey, imgIndex] = key.split("_");
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
  const getMarginButtom = (temp) => {
    if (temp === 1) {
      return "60rem";
    } else if (temp === 2) {
      return "31rem";
    } else if (temp === 3) {
      return "1rem";
    }
    return 0;
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

        const customPdfWidth = 792.96 * 72 / 96;
        const customPdfHeight = 900.87 * 72 / 96;
        // const customPdfWidth = 792.96 * 72 / 96;
        // const customPdfHeight = 1062.12 * 72 / 96;

        const pdf = new jsPDF({
          orientation: "portrait",
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
        toast.error("somthing went wrong", {
            position: "top-center",
        });
        console.error("Error generating canvas:", error);
      } finally {
        setViewButton(false);
        componentRef.current.style.display = "none";
      }
    }
  };


  const handleUpload = async (pdfBlob) => {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');

    const reqData = {
        file: formData,
        type: 99,
    };
    console.log("reqData", reqData)

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
                    typeOfPdf: "International",
                    data: [],
                });
            }else{
                reqUploadDrive({
                    pdfName: title ? title : "Default",
                    pdfurl: fileResponse?.data?.data,
                    ImagesPreviewsData: imagePreviews,
                    rowBackgroundsData: rowBackgrounds,
                    title: title,
                    typeOfPdf: "International",
                    data: [],
                });
            }
        }else{
            toast.error('Something went wrong',{
              position:"top-center"
            })
        }
    } catch (error) {
        toast.error('Something went wrong',{
            position:"top-center"
        })
        console.log("error", error);
    }
};

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">International</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">International</li>
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
                      onClick={() => navigate("/view-mocks-domestic")}
                    >
                      Go To Domestic
                    </button>
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    value={title}
                    placeholder="Input Title"
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
                                      <p>{imageNames[`${imgKey}_${index}`]}</p>
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
                                      className="c-pattern-background-image"
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
                <div id="pdf"  className='w-100'>
                            <div ref={componentRef} style={{ display: "none" }}>
                                <div className="container-wrapper c-main-content">
                                    <div className="container text-center">
                                        <div className="row">
                                            <div className="col">
                                                <h1><img src={logo} alt='logo' width='20%'/></h1>
                                                <h1 className='c-text-style'>Digital Print</h1>
                                                <h2 className='c-text-style c-text-style-h2'>{title}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <span className='c-span_div-bott'></span>
                                </div>
                                {fields.map((field, index) => (
                                    <div className="w-100 d-flex p-1">
                                        <Col md={12} >
                                        {(() => { temp = 0; return null; })()}
                                            <Row key={field.id} className="justify-content-between align-items-center gy-1" style={{ marginTop: '2px', paddingLeft: '11px', paddingRight: '11px' }}>
                                                {['firstimage', 'secondimage', 'thirdimage', 'forthimage'].map((imgKey, imgIndex) => (
                                                    <>
                                                        {imgIndex === 0 && imagePreviews[`${imgKey}_${index}`] ?
                                                            <Col md={12} key={imgIndex + 1} style={{ marginTop: '6px', marginBottom: '8rem',padding: '2px' }}>
                                                                <div className='text-center fs-1'>Design No: {imageNames[`firstimage.${index}`]}</div>
                                                                <div className="c-main_div img-dis c-a_box_style-2">
                                                                <div className='c-border_style-a c-single_border_style'><span>A</span></div>
                                                                <div className='c-box-item-3' >
                                                                    <div  style={{ border: '2px solid black' }}>
                                                                        <img src={imagepath} alt='' class="c-mask-image" />
                                                                        <div className="c-pattern-background-image c-pattern_back-ing" style={{
                                                                            backgroundImage: `url(${rowBackgrounds[index]})`,
                                                                        }}></div>
                                                                    </div>
                                                                    <div className='c-text_rotate-first'><div><span> 10 </span><span> INCHES  </span></div></div>
                                                                </div>
                                                                </div>
                                                                <div className="c-text_rotate-bottom-first">7.5 INCHES</div>
                                                            </Col> : ''}
                                                        {imgIndex === 0 && imagePreviews[`${imgKey}_${index}`] && rowBackgrounds[index] ?
                                                            <Col md={12} key={imgIndex} style={{ marginTop: '6px', marginBottom: '8rem', padding: '2px' }}>
                                                                {imagePreviews[`${imgKey}_${index}`] && (
                                                                    <>
                                                                        <div className=' text-center fs-1 m-1'>Design No: {imageNames[`firstimage_${index}`]}</div>
                                                                        <div className='img-dis c-a_box-style'>
                                                                            <div className='c-border_style-a c-single_border_style'><span>A</span></div>
                                                                            <div className='c-box-item-3 c-box_item-cover'>
                                                                                <img src={rowBackgrounds[`${index}`]} alt={`Preview ${imgIndex + 1}`} style={{ width: '96%', border: '1px solid black' }} />
                                                                                <div className='c-text_rotate-second'><div><span> 10 </span><span> INCHES  </span></div></div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div class="c-text_rotate-bottom-second">7.5 INCHES</div>
                                                            </Col>
                                                             : ' '}
                                                        {imgIndex === 0  && imagePreviews[`secondimage_${index}`] && <div className='text-center fs-1 m-1 mt-6'>Design No: {imageNames[`firstimage_${index}`]}</div>}
                                                        {imagePreviews[`${imgKey}_${index}`] && (rowBackgrounds[`${index}`] !== imagePreviews[`${imgKey}_${index}`]) && (
                                                            <>
                                                                {console.log("I am under the water")}
                                                                <Col md={12} key={imgIndex} style={{ marginTop: '1px', marginBottom: '1px', padding: '2px' }}>
                                                                    <div className='img-dis c-box-item-3 c-box_item-3-cover'>
                                                                        <div className='c-border_style-a'><span>{String.fromCharCode(66 + temp)}</span></div>
                                                                        <img src={imagePreviews[`${imgKey}_${index}`]} alt={`Preview ${imgIndex + 1}`}/>
                                                                        <div className='c-text_rotate'><div><span> 3.5 </span><span> INCHES  </span></div></div>
                                                                    </div>
                                                                </Col>
                                                                {(() => { temp += 1; return null; })()}
                                                            </>
                                                        )}
                                                    </>
                                                ))}
                                                {temp >= 1 && <div className="c-text_rotate-bottom" style={{marginBottom:getMarginButtom(temp)}}>7 INCHES</div>}
                                            </Row>
                                        </Col>
                                    </div>
                                ))}
                            </div>
                        </div>
              </div>
              {viewButton && <PdfGeneratorLoader message={"PDF Uploading.."}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default international;
