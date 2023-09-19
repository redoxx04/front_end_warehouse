import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ModalComponent = ({ isOpen, handleClose, children, width = 800 }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [searchParams, setSearchParams] = useSearchParams();

  return (

    <Modal
    onBackdropClick={()=>{
      searchParams.delete('id')
      setSearchParams(searchParams)
    }}
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
