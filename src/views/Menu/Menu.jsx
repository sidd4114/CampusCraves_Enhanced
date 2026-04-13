'use client';
import './Menu.css'
import React, { useState } from 'react'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import Footer from '../../Components/Footer/Footer'

const Menu = () => {
  const[category,setCategory]=useState("All");


  return (
    <div className='menu-page'>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <Footer/>
    </div>
  )
}

export default Menu
