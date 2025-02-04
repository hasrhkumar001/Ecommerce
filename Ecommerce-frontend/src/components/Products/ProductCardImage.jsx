import React, { useState, useEffect } from "react";
import axios from "axios";
import Img1 from "../../assets/women/women.png";
import { useNavigate } from "react-router-dom";

export const ProductCardImage = ({ product_id }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Calculate the number of slides

  // Get the images for the current slide

  useEffect(() => {
    if (product_id) {
      fetchImages();
    }
  }, [product_id]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/product-images/product/${product_id}`
      );
      // console.log(response.data);
      const fetchedImages = response.data;
    setSelectedImage(
          `http://127.0.0.1:8000/storage/${fetchedImages[0].image_path}`
        );
      
    } catch (error) {
        setSelectedImage(
            `${Img1}`
          );
      console.error("Error fetching images:", error);
    }
  };

  return <img src={selectedImage} alt="Product-main-img" className="" style={{height:"250px",objectFit: "cover"}}/>;
};
