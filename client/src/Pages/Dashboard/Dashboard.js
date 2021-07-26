import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core/";
import { useHistory } from "react-router-dom";
import Event from "./Components/Event/Event";
import CreateModal from "./Components/CreateModal/CreateModal";
import { Add } from "@material-ui/icons/";
import { api } from "../../api";
import { reformatGuests } from "../../utils";

export default function Dashboard() {
  let history = useHistory();

  const [openModal, setOpenModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const onClose = () => {
    setOpenModal(false);
  };
  const [initUsers, setInitUsers] = useState([]);

  const [events, setEvents] = useState([]);
  const [eventsMade, setEventsMade] = useState([]);
  const handleCreateEvent = (eventDetails) => {
    setEventsMade(eventsMade.concat(eventDetails));
  };
  const handleDeleteEvent = (id) => {
    setEventsMade(eventsMade.filter((event) => event.id !== id));
  };

  const handleEventDetails = async (eventDetails) => {
    const withoutEvent = eventsMade.filter((event) => {
      return event.id !== eventDetails.id;
    });
    setEventsMade(withoutEvent.concat(eventDetails));
    await api.post("/events/edit", {
      date: eventDetails.date,
      id: eventDetails.id,
      startTime: eventDetails.startTime,
      endTime: eventDetails.endTime,
      author: eventDetails.author,
    });
  };

  const logout = async () => {
    await api.get("/session/logout");
    history.push("/");
  };

  const initDetails = () => {
    async function run() {
      const user = await api.get("/session/whoami");
      const body = { id: user.data.id };
      const eventsCreated = await api.post("/events/readOwned", body);
      const eventsInvited = await api.post("/events/readInvited", body);
      const allUsers = await api.get("/users/read");
      const guests = allUsers.data.filter((guest) => {
        return guest.id !== user.data.id;
      });
      setEvents(eventsInvited.data);
      setEventsMade(eventsCreated.data);
      setUserDetails(user.data);
      setInitUsers(reformatGuests(guests));
    }
    run();
  };
  useEffect(initDetails, []);
  if (!userDetails || initUsers.length < 1) {
    return <></>;
  }

  return (
    <Box my={10}>
      <Box mx={3} display="flex" justifyContent="flex-end">
        <Button variant="outlined" color="secondary" onClick={logout}>
          {" "}
          Sign Out
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box mt={3} mb={5} fontSize={20} display="flex" flexDirection="column">
          <Box>
            <Box>Welcome {userDetails && userDetails.username} ,</Box>
            <Box>what would you like to do today?</Box>
          </Box>
        </Box>
        <Box></Box>
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="center"
        >
          <Box height="65vh" mr={2} py={2}>
            Here are the events you have:
            {events &&
              events.map((event) => {
                return (
                  <Event
                    key={event.id}
                    eventDetails={event}
                    initUsers={initUsers}
                  />
                );
              })}
          </Box>
          <Box ml={5}>
            <Box
              height="65vh"
              mr={2}
              py={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              Here are the events you made:
              {eventsMade &&
                eventsMade.map((event) => {
                  return (
                    <Event
                      key={event.id}
                      onEditEvent={handleEventDetails}
                      eventDetails={event}
                      onDeleteEvent={handleDeleteEvent}
                      initUsers={initUsers}
                      type="owned"
                    />
                  );
                })}
              <Box mt={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenModal(!openModal);
                  }}
                >
                  <Add />
                </Button>
              </Box>
              <CreateModal
                open={openModal}
                handleClose={onClose}
                user={userDetails && userDetails.id}
                onCreateEvent={handleCreateEvent}
                initUsers={initUsers}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
