import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../design/Filter";
import DataTable from "../design/DataTable";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


function DesignerList() {
  const navigate = useNavigate()
  const designerList = useSelector((state) => state?.designerState.designerList)
  console.log('designerList',designerList);

  const handleDownload = (e, st) => {
    e.preventDefault();
    console.log("sssss", st.row.original);
  };

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      Filter: TextSearchFilter,
      filter: "rankedMatchSorter",
    },
    {
      Header: "Email",
      accessor: "email",
      Filter: TextSearchFilter,
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => (
        <div>
          <button onClick={(e) => handleDownload(e, row)}>View</button>
        </div>
      ),
    },
  ];
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Designer</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Designer</li>
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
                      onClick={() => navigate('/add-designer')}
                    >
                      <i className="mdi mdi-plus me-1"></i> Create Designer
                    </button>
                  </div>
                </div>
                {/* <div id="table-ecommerce-orders"></div> */}
                {/* {Array.isArray(designList) && designList?.length > 0 && ( */}
                  <DataTable data={designerList} columns={columns} />
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignerList;
