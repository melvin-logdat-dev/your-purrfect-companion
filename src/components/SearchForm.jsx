import React, { useState, useEffect } from "react";

const SearchForm = ({ onBreedSelect }) => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("https://api.thecatapi.com/v1/breeds")
      .then((response) => response.json())
      .then((data) => setBreeds(data))
      .catch((error) => console.error("Error fetching breeds:", error));
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle breed selection change
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedBreed(value);
    onBreedSelect(value);
  };

  return (
    <div className="searchFormContainer">
      <form className="formSearch">
        <select
          value={selectedBreed}
          onChange={handleSelectChange}
          className="breedSelect"
        >
          <option value="" disabled>
            Select breed
          </option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default SearchForm;
