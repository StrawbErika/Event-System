import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { useHistory, Link } from "react-router-dom";

export default function SignUp() {
  let history = useHistory();

  const [user, setUser] = useState(null);

  const handleFieldChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      my={35}
    >
      <Box marginBottom={3} fontSize={20}>
        Signup here
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom={1}
      >
        <Box marginBottom={1}>
          <TextField
            label="Email"
            name="email"
            type="email"
            onChange={handleFieldChange}
            variant="outlined"
          />
        </Box>
        <Box marginBottom={1}>
          <TextField
            label="User Name"
            name="name"
            onChange={handleFieldChange}
            variant="outlined"
          />
        </Box>
        <Box>
          <TextField
            label="Password"
            name="password"
            onChange={handleFieldChange}
            variant="outlined"
            type="password"
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          console.log("hehe signup");
        }}
      >
        Sign Up
      </Button>

      <Box marginTop={2}>
        <Link to="/login"> Already have an account?</Link>
      </Box>
    </Box>
  );
}
