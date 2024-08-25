import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Components/Search/Search';
import Pagination from './Components/Pagination/Pagination';
import Sorting from './Components/Sorting/Sorting';
import Favorites from './Components/Favorites/Favorites';
import Button from './Components/Button/Button';
import './Home.css';

const Home = () => {
  const [catData, setCatData] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAttribute, setSortAttribute] = useState('default');

  const navigate = useNavigate(); // Initialize useNavigate

  const catsPerPage = 10;
  const maxPages = Math.ceil(catData.length / catsPerPage);
  const lastCatIndex = catsPerPage * currentPage;
  const firstCatIndex = lastCatIndex - catsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds');
        if (!response.ok) {
          throw new Error('Error: could not get response');
        }
        const data = await response.json();
        setCatData(data);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [sortAttribute]);

  const sortedCatData = [...catData].sort((a, b) => {
    if (sortAttribute === 'default') return 0;
    return b[sortAttribute] - a[sortAttribute];
  });

  const currentCatArray = sortedCatData.slice(firstCatIndex, lastCatIndex);

  const handleSortChange = (attribute) => {
    setSortAttribute(attribute);
  };

  const handleClick = (cat) => {
    if (selectedCat && selectedCat.id === cat.id) {
      setSelectedCat(null);
    } else {
      setSelectedCat(cat);
    }
  };

  const handleFavorites = (cat) => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/${cat.reference_image_id}`);
        if (!response.ok) {
          throw new Error('Response failed');
        }
        const data = await response.json();
        setFavorites((prevFavorites) => [...prevFavorites, data]);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    if (favorites.some(favorite => favorite.id === cat.reference_image_id)) {
      console.log('This cat is already in your favorites!');
      return;
    }
    fetchData();
  };

  const handleRemoveFavorites = (image) => {
    const updatedFavorites = favorites.filter((favImage) => favImage.id !== image.id);
    setFavorites(updatedFavorites);
  };

  const handleLearnMore = (cat) => {
    navigate('/learn_more', { state: { cat } }); // Navigate and pass cat data in state
  };

  return (
    <div>

      <div className="Search">
        <Search catData={catData} />
      </div>

      <div className="Favorites">
        <Favorites
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorites}
        />
      </div>

      <div className="Sorting">
        <Sorting
          sortAttribute={sortAttribute}
          onSortChange={handleSortChange}
        />
      </div>

      {currentCatArray.map((cat) => (
        <div className="main-buttons" key={cat.id}>
          <Button
            text={cat.name}
            onClick={() => handleClick(cat)}
          />
          {selectedCat && selectedCat.id === cat.id && (
            <img className="selected-image"
              src={`https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`}
              alt={cat.name}
              style={{ height: '300px', width: '300px' }}
            />
          )}
          <Button
            text="Add to Favorites"
            onClick={() => handleFavorites(cat)}
          />
          <Button
            text="Learn More"
            onClick={() => handleLearnMore(cat)}
          />
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        maxPages={maxPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
