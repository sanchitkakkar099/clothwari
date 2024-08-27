import React, { useEffect, useRef, useState } from "react";
import One from "../../assets/images/product/five.jpg";
import Two from "../../assets/images/product/seven.jpg";
import Three from "../../assets/images/product/four.jpg";
import Four from "../../assets/images/product/three.jpg";
import Five from "../../assets/images/product/one.jpg";
import Six from "../../assets/images/product/six.jpg";
import {
  useCategoryDropdownListQuery,
  useColorVariationDropdownListQuery,
  useDesignUploadListMutation,
  useDesignerDropDownListQuery,
  useTagListMutation,
  useUserTagDropdownListQuery,
} from "../../service";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DivideSquare } from "react-feather";
import Pagination from "../common/Pagination";
import MultiSelect from "../common/MultiSelect";
import ReactDatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import "../../components/uploadDesign/dropdown-filter.css";
import dayjs from "dayjs";
// import utc from 'dayjs/plugin/utc'; // Import UTC plugin
// import timezone from 'dayjs/plugin/timezone'; // Import timezone plugin
import { getTag, setSelectedTagListDesign } from "../../redux/tagSlice";
import { getCurrentPageV1 } from "../../redux/designUploadSlice";
import {
  setSearchDataDesign,
  setSelectedEndDateDesign,
  setSelectedFromDateDesign,
} from "../../redux/mixedSlice";
import { setSelectedCategoryListDesign } from "../../redux/categorySlice";
import { setSelectedColorVariationListDesign } from "../../redux/colorVariationSlice";
import { setSelectedStaffListDesign } from "../../redux/adminSlice";
import { setSelectedUserTagList } from "../../redux/userTagSlice";

// Extend Day.js with the plugins
// dayjs.extend(utc);
// dayjs.extend(timezone);
// Set the timezone to Indian Standard Time (IST)
// dayjs.tz.setDefault('Asia/Kolkata');

