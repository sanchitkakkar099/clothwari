import React, { useEffect, useState } from "react";
import {
  useCategoryDropdownListQuery,
  useDesignUploadListMutation,
  useDesignerDropDownListQuery,
  useTagListMutation,
} from "../../service";
import { useDispatch, useSelector } from "react-redux";
import { getDesignUpload } from "../../redux/designUploadSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Pagination from "../common/Pagination";
import { addedBagItems, removeBagItems } from "../../redux/clientSlice";
import ReactDatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin
// import timezone from 'dayjs/plugin/timezone'; // Import timezone plugin
import { getTag, setSelectedTagList } from "../../redux/tagSlice";
import { setSearchData, setSelectedDate } from "../../redux/mixedSlice";
import { setSelectedStaffList } from "../../redux/adminSlice";
import { setSelectedCategoryList } from "../../redux/categorySlice";
import { Input } from "reactstrap";
// Extend Day.js with the plugins
dayjs.extend(utc);
// dayjs.extend(timezone);

function SalesPersonViewDesign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const categoryDropdownRes = useCategoryDropdownListQuery();
  const staffDropDownRes = useDesignerDropDownListQuery()
  const [reqDesign, resDesign] = useDesignUploadListMutation();
  const [reqTag, resTag] = useTagListMutation();
  const tagList = useSelector((state) => state?.tagState.tagList);
  const slectedTagList = useSelector((state) => state?.tagState.selectedTagList);
  const searchData = useSelector((state) => state?.mixedState.searchData);
  const selectedDate = useSelector((state) => state?.mixedState.selectedDate);
  const selectedStaffList = useSelector((state) => state?.adminState.selectedStaffList);
  const selectedCategoryList = useSelector((state) => state?.categoryState.selectedCategoryList);
  const designUploadList = useSelector(
    (state) => state?.designUploadState.designUploadList
  );
  const selectedBagItems = useSelector(
    (state) => state?.clientState.selectedBagItems
  );
  const [designID, setDesignId] = useState(null);
  const [variationImg, setVariationImg] = useState(null);

  // pagination
  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [totalCount, setTotalCount] = useState(0);

  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [staffDropdown,setStaffDropdown] = useState([])

  const [startDate, setStartDate] = useState(null);
  const [search, setSearch] = useState("");
  const [searchPage, setSearchPage] = useState("");
  const [tagsSearch, setTagSearch] = useState([]);
  const [categorySearch, setCategorySearch] = useState([]);

  const [selectedStaff, setSelectedStaff] = useState([]);


  useEffect(() => {
    if (location?.state?.currentPage) {
      setCurrentPage(location?.state?.currentPage);
      setTagSearch(location?.state?.tagsSearch);
      setSearch(location?.state?.search);
      setStartDate(location?.state?.startDate);
    }
  }, [location]);

  useEffect(() => {
    setSearch(searchData);
  },[searchData]);

  useEffect(() => {
    setStartDate(selectedDate);
  },[selectedDate]);

  useEffect(() => {
    setTagSearch(slectedTagList);
  },[slectedTagList]);

  useEffect(() => {
    setSelectedStaff(selectedStaffList);
  },[selectedStaffList]);

  useEffect(() => {
    setCategorySearch(selectedCategoryList);
  },[selectedCategoryList]);
      

  useEffect(() => {
    if (search || startDate || tagsSearch || categorySearch || selectedStaff) {
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: search,
        date_filter: startDate ? dayjs(startDate).format() : "",
        tags: tagsSearch,
        uploadedBy:Array.isArray(selectedStaff) ? selectedStaff?.map(el => el?.value) : [],
        category: Array.isArray(categorySearch)
          ? categorySearch?.map((el) => el?.value)
          : [],
      });
    } else {
      reqDesign({
        page: currentPage,
        limit: pageSize,
        search: "",
        date_filter: "",
        tags: [],
        uploadedBy: [],
        category: [],
      });
    }
  }, [currentPage, search, startDate, tagsSearch, selectedStaff, categorySearch]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      setTBLData(resDesign?.data?.data?.docs);
      setTotalCount(resDesign?.data?.data?.totalDocs);
    }
  }, [resDesign]);

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
    if(staffDropDownRes?.isSuccess && Array.isArray(staffDropDownRes?.data?.data) && staffDropDownRes?.data?.data){
      const filterRes =  staffDropDownRes?.data?.data?.map((el) => ({label:el?.name,value:el?._id}))
      const filterRes2 = (userInfo?.role !== "Super Admin" && userInfo?.role !== "Admin") ? filterRes?.filter(el => el?.value === userInfo?._id) : filterRes
      setStaffDropdown(filterRes2)
      if(selectedStaffList.length<=0){
        setSelectedStaff(filterRes2)
        dispatch(setSelectedStaffList(filterRes2));
      }
    }
  },[staffDropDownRes?.isSuccess])

  const handleSearch = (search) => {
    dispatch(setSearchData(search));
    setSearch(search);
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
      date_filter: startDate ? dayjs(startDate).format() : "",
      tags: tagsSearch,
      uploadedBy:Array.isArray(selectedStaff) ? selectedStaff?.map(el => el?.value) : [],
      category: Array.isArray(categorySearch)
        ? categorySearch?.map((el) => el?.value)
        : [],
    });
  };

  const handleSearchPageNumber = (pageNumber) => {
    setCurrentPage(parseInt(pageNumber) ? parseInt(pageNumber) : 1);
    setSearchPage(pageNumber);
    reqDesign({
      page: pageNumber,
      limit: pageSize,
      search: search,
      date_filter: startDate ? dayjs(startDate).format() : "",
      tags: tagsSearch,
      uploadedBy:Array.isArray(selectedStaff) ? selectedStaff?.map(el => el?.value) : [],
      category: Array.isArray(categorySearch)
        ? categorySearch?.map((el) => el?.value)
        : [],
    });
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

  const handleAddToBag = (el) => {
    dispatch(addedBagItems(el));
  };

  const handleRemoveFromBag = (el) => {
    const res = selectedBagItems?.filter((sb) => sb?._id !== el?._id);
    dispatch(removeBagItems(res));
  };

  const handleDateFilter = (date) => {
    dispatch(setSelectedDate(date));
    setStartDate(date);
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
      date_filter: dayjs(date).format(),
      category: Array.isArray(categorySearch)
        ? categorySearch?.map((el) => el?.value)
        : [],
    });
  };

  const navigateToView = (e, el) => {
    e.preventDefault();
    navigate("/design-selection", {
      state: {
        data: el,
        currentPage: currentPage,
        tag: "sales",
        tagsSearch: tagsSearch,
        startDate: startDate,
        search: search,
      },
    });
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
    dispatch(setSelectedTagList(selected))
    setTagSearch(selected);
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
      date_filter: dayjs(startDate).format(),
      tags: selected,
      uploadedBy:Array.isArray(selectedStaff) ? selectedStaff?.map(el => el?.value) : [],
      category: Array.isArray(categorySearch)
      ? categorySearch?.map((el) => el?.value)
      : [],
    });
  };

  const handleChangePrimary = (e) => {
    e.preventDefault();
    setVariationImg(null);
  };
  const handleStaffSelection = (selected) => {
    dispatch(setSelectedStaffList(selected));
    setSelectedStaff(selected)
  }
  const handleCategorySelection = (selected) => {
    dispatch(setSelectedCategoryList(selected));
    setCategorySearch(selected);
    reqDesign({
      page: currentPage,
      limit: pageSize,
      search: search,
      date_filter: dayjs(startDate).format(),
      uploadedBy:Array.isArray(selectedStaff) ? selectedStaff?.map(el => el?.value) : [],
      category: Array.isArray(categorySearch)
        ? categorySearch?.map((el) => el?.value)
        : [],
    });
  };

  return (
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
                            onChange={(date) => handleDateFilter(date)}
                            placeholderText="Select Date"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-inline">
                        <div className="search-box ms-2">
                          <Typeahead
                            allowNew={false}
                            id="custom-selections-example"
                            labelKey={"label"}
                            multiple
                            options={
                              categoryDropdown &&
                              Array.isArray(categoryDropdown) &&
                              categoryDropdown?.length > 0
                                ? categoryDropdown
                                : []
                            }
                            placeholder="Search category..."
                            onChange={handleCategorySelection}
                            selected={categorySearch}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-inline">
                        <div className="search-box ms-2">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row m-4">
                    <div className="col-md-3">
                      <div className="form-inline">
                        <div className="search-box ms-2">
                          <Typeahead
                            allowNew={false}
                            id="custom-selections-example"
                            labelKey={"label"}
                            onActiveItemChange={false}
                            multiple
                            options={
                              staffDropdown &&
                              Array.isArray(staffDropdown) &&
                              staffDropdown?.length > 0
                                ? staffDropdown
                                : []
                            }
                            placeholder="Search staff..."
                            onChange={handleStaffSelection}
                            selected={selectedStaff}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content p-3 text-muted">
                    <div
                      className="tab-pane active"
                      id="popularity"
                      role="tabpanel"
                    >
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
                                              className="col-xl-4 col-sm-6 d-flex"
                                              key={i}
                                            >
                                              <div className="product-box flex-fill d-flex flex-column">
                                                <div className="product-img pt-4 px-4">
                                                  {Array.isArray(
                                                    el?.thumbnail
                                                  ) &&
                                                  el?.thumbnail[0]
                                                    ?.pdf_extract_img ? (
                                                    <img
                                                      src={
                                                        variationImg &&
                                                        el?._id === designID
                                                          ? variationImg
                                                          : el?.thumbnail[0]
                                                              ?.pdf_extract_img
                                                      }
                                                      alt="image post"
                                                      height={200}
                                                      width={250}
                                                      className="image"
                                                    />
                                                  ) : (
                                                    <img
                                                      src="https://www.bootdey.com/image/250x200/FFB6C1/000000"
                                                      className="image"
                                                      alt="image post"
                                                      onClick={() =>
                                                        navigate(
                                                          `/product-view/${el?._id}`
                                                        )
                                                      }
                                                    />
                                                  )}
                                                </div>
                                                <div className="product-content p-4 d-flex flex-column flex-fill">
                                                  <div>
                                                    <div>
                                                      <h5 className="mb-1">
                                                        <Link
                                                          to={""}
                                                          onClick={(e) =>
                                                            navigateToView(
                                                              e,
                                                              el
                                                            )
                                                          }
                                                          className="text-dark font-size-16"
                                                        >
                                                          {el?.name}
                                                        </Link>
                                                      </h5>
                                                      {/* <p className="text-muted font-size-13">
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
                                                      </p> */}
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
                                                              height: "14px",
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
                                                                  width: "14px",
                                                                  height:
                                                                    "14px",
                                                                  borderRadius:
                                                                    "50%",
                                                                  border:
                                                                    "1px solid #c7c7c7",
                                                                }}
                                                                key={cinx}
                                                                onClick={(e) =>
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
                                                {/* {selectedBagItems && Array.isArray(selectedBagItems) && selectedBagItems?.length > 0 && selectedBagItems?.some(sb => sb?._id ===el?._id)  ?
                                                
                                                  <div className="d-flex justify-content-center mt-auto m-3">
                                                        <button 
                                                        className="btn btn-danger" 
                                                        onClick={() => handleRemoveFromBag(el)}
                                                  >Remove From Bag</button>
                                                    </div>:
                                                <div className="d-flex justify-content-center mt-auto m-3">
                                                        <button 
                                                        className="btn btn-primary" 
                                                        onClick={() => handleAddToBag(el)}
                                                  >Add To Bag</button>
                                                    </div>
                                                } */}
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
                              </div>
                            </div>
                            <div className="c-maker_pag">
                              <Pagination
                                currentPage={currentPage}
                                totalCount={totalCount}
                                pageSize={pageSize}
                                onPageChange={(page) => setCurrentPage(page)}
                                TBLData={TBLData}
                              />
                              <div className="c-maker_input">
                                <div className="form-inline">
                                  <div className="search-box">
                                    <div className="position-relative">
                                      <input
                                        type="text"
                                        onChange={(e) =>
                                          handleSearchPageNumber(e.target.value)
                                        }
                                        className="form-control "
                                        placeholder="Find by Page Number"
                                        value={searchPage}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default SalesPersonViewDesign;
