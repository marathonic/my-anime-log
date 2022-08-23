import "./style.css";
import { Headr, AppContainer } from "./components/primedComps";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
function App() {
  const isMobile = useMediaQuery({ query: "(max-width:428px)" });

  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState([]);

  return (
    <AppContainer>
      <Navbar isMobile={isMobile} />
      <Routes>
        <Route path="/" element={<Home setSearch={setSearch} />}></Route>
        <Route path="/dashboard" element={<Profile />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
