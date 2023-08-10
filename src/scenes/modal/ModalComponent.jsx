import React, { useState } from "react";
import { Box, Modal } from "@mui/material";

const ModalComponent = ({ isOpen, handleClose, children }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{React.cloneElement(children, { handleClose })}</Box>
    </Modal>
  );
};

export default ModalComponent;