function UploadDesignListV1() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqTag, resTag] = useTagListMutation();
  const staffDropDownRes = useDesignerDropDownListQuery();
  const categoryDropdownRes = useCategoryDropdownListQuery();
  const colorListDropdown = useColorVariationDropdownListQuery();
  const zoneListDropdown = useUserTagDropdownListQuery();

  const latestCurrentPage = useSelector((state) => state?.designUploadState?.currentPageV1);
  const tagList = useSelector((state) => state?.tagState.tagList);
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  const slectedTagList = useSelector(
    (state) => state?.tagState.selectedTagListDesign
  );
  const searchData = useSelector((state) => state?.mixedState.searchDataDesign);
  const selectedFromDate = useSelector(
    (state) => state?.mixedState.selectedFromDateDesign
  );
  const selectedEndDate = useSelector(
    (state) => state?.mixedState.selectedEndDateDesign
  );
  const selectedStaffList = useSelector(
    (state) => state?.adminState.selectedStaffListDesign
  );
  const selectedCategoryList = useSelector(
    (state) => state?.categoryState.selectedCategoryListDesign
  );
  const selectedColorList = useSelector(
    (state) => state?.colorVariationState.selectedColorVariationListDesign
  );
  const selectedZoneList = useSelector(
    (state) => state?.userTagState.selectedUserTagList
  );
  const [staffDropdown, setStaffDropdown] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [colorDropdown, setColorDropdown] = useState([]);
  const [zoneDropdown, setZoneDropdown] = useState([]);

  const [designID, setDesignId] = useState(null);
  const [variationImg, setVariationImg] = useState(null);

  // pagination
  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(latestCurrentPage);
  const pageSize = 9;
  const [totalCount, setTotalCount] = useState(0);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMultiTagSearch, setIsMultiTagSearch] = useState(false);
  const [tagsSearch, setTagSearch] = useState([]);
  const [categorySearch, setCategorySearch] = useState([]);
  const [colorSearch, setColorSearch] = useState([]);
  const [zoneSearch, setZoneSearch] = useState(selectedZoneList);

  const [selectedStaff, setSelectedStaff] = useState([]);


  useEffect(() => {
    if (searchData) setSearch(searchData);
  }, [searchData]);

  useEffect(() => {
    if (selectedFromDate) setStartDate(selectedFromDate);
  }, [selectedFromDate]);

  useEffect(() => {
    if (selectedEndDate) setEndDate(selectedEndDate);
  }, [selectedEndDate]);

  useEffect(() => {
    if (slectedTagList.length > 0) setTagSearch(slectedTagList);
  }, [slectedTagList]);

  useEffect(() => {
    if (selectedStaffList.length > 0) setSelectedStaff(selectedStaffList);
  }, [selectedStaffList]);

  useEffect(() => {
    if (selectedCategoryList.length > 0)
      setCategorySearch(selectedCategoryList);
  }, [selectedCategoryList]);

  useEffect(() => {
    if (selectedColorList.length > 0) setColorSearch(selectedColorList);
  }, [selectedColorList]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (search || (startDate && endDate) || tagsSearch || selectedStaff || categorySearch || colorSearch || isMultiTagSearch || zoneSearch) {
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: search,
        // date_filter:startDate ?  dayjs(startDate).format() : '',
        isMultiTagSearch:isMultiTagSearch,
        start_date: startDate && endDate ? dayjs(startDate).format() : "",
        end_date: startDate && endDate ? dayjs(endDate).format() : "",
        tags: tagsSearch,
        userTags: Array.isArray(zoneSearch)
         ? zoneSearch?.map((el) => el?.value)
         : [],
        uploadedBy: Array.isArray(selectedStaff)
          ? selectedStaff?.map((el) => el?.value)
          : [],
        category: Array.isArray(categorySearch)
          ? categorySearch?.map((el) => el?.value)
          : [],
        color: Array.isArray(colorSearch)
          ? colorSearch?.map((el) => el?._id)
          : [],
      });
    } else {
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: "",
        // date_filter:'',
        isMultiTagSearch:isMultiTagSearch,
        start_date: "",
        end_date: "",
        tags: [],
        userTags: [],
        uploadedBy: [],
        category: [],
        color: [],
      });
    }
  }, [currentPage, search, startDate, endDate, tagsSearch, selectedStaff, categorySearch, colorSearch, isMultiTagSearch, zoneSearch]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs);
      setTotalCount(resDesign?.data?.data?.totalDocs);
    }
  }, [resDesign]);

  useEffect(() => {
    if (
      staffDropDownRes?.isSuccess &&
      Array.isArray(staffDropDownRes?.data?.data) &&
      staffDropDownRes?.data?.data
    ) {
      const filterRes = staffDropDownRes?.data?.data?.map((el) => ({
        label: el?.name,
        value: el?._id,
      }));
      const filterRes2 =
        userInfo?.role !== "Super Admin" && userInfo?.role !== "Admin"
          ? filterRes?.filter((el) => el?.value === userInfo?._id)
          : filterRes;
      setStaffDropdown(filterRes2);
    }
  }, [staffDropDownRes?.isSuccess]);

  useEffect(() => {
    if (
      categoryDropdownRes?.isSuccess &&
      Array.isArray(categoryDropdownRes?.data?.data) &&
      categoryDropdownRes?.data?.data
    ) {
      setCategoryDropdown(categoryDropdownRes?.data?.data);
    }
  }, [categoryDropdownRes?.isSuccess]);

  useEffect(() => {
    if (colorListDropdown?.isSuccess && colorListDropdown?.data?.data) {
      setColorDropdown(colorListDropdown?.data?.data);
    }
  }, [colorListDropdown]);

  useEffect(() => {
    if (zoneListDropdown?.isSuccess && zoneListDropdown?.data?.data) {
      setZoneDropdown(zoneListDropdown?.data?.data);
    }
  }, [zoneListDropdown]);

  const handleSearch = (search) => {
    dispatch(setSearchDataDesign(search));
    setSearch(search);
    // reqDesign({
    //   page: currentPage,
    //   limit: pageSize,
    //   search: search,
    //   date_filter:startDate ?  dayjs(startDate).format() : '',
    //   tags:tagsSearch,
    //   uploadedBy:selectedStaff ? selectedStaff : ''
    // });
  };
 

  const handleChangeVariation = (e, variation, designObj) => {
    e.preventDefault();
    if (
      variation?.label &&
      designObj?.variations &&
      Array.isArray(designObj?.variations) &&
      designObj?.variations?.length > 0
    ) {
      const variationObj = designObj?.variations?.find(
        (el) => el?.color === variation?.label
      );
      if (variationObj?.variation_thumbnail[0]?.pdf_extract_img) {
        setVariationImg(variationObj?.variation_thumbnail[0]?.pdf_extract_img);
        setDesignId(designObj?._id);
      }
    }
  };

  const handleChangePrimary = (e) => {
    e.preventDefault();
    setVariationImg(null);
  };

  const handleDateFilter = (tag, date) => {
    if (tag === "start") {
      dispatch(setSelectedFromDateDesign(date));
      setStartDate(date);
    } else {
      dispatch(setSelectedEndDateDesign(date));
      setEndDate(date);
    }
  };

  const handleSorting = (e) => {
    setIsMultiTagSearch(!isMultiTagSearch);
  };

  useEffect(() => {
    reqTag({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resTag?.isSuccess) {
      dispatch(getTag(resTag?.data?.data?.docs));
    }
  }, [resTag]);

  const handleTagSelection = (selected) => {
    dispatch(setSelectedTagListDesign(selected));
    setTagSearch(selected);
  };

  const handleCategorySelection = (selected) => {
    dispatch(setSelectedCategoryListDesign(selected));
    setCategorySearch(selected);
  };

  const handleColorSelection = (selected) => {
    dispatch(setSelectedColorVariationListDesign(selected));
    setColorSearch(selected);
  };

  const handleZoneSelection = (selected) => {
    dispatch(setSelectedUserTagList(selected));
    setZoneSearch(selected);
  };

  const handleStaffSelection = (selected) => {
    dispatch(setSelectedStaffListDesign(selected));
    setSelectedStaff(selected);
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
                  <h4 className="mb-0">Designs</h4>

                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="#!">Clothwari</a>
                      </li>
                      <li className="breadcrumb-item active">Designs</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-12 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div>
                      <div className="row">
                        <div className="col-md-6 mt-1">
                          <div>
                            <h5>Designs</h5>
                          </div>
                        </div>
                      </div>
                      <div className="row m-4">
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">
                              <div className="position-relative">
                                <input
                                  type="text"
                                  onChange={(e) => handleSearch(e.target.value)}
                                  className="form-control "
                                  placeholder="Search..."
                                  value={search}
                                />
                                <i className="bx bx-search search-icon"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">
                              <ReactDatePicker
                                selected={startDate}
                                onChange={(date) =>
                                  handleDateFilter("start", date)
                                }
                                placeholderText="Select From Date"
                                className="form-control "
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">
                              <ReactDatePicker
                                selected={endDate}
                                onChange={(date) =>
                                  handleDateFilter("end", date)
                                }
                                placeholderText="Select To Date"
                                className="form-control "
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2  position-relative">
                              <Typeahead
                                allowNew={false}
                                id="custom-selections-example"
                                labelKey={"label"}
                                multiple
                                options={
                                  tagList &&
                                  Array.isArray(tagList) &&
                                  tagList?.length > 0
                                    ? tagList?.map((el) => el?.label)
                                    : []
                                }
                                placeholder="Search tags..."
                                onChange={handleTagSelection}
                                selected={tagsSearch}
                              />
                              <div className="position-absolute" style={{top: '24%', right: '0%'}} >
                                <div className="filter-dropdown" ref={dropdownRef}>
                                  <span onClick={() => setIsOpen(!isOpen)}>
                                    {" "}
                                    <i className="mdi mdi-filter me-1"></i> 
                                  </span>
                                  {isOpen && (
                                    <div
                                      className="filter-dropdown-content"
                                      id="dropdownContent"
                                    >
                                      <div className="filter-section">
                                        <h4>Order</h4>
                                        <label className="option">
                                          <input
                                            type="radio"
                                            name="sorting"
                                            value={"single"}
                                            checked={!isMultiTagSearch}
                                            onChange={(e) => handleSorting(e)}
                                          />{" "}
                                          Single tag by Search
                                        </label>
                                        <label className="option">
                                          <input
                                            type="radio"
                                            name="sorting"
                                            value={"multiple"}
                                            checked={isMultiTagSearch}
                                            onChange={(e) => handleSorting(e)}
                                          />{" "}
                                          Multiple tags by Search
                                        </label>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row m-4">
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">
                              <MultiSelect
                                key="example_id"
                                options={
                                  staffDropdown &&
                                  Array.isArray(staffDropdown) &&
                                  staffDropdown?.length > 0
                                    ? staffDropdown
                                    : []
                                }
                                onChange={handleStaffSelection}
                                value={selectedStaff}
                                isSelectAll={true}
                                menuPlacement={"bottom"}
                                placeholder="Search staff..."
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">                    
                              <MultiSelect
                                key="example_id"
                                options={
                                  categoryDropdown &&
                                  Array.isArray(categoryDropdown) &&
                                  categoryDropdown?.length > 0
                                  ? categoryDropdown
                                    : []
                                }
                                onChange={handleCategorySelection}
                                value={categorySearch}
                                isSelectAll={true}
                                menuPlacement={"bottom"}
                                placeholder="Search category..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">
                              <MultiSelect
                                key="example_id"
                                options={
                                  colorDropdown &&
                                  Array.isArray(colorDropdown) &&
                                  colorDropdown?.length > 0
                                    ? colorDropdown
                                    : []
                                }
                                onChange={handleColorSelection}
                                value={colorSearch}
                                isSelectAll={true}
                                menuPlacement={"bottom"}
                                placeholder="Search color..."
                              />
                            </div>
                          </div>
                        </div>
                        {userInfo?.role === "Super Admin" &&
                        <div className="col-md-3">
                          <div className="form-inline">
                            <div className="search-box ms-2">
                              <MultiSelect
                                key="example_id"
                                options={
                                  zoneDropdown &&
                                  Array.isArray(zoneDropdown) &&
                                  zoneDropdown?.length > 0
                                    ? zoneDropdown
                                    : []
                                }
                                onChange={handleZoneSelection}
                                value={zoneSearch}
                                isSelectAll={true}
                                menuPlacement={"bottom"}
                                placeholder="Search Zone..."
                              />
                            </div>
                          </div>
                        </div>}
                      </div>
                      <div className="tab-content text-muted">
                        <div
                          className="tab-pane active"
                          id="popularity"
                          role="tabpanel"
                        >
                          {/* <div className="row">
                        {designUploadList &&
                        Array.isArray(designUploadList) &&
                        designUploadList?.length > 0 ? (
                          designUploadList?.map((el, i) => {
                            return (
                              <div
                                className="col-md-6 col-xl-3"
                                style={{ cursor: "pointer" }}
                                key={i}
                              >
                                <div className="card">
                                  <img
                                    className="card-img-top img-fluid"
                                    src={el?.thumbnail?.filepath}
                                    alt="Card image cap"
                                  />
                                  <div className="card-body">
                                    <h4 className="card-title">{el?.name}</h4>
                                    <p className="card-text">
                                      {el?.category?.label}
                                    </p>
                                    
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h4 className="text-center mt-5">No Design Found</h4>
                        )}
                      </div> */}
                          <div className="row">
                            <div className="col-xl-12 col-lg-8">
                              <div className="card">
                                <div className="card-body">
                                  <div>
                                    <div className="tab-content p-3 text-muted">
                                      <div
                                        className="tab-pane active"
                                        id="popularity"
                                        role="tabpanel"
                                      >
                                        <h6
                                          style={{
                                            display: "flex",
                                            justifyContent: "end",
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Total Designs: {totalCount}
                                        </h6>

                                        <div className="row">
                                          {designUploadList &&
                                          Array.isArray(designUploadList) &&
                                          designUploadList?.length > 0 ? (
                                            designUploadList?.map((el, i) => {
                                              return (
                                                <div
                                                  className="col-xl-4 col-sm-6"
                                                  key={i}
                                                >
                                                  <div className="product-box">
                                                    <div className="product-img pt-4 px-4">
                                                      {el?.thumbnail &&
                                                      Array.isArray(
                                                        el?.thumbnail
                                                      ) &&
                                                      el?.thumbnail?.length >
                                                        0 &&
                                                      el?.thumbnail[0]
                                                        ?.pdf_extract_img ? (
                                                        <Link
                                                          to={`/product-view/${el?._id}`}
                                                          target="_blank"
                                                        >
                                                          <>
                                                          <img
                                                            src={
                                                              variationImg &&
                                                              el?._id ===
                                                                designID
                                                                ? variationImg
                                                                : el
                                                                    ?.thumbnail[0]
                                                                    ?.pdf_extract_img
                                                            }
                                                            alt="image post"
                                                            loading="lazy"
                                                            height={200}
                                                            width={250}
                                                            className="image"
                                                            style={{
                                                              objectFit:
                                                                "cover",
                                                            }}
                                                          />
                                                            <div className="watermark">Clothwari</div>
                                                          </>
                                                        </Link>
                                                      ) : (
                                                        <Link
                                                          to={`/product-view/${el?._id}`}
                                                          target="_blank"
                                                        >
                                                          <img
                                                            src="https://www.bootdey.com/image/250x200/FFB6C1/000000"
                                                            className="image"
                                                            alt="image post"

                                                            // onClick={() => navigate(`/product-view/${el?._id}`)}
                                                          />
                                                        </Link>
                                                      )}

                                                      {/* <img 
                                                    src={el?.thumbnail[0]?.tif_extract_img} 
                                                    className="image" 
                                                    alt="image post"
                                                    height={200}
                                                    width={250}
                                                    onClick={() => navigate(`/product-view/${el?._id}`)}
                                                    /> */}
                                                    </div>

                                                    <div className="product-content p-4">
                                                      <div>
                                                        <div>
                                                          <h5 className="mb-1">
                                                            <Link
                                                              to={`/product-view/${el?._id}`}
                                                              target="_blank"
                                                              className="text-dark font-size-16"
                                                            >
                                                              {el?.name}
                                                            </Link>
                                                          </h5>
                                                          <p className="text-muted font-size-13">
                                                            {el?.tag &&
                                                            Array.isArray(
                                                              el?.tag
                                                            ) &&
                                                            el?.tag?.length > 0
                                                              ? el?.tag
                                                                  ?.map(
                                                                    (el) =>
                                                                      el?.label
                                                                  )
                                                                  ?.join(",")
                                                              : ""}
                                                          </p>
                                                        </div>

                                                        <div>
                                                          <ul className="list-inline mb-0 text-muted product-color">
                                                            {el?.primary_color_code && (
                                                              <li
                                                                className="list-inline-item"
                                                                style={{
                                                                  backgroundColor:
                                                                    el?.primary_color_code,
                                                                  width: "14px",
                                                                  height:
                                                                    "14px",
                                                                  borderRadius:
                                                                    "50%",
                                                                  border:
                                                                    "1px solid #c7c7c7",
                                                                }}
                                                                onClick={(e) =>
                                                                  handleChangePrimary(
                                                                    e
                                                                  )
                                                                }
                                                              >
                                                                <span className=""></span>
                                                              </li>
                                                            )}
                                                            {el?.color?.map(
                                                              (cl, cinx) => {
                                                                return (
                                                                  <li
                                                                    className="list-inline-item"
                                                                    style={{
                                                                      backgroundColor:
                                                                        cl?.value,
                                                                      width:
                                                                        "14px",
                                                                      height:
                                                                        "14px",
                                                                      borderRadius:
                                                                        "50%",
                                                                      border:
                                                                        "1px solid #c7c7c7",
                                                                    }}
                                                                    key={cinx}
                                                                    onClick={(
                                                                      e
                                                                    ) =>
                                                                      handleChangeVariation(
                                                                        e,
                                                                        cl,
                                                                        el
                                                                      )
                                                                    }
                                                                  >
                                                                    <span className=""></span>
                                                                  </li>
                                                                );
                                                              }
                                                            )}
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
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
                                    </div>

                                    {/* <div className="row mt-4">
                                  <div className="col-sm-6">
                                    <div>
                                      <p className="mb-sm-0">Page 2 of 84</p>
                                    </div>
                                  </div>
                                  <div className="col-sm-6">
                                    <div className="float-sm-end">
                                      <ul className="pagination pagination-rounded mb-sm-0">
                                        <li className="page-item disabled">
                                          <a href="#" className="page-link">
                                            <i className="mdi mdi-chevron-left"></i>
                                          </a>
                                        </li>
                                        <li className="page-item active">
                                          <a href="#" className="page-link">
                                            1
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            2
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            3
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            4
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            5
                                          </a>
                                        </li>
                                        <li className="page-item">
                                          <a href="#" className="page-link">
                                            <i className="mdi mdi-chevron-right"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div> */}
                                  </div>
                                </div>
                                {/* <Pagination
                                  currentPage={currentPage}
                                  totalCount={totalCount}
                                  pageSize={pageSize}
                                  onPageChange={(page) => setCurrentPage(page)}
                                  TBLData={TBLData}
                                /> */}
                                
                                  <Pagination
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    pageSize={pageSize}
                                    onPageChange={(page) => {
                                      dispatch(getCurrentPageV1(page));                                      
                                      setCurrentPage(page)
                                    }}
                                    TBLData={TBLData}
                                  />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="row mt-4">
                    <div className="col-sm-6">
                      <div>
                        <p className="mb-sm-0">Page 1 of 1</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="float-sm-end">
                        <ul className="pagination pagination-rounded mb-sm-0">
                          <li className="page-item disabled">
                            <a href="#" className="page-link">
                              <i className="mdi mdi-chevron-left"></i>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a href="#" className="page-link">
                              1
                            </a>
                          </li>
                          <li className="page-item">
                            <a href="#" className="page-link">
                              <i className="mdi mdi-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
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

export default UploadDesignListV1;
