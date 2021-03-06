import React, { useState } from "react";
import { Box, Button, makeStyles, Modal, Backdrop } from "@material-ui/core/";
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
  reformatDate,
  removeUsers,
} from "../../../../utils";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";
import { api } from "../../../../api";
import Select from "react-select";

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

export default function CreateModal({
  open,
  handleClose,
  user,
  onCreateEvent,
  initUsers,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const onClose = () => {
    setOpenSnackbar(false);
  };

  const classes = useStyles();
  const [guest, setGuest] = useState(null);
  const [guests, setGuests] = useState([]);
  const [users, setUsers] = useState(removeUsers(initUsers, []));

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [error, setError] = useState({});

  const handleDateChange = (date) => {
    onError("event", null);
    onError("date", null);
    const dateString = reformatDate(date);
    if (dateChecker(date, onError)) {
      setDate(dateString);
    }
  };

  const onError = (title, message) => {
    setError({ ...error, [title]: message });
  };

  const handleStartChange = (time) => {
    onError("event", null);
    onError("startTime", null);
    setStartTime(time);
  };

  const handleEndTime = (time) => {
    onError("event", null);
    onError("endTime", null);
    setEndTime(time);
  };

  const handleAddGuest = () => {
    onError("event", null);
    onError("guests", null);
    const tempGuest = guests.concat(guest);
    const tempUsers = users.filter((user) => {
      return user.id !== guest.id;
    });
    setUsers(removeUsers(tempUsers, tempGuest));
    setGuests(tempGuest);
  };

  const handleGuest = (selected) => {
    setGuest({ id: selected.value, username: selected.label });
  };

  const createEvent = async () => {
    setError({});

    const currentTs = new Date().getTime() / 1000;
    const startTs = new Date(startTime).getTime() / 1000;
    if (startTs < currentTs) {
      onError("event", "Cannot create event with past time");
    } else {
      onError("event", null);
      const start = reformatTime(startTime);
      const end = reformatTime(endTime);
      if (guests.length < 1) {
        onError("guests", "Please tag atleast 1 guest");
      } else if (
        startTimeChecker(start, end, onError) &&
        endTimeChecker(end, start, onError)
      ) {
        const eventDetails = {
          date: new Date(date).toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          author: user,
          guests: guests,
        };
        const response = await api.post("/events/create", eventDetails);
        handleClose();
        setOpenSnackbar(!openSnackbar);
        onCreateEvent({ ...eventDetails, id: response.data.id });
        emptyFields();
      }
    }
  };

  const emptyFields = () => {
    setGuests([]);
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setGuest(null);
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
                  <Select
                    width="200px"
                    options={users}
                    onChange={handleGuest}
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
                    return (
                      <Box my={1} key={guest.id}>
                        {guest.username}
                      </Box>
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

            <Button onClick={createEvent}>Create Event</Button>
          </Box>
        </div>
      </Modal>
      <SimpleSnackbar
        open={openSnackbar}
        handleClose={onClose}
        message="Event has been created"
      />
    </div>
  );
}
