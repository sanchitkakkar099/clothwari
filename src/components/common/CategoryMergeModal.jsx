import React, { useEffect, useState } from "react";
import {
  Button,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useCategoryDropdownListQuery, useCategoryListV2Mutation, useChangePasswordBySuperAdminMutation, useMergeCategoryMutation } from "../../service";
import toast from "react-hot-toast";
import Select from "react-select";
import { set } from "react-hook-form";
import { getCategory } from "../../redux/categorySlice";
import { useDispatch } from "react-redux";
function CategoryMergeModal({mergeFrom,setMergeFrom,mergeTo,setMergeTo,onMergeCloseClick,currentPage,pageSize,setTBLData,setTotalCount}) {
  const dispatch = useDispatch()
  const categoryDropdownRes = useCategoryDropdownListQuery();
  const [reqMergeCategory,resMergeCategory] = useMergeCategoryMutation()
  const [reqCategory,resCategory] = useCategoryListV2Mutation()

  const [categoryDropdown,setCategoryDropdown] = useState([])
  const [confirmOpen,setConfirmOpen] = useState(false)

  console.log('mergeFrom',mergeFrom,'mergeTo',mergeTo);



  //   const [reqChangesPwd,resChangesPwd] = useChangePasswordBySuperAdminMutation()

  useEffect(() => {
    if(categoryDropdownRes?.isSuccess && Array.isArray(categoryDropdownRes?.data?.data) && categoryDropdownRes?.data?.data){
      setCategoryDropdown(categoryDropdownRes?.data?.data?.filter(el => el?._id !== mergeTo?._id))
    }
  },[categoryDropdownRes?.isSuccess,mergeTo])

    const handleSubmit = (e) => {
      e.preventDefault()
      reqMergeCategory({
        merge_from: mergeFrom?._id,
        merge_to: mergeTo?._id
      })
    }

    const onConfirmModal = (e) => {
        setConfirmOpen(true)
    }

    const onCloseConfirm = () => {
        setConfirmOpen(false)
      }

    useEffect(() => {
      if(resMergeCategory?.isSuccess){
          toast.success('Category Merge Successfully',{
              position:'top-center'
          })
          setMergeFrom(null)
          setMergeTo(null)
          setConfirmOpen(false)
            reqCategory({
            page: currentPage,
            limit: pageSize,
            });
      }
      if(resMergeCategory?.isError){
          toast.error('Something went wrong',{
              position:'top-center'
          })
          setMergeFrom(null)
          setMergeTo(null)
          setConfirmOpen(false)
      }
    },[resMergeCategory?.isSuccess,resMergeCategory?.isError])

    useEffect(() => {
        if (resCategory?.isSuccess) {
          dispatch(getCategory(resCategory?.data?.data?.docs));
          setTBLData(resCategory?.data?.data?.docs)
          setTotalCount(resCategory?.data?.data?.totalDocs)
        }
      }, [resCategory]);
  return (
    <>
    <Modal isOpen={mergeTo ? true : false} centered toggle={onMergeCloseClick}>
      <ModalHeader className="text-center">Merge Category</ModalHeader>
      <ModalBody>
        <Label for="permissions" className="form-label">
          Merge From
        </Label>
        <Select
          className="react-select"
          classNamePrefix="select"
          options={categoryDropdown || []}
          onChange={(val) => setMergeFrom(val)}
        />
        <Label for="permissions" className="form-label mt-2">
          Merge To
        </Label>
        <Input
          className="react-select"
          classNamePrefix="select"
          value={mergeTo?.name}
          readOnly
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onMergeCloseClick}>Close</Button>
        <Button color="primary" onClick={(e) => onConfirmModal(e)} disabled={!mergeFrom || !mergeTo}>Submit</Button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={confirmOpen} centered toggle={onCloseConfirm}>
    <ModalHeader className="text-center">Are you sure to merge category?</ModalHeader>
    <ModalFooter>
        <Button color="secondary" onClick={onCloseConfirm}>No</Button>
        <Button color="primary" onClick={(e) => handleSubmit(e)}>Yes</Button>
      </ModalFooter>
    </Modal>
    </>
  );
}

export default CategoryMergeModal;
