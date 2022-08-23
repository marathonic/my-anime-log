import { useState } from "react";
import { Sidebar } from "../components/primedComps";

export default function Home({ setSearch }) {
  return (
    <div>
      <h1>Home</h1>
      <Sidebar>
        <h3>Top anime</h3>
      </Sidebar>
    </div>
  );
}
