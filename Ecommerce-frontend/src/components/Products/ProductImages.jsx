import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../../public/style.css";

export const ProductImages = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(images.length / itemsPerSlide);
  
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(`http://127.0.0.1:8000/storage/${images[0].image_path}`);
      setIsLoading(false);
    }
  }, [images]);

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;
    setHoverPosition({
      x: (offsetX / offsetWidth) * 100,
      y: (offsetY / offsetHeight) * 100,
    });
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentImages = images.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  return (
    <div className="product-carousel">
      {/* Thumbnail Carousel */}
      <div className="thumbnail-carousel">
        {/* Previous Button */}
        {currentSlide > 0 && (
          <button className="thumbnail-nav prev" onClick={handlePrevious}>
            &lt;
          </button>
        )}

        {/* Thumbnails */}
        <div className={`thumbnails ${isLoading ? "visible" : ""}`}>
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                height={75}
                width={75}
                style={{ borderRadius: "10px" }}
              />
            ))
          ) : (
            currentImages.map((image, index) => {
              const thumbnailUrl = `http://127.0.0.1:8000/storage/${image.image_path}`;
              return (
                <img
                  key={index}
                  src={thumbnailUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    selectedImage === thumbnailUrl ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(thumbnailUrl)}
                />
              );
            })
          )}
        </div>

        {/* Next Button */}
        {currentSlide < totalSlides - 1 && (
          <button className="thumbnail-nav next" onClick={handleNext}>
            &gt;
          </button>
        )}
      </div>

      {/* Main Image with Hover Zoom */}
      {isLoading ? (
        <div className="main-image-container">
          <Skeleton width={600} height={600} />
        </div>
      ) : selectedImage ? (
        <div
          className="main-image-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src={selectedImage}
            alt="Selected Product"
            className="main-image"
            style={{
              transformOrigin: `${hoverPosition.x}% ${hoverPosition.y}%`,
            }}
          />
        </div>
      ) : (
        <div className="main-image-container">
          <Skeleton width={600} height={600} />
        </div>
      )}
    </div>
  );
};
