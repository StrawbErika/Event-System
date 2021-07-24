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

export default function EventModal({ open, handleClose }) {
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
    setError({ ...error, date: null });
    const today = new Date();
    const todayTime = today.getTime();
    const dateTime = date.getTime(date) + 23 * 60 * 60 * 1000; //Adds 23hrs into the date (since date's time is always 00)
    if (todayTime > dateTime) {
      setError({ ...error, date: "Cannot create an event in the past" });
    } else {
      const dateString = date.toString().substring(0, 15);
      setDate(dateString);
    }
  };

  const handleStartChange = (time) => {
    setError({ ...error, startTime: null });
    const outputTime = reformatTime(time);
    if (outputTime.hour < 8) {
      setError({ ...error, startTime: "Cannot create before 8" });
    } else if (endTime && outputTime.hour > reformatTime(endTime.obj).hour) {
      setError({
        ...error,
        startTime: "Cannot have start time after end time",
      });
    } else if (
      endTime &&
      outputTime.hour === reformatTime(endTime.obj).hour &&
      (outputTime.minute > reformatTime(endTime.obj).minute ||
        outputTime.minute === reformatTime(endTime.obj).minute)
    ) {
      setError({
        ...error,
        startTime: "Cannot have start time after end time",
      });
    } else {
      setStartTime({ display: outputTime.display, obj: time });
    }
  };

  const handleEndTime = (time) => {
    setError({ ...error, endTime: null });
    const outputTime = reformatTime(time);
    if (
      outputTime.hour > 20 ||
      (outputTime.hour === 20 && outputTime.minute > 0)
    ) {
      setError({ ...error, endTime: "Cannot create past 8" });
    } else if (
      outputTime.hour < 8 ||
      (outputTime.hour === 8 && outputTime.minute === 0)
    ) {
      setError({ ...error, endTime: "Cannot create before 8" });
    } else if (
      startTime &&
      outputTime.hour < reformatTime(startTime.obj).hour
    ) {
      setError({
        ...error,
        endTime: "Cannot have end time after start time",
      });
    } else if (
      startTime &&
      outputTime.hour === reformatTime(startTime.obj).hour &&
      (outputTime.minute < reformatTime(startTime.obj).minute ||
        outputTime.minute === reformatTime(startTime.obj).minute)
    ) {
      setError({
        ...error,
        endTime: "Cannot have end time after start time",
      });
    } else {
      setEndTime({ display: outputTime.display, obj: time });
    }
  };

  const reformatTime = (time) => {
    let timeString = time.toString().substring(16, 24);
    const timeSplit = timeString.split(":");
    const hour = timeSplit[0];
    const minute = timeSplit[1];
    return {
      display: timeString,
      hour: parseInt(hour),
      minute: parseInt(minute),
    };
  };

  const handleGuest = (e) => {
    //   TODO: the only choices are the users
    setGuest(e.target.value);
  };

  const handleAddGuest = () => {
    setError({
      ...error,
      guests: null,
    });
    if (!guest || guest === " ") {
      setError({
        ...error,
        guests: "Guest field cannot be empty",
      });
    } else {
      const tempGuest = guests.concat(guest);
      setGuests(tempGuest);
    }
  };

  const createEvent = () => {
    if (guests.length < 1) {
      setError({
        ...error,
        guests: "Please tag atleast 1 guest",
      });
    } else {
      const eventDetails = {
        ...event,
        guests: guests,
        date: date,
        startTime: startTime,
        endTime: endTime,
      };
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
