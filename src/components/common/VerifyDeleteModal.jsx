import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function VerifyDeleteModal({
  showModal,
  setShowModal,
  modalDetails,
  confirmAction,
}) {
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <Modal isOpen={showModal} centered toggle={() => closeModal()}>
      <ModalHeader>{modalDetails?.title}</ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={() => closeModal()}>
          No
        </Button>
        <Button color="primary" onClick={() => confirmAction(modalDetails?.id)}>
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default VerifyDeleteModal;
