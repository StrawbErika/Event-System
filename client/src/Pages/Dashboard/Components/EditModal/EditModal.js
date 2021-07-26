import React, { useEffect, useState } from "react";
import { Box, Button, makeStyles, Modal, Backdrop } from "@material-ui/core/";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Add, Delete } from "@material-ui/icons/";
import {
  startTimeChecker,
  endTimeChecker,
  reformatTime,
  dateChecker,
} from "../../../../utils";
import Select from "react-select";
import Guest from "../Guest/Guest";
import { api } from "../../../../api";

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

export default function EditModal({
  open,
  handleClose,
  eventDetails,
  onEditEvent,
  initUsers,
  guests,
}) {
  const classes = useStyles();
  const [guest, setGuest] = useState(null);
  const [editGuests, setEditGuests] = useState(guests);

  // TODO: part of event obj ?
  const [changed, setChanged] = useState({});
  const [date, setDate] = useState(eventDetails.date);
  const [startTime, setStartTime] = useState(eventDetails.startTime);
  const [endTime, setEndTime] = useState(eventDetails.endTime);
  const [error, setError] = useState({});

  const handleDateChange = (date) => {
    onError("date", null);
    if (dateChecker(date, onError)) {
      setChanged({ ...changed, date: true });
      setDate(date);
    }
  };

  const onError = (title, message) => {
    setError({ ...error, [title]: message });
  };

  const handleStartChange = (time) => {
    onError("startTime", null);
    setChanged({ ...changed, start: true });
    setStartTime(time);
  };

  const handleEndTime = (time) => {
    onError("endTime", null);
    setChanged({ ...changed, end: true });
    setEndTime(time);
  };

  const handleGuest = (selected) => {
    setGuest({ id: selected.value, username: selected.label });
  };

  const handleAddGuest = async () => {
    onError("guests", null);
    // TODO: check if guest is already in the list before adding
    const tempGuest = editGuests.concat(guest);
    setEditGuests(tempGuest);
    const body = {
      id: guest.id,
      author: eventDetails.author,
      event_id: eventDetails.id,
    };
    await api.post("/guest/add", body);
  };

  const handleDeleteGuest = async (delGuest) => {
    onError("guests", null);
    const tempGuest = editGuests.filter((guest) => {
      return guest.id !== delGuest.id;
    });
    if (tempGuest.length < 1) {
      onError("guests", "Please tag atleast 1 guest");
    } else {
      const body = {
        id: delGuest.id,
      };
      setEditGuests(tempGuest);
      await api.post("/guest/delete", body);
    }
  };

  const editEvent = () => {
    setError({});
    const start = reformatTime(startTime);
    const end = reformatTime(endTime);
    if (guests && guests.length < 1) {
      onError("guests", "Please tag atleast 1 guest");
    } else if (
      startTimeChecker(start, end, onError) &&
      endTimeChecker(end, start, onError)
    ) {
      // TODO: check if start time is > than currentTime
      const editEvent = {
        ...eventDetails,
        guests: editGuests,
        date: changed.date ? date.toISOString() : date,
        startTime: changed.start ? startTime.toISOString() : startTime,
        endTime: changed.end ? endTime.toISOString() : endTime,
      };
      handleClose();
      onEditEvent(editEvent);
    }
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
          <Box display="flex" flexDirection="column" p={2}>
            <Box fontSize={25} pb={2}>
              Edit Event
            </Box>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  value={date}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                {error && error.date && (
                  <Box color="red" fontSize={11}>
                    {error.date}
                  </Box>
                )}
                <Box display="flex" flexDirection="row">
                  <Box mr={2}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Start time"
                      value={startTime}
                      onChange={handleStartChange}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                    {error && error.startTime && (
                      <Box color="red" fontSize={11}>
                        {error.startTime}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="End time"
                      value={endTime}
                      onChange={handleEndTime}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                    {error && error.endTime && (
                      <Box color="red" fontSize={11}>
                        {error.endTime}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </MuiPickersUtilsProvider>
            <Box mb={2}>
              <Box mt={1} mb={1} display="flex" width="100%">
                <Box mr={1} width="100%">
                  {/* TODO:React select */}
                  <Select
                    width="200px"
                    options={initUsers}
                    onChange={handleGuest}
                  />
                </Box>
                {editGuests.length < 10 ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddGuest}
                  >
                    <Add />
                  </Button>
                ) : (
                  <Box
                    display="flex"
                    color="red"
                    alignItems="center"
                    justifyContent="center"
                  >
                    Max 10 guests
                  </Box>
                )}
              </Box>
              {error && error.guests && (
                <Box color="red" fontSize={11}>
                  {error.guests}
                </Box>
              )}
            </Box>
            {editGuests.length > 0 && (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                Guests you have invited:
                <Box>
                  {/* SCROLLABLE */}
                  {/* TODO: able to and delete */}
                  {editGuests.map((guest) => {
                    return (
                      <Guest
                        guest={guest}
                        handleDeleteGuest={handleDeleteGuest}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}
            <Box
              display="flex"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              {error && error.event && (
                <Box color="red" fontSize={11}>
                  {error.event}
                </Box>
              )}
            </Box>

            <Button onClick={editEvent}>Edit Event</Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
