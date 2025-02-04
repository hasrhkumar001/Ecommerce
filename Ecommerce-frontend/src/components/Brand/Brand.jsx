import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Brand = ({brand_id}) => {

    const [brand, setBrand] = useState([]);
   
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true);
    
  
    useEffect(() => {
        fetchBrand();
    }, []);
  
    const fetchBrand = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/brand/${brand_id}`);
        setBrand(response.data);
        
        
      } catch (error) {
        console.error('Error fetching brand name:', error);
      }
      finally{
        setIsLoading(false)
      }
    };

  return (
    <div>
      {isLoading ? (
              <Skeleton width={120} height={20} />
            ):(<p>{`${brand.name}`}</p>)}
    
    </div>
  );
}
