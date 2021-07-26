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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkLogin = async () => {
    async function run() {
      const user = await api.get("/session/whoami");
      setIsLoggedIn(user ? true : false);
    }
    run();
  };
  useEffect(checkLogin, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/dashboard">
            {isLoggedIn === true ? <Dashboard /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
// passport js for auth

export default App;
