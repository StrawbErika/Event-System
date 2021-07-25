import React, { useEffect, useState } from "react";
import { Box, Button, makeStyles, Modal, Backdrop } from "@material-ui/core/";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "none",
    width: 300,

    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 10,
  },
}));

export default function DeleteModal({ open, handleClose }) {
  const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const onClose = () => {
    setOpenSnackbar(false);
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paper}>
          <Box
            display="flex"
            flexDirection="column"
            p={2}
            justifyContent="center"
            alignItems="center"
          >
            <Box fontSize={25} pb={1}>
              Deleting Event
            </Box>
            <Box fontSize={18}>Are you sure you want to delete?</Box>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleClose}>cancel</Button>

            <Button
              color="secondary"
              onClick={() => {
                handleClose();
                setOpenSnackbar(!openSnackbar);
              }}
            >
              delete
            </Button>
          </Box>
        </div>
      </Modal>
      <SimpleSnackbar
        open={openSnackbar}
        handleClose={onClose}
        message="Event has been deleted"
      />
    </div>
  );
}
