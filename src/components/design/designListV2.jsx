import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "./Filter";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


function DesignListV2() {
  const navigate = useNavigate()
  const [data, getData] = useState([]);
  const URL = "https://jsonplaceholder.org/users";
  const designList = useSelector((state) => state?.designState.designList)
  console.log('designList',designList);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = () => {
  //   fetch(URL)
  //     .then((res) => res.json())

  //     .then((response) => {
  //       console.log(response);
  //       const response1 = response?.map((el) => ({
  //         id: el?.id,
  //         firstname: el?.firstname,
  //         lastname: el?.lastname,
  //         email: el?.email,
  //         birthDate: el?.birthDate,
  //         company: el?.company?.name,
  //       }));
  //       getData(response1);
  //     });
  // };

  // console.log("data", data);

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
      Header: "Design Code",
      accessor: "designe_code",
      Filter: TextSearchFilter,
    },
    {
      Header: "Design Number",
      accessor: "designe_number",
      Filter: TextSearchFilter,
    },
    // {
    //   Header: "BirthDate",
    //   accessor: "birthDate",
    //   Filter: DateSearchFilter,
    // },
    {
      Header: "Varient",
      accessor: "varient.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Product",
      accessor: "product.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Pattern",
      accessor: "pattern.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Color",
      accessor: "color.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Weave",
      accessor: "weave.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Blend",
      accessor: "blend.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => (
        <div>
          <button onClick={(e) => handleDownload(e, row)}>Download</button>
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
              <h4 className="mb-0">Designs</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Designs</li>
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
                      onClick={() => navigate('/upload-design')}
                    >
                      <i className="mdi mdi-plus me-1"></i> Upload Design
                    </button>
                  </div>
                </div>
                {/* <div id="table-ecommerce-orders"></div> */}
                {/* {Array.isArray(designList) && designList?.length > 0 && ( */}
                  <DataTable data={designList} columns={columns} />
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignListV2;
