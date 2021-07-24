import React, { useEffect, useState } from "react";
import { Box, Paper, Button } from "@material-ui/core/";
import { Edit, Delete } from "@material-ui/icons/";
export default function Event({ eventDetails, type }) {
  return (
    <Box my={2}>
      <Paper>
        <Box display="flex" flexDirection="column" p={2}>
          <Box>
            {eventDetails.startTime} : {eventDetails.endTime}
          </Box>
          <Box>{eventDetails.date}</Box>
          {type !== "owned" && <Box>Author: {eventDetails.author}</Box>}

          {type === "owned" && (
            <Box
              display="flex"
              flexDirection="row"
              mt={1}
              justifyContent="space-between"
            >
              <Button>
                <Edit />
              </Button>
              <Button>
                <Delete />
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
