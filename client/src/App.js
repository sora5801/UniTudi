import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from "./components/Login/Auth";
import MainNavigation from "./components/Navigation/MainNavigation";
import { AuthContext } from "./components/context/auth-context";
import AddTask from "./components/Tasks/AddTask";
import Tasks from "./components/Tasks/Tasks";
import UpdateTask from "./components/Tasks/UpdateTask";
import UserProfile from "./components/UserProfile/UserProfile";
import { useAuth } from './customHooks/auth-hook';


const App = () => {
  const { token, login, logout, userId } = useAuth();


  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/:userId/tasks" exact>
          <Tasks />
        </Route>
        <Route path="/tasks/new" exact>
          <AddTask />
        </Route>
        <Route path="/:userId/profile" exact>
          <UserProfile />
        </Route>

        <Route path="/tasks/:taskId">
          <UpdateTask />
        </Route>
        <Route path="/:userId/edit">
          <UserProfile />
        </Route>
        <Redirect to="/tasks/new" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/Auth" exact>
          <Auth />
        </Route>
        <Redirect to="/Auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
