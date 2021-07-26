import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core/";
import { Delete } from "@material-ui/icons/";

export default function Guest({ guest, handleDeleteGuest }) {
  return (
    <div>
      <Box my={1} display="flex" alignItems="center">
        {guest.username}
        <Button
          onClick={() => {
            handleDeleteGuest(guest);
          }}
        >
          <Delete />
        </Button>
      </Box>
    </div>
  );
}
