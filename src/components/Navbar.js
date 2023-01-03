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
            <span className="navLink">{isMobile ? <FaHome /> : "Home"}</span>
          </Link>
        </li>

        <li>
          <Link to="/dashboard">
            <span className="navLink"> {isMobile ? <FaUser /> : "My Log"}</span>
          </Link>
        </li>
      </UList>
    </NavBar>
  );
}
