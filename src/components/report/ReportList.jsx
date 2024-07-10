import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../common/Pagination";
import ReactDatePicker from "react-datepicker";
import ReportTooltip from "../common/ReportTooltip";
import { CSVLink, CSVDownload } from "react-csv";
import useLoader from "../../hook/useLoader";
import PdfGeneratorLoader from "../common/PdfGeneratorLoader";
import {
  useReportDesignUploadListMutation,
  useCSVDesignUploadListMutation,
} from "../../service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 


dayjs.extend(utc);

function ReportList() {
  const btnRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqDesign, resDesign] = useReportDesignUploadListMutation();
  const [reqCSVDesign, resCSVDesign] = useCSVDesignUploadListMutation();
  const { isLoading, showLoader ,hideLoader } = useLoader();

  const [TBLData, setTBLData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [totalDesign, setTotalDesign] = useState(0);
  const [totalPDF, setTotalPDF] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalTag, setTotalTag] = useState(0);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [imageurl, setImageurl] = useState("");
  const [target, setTarget] = useState("");

  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      reqDesign({
        page: currentPage,
        limit: pageSize,
        start_date: startDate && endDate ? dayjs(startDate).format() : "",
        end_date: startDate && endDate ? dayjs(endDate).format() : "",
      });
    } else {
      reqDesign({
        page: currentPage,
        limit: pageSize,
        start_date: "",
        end_date: "",
      });
    }
  }, [startDate, endDate, currentPage]);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      setTBLData(resDesign?.data?.data?.docs);
      setTotalDesign(resDesign?.data?.data?.totalDocs);
      setTotalCount(resDesign?.data?.data?.totalDocs);
      setTotalPDF(resDesign?.data?.data?.totalpdf);
      setTotalCategory(resDesign?.data?.data?.totalCategory);
      setTotalTag(resDesign?.data?.data?.totalTags);
      // dispatch(getDesignUpload(resDesign?.data?.data?.docs));
      // setTBLData(resDesign?.data?.data?.docs)
      // setTotalCount(resDesign?.data?.data?.totalDocs)
    }
  }, [resDesign]);

  const handleDateFilter = (tag, date) => {
    if (tag === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      showLoader()
      const response = await reqCSVDesign({
        start_date: startDate && endDate ? dayjs(startDate).format() : "",
        end_date: startDate && endDate ? dayjs(endDate).format() : "",
      });
      
      if (response?.data?.code === 200) {
        const responseTBLData = response?.data?.data || [];

        const csvDataTemp = [
          [
            "Design Name",
            "Uploaded By",
            "Created At",
            "Tags Created",
            "Category",
          ],
        ];
        responseTBLData.forEach((data) => {
          const tags = data.tag.map((tag) => tag.label).join(", ");
          csvDataTemp.push([
            data.name,
            data.uploadedBy?.name || " ",
            dayjs.utc(data.createdAt).format("MM/DD/YYYY"),
            tags,
            data.category?.name || " ",
          ]);
        });

        setCsvData(csvDataTemp);
        setTimeout(() => {
          btnRef.current.link.click();
          hideLoader();
        }, 1000);
      }
    } catch (error) {
      hideLoader();
      console.error("Error fetching CSV data:", error);
    }
  };

  const toggle = (tag, id, img) => {
    if (tag === "open") {
      setTooltipOpen(true);
      setTarget(null);
      setTarget(`design-${id}`);
      setImageurl(img);
    } else {
      setTooltipOpen(false);
      setTarget(`design-${id}`);
    }
  };

  return (
    <>
      {userInfo?.role === "Super Admin" ? (
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Report</h4>

                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="#!">Clothwari</a>
                      </li>
                      <li className="breadcrumb-item active">Report</li>
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
                            <h5>Report</h5>
                          </div>
                        </div>
                      </div>
                      <div className="position-relative">
                        {userInfo?.role === "Super Admin" && (
                          <div className=" mt-2 d-flex align-items-baseline justify-content-end gap-5">
                            <ReactDatePicker
                              selected={startDate}
                              onChange={(date) =>
                                handleDateFilter("start", date)
                              }
                              placeholderText="Select From Date"
                              selectsStart
                              startDate={startDate}
                              endDate={endDate}
                            />
                            <ReactDatePicker
                              selected={endDate}
                              onChange={(date) => handleDateFilter("end", date)}
                              placeholderText="Select To Date"
                              selectsEnd
                              startDate={startDate}
                              endDate={endDate}
                              minDate={startDate}
                            />
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
                        )}
                      </div>
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="row">
                            <div className="col-lg-3 col-md-6">
                              <div className="card">
                                <div className="card-body">
                                  <p className="text-muted mb-0 text-center">
                                    Tags Created
                                  </p>
                                  <h4 className="mt-1 mb-0 text-center">
                                    {totalTag}
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                              <div className="card">
                                <div className="card-body">
                                  <p className="text-muted mb-0 text-center">
                                    Category Created
                                  </p>
                                  <h4 className="mt-1 mb-0 text-center">
                                    {totalCategory}
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                              <div className="card">
                                <div className="card-body">
                                  <p className="text-muted mb-0 text-center">
                                    PDF uploaded
                                  </p>
                                  <h4 className="mt-1 mb-0 text-center">
                                    {totalPDF}
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                              <div className="card">
                                <div className="card-body">
                                  <p className="text-muted mb-0 text-center">
                                    Total Designs
                                  </p>
                                  <h4 className="mt-1 mb-0 text-center">
                                    {totalDesign}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <table className="filter-table responsive">
                        <thead>
                          <tr>
                            <th>Design Name</th>
                            <th>Uploaded By</th>
                            <th>Created At</th>
                            <th>Tag Created</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TBLData &&
                          Array.isArray(TBLData) &&
                          TBLData?.length > 0 ? (
                            TBLData?.map((ele) => {
                              return (
                                <tr key={ele?._id}>
                                  <td id={`design-${ele?._id}`}>
                                    <Link
                                      id={`design-${ele?._id}`}
                                      onMouseEnter={() =>
                                        toggle(
                                          "open",
                                          ele?._id,
                                          ele?.thumbnail[0]?.pdf_extract_img
                                        )
                                      }
                                      onMouseLeave={() =>
                                        toggle("close", ele?._id)
                                      }
                                    >
                                      {ele?.name}
                                    </Link>
                                  </td>
                                  <td>{ele?.uploadedBy?.name}</td>
                                  <td>
                                    {ele?.createdAt
                                      ? dayjs
                                          .utc(ele?.createdAt)
                                          .format("MM/DD/YYYY")
                                      : ""}
                                  </td>

                                  <td>
                                    {Array.isArray(ele?.tag) &&
                                    ele?.tag?.length > 0
                                      ? ele?.tag.map((tag) => {
                                          return (
                                            <span
                                              key={tag?._id}
                                              className={`tag ${
                                                tag?.range ? "tag-gray" : ""
                                              }`}
                                            >
                                              {tag?.label}
                                            </span>
                                          );
                                        })
                                      : ""}
                                  </td>
                                  <td>
                                    <span
                                      className={`category ${
                                        ele?.category?.range ? "tag-gray" : ""
                                      }`}
                                    >
                                      {ele?.category?.label}
                                    </span>
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
                    </div>
                  </div>
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
            {isLoading && <PdfGeneratorLoader message={"CSV Generating.."}/>}
          </div>
        </div>
      ) : (
        <Navigate to={"/dashboard"} />
      )}
      {target && (
        <ReportTooltip
          imageurl={imageurl}
          target={target}
          setTooltipOpen={setTooltipOpen}
          tooltipOpen={tooltipOpen}
        />
      )}
    </>
  );
}

export default ReportList;
