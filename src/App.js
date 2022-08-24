import "./style.css";
import { Headr, AppContainer } from "./components/primedComps";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
function App() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState([]);

  const getData = async () => {
    // For most popular:
    const res = await fetch(`https://api.jikan.moe/v4/top/anime`);
    // For an individual anime search:
    //const res = await fetch(`https://api.jikan.moe/v4/anime?q=Naruto&sfw`);
    const resData = await res.json();
    console.log(resData);
    setTopAnime(resData.data.slice(0, 10));
  };

  useEffect(() => {
    getData();
  }, []);

  const isMobile = useMediaQuery({ query: "(max-width:428px)" });

  return (
    <AppContainer>
      <Navbar isMobile={isMobile} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              setSearch={setSearch}
              topAnime={topAnime}
              isMobile={isMobile}
            />
          }
        ></Route>
        <Route path="/dashboard" element={<Profile />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
