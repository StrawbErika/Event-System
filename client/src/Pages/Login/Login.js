import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { useHistory, Link } from "react-router-dom";
import { api } from "../../api";
export default function Login() {
  let history = useHistory();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleFieldChange = (e) => {
    setError(null);
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (user.username && user.password) {
      let body = { username: user.username, password: user.password };
      await api.post("/session/login", body);
      history.push("/dashboard");
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
      my={40}
    >
      <Box marginBottom={3} fontSize={20}>
        Login Here
      </Box>

      <Box display="flex" flexDirection="column" marginBottom={3}>
        <Box marginBottom={1}>
          <TextField
            label="Username"
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
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
      <Box mt={2}>
        {error && (
          <Box color="red" fontSize={15}>
            {error}
          </Box>
        )}
      </Box>
      <Box marginTop={2}>
        <Link to="/signup"> Don't have an account?</Link>
      </Box>
    </Box>
  );
}
