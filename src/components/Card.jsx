import React from 'react';
import '../styles/Card.css';
// import options from './assets/3 dot menu.svg';
import circle from './assets/image.png';
import urgent from './assets/SVG - Urgent Priority colour.svg';
import high from './assets/Img - High Priority.svg';
import medium from './assets/Img - Medium Priority.svg';
import low from './assets/Img - Low Priority.svg';
import nopriority from './assets/3 dot menu.svg';

function Card({ id, title, tag, priority }) {
 
  const getPriorityIcon = () => {
    switch (priority) {
      case 4:
        return urgent;
      case 3:
        return high;
      case 2:
        return medium;
      case 1:
        return low;
      default:
        return nopriority;
    }
  };

  return (
    <div className='card'>
    
      <span className='same-line'>
        <p className='card-header'>{id}</p>
    
      </span>
      <p className='card-title'>{title}</p>

      <span className='card-bottom'>
        <img src={getPriorityIcon()} alt="Priority" className='card-priority' />
        
        {tag.length > 0 && (
          <span className='card-tag'>
            {/* console.log(tag); */}
            <img src={circle} alt="Tag Icon" /> {tag[0]}
          </span>
        )}
      </span>
    </div>
  );
}

export default Card;
