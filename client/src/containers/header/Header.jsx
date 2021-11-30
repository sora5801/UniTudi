import React from 'react';
import people from '../../assets/people.png';
import ai from '../../assets/ai2.png';
import './Header.css';

const Header = () => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Let&apos;s get organized!</h1>
      <p>University student's let us get productive.</p>

      <div className="gpt3__header-content__input">
        <input type="email" placeholder="Your Email Address" />
        <button type="button">Free Resources</button>
      </div>

      <div className="gpt3__header-content__people">
        <img src={people} />
        <p>Monthly updates on the tools and free resources.</p>
      </div>
    </div>

    <div className="gpt3__header-image">
      <img src={ai} />
    </div>
  </div>
);

export default Header;