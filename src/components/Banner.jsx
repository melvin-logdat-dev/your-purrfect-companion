import catImage from "../assets/calico-cat.png";
import preloader from "../assets/loading-cat.gif";
import axios from "axios";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Banner = ({ breedId }) => {
  const [images, setImages] = useState([]);
  const [breedName, setBreedName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState({}); // simple cache

  useEffect(() => {
    // prevent unncessary API calls / errors
    if (!breedId) return;
    // stops the old request. / for component unmount
    const controller = new AbortController();
    // using async here because it using await to wait for API responses.
    const fetchData = async () => {
      // using try catch for error handling
      try {
        // to use in preloader
        setIsLoading(true);
        // if cached, use it immediately
        // Checks if this breed's data already exists in cache.
        if (cache[breedId]) {
          // If cached data exists, it immediately sets the images.
          setImages(cache[breedId].images);
          // Sets the breed name from the cache.
          setBreedName(cache[breedId].breedName);
          // Since we already have the data, loading is finished.
          setIsLoading(false);
          return;
        }
        // runs multiple API requests at the same time.
        //
        const [breedRes, imageRes] = await Promise.all([
          // This fetches breed information
          axios.get(`https://api.thecatapi.com/v1/breeds/${breedId}`, {
            // allows the request to be cancelled.
            signal: controller.signal,
          }),
          axios.get(
            // This fetches 5 images of the selected breed
            `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`,
            // allows the request to be cancelled.
            { signal: controller.signal },
          ),
        ]);

        // axios returns a response object.
        // The actual data is inside .data
        const breedData = breedRes.data;
        const imageData = imageRes.data;

        // get breed name
        // prevents errors. when breed name is null return placeholder / fallback name
        const name = breedData?.name || "Cat";
        setBreedName(name);
        // Check if images exist
        // Prevents empty results.
        if (imageData?.length > 0) {
          // preload all images before setting state
          // Images load instantly when displayed
          // optmized image to avoid slow image appears
          const preloadPromises = imageData.map(
            (img) =>
              new Promise((resolve) => {
                // Create Image object
                const imageObj = new Image();
                // Assign image source
                imageObj.src = img.url;
                // Wait for image to load
                imageObj.onload = () => resolve({ src: img.url, alt: name });
              }),
          );
          // Wait for all images to preload
          const loadedImages = await Promise.all(preloadPromises);
          setImages(loadedImages);

          // save to cache
          // This stores the data for future use.
          setCache((prev) => ({
            ...prev,
            [breedId]: { images: loadedImages, breedName: name },
          }));
        } else {
          // If no images found
          setImages([{ src: catImage, alt: "Cat Banner" }]);
        }
        setIsLoading(false);
        // Catch errors
      } catch (err) {
        console.error("Error fetching banner data:", err);
        setIsLoading(false);
      }
    };
    // Executes the async function.
    fetchData();
    // Cleanup function
    // It cancels the API request to prevent memory leaks.
    return () => {
      controller.abort();
    };
    // Dependencies
    // breedId changes
    // cache changes
  }, [breedId, cache]);

  return (
    <div className="bannerContainer">
      {isLoading ? (
        <img src={preloader} alt="preloader" className="preloader" />
      ) : images.length > 0 ? (
        <Swiper
          key={breedId} // forces reload when breed changes
          modules={[Navigation, Autoplay]}
          loop
          autoplay={{ delay: 3000 }}
          autoHeight={true}
          spaceBetween={20}
          navigation={images.length > 0}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img.src} alt={breedName} className="BannerImage" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img src={catImage} alt="Cat Banner" className="BannerImage" />
      )}
    </div>
  );
};

export default Banner;
