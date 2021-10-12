import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Login from './components/Login/Login';
import {Content} from './components/Tasks/Content';
import MainNavigation from './components/Navigation/MainNavigation';
import { AuthContext } from "./components/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if(isLoggedIn){
    routes = (<Switch>
        <Content />
    </Switch>);
  } else {
    routes = (
      <Switch>
        <Route path="/Login" exact>
          <Login />
        </Route>
        <Redirect to="/Login" />
    </Switch>
    )
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
    <Router>
    <MainNavigation />
    <main>{routes}</main> 
  </Router>
  </AuthContext.Provider>
    );
}

export default App;
