import catImage from "../assets/calico-cat.png";
import { useState, useEffect } from "react";

const Banner = ({ breedId }) => {
  const [breedImage, setBreedImage] = useState(null);
  const [breedName, setBreedName] = useState("");

  useEffect(() => {
    if (!breedId) return;
    // Fetch breed info first
    fetch(`https://api.thecatapi.com/v1/breeds/${breedId}`)
      .then((res) => res.json())
      .then((breedData) => {
        setBreedName(breedData?.name || "Cat");

        // Then fetch image for that breed
        return fetch(
          `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
        );
      })
      .then((res) => res.json())
      .then((imageData) => {
        if (imageData?.length > 0) {
          setBreedImage(imageData[0]?.url);
        }
      })
      .catch((err) => console.error("Error fetching banner data:", err));
  }, [breedId]);

  return (
    <div className="bannerContainer">
      {breedImage ? (
        <img src={breedImage} alt={breedName} className="BannerImage" />
      ) : (
        <img src={catImage} alt="Cat Banner" className="BannerImage" />
      )}
    </div>
  );
};

export default Banner;
