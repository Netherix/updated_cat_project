import React from 'react';
import Button from '../Button/Button';
import './Favorites.css';

const Favorites = ({ favorites, onRemoveFavorite }) => {
  return (
    <div className="Favorites">
      <h3>Favorites</h3>
      {favorites.map((image) => (
        <div key={image.id}>
          <div className="test">
          <img 
            src={image.url}
            alt={image.name}
          />
          </div>
          <div className="button-container">
            <Button
              text="Remove Favorites"
              onClick={() => onRemoveFavorite(image)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
