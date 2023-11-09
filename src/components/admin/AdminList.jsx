import React, { useEffect, useState } from "react";
import {
  DateSearchFilter,
  DropdownFilter,
  TextSearchFilter,
} from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAdminListMutation } from "../../service";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit, MoreVertical, Eye } from "react-feather";
import { getAdmin } from "../../redux/adminSlice";

function AdmintList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reqAdmin, resAdmin] = useAdminListMutation();
  const adminList = useSelector((state) => state?.adminState.adminList);
  console.log("adminList", adminList);

  useEffect(() => {
    reqAdmin({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resAdmin?.isSuccess) {
      dispatch(getAdmin(resAdmin?.data?.data?.docs));
    }
  }, [resAdmin]);

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/admin-form", {
      state: {
        adminID: st?.row?.original?._id,
        isEdit: true,
      },
    });
  };

  const onViewAction = (e, st) => {
    e.preventDefault();
    navigate("/admin-view", {
      state: {
        adminID: st?.row?.original?._id,
      },
    });
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
      filter: "rankedMatchSorter",
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => (
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
            <DropdownItem href="#!" onClick={(e) => onViewAction(e, row)}>
              <Eye className="me-50" size={15} />{" "}
              <span className="align-middle">View</span>
            </DropdownItem>
            <DropdownItem href="#!" onClick={(e) => onEditAction(e, row)}>
              <Edit className="me-50" size={15} />{" "}
              <span className="align-middle">Edit</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Admin</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="javascript: void(0);">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">Admin</li>
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
                        onClick={() => navigate("/admin-form")}
                      >
                        <i className="mdi mdi-plus me-1"></i> Create Admin
                      </button>
                    </div>
                  </div>
                  <DataTable data={adminList} columns={columns} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdmintList;
