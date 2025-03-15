import { useState, useEffect } from "react";
import "./App.css";
// import steamButton from "./assets/sits_01.png";
import SteamLoginButton from "./steambutton";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { supabase } from "./config/supabaseClient";
import { format } from "date-fns";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (inv_total_val > 0) {
      // haven't understood why this happens but with inv_total_value dependency array, it triple inserts data, this is a bandaid solution tho
      const AddDatapoint = async () => {
        const { newdatapoint, error } = await supabase
          .from("inventory_history")
          .insert([
            {
              // note: no need for timestamp bc supabase auto gens one, hopefully it works with recharts
              steam_id: steam_id,
              total_inv_val: inv_total_val,
            },
          ])
          .select() // this is what we are gonna use to select specific columns to fill out our data const array that we are gonna feed into our chart
          .single(); // this ensures that a single row is returned, rather than an array, WHICH WE NEED as I'm making

        if (error) {
          console.error("Datapoint not inserted! Peep error:", error);
          return null;
        } else {
          console.log("Good job, data inserted!", newdatapoint);
        }
      };
      AddDatapoint();
    }
  }, [inv_total_val]);


  const [InvData, setInvData] = useState<{ inv_total_val: number; timestamp: string }[]>([]); // expected formatting of InvData, making sure that we can just pass InvData as the data prop of the line chart later
  useEffect(() => {
      const fetchData = async () => {
          const { data, error } = await supabase
              .from("inventory_history")
              .select("total_inv_val, timestamp");
          console.log("Fetched Data:", data);

          const formattedData = data.map(item => ({
            inv_total_val: item.total_inv_val,
            timestamp: format(new Date(item.timestamp), "MM/dd/yyyy HH:mm"),
          }));

          setInvData(formattedData);
      };
      fetchData()

  }, []);

  useEffect(() => { // console log the stored InvData, AFTER it's updated 
    console.log("Stored fetched data:", InvData)
  }, [InvData]);

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

          {/* CHART CONTAINER  */}
            <li className="basis-7/10">
              <div className="bg-slate-950 outline-1 outline-offset-5 p-4 outline-gray-600 mx-10">
                <ul>
                  <li>
                    {/* some kind of a if mousehover on the chart, change the value displayed to the $ value on the chart like RH  WITH A USESTATE sethovered*/}
                    <h1 className="text-white text-5xl text-bold">
                      ${inv_total_val}
                    </h1>
                    {/* I want this to end up being like how much has the price increased or decreased since last login , find delta since last fetched val*/}
                    <h1 className="text-emerald-400 text-3xl text-bold">
                      +$123 (12.27%)
                    </h1>
                  </li>
                  

                  <li>
                    <div className="h-[65vh]">
                      <ResponsiveContainer width="100%" height="100%">

                        <LineChart
                          data={InvData}
                          className="mt-10"
                          width={500}
                          height={300}
                        >
                          <YAxis domain={["auto", "auto"]}></YAxis>
                          <XAxis dataKey="timestamp" domain={["auto", "auto"]}></XAxis>
                          <Line
                            type="monotone"
                            dataKey="inv_total_val"
                            stroke="#00d492"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                  </li>



                </ul>
              </div>
            </li>



          {/* ITEMS BOX STARTS */}
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
