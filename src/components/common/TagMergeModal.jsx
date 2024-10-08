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
import { useMergeTagMutation, useTagDropdownListQuery, useTagListV2Mutation } from "../../service";
import toast from "react-hot-toast";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { getTag } from "../../redux/tagSlice";
function TagMergeModal({mergeFrom,setMergeFrom,mergeTo,setMergeTo,onMergeCloseClick,currentPage,pageSize,setTBLData,setTotalCount}) {
  const dispatch = useDispatch()
  const tagDropdownRes = useTagDropdownListQuery();
  const [reqMergeTag,resMergeTag] = useMergeTagMutation()
  const [reqTag,resTag] = useTagListV2Mutation()

  const [tagDropdown,setTagDropdown] = useState([])
  const [confirmOpen,setConfirmOpen] = useState(false)


  useEffect(() => {
    if(tagDropdownRes?.isSuccess && Array.isArray(tagDropdownRes?.data?.data) && tagDropdownRes?.data?.data){
      setTagDropdown(tagDropdownRes?.data?.data?.filter(el => el?._id !== mergeTo?._id))
    }
  },[tagDropdownRes?.isSuccess,mergeTo])

    const handleSubmit = (e) => {
      e.preventDefault()
      console.log('submitted',{
        merge_from: mergeFrom?.label,
        merge_to: mergeTo?.label,
        merge_from_tagId: mergeFrom?._id,
        merge_to_tagId: mergeTo?._id,
      });
      reqMergeTag({
        merge_from: mergeFrom?.label,
        merge_to: mergeTo?.label,
        merge_from_tagId: mergeFrom?._id,
        merge_to_tagId: mergeTo?._id,
      })
    }

    const onConfirmModal = (e) => {
        setConfirmOpen(true)
    }

    const onCloseConfirm = () => {
        setConfirmOpen(false)
      }

    useEffect(() => {
      if(resMergeTag?.isSuccess){
          toast.success('Tag Replace Successfully',{
              position:'top-center'
          })
          setMergeFrom(null)
          setMergeTo(null)
          setConfirmOpen(false)
            reqTag({
              page: currentPage,
              limit: pageSize,
            });
      }
      if(resMergeTag?.isError){
          toast.error('Something went wrong',{
              position:'top-center'
          })
          setMergeFrom(null)
          setMergeTo(null)
          setConfirmOpen(false)
      }
    },[resMergeTag?.isSuccess,resMergeTag?.isError])

    useEffect(() => {
        if (resTag?.isSuccess) {
          dispatch(getTag(resTag?.data?.data?.docs));
          setTBLData(resTag?.data?.data?.docs)
          setTotalCount(resTag?.data?.data?.totalDocs)
        }
      }, [resTag]);
  return (
    <>
    <Modal isOpen={mergeTo ? true : false} centered toggle={onMergeCloseClick}>
      <ModalHeader className="text-center">Replace Tag</ModalHeader>
      <ModalBody>
        <Label for="permissions" className="form-label">
          Replace From
        </Label>
        <Select
          className="react-select"
          classNamePrefix="select"
          options={tagDropdown || []}
          onChange={(val) => setMergeFrom(val)}
        />
        <Label for="permissions" className="form-label mt-2">
          Replace To
        </Label>
        <Input
          className="react-select"
          classNamePrefix="select"
          value={mergeTo?.label}
          readOnly
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onMergeCloseClick}>Close</Button>
        <Button color="primary" onClick={(e) => onConfirmModal(e)} disabled={!mergeFrom || !mergeTo}>Submit</Button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={confirmOpen} centered toggle={onCloseConfirm}>
    <ModalHeader className="text-center">Are you sure to replace tag?</ModalHeader>
    <ModalFooter>
        <Button color="secondary" onClick={onCloseConfirm}>No</Button>
        <Button color="primary" onClick={(e) => handleSubmit(e)}>Yes</Button>
      </ModalFooter>
    </Modal>
    </>
  );
}

export default TagMergeModal;
