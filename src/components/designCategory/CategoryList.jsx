import React, { useEffect, useRef, useState } from "react";
import { TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  useCategoryDropdownListQuery,
  useCategoryListV2Mutation,
  useDeleteCategoryMutation,
} from "../../service";
import { getCategory } from "../../redux/categorySlice";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import toast from "react-hot-toast";
import { CSVLink, CSVDownload } from "react-csv";
import {
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownToggle,
  Button,
} from "reactstrap";
import { Edit, Eye, GitMerge, MoreVertical, Trash } from "react-feather";
import CategoryMergeModal from "../common/CategoryMergeModal";
import "../../components/uploadDesign/dropdown-filter.css";
import Pagination from "../common/Pagination";
import useLoader from "../../hook/useLoader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 

dayjs.extend(utc);


function CategoryList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const btnRef = useRef(null);
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqCategory, resCategory] = useCategoryListV2Mutation();
  const [reqDelete, resDelete] = useDeleteCategoryMutation();
  const categoryDropdownRes = useCategoryDropdownListQuery();
  const categoryList = useSelector(
    (state) => state?.categoryState.categoryList
  );
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  const [mergeFrom, setMergeFrom] = useState(null);
  const [mergeTo, setMergeTo] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [sortingBy, setSortingBy] = useState("asc");

  // pagination
  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  // filter
  const [filterName, setFilterName] = useState("");

  const [csvData, setCsvData] = useState([]);


  // useEffect(() => {
  //   reqCategory({
  //     page: 0,
  //     limit: 0,
  //     search: "",
  //   });
  // }, []);

  useEffect(() => {
    if (filterName || sortingBy) {
      reqCategory({
        page: currentPage,
        limit: pageSize,
        search: filterName,
        sortBy: sortingBy,
      });
    } else {
      reqCategory({
        page: currentPage,
        limit: pageSize,
      });
    }
  }, [currentPage, filterName, sortingBy]);

  useEffect(() => {
    if (location?.state?.currentPage) {
      setCurrentPage(location?.state?.currentPage);
    }
  }, [location]);

  useEffect(() => {
    if (resCategory?.isSuccess) {
      dispatch(getCategory(resCategory?.data?.data?.docs));
      setTBLData(resCategory?.data?.data?.docs);
      setTotalCount(resCategory?.data?.data?.totalDocs);
    }
  }, [resCategory]);

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

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/category-form", {
      state: {
        categoryID: st._id,
        isEdit: true,
        currentPage: currentPage,
      },
    });
  };

  const handleDelete = (e, st) => {
    e.preventDefault();
    setModalDetails({
      title: st?.name,
      id: st?._id,
    });
    setShowModal(true);
  };

  const handleMerge = (e, st) => {
    e.preventDefault();
    setMergeTo(st);
  };

  const onMergeCloseClick = (e) => {
    e.preventDefault();
    setMergeTo(null);
    setMergeFrom(null);
  };

  useEffect(() => {
    if (resDelete?.isSuccess) {
      toast.success(resDelete?.data?.message, {
        position: "top-center",
      });
      reqCategory({
        page: currentPage,
        limit: pageSize,
        sortBy: sortingBy,
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

  const handleSorting = (e) => {
    setSortingBy(e.target.value);
  };

  const handleNameFilter = (e) => {
    setFilterName(e.target.value);
  };

  const handleDownloadCSV = async () => {
    try {
      if(categoryDropdownRes?.isSuccess){
        const responseCatData = categoryDropdownRes?.data?.data || [];
      
      const csvDataTemp = [
        [
          "Category Name",
          "Created At"
        ],
      ];
      responseCatData.forEach((data) => {
        csvDataTemp.push([
          data.label,
          dayjs.utc(data.createdAt).format("MM/DD/YYYY")
        ]);
      });

      setCsvData(csvDataTemp);
      setTimeout(() => {
        btnRef.current.link.click();
      }, 1000);
    }
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  return (
    <>
      {userInfo?.role === "Super Admin" ||
      userInfo?.role === "Admin" ||
      userInfo?.role === "Designer" ? (
        <>
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">Category</h4>

                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a href="#!">Clothwari</a>
                        </li>
                        <li className="breadcrumb-item active">Category</li>
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
                            onClick={() => navigate("/category-form")}
                          >
                            <i className="mdi mdi-plus me-1"></i> Create
                            Category
                          </button>
                          <button
                            type="button"
                            className="btn btn-success waves-effect waves-light mb-4 me-2"
                            data-bs-toggle="modal"
                            data-bs-target=".add-new-order"
                            onClick={handleDownloadCSV}
                          >
                            Download CSV
                          </button>
                          <CSVLink
                            data={csvData}
                            filename="data.csv"
                            className="hidden"
                            ref={btnRef}
                            target="_blank"
                          />
                        </div>
                      </div>
                      <div className="position-relative">
                        <div className="filter-dropdown" ref={dropdownRef}>
                          <Button onClick={() => setIsOpen(!isOpen)}>
                            {" "}
                            <i className="mdi mdi-filter me-1"></i> Sort By
                          </Button>
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
                                    value={"asc"}
                                    checked={sortingBy === "asc"}
                                    onChange={(e) => handleSorting(e)}
                                  />{" "}
                                  A TO Z
                                </label>
                                <label className="option">
                                  <input
                                    type="radio"
                                    name="sorting"
                                    value={"desc"}
                                    checked={sortingBy === "desc"}
                                    onChange={(e) => handleSorting(e)}
                                  />{" "}
                                  Z TO A
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* <DataTable data={categoryList} columns={columns} /> */}
                      <table className="filter-table">
                        <thead>
                          <tr>
                            <th>Category Name</th>
                            <th>Action</th>
                          </tr>
                          <tr>
                            <td>
                              <input
                                type="text"
                                value={filterName}
                                onChange={(e) => handleNameFilter(e)}
                              />
                            </td>
                            <td />
                          </tr>
                        </thead>
                        <tbody>
                          {TBLData &&
                          Array.isArray(TBLData) &&
                          TBLData?.length > 0 ? (
                            TBLData?.map((ele) => {
                              return (
                                <tr key={ele?._id}>
                                  <td>{ele?.name}</td>
                                  <td>
                                    <UncontrolledDropdown>
                                      <DropdownToggle
                                        className="icon-btn hide-arrow moreOption"
                                        color="transparent"
                                        size="sm"
                                        caret
                                      >
                                        <MoreVertical size={15} />
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        {/* <DropdownItem
                                    href="#!"
                                    onClick={(e) => onViewAction(e,row)}
                                  >
                                    <Eye className="me-50" size={15} />{" "}
                                    <span className="align-middle">View</span>
                                  </DropdownItem> */}
                                        <DropdownItem
                                          href="#!"
                                          onClick={(e) => onEditAction(e, ele)}
                                        >
                                          <Edit className="me-50" size={15} />{" "}
                                          <span className="align-middle">
                                            Edit
                                          </span>
                                        </DropdownItem>
                                        <DropdownItem
                                          href="#!"
                                          onClick={(e) => handleDelete(e, ele)}
                                        >
                                          <Trash className="me-50" size={15} />{" "}
                                          <span className="align-middle">
                                            Delete
                                          </span>
                                        </DropdownItem>

                                        <DropdownItem
                                          href="#!"
                                          onClick={(e) => handleMerge(e, ele)}
                                        >
                                          <GitMerge
                                            className="me-50"
                                            size={15}
                                          />{" "}
                                          <span className="align-middle">
                                            Replace Category
                                          </span>
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center">
                                No Data To Display
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <Pagination
                        currentPage={currentPage}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                        TBLData={TBLData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <VerifyDeleteModal
            showModal={showModal}
            setShowModal={setShowModal}
            modalDetails={modalDetails}
            confirmAction={reqDelete}
          />
        </>
      ) : (
        <Navigate to={"/dashboard"} />
      )}
      <CategoryMergeModal
        mergeFrom={mergeFrom}
        setMergeFrom={setMergeFrom}
        mergeTo={mergeTo}
        setMergeTo={setMergeTo}
        onMergeCloseClick={onMergeCloseClick}
        currentPage={currentPage}
        pageSize={pageSize}
        setTBLData={setTBLData}
        setTotalCount={setTotalCount}
      />
    </>
  );
}

export default CategoryList;
