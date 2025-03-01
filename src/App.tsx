import { useState, useEffect } from 'react' ;
import './App.css'
import steamButton from './assets/sits_01.png';

const base_url = `https://www.steamwebapi.com/steam/api/inventory`
const steam_id = `76561198194854574`
const game = `cs2`

// our built up endpoint url
const INVENTORY_REQUEST_URL = `${base_url}?steam_id=${steam_id}&game=${game}&key=${import.meta.env.VITE_STEAMAPI_API_KEY}`

function App() {

  const [items, setItems] = useState([]) // creating an empty array named items, with a setter function setItems


  useEffect(() => { // using useEffect to watch our usage of the API due to request limits 
    const getData = async () => {  
      const response = await fetch(INVENTORY_REQUEST_URL);
      const data = await response.json();
      setItems(data); // call setter function for items 
    } 

    getData() // runs our defined getData function within the useEffect hook

    }, []);  // useEffect hook with an empty dependency array to run once upon rendering the site for the first time

  console.log(items); 

  // outside of the useEffect hook, bc we already have items stored with the useState hook

  const inv_total_val = items.reduce((acc, item) => { // creating a total sum of all of the items in one's inventory with the reduce array method
    return parseFloat((acc += item.priceavg).toFixed(2)); // value.toFixed(2) allows us to round to two decimal places, but we use parseFloat to keep it as a number
  }, 0) // 0 is the starting value in the reduce function

  console.log(inv_total_val);
  
    



  




  return (
    <>
    <nav className="flex relative justify-center items-center h-16 bg-gray-900 text-white font-bold">
      <h1 className="absolute left-1/2 transform -translate-x-1/2">CS2 Inventory Dashboard</h1>
      <button className="hover:opacity-90 absolute right-5">
        <img src={steamButton} />
      </button>  
    </nav> 
    <h1>${inv_total_val}</h1> 
    <ul>
        {items.map((item, index) => ( // iterates through each item in items, keeping track of its index
          // every item has a key of index, and prints the items marketname and price avg
          <li key={index}>    
            {item.marketname} ${item.priceavg} 
          </li>
        ))}
    </ul>
    </>
  )
}

export default App
