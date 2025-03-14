import steamButton from "./assets/sits_01.png";
import React from "react";

interface SteamLoginButtonProps {
  loggedin: string | null;
}

const SteamLoginButton: React.FC<SteamLoginButtonProps> = ({ loggedin }) => { // loggedin is the prop passed in steamloginbutton component
  return (
    <div className="flex items-center absolute right-5 h-full">
      {loggedin ? ( // this basically says if logged in, display the log out button, if not display the steam button
        <h3 className="font-bold mr-5">Log Out</h3>
      ) : (
        <button className="hover:opacity-90">
          <img src={steamButton} />
        </button>
      )}
    </div>
  );
};

export default SteamLoginButton;
