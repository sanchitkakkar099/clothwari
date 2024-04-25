import React, { useEffect, useState } from 'react'
import {
    Button,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "reactstrap";
import toast from "react-hot-toast";
import Select from "react-select";
import { useAdminListMutation, useDesignerDropDownListQuery } from '../../service';
function UpdateDesignerModal({openUploadedByChange,onCloseClick,selectedDesign}) {
    const [staffDropdown,setStaffDropdown] = useState([])
    const [adminDropdown,setAdminDropdown] = useState([])
    const [selectedStaff,setSelectedStaff] = useState(null)
    const [confirmOpen,setConfirmOpen] = useState(false)
    const staffDropDownRes = useDesignerDropDownListQuery()
    const [reqAdmin, resAdmin] = useAdminListMutation();
    console.log('adminDropdown',adminDropdown);


    useEffect(() => {
        reqAdmin({
          page: 0,
          limit: 0,
          search: "",
        });
      }, []);

    useEffect(() => {
        if (resAdmin?.isSuccess) {
            const filterRes =  resAdmin?.data?.data?.docs?.map((el) => ({label:el?.name,value:el?._id}))
            setAdminDropdown(filterRes);
        }
    },[resAdmin?.isSuccess])

    useEffect(() => {
        if(staffDropDownRes?.isSuccess && Array.isArray(staffDropDownRes?.data?.data) && staffDropDownRes?.data?.data){
            const filterRes =  staffDropDownRes?.data?.data?.map((el) => ({label:el?.name,value:el?._id}))
            const filterRes2 = filterRes
            setStaffDropdown(filterRes2)
        }
        },[staffDropDownRes?.isSuccess])

    const onConfirmModal = (e) => {
        setConfirmOpen(true)
    }

    const onCloseConfirm = () => {
        setConfirmOpen(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('payload',{
            designs:selectedDesign,
            designerId:selectedStaff?.value
        });
    }

    return (
        <>
        <Modal isOpen={openUploadedByChange} centered toggle={onCloseClick}>
        <ModalHeader className="text-center">Update Uploaded By</ModalHeader>
        <ModalBody>
            <Label for="permissions" className="form-label">
            Select Uploaded By
            </Label>
            <Select
            className="react-select"
            classNamePrefix="select"
            options={[...staffDropdown,...adminDropdown] || []}
            onChange={(val) => setSelectedStaff(val)}
            />
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={onCloseClick}>Close</Button>
            <Button color="primary" onClick={(e) => onConfirmModal(e)} disabled={!selectedStaff}>Submit</Button>
        </ModalFooter>
        </Modal>
        <Modal isOpen={confirmOpen} centered toggle={onCloseConfirm}>
        <ModalHeader className="text-center">Are you sure to update uploaded by?</ModalHeader>
        <ModalFooter>
            <Button color="secondary" onClick={onCloseConfirm}>No</Button>
            <Button color="primary" onClick={(e) => handleSubmit(e)}>Yes</Button>
        </ModalFooter>
        </Modal>
        </>
    )
}

export default UpdateDesignerModal
