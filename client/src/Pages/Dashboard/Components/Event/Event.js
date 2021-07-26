import React, { useEffect, useState } from "react";
import { Box, Paper, Button } from "@material-ui/core/";
import { Edit, Delete } from "@material-ui/icons/";
import EditModal from "../EditModal/EditModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { api } from "../../../../api";
import { DateTime } from "luxon";

export default function Event({
  eventDetails,
  onEditEvent,
  onDeleteEvent,
  type,
  initUsers,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [init, setInit] = useState(false);
  const [guests, setGuests] = useState([]);
  const onClose = () => {
    setOpenModal(false);
  };

  // move to formatter
  const initStart = DateTime.fromISO(eventDetails.startTime).toLocaleString(
    DateTime.DATETIME_MED
  );
  const initEnd = DateTime.fromISO(eventDetails.endTime).toLocaleString(
    DateTime.DATETIME_MED
  );
  const start = initStart.split(",")[2];
  const end = initEnd.split(",")[2];
  const date = DateTime.fromISO(eventDetails.date).toLocaleString();

  const handleDelete = async () => {
    setOpenDeleteModal(false);
    onDeleteEvent(eventDetails.id);
    const body = { id: eventDetails.id };
    await api.post("/events/delete", body);
  };

  const initGuests = () => {
    async function run() {
      const body = { id: eventDetails.id };
      const guestsRes = await api.post("/guest/read", body);
      setGuests(guestsRes.data);
      setInit(true);
    }
    run();
  };
  useEffect(initGuests, []);
  if (!init) {
    return <></>;
  }
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
            initUsers={initUsers}
            guests={guests}
          />
          <DeleteModal open={openDeleteModal} handleClose={handleDelete} />
        </Box>
      </Paper>
    </Box>
  );
}
