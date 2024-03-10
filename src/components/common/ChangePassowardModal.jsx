import React, { useEffect, useState } from 'react'
import { Button, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useChangePasswordBySuperAdminMutation } from '../../service'
import toast from 'react-hot-toast'
function ChangePassowardModal({pwdUser,setPwdUser,onChangePWDCloseAction,pwdText,setPwdText}) {
  
  const [reqChangesPwd,resChangesPwd] = useChangePasswordBySuperAdminMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    reqChangesPwd({
        userId: pwdUser?._id,
        password: pwdText
    })
  }

  useEffect(() => {
    if(resChangesPwd?.isSuccess){
        toast.success('Password Change Successfully',{
            position:'top-center'
        })
        setPwdUser(null)
        setPwdText(null)
    }
    if(resChangesPwd?.isError){
        toast.error('Something went wrong',{
            position:'top-center'
        })
        setPwdUser(null)
        setPwdText(null)
    }
  },[resChangesPwd?.isSuccess,resChangesPwd?.isError])

  return (
    <Modal isOpen={pwdUser ? true : false} centered toggle={onChangePWDCloseAction}>
    <ModalHeader className="text-center">
        Change password for {pwdUser?.name}
    </ModalHeader>
    <ModalBody>
    <Label htmlFor="exampleEmail">
      Password
    </Label>
    <Input onChange={(e) => setPwdText(e.target.value)} />
    {/* <FormFeedback>
      Oh noes!
    </FormFeedback> */}
    </ModalBody>
    <ModalFooter>
    <Button color='secondary' onClick={onChangePWDCloseAction}>Close</Button>
    <Button color='primary' onClick={(e) => handleSubmit(e)} disabled={!pwdText}>Submit</Button>

  </ModalFooter>
    </Modal>
  )
}

export default ChangePassowardModal
