import React from "react";
import { Link } from "react-router-dom";
import { NavBar, UList } from "./primedComps";
import { FaUser, FaHome, FaSearch, FaCompass } from "react-icons/fa";

export default function Navbar({ isMobile }) {
  return (
    <NavBar isMobile>
      <UList>
        <li>
          <Link to="/">
            <span className="logo">{isMobile ? <FaCompass /> : "Explore"}</span>
          </Link>
        </li>

        <li>
          {/* We want to know:
          1) user? Whether or not there is a user (not null):
          2) isMobile? Whether the device is mobile phone or not.
              3)If mobile, Render A) <User /> if there is a user. Or, Render B) <FiLogin /> if user is null.
              3)If desktop, Render A) "My Profile" if there is a user. Or, Render B) "Log In" if user is null.
          SOLUTION: We could use MediaQueries: 
          <MediaQuery max-width(640px)>{user ? <User /> : <FiLogin />}</MediaQuery>
          <MediaQuery min-width(desktop-width)> </MediaQuery>
          */}
          <Link to="/dashboard">{isMobile ? <FaUser /> : "My Profile"}</Link>
        </li>
        {/* We can nest inside a component <MediaQuery> here,
            first we check if the user is logged in.
            <MediaQuery isLoggedIn ? 
               {isMobile ? <img src="fireStore.user.profilePic" /> : "John (user Name)" }
               :
               {isMobile ? <FaUser /> : "Log in"}
            />
            
        */}
        {/* 
            We could also do 2 media queries back to back:
            <MediaQuery isLoggedIn && 
            {isMobile ? etc...}
            />
            <MediaQuery !isLoggedIn &&
            {isMobile ? etc...}
            />
        */}
      </UList>
    </NavBar>
  );
}
