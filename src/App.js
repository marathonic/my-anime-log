import "./style.css";
import { AppContainer } from "./components/primedComps";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Explore from "./components/Explore";
import SingleAnime from "./components/SingleAnime";
import SearchResults from "./pages/SearchResults";
import { useReducer } from "react";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topSpecials, setTopSpecials] = useState([]);
  const [topAiring, setTopAiring] = useState([]);
  const [topPopular, setTopPopular] = useState([]);
  const [topFavorites, setTopFavorites] = useState([]);
  const [topUpcoming, setTopUpcoming] = useState([]);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(
    useMediaQuery({ query: "(max-width:428px)" })
  );

  const initialAnime = {};
  const [allTopAnime, updateAllTopAnime] = useReducer(
    (allTopAnime, updates) => ({ ...allTopAnime, ...updates }),
    initialAnime
  );

  // updates: updateAllTopAnime({ category: response.data })

  const getTopAnime = async () => {
    // For most popular:
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?&type=special`);
    // Get movies: const res = await fetch(`https://api.jikan.moe/v4/top/anime?&type=movie`);
    // For an individual anime search:
    //const res = await fetch(`https://api.jikan.moe/v4/anime?q=Naruto&sfw`);
    const resData = await res.json();
    // console.log(resData);
    console.log(resData);
    setTopAnime(resData.data.slice(0, 10));
  };

  const newGetTopAnime = async (category) => {
    let searchTerm;
    switch (category) {
      case "top":
        searchTerm = "";
        break;

      case "movies":
        searchTerm = "?&type=movie";
        break;

      case "airing":
        searchTerm = "?&filter=airing";
        break;

      case "popular":
        searchTerm = "?&filter=bypopularity";
        break;

      case "favorites":
        searchTerm = "?&filter=favorite";
        break;

      case "upcoming":
        searchTerm = "?&filter=upcoming";
        break;

      case "specials":
        searchTerm = "?&type=special";
        break;

      default:
        break;
    }

    const URL = `https://api.jikan.moe/v4/top/anime${searchTerm}&limit=3`;
    const res = await fetch(URL);
    const resData = await res.json();
    return resData.data;
    // updateAllTopAnime({ [`${category}`]: resData.data });
    // await new Promise((resolve) => setTimeout(resolve, 6000));
  };

  console.log(allTopAnime);

  const getAllMyTopAnime = async () => {
    const topMovies = await newGetTopAnime("movies");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const topAiring = await newGetTopAnime("airing");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const topPopular = await newGetTopAnime("popular");
    // await new Promise((resolve) => setTimeout(resolve, 1200));
    updateAllTopAnime({
      movies: topMovies,
      airing: topAiring,
      popular: topPopular,
    });
  };

  const getMovies = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/top/anime?&type=movie&limit=7`
    );
    const resData = await res.json();
  };

  const getTopMovies = async () => {
    // READ: TO DO:
    // ---------- A) Work on the functionality described in the comments below "**".
    // ---------- B) Work on Home.js (Lazy loading)
    // **
    // 1) WE CAN TURN getTopAnime into an all-purpose function,
    // that takes in the type of anime we want; e.g: getTopSection(section).
    // Inside the function, let searchTerm; switch(searchTerm) case 'movie' searchTerm = `?&type=movie`.
    // case 'airing' searchTerm = `?&airing` (test that, we haven't tested that yet), etc.
    // 2) WE CAN lazy load images, so that the divs for the top 10 (the whole row of divs)
    //  shows up instantly upon page load, even if our anime is taking a while to load.
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?&type=movie`);
    const resData = await res.json();
    console.log(resData);
    setTopMovies(resData.data.slice(0, 10));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search);
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
    // getTopAnime();
    getAllMyTopAnime();
    // const timerOne = setTimeout(newGetTopAnime("movies"), 3000);
    // clearTimeout(timerOne);

    // const timerTwo = setTimeout(newGetTopAnime("airing"), 3000);
    // clearTimeout(timerTwo);
    // const timerThree = setTimeout(newGetTopAnime("specials"), 3000);
    // clearTimeout(timerThree);
    // newGetTopAnime("specials");
    // newGetTopAnime("airing");
  }, []);

  return (
    <AppContainer>
      <Navbar isMobile={isMobile} />
      <Routes>
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
          path="anime/search/:searchQuery"
          element={<SearchResults isMobile={isMobile} />}
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

        <Route path="/dashboard" element={<Profile />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
