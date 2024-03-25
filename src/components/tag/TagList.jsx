import React,{useState,useEffect} from 'react'
import { TextSearchFilter } from '../common/Filter';
import DataTable from "../common/DataTable";
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDeleteTagMutation, useTagListMutation } from '../../service';
import VerifyDeleteModal from '../common/VerifyDeleteModal';
import { getTag } from '../../redux/tagSlice';
import toast from 'react-hot-toast';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { Edit, GitMerge, MoreVertical, Trash } from 'react-feather';
import TagMergeModal from '../common/TagMergeModal';


function TagList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqTag,resTag] = useTagListMutation()
  const [reqDelete, resDelete] = useDeleteTagMutation();
  const tagList = useSelector((state) => state?.tagState.tagList)
  console.log('tagList',tagList);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [mergeFrom, setMergeFrom] = useState(null);
  const [mergeTo, setMergeTo] = useState(null);

  useEffect(() => {
    reqTag({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resTag?.isSuccess) {
      dispatch(getTag(resTag?.data?.data?.docs));
    }
  }, [resTag]);

  const onEditAction = (e, st) => {
    e.preventDefault();
    navigate("/tag-form", {
      state: {
        tagID: st?.row?.original?._id,
      },
    });
  };

  const handleDelete = (e, st) => {
    e.preventDefault();
    console.log("sssss", st?.row?.original);
    setModalDetails({
      title: st?.row?.original?.label,
      id: st?.row?.original?._id,
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (resDelete?.isSuccess) {
      toast.success(resDelete?.data?.message, {
        position: "top-center",
      });
      reqTag({
        page: 0,
        limit: 0,
        search: "",
      });
      setShowModal(false);
      setModalDetails(null);
    }
  }, [resDelete]);

  const handleMerge = (e, st) => {
    e.preventDefault();
    console.log("Merge", st?.row?.original);
    setMergeTo(st?.row?.original)
  }

  
  const onMergeCloseClick = (e) => {
    e.preventDefault();
    setMergeTo(null)
    setMergeFrom(null)
  }


    const columns = [
        {
          Header: "Tag Name",
          accessor: "label",
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

                                  <DropdownItem
                                    href="#!"
                                    onClick={(e) => handleMerge(e,row)}
                                  >
                                    <GitMerge className="me-50" size={15} />{" "}
                                    <span className="align-middle">Merge Tag</span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
           
          ),
          // Cell: (row) => (
          //   <div>
          //     <button onClick={(e) => onEditAction(e,row)}>Edit</button>
          //     <button onClick={(e) => handleDelete(e,row)} className='ms-2'>Delete</button>
          //   </div>
          // ),
         
        },
      ];
  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin' || userInfo?.role === 'Designer') ?

    <>
    <div className="page-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Tag</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="#!">Clothwari</a>
                </li>
                <li className="breadcrumb-item active">Tag</li>
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
                    onClick={() => navigate('/tag-form')}
                  >
                    <i className="mdi mdi-plus me-1"></i> Create Tag
                  </button>
                </div>
              </div>
              
                <DataTable data={tagList} columns={columns} />
              
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
  :
  <Navigate to={"/dashboard"} />    
  }
  <TagMergeModal
      mergeFrom={mergeFrom}
      setMergeFrom={setMergeFrom}
      mergeTo={mergeTo}
      setMergeTo={setMergeTo}
      onMergeCloseClick={onMergeCloseClick}
    />
  </>
  )
}

export default TagList
