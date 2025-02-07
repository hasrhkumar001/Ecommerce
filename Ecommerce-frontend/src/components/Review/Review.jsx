import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

function Review({ productId }) {
const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState('');
const [review, setReview] = useState('');
const [reviewExist, setReviewExist] = useState('')
const [reviewFetch, setReviewFetch] = useState('')
const [reviewHeading, setReviewHeading] = useState('');
const [errors, setErrors] = useState({});
const token = localStorage.getItem('authToken');
const navigate = useNavigate();
const [averageRating, setAverageRating] = useState(0);

useEffect(() => {
  fetchReviews();
}, []);

const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://192.168.137.160:8081/api/product/${productId}/reviews`);
    setReviews(response.data);
    calculateAverageRating(response.data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Results: rating:"+rating+ " review:"  +review+" heading:" +reviewHeading);

  

  try {
    const response = await axios.post(
      'http://192.168.137.160:8081/api/reviews',
      { rating, review,reviewHeading, product_id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200){
    console.log("Successfully submitted you review.")
  }else if(response.status === 403){
    setErrors({reviewExist:'You have already reviewed this product'});
  }else{
    setErrors({reviewFetch:'Login Again, Token Expired'});
  }

    setRating('');
    setReview('');
    setReviewHeading('');
    fetchReviews(); // Refresh the reviews after submission
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};

const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) {
    setAverageRating(0);
  } else {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    setAverageRating(average.toFixed(1)); // round to 1 decimal place
  }
};

const renderStars = (rating) => {
  return (
    <div className='flex'>
      {[...Array(5)].map((star, i) => {
        const starValue = i + 1;
        return (
          <span key={i}>
            {starValue <= rating ? (
            <BsStarFill size={18} color="gold" />
            ) : starValue - 0.5 === rating ? (
            <BsStarHalf size={18} color="gold" />
            ) : (
            <BsStar size={18} color="gold" />
            )}
        </span>
        );
      })}
    </div>
  );
};

return (
    <div >
    <h1 className="text-center "
        style={{
          textAlign:"left",
          marginTop: "90px",
          fontSize:"24px"}}>Reviews</h1>
          <div className='flex gap-5'>
          {reviews.length > 0 ? (
            reviews.map((review) => (
                <div key={review.id} className="flex gap-2 mt-5 flex-wrap">
                <div
                    className="p-5  border border-gray-300"
                    style={{ width: "250px" }}
                >
                    <div className="flex items-center">
                    <h4 className="text-lg font-semibold">{review.reviewHeading}</h4>
                    </div>
                    <div>
                    <div className="mt-2">{renderStars(review.rating)}</div>
                    <p className="text-sm text-gray-500 mt-2">{review.user.name}</p>
                    <p className="text-sm mt-2">{review.review}</p>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <div className="text-center text-gray-500  mt-5">No Reviews</div>
            )}
    </div>

    {token ? (
      <form onSubmit={handleSubmit} className="border border-gray-300 p-5 " style={{marginTop:"20px"  }}>
        

          <h4 style={{
              }}>Write a Review</h4>
          <div className='d-flex justify-content-center flex-column'>
          
          <StarRating rating={rating} setRating={setRating} />
          {errors.reviewFetch && <p className="fs-5 text-danger">{errors.reviewFetch}</p>}
          {errors.reviewExist && <p className="fs-5 text-danger">{errors.reviewExist}</p>}
          {errors.rating && <p className="fs-5 text-danger">{errors.rating}</p>}
        </div>
          
        
        <div className='d-flex justify-content-center flex-column'>
          
          <textarea
            value={reviewHeading}
            placeholder="Title"
            width="500px"
            style={{padding:"10px", marginBottom:"5px",width:"100%" ,fontSize:"14px" ,border: "1px solid #dfdfdf"}}
            onChange={(e) => setReviewHeading(e.target.value)}
          ></textarea>
          {errors.reviewHeading && <p className="fs-5 text-danger">{errors.reviewHeading}</p>}
        </div>

        <div className='d-flex justify-content-center flex-column'>
          
          <textarea
            value={review}
            width="500px"
            style={{minHeight:"100px",padding:"10px",fontSize:"14px",width:"100%", marginBottom:"5px",border: "1px solid #dfdfdf" }}
            placeholder='Share details of your own experience'
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          {errors.review && <p className="fs-5 text-danger">{errors.review}</p>}
        </div>

        <button style={{backgroundColor: "#ff4d30" ,border:"none" ,color:"white",fontWeight:"700",padding:"5px 10px"}}
              className="btn-lg btn-block w-100 fs-3  " type="submit">Submit Review</button>
      </form>
    ) : (
      <></>
    )}
  </div>
);
}

export default Review;
