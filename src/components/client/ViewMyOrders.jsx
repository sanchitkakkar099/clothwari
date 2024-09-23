import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {  Link, useLocation, useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import { CSVLink, CSVDownload } from "react-csv";
import { useApproveClientMutation, useMyAllOrdersMutation, useMyAllOrdersReportMutation } from "../../service";
import { CheckCircle, Edit, Eye, MoreVertical, XCircle } from "react-feather";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import Pagination from "../common/Pagination";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; 
import useLoader from "../../hook/useLoader";
import PdfGeneratorLoader from "../common/PdfGeneratorLoader";


dayjs.extend(utc);


function ViewMyOrders() {
  const btnRef = useRef(null);
  const navigate = useNavigate()
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);

  const [reqOrders, resOrders] = useMyAllOrdersMutation();
  const [reqApproveClient, resApproveClient] = useApproveClientMutation();
  const [reqCSVDesign, resCSVDesign] = useMyAllOrdersReportMutation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const { isLoading, showLoader ,hideLoader } = useLoader();

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [totalCount, setTotalCount] = useState(0)
  // console.log('TBLData',TBLData,totalCount);

  // filter
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchMarketerName, setSearchMarketerName] = useState('');
  const [searchCustomerCode, setSearchCustomerCode] = useState('');
  const [searchSalesOrder, setSearchSalesOrder] = useState('');

  useEffect(() => {
    if(searchCustomerName || searchMarketerName || searchSalesOrder || searchCustomerCode || startDate || endDate){
      reqOrders({
        page: currentPage,
        limit: pageSize,
        // user_id:userInfo?.role !== 'Super Admin' ? userInfo?._id : "",
        customerName:searchCustomerName,
        marketingPersonName:searchMarketerName,
        salesOrderNumber:searchSalesOrder,
        customerCode:searchCustomerCode,
        start_date: startDate && endDate ? dayjs(startDate).format() : "",
        end_date: startDate && endDate ? dayjs(endDate).format() : "",

      });
    }else{
      reqOrders({
        page: currentPage,
        limit: pageSize,
        // user_id:userInfo?.role !== 'Super Admin' ? userInfo?._id : "",
      });
    }
  }, [currentPage,searchCustomerName,searchMarketerName,searchSalesOrder,searchCustomerCode,startDate,endDate]);

  useEffect(() => {
    if (resOrders?.isSuccess) {
      setTBLData(resOrders?.data?.data?.docs)
      setTotalCount(resOrders?.data?.data?.total)
    }
  }, [resOrders]);

  const handleDateFilter = (tag, date) => {
    if (tag === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const onViewAction = (e,el) => {
    e.preventDefault()
    console.log('el',el);
    navigate(`/order-details/${el?._id}`)
  }

  const onEditAction = (e, el) => {
    e.preventDefault();
    navigate("/cart-item", {
      state: {
        cartID: el?._id,
        isEdit:true
      },
    });
  };

  const onApproveAction = (e, el) => {
    e.preventDefault();
    console.log('el',el);
    reqApproveClient({
      cartId:el?._id,
      isClientApproved:"Approved"
    })
  };

  const onRejectAction = (e, el) => {
    e.preventDefault();
    reqApproveClient({
      cartId:el?._id,
      isClientApproved:"Rejected"
    })
  };


  useEffect(() => {
    if(resApproveClient?.isSuccess){
      toast.success("Order SuccessFully Updated",{
        position:'top-center'
      })
      reqOrders({
        page: currentPage,
        limit: pageSize,
      });
    }
    if(resApproveClient?.isError){
      toast.error("Something went wrong",{
        position:'top-center'
      })
      reqOrders({
        page: currentPage,
        limit: pageSize,
      });
    }
  },[resApproveClient?.isSuccess,resApproveClient?.isError])

  const handleDownloadCSV = async () => {
    try {
      showLoader()
      const response = await reqCSVDesign({
        start_date: startDate && endDate ? dayjs(startDate).format() : "",
        end_date: startDate && endDate ? dayjs(endDate).format() : "",
      });
      
      if (response?.data?.code === 200) {
        const responseTBLData = response?.data?.data?.docs || [];

        const csvDataTemp = [
          [
            "Customer Name",
            "Customer Code",
            "Marketing Person Name",
            "Sales Order Number",
            "Design Number",
            "Designer Name"
          ],
        ];
        if(Array.isArray(responseTBLData)){
          responseTBLData?.forEach((data) => {
            const designs = data?.cartItem?.map((tag) => {
              return [
                data?.customerName,
                data?.customerCode,
                data?.marketingPersonName,
                data?.salesOrderNumber,
                tag?.designNo,
                tag?.uploadedByDesign
              ];
            });
            
            designs.forEach((design) => {
              csvDataTemp.push(design);
            });
          });
        }else{
          console.log("Error in array")
        }
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


  return (
    <>
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Orders</h4>
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
                  filename="clothwari_order_details.csv"
                  className="hidden"
                  ref={btnRef}
                  target="_blank"
                />
            </div>
          )}
        </div>
        <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
               
              {/* <div className="position-relative">
                  <div className="filter-dropdown" ref={dropdownRef}>
                  <Button onClick={() => setIsOpen(!isOpen)}> <i className="mdi mdi-filter me-1"></i> Sort By</Button>
                  {isOpen && (
                  <div className="filter-dropdown-content" id="dropdownContent">
                    <div className="filter-section">
                    
                      <h4>Order</h4>
                      <label className="option">
                        <input type="radio" name="sorting" value={'asc'} checked={sortingBy === 'asc'}  onChange={(e) => handleSorting(e)}/> A TO Z
                      </label>
                      <label className="option">
                        <input type="radio" name="sorting" value={'desc'} checked={sortingBy === 'desc'} onChange={(e) => handleSorting(e)}/> Z TO A
                      </label>
                    </div>
                  </div>
                  )}
                </div>
              </div> */}
              
                <table className="filter-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Customer Code</th>
                        <th>Marketing Person Name</th>
                        <th>Sales Order Number</th>
                        {userInfo?.role === "Super Admin" && <th>Approved By</th>}                        
                        {userInfo?.role === "Client" && <th>My Status</th>}
                        {(userInfo?.role === "Super Admin" || userInfo?.role === "SalesPerson") && <th>Client Status</th>}
                        <th>Review Status</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td><input type="text" value={searchCustomerName} onChange={(e) => setSearchCustomerName(e.target.value)}/></td>
                        <td><input type="text" value={searchCustomerCode} onChange={(e) => setSearchCustomerCode(e.target.value)}/></td>
                        <td><input type="text" value={searchMarketerName} onChange={(e) => setSearchMarketerName(e.target.value)}/></td>
                        <td><input type="text" value={searchSalesOrder} onChange={(e) => setSearchSalesOrder(e.target.value)}/></td>
                        {userInfo?.role === "Super Admin" && <td/>}
                        {(userInfo?.role === "Client" || userInfo?.role === "SalesPerson") && <td/>}
                        <td/>
                        <td/>

                        </tr>
                    </thead>
                    <tbody>
                    {(TBLData && Array.isArray(TBLData) && TBLData?.length > 0) ? 
                      TBLData?.map((ele) => {
                        return(
                          <tr key={ele?._id}>
                          <td>{ele?.customerName}</td>
                          <td>{ele?.customerCode}</td>
                          <td>{ele?.marketingPersonName}</td>
                          <td>{ele?.salesOrderNumber}</td>
                          {userInfo?.role === "Super Admin" && <td>{ele?.reviewedBy?.name}</td>}
                          {(userInfo?.role === "Super Admin" || userInfo?.role === "Admin" || userInfo?.role === "Client" || userInfo?.role === "SalesPerson") && <td>{ele?.isClientApproved || "In Review"}</td>}
                          <td>{ele?.status !== "" ? ele?.status : "In Review"}</td>
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
                                <DropdownItem
                                    href="#!"
                                    onClick={(e) => onViewAction(e,ele)}
                                  >
                                    <Eye className="me-50" size={15} />{" "}
                                    <span className="align-middle">View</span>
                                  </DropdownItem>
                                  {(userInfo?.role === 'SalesPerson') && ele?.isClientApproved !== "Approved" && ele?.isClientApproved !== "Rejected" &&

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onEditAction(e,ele)}
                                  >
                                    <Edit className="me-50" size={15} />{" "}
                                    <span className="align-middle">Edit</span>
                                  </DropdownItem>
                                  }
                                  {((userInfo?.role === 'Client') && ele?.status === "Approved" && ele?.isClientApproved !== "Approved" && ele?.isClientApproved !== "Rejected") &&
                                  <>
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onApproveAction(e,ele)}
                                  >
                                    <CheckCircle className="me-50" size={15} />{" "}
                                    <span className="align-middle">Approve</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onRejectAction(e,ele)}
                                  >
                                    <XCircle className="me-50" size={15} />{" "}
                                    <span className="align-middle">Reject</span>
                                  </DropdownItem>
                                  </>
                                  }
                                </DropdownMenu>
                              </UncontrolledDropdown>
                          </td>
                          </tr>
                        )
                      }):
                      <tr><td colSpan={4} className="text-center">No Data To Display</td></tr>
                    }
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    TBLData={TBLData}
                    setCurrentPage={setCurrentPage}
                  />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    {isLoading && <PdfGeneratorLoader message={"CSV Generating.."}/>}
    </>
  );
}

export default ViewMyOrders;
