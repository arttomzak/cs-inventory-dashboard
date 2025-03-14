import { useState, useEffect } from "react";
import "./App.css";
// import steamButton from "./assets/sits_01.png";
import SteamLoginButton from "./steambutton";
import {
  LineChart,
  Line,
  // XAxis,
  // YAxis,
  // Tooltip,
  // Legend,
  // ResponsiveContainer,
} from "recharts";

function App() {
  // intializing some variables making up our url
  const base_url = `https://www.steamwebapi.com/steam/api/inventory`;
  const steam_id = `76561198194854574`;
  const game = `cs2`;

  // our built up endpoint url
  const INVENTORY_REQUEST_URL = `${base_url}?steam_id=${steam_id}&game=${game}&key=${
    import.meta.env.VITE_STEAMAPI_API_KEY
  }`;

  const [items, setItems] = useState([]); // creating an empty array named items, with a setter function setItems

  useEffect(() => {
    // using useEffect to watch our usage of the API due to request limits
    const getData = async () => {
      const response = await fetch(INVENTORY_REQUEST_URL);
      const data = await response.json();
      setItems(data); // call setter function for items
    };
    getData(); // runs our defined getData function within the useEffect hook
  }, []); // items.map(item => item.priceavg) in the dependency array leads to nonstop GET requests and we don't want that, so we will stick with only rendering the price once on render
  // NOTE: DEPENDENCY ARRAY WILL EVENTUALLY BE THE STEAMUSERID entered/stored from the website's steam login, because we might wanna switch in between users

  console.log(items);

  // useEffect(() => {
  items.sort((a, b) => b.priceavg - a.priceavg); // sorting all of the items from greatest priceavg to lowest, in-place, down the line, sort out a useEffect ?
  // }, [items.map(item => item.priceavg).join(",")]);

  const inv_total_val = items.reduce((acc, item) => {
    // creating a total sum of all of the items in one's inventory with the reduce array method
    return parseFloat((acc += item.priceavg).toFixed(2)); // value.toFixed(2) allows us to round to two decimal places, but we use parseFloat to keep it as a number
  }, 0); // 0 is the starting value in the reduce function

  console.log(inv_total_val);

  useEffect(() => {});
  // TODO: sort out the type problems that are coming up with the item attributes

    

  return (
    <>
      <div className="bg-gray-950 h-screen">
        <nav className="flex relative justify-center items-center h-16 bg-gray-900 text-white font-bold">
          <h1 className="absolute left-1/2 transform -translate-x-1/2">
            CS2 Inventory Dashboard
          </h1>
          <SteamLoginButton loggedin={steam_id} />
        </nav>

        <div className="mt-10">
          <ul className="flex items-start">
            <li className="basis-7/10">
              <div className="bg-slate-950 outline-1 outline-offset-5 outline-gray-600 mx-10">
                <ul>
                  <li>
                    {/* some kind of a if mousehover on the chart, change the value displayed to the $ value on the chart like RH  WITH A USESTATE sethovered*/}
                    <h1 className="text-white ml-4 text-5xl text-bold">
                      ${inv_total_val} 
                    </h1>
                    {/* I want this to end up being like how much has the price increased or decreased since last login */}
                    <h1 className="text-emerald-400 ml-4 text-3xl text-bold"> 
                      +$123 (0.27%)
                    </h1>
                  </li>

                  <li>
                    <LineChart
                      width={1000}
                      height={600}
                      // data={pucio}
                      className="mt-10"
                    >
                      <Line
                        type="monotone"
                        dataKey="pv"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </li>
                </ul>
              </div>
            </li>

            <li className="basis-3/10">
              {/* TODO: make the items box stay up top and the items scrollable */}
              <div className=" outline-gray-600 outline-1 outline-offset-5 bg-gray-950 mx-10">
                <h2 className=" outline-1 outline-gray-600 outline-offset-5 text-center text-bold text-white">
                  Items
                </h2>
                <div className="overflow-y-auto scroll-smooth h-[80vh] mb-5 mt-2 ">
                  {items.map(
                    (
                      item,
                      index // iterates through each item in items, keeping track of its index, which later becomes its key
                    ) => (
                      <ul
                        className="flex bg-gray-950 items-center justify-center"
                        key={index}
                      >
                        {/* basis fractions to split up the space within the scrollable container?  */}
                        <li className="bg-slate-950 mr-4 ">
                          <img
                            src={item.image}
                            className="w-25 h-auto object-contain"
                          ></img>
                        </li>
                        <li className="text-white mr-4">{item.marketname}</li>
                        <li className="text-emerald-400 ml-auto mr-4">
                          ${item.priceavg}
                        </li>
                      </ul>
                    )
                  )}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
