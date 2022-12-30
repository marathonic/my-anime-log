import React from "react";
import { Link } from "react-router-dom";
import { NavBar, UList } from "./primedComps";
import { FaUser, FaHome } from "react-icons/fa";

export default function Navbar({ isMobile }) {
  return (
    <NavBar isMobile>
      <UList>
        <li>
          <Link to="/">
            <span className="logo">{isMobile ? <FaHome /> : "Home"}</span>
          </Link>
        </li>

        <li>
          <Link to="/dashboard">
            <span className="logo"> {isMobile ? <FaUser /> : "My Log"}</span>
          </Link>
        </li>
      </UList>
    </NavBar>
  );
}
