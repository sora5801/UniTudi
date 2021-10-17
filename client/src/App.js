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
import Tasks from "./components/Tasks/Tasks";
import UpdateTask from "./components/Tasks/UpdateTask";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if(isLoggedIn){
    routes = (<Switch>
      <Route path="/:userId/tasks" exact>
          <Tasks/>
        </Route>
        <Route path="/tasks/new" exact>
          <AddTask />
        </Route>
        <Route path="/tasks/:taskId">
          <UpdateTask />
        </Route>
        <Redirect to="/tasks/new"/>
    </Switch>);
     
  } else {
    routes = (
      <Switch>
        <Route path="/Auth" exact>
          <Auth />
        </Route>
        <Redirect to="/Auth" />
    </Switch>
    )
    
  }

 

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
