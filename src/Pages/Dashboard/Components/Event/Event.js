import React, { useEffect, useState } from "react";
import { Box, Paper } from "@material-ui/core/";
export default function Event({ eventDetails }) {
  return (
    <Box my={2}>
      <Paper>
        <Box display="flex" flexDirection="column" p={2}>
          <Box>
            {eventDetails.start} : {eventDetails.end}
          </Box>
          <Box>{eventDetails.date}</Box>
          <Box>Author: {eventDetails.author}</Box>
        </Box>
      </Paper>
    </Box>
  );
}
