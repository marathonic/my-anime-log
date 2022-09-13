import "./style.css";
import { AppContainer } from "./components/primedComps";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import SingleAnime from "./components/SingleAnime";
import SearchResults from "./pages/SearchResults";
import { useReducer } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import RegisterUser from "./components/RegisterUser";
import PasswordReset from "./components/PasswordReset";
import Dashboard from "./pages/Dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");
  // const [user, setUser] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const initialAnime = {};
  const [allTopAnime, updateAllTopAnime] = useReducer(
    (allTopAnime, updates) => ({ ...allTopAnime, ...updates }),
    initialAnime
  );
  const isMobile = useMediaQuery({ query: "(max-width:428px)" });

  // updates: updateAllTopAnime({ category: response.data })

  const fetchTopTen = async (category) => {
    let searchTerm;
    switch (category) {
      case "overall":
        searchTerm = "?";
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

    const URL = `https://api.jikan.moe/v4/top/anime${searchTerm}&limit=7`;
    const res = await fetch(URL);
    const resData = await res.json();
    return resData.data;
    // updateAllTopAnime({ [`${category}`]: resData.data });
    // await new Promise((resolve) => setTimeout(resolve, 6000));
  };

  console.log(allTopAnime);

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
    const getAllMyTopAnime = async () => {
      // we can set all at the end at once: updateAllTopAnime({movies: topMovies, airing: topAiring, popular: topPopular})
      // but then the user would have to wait several seconds before our content displays.
      // Let's set each one individually as soon as it's ready:
      const topOverall = await fetchTopTen("overall");
      updateAllTopAnime({ overall: topOverall });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const topMovies = await fetchTopTen("movies");
      updateAllTopAnime({ movies: topMovies });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const topAiring = await fetchTopTen("airing");
      updateAllTopAnime({ airing: topAiring });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const topPopular = await fetchTopTen("popular");
      updateAllTopAnime({ popular: topPopular });

      // What if the user spam reloads the page several times in a row? we may wish to handle that
      // We would need to check if the page has been reloaded within the last second.
      // If so, throttle (fire another setTimeout before the first request):
      // if(timeFromLastReload <= 1200) { await new Promise((resolve) => setTimeout(resolve,1200)) }
      // __previous code:
      // await new Promise((resolve) => setTimeout(resolve, 1200));
      // updateAllTopAnime({
      //   movies: topMovies,
      //   airing: topAiring,
      //   popular: topPopular,
      // });
    };

    getAllMyTopAnime();
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
          // this should probably be the index page, just leave this word here --> index
          element={
            <Home
              search={search}
              setSearch={setSearch}
              animeList={animeList}
              overall={allTopAnime.overall}
              movies={allTopAnime.movies}
              popular={allTopAnime.popular}
              airing={allTopAnime.airing}
              isMobile={isMobile}
              handleSearch={handleSearch}
            />
          }
        ></Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              {/* <Profile /> */}
              <Dashboard />
            </ProtectedRoute>
          }
        ></Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
