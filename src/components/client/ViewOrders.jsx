import React, { useEffect, useState } from "react";;
import {  Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Download,  MoreVertical } from "react-feather";
import Pagination from "../common/Pagination";

function ViewOrderList() {
  const userInfo = useSelector((state) => state?.authState.userInfo);
  // pagination 
  const [TBLData, setTBLData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  return (
    <>
    {(userInfo?.role === 'Super Admin') ?
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">View Order</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">View Order</li>
                  </ol>
                </div>
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
                        <th>Design No</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td><input type="text"/></td>
                        <td><input type="text"/> </td>
                        <td><input type="text"/></td>
                        <td><input type="text"/></td>
                        <td><input type="text"/></td>
                        <td></td>
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
                          <td>{ele?.designNo}</td>
                          <td>
                          {((userInfo?.role === 'Super Admin' || userInfo?.role === 'Client' || userInfo?.role === 'SalesPerson') || userInfo?.permissions?.some(el => el === "Drive")) ?
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
                                    onClick={(e) => pdfDownload(e,ele)}
                                  >
                                    <Download className="me-50" size={15} />{" "}
                                    <span className="align-middle">Download</span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                              :'No Permission'}
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
    :
    <Navigate to={"/dashboard"}/>
    }
    </>
  );
}

export default ViewOrderList;
