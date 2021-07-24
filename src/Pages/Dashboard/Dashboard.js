import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Event from "./Components/Event/Event";
import EventModal from "./Components/EventModal/EventModal";
import { Add } from "@material-ui/icons/";

export default function Dashboard({ userDetails }) {
  const [openModal, setOpenModal] = useState(false);
  const onClose = () => {
    setOpenModal(false);
  };
  const events = [
    {
      start: "8am",
      end: "4pm",
      date: "July 23, 2021",
      author: "Me",
    },
    {
      start: "8am",
      end: "12am",
      date: "July 23, 2021",
      author: "Not Me",
    },
  ];
  return (
    <Box my={10}>
      <Box mx={3} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            console.log("signing out aight");
          }}
        >
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
            <Box>Welcome {userDetails.name} ,</Box>
            <Box>what would you like to do today?</Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="center"
        >
          <Box height="65vh" mr={2} py={2}>
            Here are the events you have:
            {events.map((event) => {
              return <Event eventDetails={event} />;
            })}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <Add />
            </Button>
            <EventModal open={openModal} handleClose={onClose} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
