import React, { useState } from "react";
import { TextField, Box, Button } from "@material-ui/core/";
import { useHistory, Link } from "react-router-dom";
import { api } from "../../api";

export default function SignUp() {
  let history = useHistory();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const handleFieldChange = (e) => {
    setError(null);
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async () => {
    if (user.username && user.password) {
      let body = { username: user.username, password: user.password };
      await api.post("/session/signup", body);
      history.push("/");
    } else {
      setError("Input user/password in the fields");
    }
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
            label="User Name"
            name="username"
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
      <Button variant="contained" color="primary" onClick={handleSignUp}>
        Sign Up
      </Button>
      <Box mt={2}>
        {error && (
          <Box color="red" fontSize={15}>
            {error}
          </Box>
        )}
      </Box>

      <Box marginTop={2}>
        <Link to="/"> Already have an account?</Link>
      </Box>
    </Box>
  );
}
