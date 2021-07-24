import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Event from "./Components/Event/Event";
import CreateModal from "./Components/CreateModal/CreateModal";
import { Add } from "@material-ui/icons/";

export default function Dashboard({ userDetails }) {
  const [openModal, setOpenModal] = useState(false);
  const onClose = () => {
    setOpenModal(false);
  };
  const events = [
    {
      startTime: "8am",
      endTime: "4pm",
      date: "July 23, 2021",
      author: "Me",
      guests: ["1"],
      id: "",
    },
    {
      startTime: "8am",
      endTime: "12am",
      date: "July 23, 2021",
      author: "Not Me",
      guests: ["1", "2"],
      id: "",
    },
  ];
  const eventsMade = [
    {
      startTime: "8am",
      endTime: "12am",
      date: "July 23, 2021",
      author: "Not Me",
      guests: ["1", "2"],
      id: "",
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
        <Box></Box>
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
          </Box>
          <Box ml={5}>
            <Box height="65vh" mr={2} py={2}>
              Here are the events you made:
              {eventsMade.map((event) => {
                return <Event eventDetails={event} type="owned" />;
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
              <CreateModal
                open={openModal}
                handleClose={onClose}
                user={userDetails.name}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
