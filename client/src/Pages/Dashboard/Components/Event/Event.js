import React, { useEffect, useState } from "react";
import { Box, Paper, Button } from "@material-ui/core/";
import { Edit, Delete } from "@material-ui/icons/";
import { reformatTime, reformatDate } from "../../../../dateUtils";
import EditModal from "../EditModal/EditModal";
import DeleteModal from "../DeleteModal/DeleteModal";
export default function Event({ eventDetails, onEditEvent, type }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const onClose = () => {
    setOpenModal(false);
  };
  const onCloseDelete = () => {
    setOpenDeleteModal(false);
  };
  // TODO: instead of using display, use hour and minute so can display in AM PM
  const start = reformatTime(eventDetails.startTime).display;
  const end = reformatTime(eventDetails.endTime).display;
  const date = reformatDate(eventDetails.date);
  return (
    <Box my={2}>
      <Paper>
        <Box display="flex" flexDirection="column" p={2}>
          <Box>
            {start} to {end}
          </Box>
          <Box>{date}</Box>
          {type !== "owned" && <Box>Author: {eventDetails.author}</Box>}

          {type === "owned" && (
            <Box
              display="flex"
              flexDirection="row"
              mt={1}
              justifyContent="space-between"
            >
              <Button
                onClick={() => {
                  setOpenModal(!openModal);
                }}
              >
                <Edit />
              </Button>
              <Button
                onClick={() => {
                  setOpenDeleteModal(!openDeleteModal);
                }}
              >
                <Delete />
              </Button>
            </Box>
          )}
          <EditModal
            open={openModal}
            handleClose={onClose}
            eventDetails={eventDetails}
            onEditEvent={onEditEvent}
          />
          <DeleteModal open={openDeleteModal} handleClose={onCloseDelete} />
        </Box>
      </Paper>
    </Box>
  );
}
