import React from "react";
import { Link } from "react-router-dom";
import { NavBar, UList } from "./primedComps";

export default function Navbar() {
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
          <Link to="/">Home</Link>
        </li>
      </UList>
    </NavBar>
  );
}
