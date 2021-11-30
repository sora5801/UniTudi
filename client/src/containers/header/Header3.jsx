import React from 'react';
import people from '../../assets/people.png';
import pic from '../../assets/ai2.png';
import pexels from '../../assets/pexels-cottonbro-.jpg';
import './Header3.css';

const Header2 = () => (
  <div className="gpt3__header section__padding" id="home">
    
      <div className="gpt3__header-image">
      <img src={pexels} />
    </div>
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Follow us on our blog!</h1>
      </div>
    
  </div>
  
    
 
);

export default Header2;