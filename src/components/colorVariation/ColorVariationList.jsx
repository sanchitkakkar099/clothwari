import React, { useEffect, useState } from 'react'
import { TextSearchFilter } from '../common/Filter';
import DataTable from "../common/DataTable";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useColorVariationListMutation,useDeleteColorVariationMutation } from '../../service';
import { getCategory } from '../../redux/categorySlice';
import VerifyDeleteModal from '../common/VerifyDeleteModal';
import toast from 'react-hot-toast';
import { DropdownItem,DropdownMenu,UncontrolledDropdown,DropdownToggle } from 'reactstrap';
import { Edit, Eye, MoreVertical,Trash } from 'react-feather';
import { getColorVariation } from '../../redux/colorVariationSlice';


function ColorVariationList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [reqColorVariation,resColorVariation] = useColorVariationListMutation()
  const [reqDelete, resDelete] = useDeleteColorVariationMutation();
  const colorVariationList = useSelector((state) => state?.colorVariationState.colorVariationList)
  console.log('colorVariationList',colorVariationList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  useEffect(() => {
    reqColorVariation({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resColorVariation?.isSuccess) {
      dispatch(getColorVariation(resColorVariation?.data?.data?.docs));
    }
  }, [resColorVariation]);


  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/color-variation-form", {
      state: {
        variationID: st?.row?.original?._id,
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
      reqColorVariation({
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
          Header: "Color Name",
          accessor: "name",
          Filter: TextSearchFilter,
          filter: "rankedMatchSorter",
        },
        {
          Header: "Color Code",
          accessor: "code",
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
                                  {/* <DropdownItem
                                    href="#!"
                                    onClick={(e) => onViewAction(e,row)}
                                  >
                                    <Eye className="me-50" size={15} />{" "}
                                    <span className="align-middle">View</span>
                                  </DropdownItem> */}
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => onEditAction(e,row)}
                                  >
                                    <Edit className="me-50" size={15} />{" "}
                                    <span className="align-middle">Edit</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => handleDelete(e,row)}
                                  >
                                    <Trash className="me-50" size={15} />{" "}
                                    <span className="align-middle">Delete</span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
           
          ),
        },
      ];
    //   <div>
    //   <button onClick={(e) => onEditAction(e,row)}>Edit</button>
    //   <button onClick={(e) => handleDelete(e,row)} className='ms-2'>Delete</button>
    // </div>
  return (
    <>
    <div className="page-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Color Variation</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="#!">Clothwari</a>
                </li>
                <li className="breadcrumb-item active">Color Variation</li>
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
                    onClick={() => navigate('/color-variation-form')}
                  >
                    <i className="mdi mdi-plus me-1"></i> Create Color Variation
                  </button>
                </div>
              </div>
              
                <DataTable data={colorVariationList} columns={columns} />
              
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
  )
}

export default ColorVariationList
