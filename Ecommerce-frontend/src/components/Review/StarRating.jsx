import React, { useState } from 'react';


const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (value) => {
    setRating(value);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoverRating || rating) ? 'filled' : ''}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          style={{
            cursor: 'pointer',
            fontSize: '2rem',
            margin: '0 5px',
            transition: 'color 0.2s ease-in-out',
            color: i <= (hoverRating || rating) ? '#FFD700' : '#C0C0C0',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="star-rating d-flex justify-content-center">
      {renderStars()}
    </div>
  );
};

export default StarRating;
