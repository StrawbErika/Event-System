import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { api } from "./api";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [sessionIsFetched, setSessionIsFetched] = useState(false);
  const initUser = () => {
    async function run() {
      const user = await api.get("/session/whoami");
      setUserDetails(user.data);
      setSessionIsFetched(true);
    }
    run();
  };

  const handleLogin = async (user, setError) => {
    if (user.username && user.password) {
      let body = { username: user.username, password: user.password };
      const userRes = await api.post("/session/login", body);
      setUserDetails(userRes.data);
    } else {
      setError("Input user/password in the fields");
    }
  };

  const handleLogout = () => {
    setUserDetails(null);
  };

  useEffect(initUser, []);
  if (!sessionIsFetched) {
    return <> </>;
  }
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {userDetails ? (
              <Dashboard userDetails={userDetails} onLogout={handleLogout} />
            ) : (
              <Login handleLogin={handleLogin} />
            )}
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
