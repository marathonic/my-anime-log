import React from "react";
import { Link } from "react-router-dom";
import { NavBar, UList } from "./primedComps";
import { FaUser, FaHome, FaSearch, FaCompass } from "react-icons/fa";

export default function Navbar({ isMobile }) {
  return (
    // <nav className="nav">
    //   <ul>
    //     <li>
    //       <Link to="/">Home</Link>
    //     </li>
    //     <li>
    //       <Link to="/">Log In</Link>
    //     </li>
    //   </ul>
    // </nav>
    <NavBar isMobile>
      <UList>
        <li>
          <Link to="/">
            <span className="logo">{isMobile ? <FaCompass /> : "Explore"}</span>
          </Link>
        </li>
        <input className="search-bar" type="search" placeholder="search..." />
        <li>
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
