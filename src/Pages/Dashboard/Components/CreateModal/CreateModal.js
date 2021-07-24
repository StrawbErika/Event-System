import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  makeStyles,
  Modal,
  Backdrop,
} from "@material-ui/core/";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Add } from "@material-ui/icons/";
import {
  startTimeChecker,
  endTimeChecker,
  reformatTime,
  dateChecker,
} from "../../../../dateUtils";

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

export default function CreateModal({ open, handleClose, userDetails }) {
  const classes = useStyles();
  const [guest, setGuest] = useState(null);
  const [guests, setGuests] = useState([]);
  const [event, setEvent] = useState(null);

  // TODO: part of event obj ?
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState({ obj: new Date() });
  const [endTime, setEndTime] = useState({ obj: new Date() });
  const [error, setError] = useState({});

  const handleDateChange = (date) => {
    onError("date", null);
    if (dateChecker(date, onError)) {
      const dateString = date.toString().substring(0, 15);
      setDate(dateString);
    }
  };

  const onError = (title, message) => {
    setError({ ...error, [title]: message });
  };

  const handleStartChange = (time) => {
    onError("startTime", null);
    const outputTime = reformatTime(time);
    const reformatEnd = reformatTime(endTime.obj);
    if (startTimeChecker(outputTime, reformatEnd, onError)) {
      setStartTime({ display: outputTime.display, obj: time });
    }
  };

  const handleEndTime = (time) => {
    onError("endTime", null);
    const outputTime = reformatTime(time);
    const reformatStart = reformatTime(startTime.obj);
    if (endTimeChecker(outputTime, reformatStart, onError)) {
      setEndTime({ display: outputTime.display, obj: time });
    }
  };

  const handleGuest = (e) => {
    //   TODO: the only choices are the users
    setGuest(e.target.value);
  };

  const handleAddGuest = () => {
    onError("guests", null);
    if (!guest || guest === " ") {
      onError("guests", "Guest field cannot be empty");
    } else {
      const tempGuest = guests.concat(guest);
      setGuests(tempGuest);
    }
  };

  const createEvent = () => {
    if (guests.length < 1) {
      onError("guests", "Please tag atleast 1 guest");
    } else {
      const eventDetails = {
        ...event,
        guests: guests,
        date: date,
        startTime: startTime,
        endTime: endTime,
        author: userDetails,
        // create uid
      };
      setEvent(eventDetails);
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
              Create an Event
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
                      value={startTime.obj}
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
                      value={endTime.obj}
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
              <Box
                mt={1}
                mb={1}
                display="flex"
                justifyContent="center"
                width="100%"
              >
                <Box mr={1}>
                  {/* TODO:React select */}
                  <TextField
                    label="Invite a guest"
                    onChange={handleGuest}
                    value={guest || ""}
                    name="guest"
                    variant="outlined"
                  />
                </Box>
                {guests.length < 10 ? (
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
            {guests.length > 0 && (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                Guests you have invited:
                <Box>
                  {/* SCROLLABLE */}
                  {guests.map((guest) => {
                    return <Box my={1}>{guest}</Box>;
                  })}
                </Box>
              </Box>
            )}

            <Button onClick={createEvent}>Create Event</Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
