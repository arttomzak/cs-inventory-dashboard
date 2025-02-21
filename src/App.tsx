// import { useState } from 'react'
import './App.css'
import steamButton from './assets/sits_01.png';

// this is my inventory's json output from steam API (note: will need user's steamid )
// https://steamcommunity.com/inventory/76561198194854574/730/2?l=english&count=5000

// tradable: data determining whether we will be adding its price data to our overall price 
// market_name: seems to be already formatted for if we wanna just go off the median price found based off of the steam community site 


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
