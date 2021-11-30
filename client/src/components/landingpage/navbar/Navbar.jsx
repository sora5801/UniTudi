import React, { useState } from 'react';
import {Link} from 'react-router-dom';
//import { browserHistory} from "react-router";
import {useHistory} from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../../assets/logo4.svg';
import './Navbar.css';


const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_container">
          <p><Link to={"/"}>Home</Link></p>
          <p><a href="#learn more">learn more</a></p>
          <p><a href="#features">features</a></p>
          <p><a href="#testimonials">testimonials</a></p>
          <p><a href="#blog">blog</a></p>
        </div>
      </div>
  
      <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><a href="#home">Home</a></p>
            
            <p><a href="#learn more">What is GPT3?</a></p>
            <p><a href="#features">Open AI</a></p>
            <p><a href="#testimonials">Case Studies</a></p>
            <p><a href="#blog">Library</a></p>
          </div>
          <div className="gpt3__navbar-menu_container-links-sign">
            <p>Sign in</p>
            <button type="button">Sign up</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;






