import React from 'react'
import { CategoryBanner } from './CategoryBanner'
import Banner from './components/Banner/Banner'
import Hero from './components/Hero/Hero'
import Products from './components/Products/Products'
import Subscribe from './components/Subscribe/Subscribe'
import Testimonials from './components/Testimonials/Testimonials'
import TopProducts from './components/TopProducts/TopProducts'

export const Home = () => {
  return (
    <div> 
        <Hero  />
        <CategoryBanner />
        <Products />
        <TopProducts />
        <Banner />
        
        <Testimonials />
    </div>
  )
}
