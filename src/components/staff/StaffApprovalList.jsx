import React, { useEffect, useState } from 'react'
import { TextSearchFilter } from '../common/Filter';
import DataTable from "../common/DataTable";
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminStaffApprovalListMutation, useColorVariationListMutation,useDeleteColorVariationMutation, useGetDesignerPermissionListQuery, useStaffApprovalBySuperAdminMutation } from '../../service';
import { getCategory } from '../../redux/categorySlice';
import VerifyDeleteModal from '../common/VerifyDeleteModal';
import toast from 'react-hot-toast';
import { DropdownItem,DropdownMenu,UncontrolledDropdown,DropdownToggle, Table } from 'reactstrap';
import { ArrowRightCircle, Edit, Eye, MoreVertical,Trash } from 'react-feather';
import { getColorVariation } from '../../redux/colorVariationSlice';
import { getStaffApprovalList } from '../../redux/adminSlice';
import Select from "react-select";


function StaffApprovalList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const [reqStaffApprovalList,resStaffApproval] = useAdminStaffApprovalListMutation()
  const [reqStaffApproved,resStaffApproved] = useStaffApprovalBySuperAdminMutation()
  const permissionList = useGetDesignerPermissionListQuery()
  const staffApprovalList = useSelector((state) => state?.adminState.staffApprovalList)
  const [permissionDropdown,setPermissionDropDown] = useState([])

  
  useEffect(() => {
    reqStaffApprovalList({
      page: 0,
      limit: 0,
      search: "",
    });
  }, []);

  useEffect(() => {
    if(permissionList?.isSuccess && permissionList?.data?.data){
      setPermissionDropDown(permissionList?.data?.data)
    }
  },[permissionList])

  useEffect(() => {
    if (resStaffApproval?.isSuccess) {
      dispatch(getStaffApprovalList(resStaffApproval?.data?.data?.docs));
    }
  }, [resStaffApproval]);


  const onApproveAction = (e, fld) => {
    e.preventDefault();
    // status 0:Pending 1:Approved 2:Rejected
    reqStaffApproved({
      staffId: fld?._id,
      status: 1,
      permissions: [
        "654a8a479bb8a67119c30a37"
      ]
    })
    // navigate("/color-variation-form", {
    //   state: {
    //     variationID: st?.row?.original?._id,
    //   },
    // });
  };

  const onRejectAction = (e, fld) => {
    e.preventDefault();
    // status 0:Pending 1:Approved 2:Rejected
    reqStaffApproved({
      staffId: fld?._id,
      status: 2,
      permissions: [
        "654a8a479bb8a67119c30a37"
      ]
    })
  };


  useEffect(() => {
    if (resStaffApproved?.isSuccess) {
      toast.success(resStaffApproved?.data?.message, {
        position: "top-center",
      });
      reqStaffApprovalList({
        page: 0,
        limit: 0,
        search: "",
      });
    }
  }, [resStaffApproved]);


    
  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin') ?

    <div className="page-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Staff Approval</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="#!">Clothwari</a>
                </li>
                <li className="breadcrumb-item active">Staff Approval</li>
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
                
              </div>
              <form >
          <Table   striped >
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>Permissions</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffApprovalList && Array.isArray(staffApprovalList) && staffApprovalList?.length > 0 
              ? staffApprovalList?.map((fld, index) => (
                <tr key={index}>
                  <td>
                    {fld?.name}
                  </td>
                  {/* <td>
                
                                <Select
                                  isClearable
                                  isMulti
                                  options={
                                   permissionDropdown || []
                                  }
                                  className="react-select"
                                  classNamePrefix="select"
                                 
                                />
                           
                  </td> */}
                  <td>
                    <button className='btn btn-success' onClick={(e) => onApproveAction(e,fld)}>Approve</button>
                    <button className='btn btn-danger ms-2' onClick={(e) => onRejectAction(e,fld)}>Reject</button></td>
                </tr>
              )) : <tr><td colSpan={3} className='text-center'>No Pending Approval</td></tr>}
            </tbody>
          </Table>
          
        </form>
              
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
  )
}

export default StaffApprovalList
