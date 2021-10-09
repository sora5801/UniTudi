import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from './components/Login/Auth';
import MainNavigation from './components/Navigation/MainNavigation';
import { AuthContext } from "./components/context/auth-context";
import AddTask from "./components/Tasks/AddTask";
import UserProfile from "./components/UserProfile/UserProfile";
import Tasks from "./components/Tasks/Tasks";
import UpdateTask from "./components/Tasks/UpdateTask";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      login: login,
      logout: logout
    }}
    >
    <Router>
    <MainNavigation />
    <main>{routes}</main> 
  </Router>
  </AuthContext.Provider>
    );
}

export default App;
