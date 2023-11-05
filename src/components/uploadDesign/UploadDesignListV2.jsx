import React, { useEffect, useState } from "react";
import { DateSearchFilter, DropdownFilter, TextSearchFilter } from "../common/Filter";
import DataTable from "../common/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteDesignUploadMutation, useDesignUploadListMutation } from "../../service";
import { getDesignUpload } from "../../redux/designUploadSlice";
import toast from "react-hot-toast";
import VerifyDeleteModal from "../common/VerifyDeleteModal";


function UploadDesignListV2() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [reqDesign,resDesign] = useDesignUploadListMutation()
  const [reqDelete, resDelete] = useDeleteDesignUploadMutation();
  const designUploadList = useSelector((state) => state?.designUploadState.designUploadList)
  console.log('designUploadList',designUploadList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  useEffect(() => {
    reqDesign({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
    }
  }, [resDesign]);

  const handleDownload = (e, st) => {
    e.preventDefault();
    console.log("sssss", st.row.original);
  };

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/upload-design-form", {
      state: {
        designID: st?.row?.original?._id,
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
      reqDesign({
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
      Header: "Design Name",
      accessor: "name",
      Filter: TextSearchFilter,
      filter: "rankedMatchSorter",
    },
    // {
    //   Header: "Date",
    //   accessor: "Date",
    //   Filter: DateSearchFilter,
    // },
    {
      Header: "Category",
      accessor: "category.label",
      Filter: DropdownFilter,
    },
    {
      Header: "Upload By",
      accessor: "uploadedBy.firstName uploadedBy.lastName",
      Cell: (row) => `${row?.row?.original?.uploadedBy?.firstName} ${row?.row?.original?.uploadedBy?.lastName}`,
      Filter: TextSearchFilter,
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
                      onClick={() => navigate('/upload-design-form')}
                    >
                      <i className="mdi mdi-plus me-1"></i> Upload Design
                    </button>
                  </div>
                </div>                
                  <DataTable data={designUploadList} columns={columns} />
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

export default UploadDesignListV2;
