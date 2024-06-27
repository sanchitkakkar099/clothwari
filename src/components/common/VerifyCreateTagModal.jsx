import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function VerifyCreateTagModal({
  showModal,
  setShowModal,
  modalDetails,
  confirmAction,
}) {
    console.log("modalDetails",modalDetails)
  const closeModal = () => {
    setShowModal(false);
  };
  const confirmActionModal = ()  => {
    confirmAction(modalDetails);
    setShowModal(false);
  }
  return (
    <Modal isOpen={showModal} centered toggle={() => closeModal()}>
      <ModalHeader>{modalDetails?.label}</ModalHeader>
      <ModalBody>
        <p>Are you sure you wan to create new tag?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={() => closeModal()}>
          No
        </Button>
        <Button color="primary" onClick={() => confirmActionModal()}>
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default VerifyCreateTagModal;
