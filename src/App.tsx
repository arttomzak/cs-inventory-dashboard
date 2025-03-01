import { useState, useEffect } from 'react' ;
import './App.css'
import steamButton from './assets/sits_01.png';

const base_url = `https://www.steamwebapi.com/steam/api/inventory`
const steam_id = `76561198194854574`
const game = `cs2`

const INVENTORY_REQUEST_URL = `${base_url}?steam_id=${steam_id}&game=${game}&key=${import.meta.env.VITE_STEAMAPI_API_KEY}`


// tradable: data determining whether we will be adding its price data to our overall price 
// market_name: seems to be already formatted for if we wanna just go off the median price found based off of the steam community site 


function App() {

  const [items, setItems] = useState([])

  useEffect(() => {
    const getData = async () => {  
      const response = await fetch(INVENTORY_REQUEST_URL);
      const data = await response.json();
      setItems(data);  
    } 
      getData()
    }, []);

  console.log(items);

  return (
    <>
    <nav className="flex relative justify-center items-center h-16 bg-gray-900 text-white font-bold">
      <h1 className="absolute left-1/2 transform -translate-x-1/2">CS2 Inventory Dashboard</h1>
      <button className="hover:opacity-90 absolute right-5">
        <img src={steamButton} />
      </button>  
    </nav>  
    <ul>
        {items.map((item, index) => ( 
          <li key={index}> 
            {item.marketname} ${item.priceavg}
          </li>
        ))}
    </ul>
    </>
  )
}

export default App
