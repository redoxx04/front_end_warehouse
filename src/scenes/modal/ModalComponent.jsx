import React, { useState } from "react";
import { Modal } from "@mui/material";

const ModalComponent = ({ isOpen, handleClose, children}) => {

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {React.cloneElement(children, { handleClose })}
        {/* {children} */}
      </Modal>
    </div>
  );
};

export default ModalComponent;
