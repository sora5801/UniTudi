import React from 'react';
import people from '../../assets/people.png';
import pic from '../../assets/ai2.png';
import './Header.css';

const Header = () => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Let&apos;s get organized!</h1>
      <p>University students, let's get productive.</p>

      <div className="gpt3__header-content__input">
        <input type="email" placeholder="Your Email Address" />
        <button type="button">Free Resources</button>
      </div>

      <div className="gpt3__header-content__people">
        <img src={people} />
        <p>Monthly email news letters telling you about all the latest productivity tools and hacks.</p>
      </div>
    </div>

  </div>

 
);

export default Header;