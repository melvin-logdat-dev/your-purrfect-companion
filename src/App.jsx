import { useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import SearchForm from "./components/SearchForm";

function App() {
  const [selectedBreed, setSelectedBreed] = useState(null);

  return (
    <div className="app-body">
      <Header />
      <Banner breedId={selectedBreed} />
      <SearchForm onBreedSelect={setSelectedBreed} />
    </div>
  );
}

export default App;
