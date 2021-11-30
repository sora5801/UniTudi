import React from 'react';
import people from '../../assets/people.png';
import pic from '../../assets/ai2.png';
import pexels from '../../assets/pexels-cottonbro-.jpg';
import './Header2.css';

const Header2 = () => (
  <div className="gpt3__header section__padding" id="home">
    
      <div className="gpt3__header-image">
      <img src={pic} />
    </div>
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Completely Free!</h1>
      <p>The leading software in helping university students get more done.</p>
      </div>
    
  </div>
  
    
 
);

export default Header2;