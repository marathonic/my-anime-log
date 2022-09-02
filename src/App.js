import "./style.css";
import {AppContainer } from "./components/primedComps";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Explore from "./components/Explore";
import SingleAnime from "./components/SingleAnime";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");

  const getTopAnime = async () => {
    // For most popular:
    const res = await fetch(`https://api.jikan.moe/v4/top/anime`);
    // For an individual anime search:
    //const res = await fetch(`https://api.jikan.moe/v4/anime?q=Naruto&sfw`);
    const resData = await res.json();
    // console.log(resData);
    setTopAnime(resData.data.slice(0, 10));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search);
    console.log(search);
    // fetchAnime(search);
  };

  const fetchAnime = async (animeName) => {
    const data = await fetch(
      `https://api.jikan.moe/v4/anime?q=${animeName}&sfw`
      // `https://api.jikan.moe/v4/search/anime?q=${animeName}&order`).then((res) => res.json())
    ).then((res) => res.json());
    setAnimeList(data.results);
  };

  useEffect(() => {
    getTopAnime();
  }, []);

  const isMobile = useMediaQuery({ query: "(max-width:428px)" });

  return (
    <AppContainer>
      <Navbar isMobile={isMobile} />
      <Routes>
        {/* {topAnime.map((anime) => (
          <Link to={"anime/" + anime.mal_id} />
        ))} */}
        <Route
          path="anime/:mal_id"
          element={
            <SingleAnime
              topAnime={topAnime}
              message={"HELLO FROM LINE 55 IN APP.JS"}
              isMobile={isMobile}
            />
          }
        />

        <Route
          path="/"
          element={
            <Home
              search={search}
              setSearch={setSearch}
              animeList={animeList}
              topAnime={topAnime}
              isMobile={isMobile}
              handleSearch={handleSearch}
            />
          }
        ></Route>
        <Route path="/explore">
          <Route index element={<Explore />} />
          <Route
            path=":animeId"
            element={<SingleAnime message={"HELLO FROM LINE 72 IN APP.JS"} />}
          />
        </Route>
        {/* <Route path=":animeId" element={<SingleAnime />}></Route> */}
        <Route path="/dashboard" element={<Profile />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
