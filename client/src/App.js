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
import User from "./components/UserProfile/User";
import UserProfile from "./components/UserProfile/UserProfile";
import { useAuth } from './customHooks/auth-hook';
import Welcome from "./components/landingpage/Welcome";
import {Footer, Blog, Possibility, Features, WhatGP3T, Header} from './containers';
import {CTA, Brand, Navbar} from './components/landingpage';
import Header2 from "./containers/header/Header2";
import Header3  from "./containers/header/Header3";

import './App.css';

const App = () => {
  const { token, login, logout, userId} = useAuth();


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
          <User />
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
        <Route path="/" exact>
        <div className="App">
        <div className="gradient_bg">
        <Navbar />
        <Header/>
        <Header2 />
        <Header3 />
        </div>
        </div>
        </Route>
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
      <div className="gradient__bg">
        <main>{routes}</main>
        </div>
      </Router>

      
    </AuthContext.Provider>
  );
};

export default App;


//Will use later
//<Route path="/Auth" exact>
//<Auth />
//</Route>
//<Redirect to="/Auth" />



/**
 * <div className="App">
        <div className="gradient_bg">
        <Switch>
          <Route path="/" exact>
            <Welcome />
          </Route>
        </Switch>
        <Switch>
          <Route path="/login" exact>
            <Auth />
          </Route>
        </Switch>
        </div>
        <Brand/>
        <WhatGP3T/>
        <Features/>
        <Possibility/>
        <CTA/>
        <Blog/>
        <Footer/>
      </div>
 */

      /**
       *    <Router>
      <div className="App">
      <div className="gradient__bg">
        <Navbar />
        <Header/>
        <main>{routes}</main>
        </div>
        </div>
      </Router>
    </AuthContext.Provider>
       */