import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'

function SalesPersonView({modal,setModal,viewData}) {
    const toggle = () =>  {
        setModal(!modal);
      }
  return (
    <Modal isOpen={modal} toggle={toggle}>
    <ModalHeader className="text-center">
        Sales Person Details
    </ModalHeader>
    <ModalBody >
      <Table bordered>
        <tbody>
          <tr>
            <th style={{ width: "20%" }}>Name</th>
            <td style={{ width: "80%" }}>{viewData?.name}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Email</th>
            <td style={{ width: "80%" }}>{viewData?.email}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Phone</th>
            <td style={{ width: "80%" }}>{viewData?.phone}</td>
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

export default SalesPersonView
