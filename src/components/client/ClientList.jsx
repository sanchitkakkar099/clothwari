import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useClientListMutation, useDeleteClientMutation } from "../../service";
import { getDesigner } from "../../redux/designerSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";
import { getClient } from "../../redux/clientSlice";


function ClientList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [reqClient,resClient] = useClientListMutation()
  const [reqDelete, resDelete] = useDeleteClientMutation();
  const designerList = useSelector((state) => state?.clientState.clientList)
  console.log('designerList',designerList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  useEffect(() => {
    reqClient({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resClient?.isSuccess) {
      dispatch(getClient(resClient?.data?.data?.docs));
    }
  }, [resClient]);

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/client-form", {
      state: {
        clientID: st?.row?.original?._id,
        isEdit:true
      },
    });
  };

  const handleDelete = (e, st) => {
    e.preventDefault();
    console.log("sssss", st?.row?.original);
    setModalDetails({
      title: st?.row?.original?.name,
      id: st?.row?.original?._id,
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (resDelete?.isSuccess) {
      toast.success(resDelete?.data?.message, {
        position: "top-center",
      });
      reqClient({
        page: 0,
        limit: 0,
        search: "",
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

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
        <div>
          <button onClick={(e) => onEditAction(e,row)}>Edit</button>
          <button onClick={(e) => handleDelete(e,row)} className='ms-2'>Delete</button>
        </div>
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
              <h4 className="mb-0">Client</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Client</li>
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
                      onClick={() => navigate('/client-form')}
                    >
                      <i className="mdi mdi-plus me-1"></i> Create Client
                    </button>
                  </div>
                </div>
                  <DataTable data={designerList} columns={columns} />
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
  );
}

export default ClientList;
