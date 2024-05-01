import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  Navigate, useLocation, useNavigate } from "react-router-dom";
import { useApproveOrderMutation, useRequestOrderListMutation } from "../../service";
import { CheckCircle, Edit, Eye, MoreVertical, XCircle } from "react-feather";
import {  DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import Pagination from "../common/Pagination";
import toast from "react-hot-toast";


function OrdersApprovalList() {
  const navigate = useNavigate()
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);

  const [reqOrders, resOrders] = useRequestOrderListMutation();
  const [reqApproveOrder, resApproveOrder] = useApproveOrderMutation();


  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [totalCount, setTotalCount] = useState(0)
  console.log('TBLData',TBLData,totalCount);

  // filter
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchMarketerName, setSearchMarketerName] = useState('');
  const [searchCustomerCode, setSearchCustomerCode] = useState('');
  const [searchSalesOrder, setSearchSalesOrder] = useState('');


  useEffect(() => {
    if(searchCustomerName || searchMarketerName || searchSalesOrder || searchCustomerCode){
      reqOrders({
        page: currentPage,
        limit: pageSize,
        customerName:searchCustomerName,
        marketingPersonName:searchMarketerName,
        salesOrderNumber:searchSalesOrder,
        customerCode:searchCustomerCode,
      });
    }else{
      reqOrders({
        page: currentPage,
        limit: pageSize,
      });
    }
  }, [currentPage,searchCustomerName,searchMarketerName,searchSalesOrder,searchCustomerCode]);

  useEffect(() => {
    if (resOrders?.isSuccess) {
      setTBLData(resOrders?.data?.data?.docs?.map(el => ({...el?.cartId,status:el?.status})))
      setTotalCount(resOrders?.data?.data?.totalDocs)
    }
  }, [resOrders]);

  const onViewAction = (e,el) => {
    e.preventDefault()
    console.log('el',el);
    navigate(`/order-details/${el?._id}`,{
      state:{
        from:'view-orders-request'
      }
    })
  }

  const onApproveAction = (e, el) => {
    e.preventDefault();
    console.log('el',el);
    reqApproveOrder({
      cartId:el?._id,
      status:"Approved"
    })
  };

  const onRejectAction = (e, el) => {
    e.preventDefault();
    reqApproveOrder({
      cartId:el?._id,
      status:"Rejected"
    })
  };

  useEffect(() => {
    if(resApproveOrder?.isSuccess){
      toast.success("Order Request SuccessFully Updated",{
        position:'top-center'
      })
      reqOrders({
        page: currentPage,
        limit: pageSize,
      });
    }
    if(resApproveOrder?.isError){
      toast.error("Something went wrong",{
        position:'top-center'
      })
      reqOrders({
        page: currentPage,
        limit: pageSize,
      });
    }
  },[resApproveOrder?.isSuccess,resApproveOrder?.isError])

  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some((el) => el === "Order Approved/Rejected")) ?
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Orders Request</h4>
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
                <table className="filter-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Customer Code</th>
                        <th>Marketing Person Name</th>
                        <th>Sales Order Number</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td><input type="text" value={searchCustomerName} onChange={(e) => setSearchCustomerName(e.target.value)}/></td>
                        <td><input type="text" value={searchCustomerCode} onChange={(e) => setSearchCustomerCode(e.target.value)}/></td>
                        <td><input type="text" value={searchMarketerName} onChange={(e) => setSearchMarketerName(e.target.value)}/></td>
                        <td><input type="text" value={searchSalesOrder} onChange={(e) => setSearchSalesOrder(e.target.value)}/></td>
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
                  />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    :
    <Navigate to={"/dashboard"}/>
    }
    </>

  );
}

export default OrdersApprovalList;
