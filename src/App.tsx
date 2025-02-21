// import { useState } from 'react'
import './App.css'
import steamButton from './assets/sits_01.png';

function App() {

  return (
    <>

    <nav className="flex relative justify-center items-center h-16 bg-gray-900 text-white font-bold">
      
      <h1 className="absolute left-1/2 transform -translate-x-1/2">CS2 Inventory Dashboard</h1>
      
      <button className="hover:opacity-90 absolute right-5">
        <img src={steamButton} />
      </button>
      
    </nav>

      <div>
      </div>
    </>


  )
}

export default App
