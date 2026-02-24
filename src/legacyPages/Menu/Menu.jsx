'use client';
import '../../views/Menu/Menu.css'
import React, { useState } from 'react'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import Footer from '../../Components/Footer/Footer'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'

const Menu = () => {
  const[category,setCategory]=useState("All");


  return (
    <div className='menu-page'>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <Footer/>
    </div>
  )
}

export default Menu
