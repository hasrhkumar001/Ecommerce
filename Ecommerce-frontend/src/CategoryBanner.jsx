import React from 'react';
import men from "./assets/shop_men.jfif";
import women from "./assets/shop_women.jfif";
import kids from "./assets/shop_kids.jfif";
import { Link } from 'react-router-dom';

export const CategoryBanner = () => {
  return (
    <div className='flex container gap-1'>
        <Link to='/products/mens' ><img className='banner-img' src={men} /></Link>
        <Link to='/products/womens' ><img className='banner-img' src={women} /></Link>
        <Link to='/products/kids' ><img className='banner-img' src={kids} /></Link>
    </div>
  )
}
