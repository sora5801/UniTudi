import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import {Link} from 'react-router-dom';

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/tasks`}>MY TASKS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
      <li>
        <NavLink to="/tasks/new">ADD TASKS</NavLink>
      </li>)}
      {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${auth.userId}/profile`}>MY PROFILE</NavLink>
      </li>)}
      {!auth.isLoggedIn && (<div className="gpt3__navbar-sign">
        <p><Link to={"/Auth"}>Sign in</Link></p>
        <button type="button">Sign up</button>
      </div>)}
      {auth.isLoggedIn && (<li>
          <button onClick={auth.logout}>LOGOUT</button>
      </li>)}
    </ul>
  );
};

export default NavLinks;
