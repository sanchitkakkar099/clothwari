import React from 'react'
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'

function UploadDesignView({modal,setModal,viewData}) {
    const toggle = () =>  {
        setModal(!modal);
      }
  return (
    <Modal isOpen={modal} toggle={toggle}>
    <ModalHeader className="text-center">
        Design Details
    </ModalHeader>
    <ModalBody >
      <Table bordered size='lg'>
        <tbody>
          <tr>
            <th style={{ width: "20%" }}>Design Name</th>
            <td style={{ width: "80%" }}>{viewData?.name}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Design Number</th>
            <td style={{ width: "80%" }}>{viewData?.designNo}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Category</th>
            <td style={{ width: "80%" }}>{viewData?.category?.label}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Tag</th>
            <td style={{ width: "80%" }}>{viewData?.tag && Array.isArray(viewData?.tag) && viewData?.tag?.length > 0  ?  viewData?.tag?.map(el => el?.label)?.join(',') : ''}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Main File</th>
            <td style={{ width: "80%" }}>{viewData?.image ? <img src={viewData?.image?.filepath} height={50} width={50} alt='img'/> : ''}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Thumbnail File</th>
            <td style={{ width: "80%" }}>{viewData?.thumbnail ? <img src={viewData?.thumbnail?.filepath} height={50} width={50} alt='img'/> : ''}</td>
          </tr>
        </tbody>
      </Table>
    </ModalBody>
  <ModalFooter>
    <Button color='secondary' onClick={toggle}>Close</Button>
  </ModalFooter>
  </Modal>
  )
}

export default UploadDesignView
