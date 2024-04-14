import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  Link, useLocation } from "react-router-dom";
import { useMyAllOrdersMutation } from "../../service";
import { Eye } from "react-feather";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import Pagination from "../common/Pagination";


function ViewMyOrders() {
  const location = useLocation();
  const userInfo = useSelector((state) => state?.authState.userInfo);
  console.log('location?.state?.data',location?.state?.data);

  const [reqOrders, resOrders] = useMyAllOrdersMutation();

  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [totalCount, setTotalCount] = useState(0)

  // filter
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchMarketerName, setSearchMarketerName] = useState('');
  const [searchCustomerCode, setSearchCustomerCode] = useState('');
  const [searchSalesOrder, setSearchSalesOrder] = useState('');


  console.log('TBLData',TBLData);

  useEffect(() => {
      reqOrders({
        page: currentPage,
        limit: pageSize,
        search: "",
      });
    
  }, [currentPage]);

  useEffect(() => {
    if (resOrders?.isSuccess) {
      // setTBLData(resOrders?.data?.data?.docs)
      // setTotalCount(resOrders?.data?.data?.totalDocs)
    }
  }, [resOrders]);


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
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td><input type="text" value={searchCustomerName} onChange={(e) => setSearchCustomerName(e.target.value)}/></td>
                        <td><input type="text" value={searchCustomerCode} onChange={(e) => setSearchCustomerCode(e.target.value)}/></td>
                        <td><input type="text" value={searchMarketerName} onChange={(e) => setSearchMarketerName(e.target.value)}/></td>
                        <td><input type="text" value={searchSalesOrder} onChange={(e) => setSearchSalesOrder(e.target.value)}/></td>
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
                                    // onClick={(e) => onViewAction(e,row)}
                                  >
                                    <Eye className="me-50" size={15} />{" "}
                                    <span className="align-middle">View</span>
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
  
    </>
  );
}

export default ViewMyOrders;
