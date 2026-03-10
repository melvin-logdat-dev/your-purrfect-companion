import { useState, useEffect } from "react";
import axios from "axios";

const SearchForm = ({ onBreedSelect }) => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");

  useEffect(() => {
    // stops the old request. / for component unmount
    const controller = new AbortController();
    // Make a request for a user with a given ID
    axios
      // The API endpoint returns a list of all cat breeds.
      .get("https://api.thecatapi.com/v1/breeds", {
        // connects the request to the AbortController, so it can be cancelled if necessary.
        signal: controller.signal,
      })
      // handle success
      // contains the data returned from the server.
      .then((response) => {
        // Save the Breeds to State
        setBreeds(response.data);
      })
      // Handle Errors
      .catch((error) => {
        // If the request was cancelled intentionally, ignore the error.
        if (error.name === "CanceledError") {
          return;
        }
        // If the error is not caused by cancellation. log it to the console.
        console.error("Error fetching and parsing data", error);
      });
    // Cleanup Function
    // It cancels the API request to prevent memory leaks.
    return () => {
      controller.abort();
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
