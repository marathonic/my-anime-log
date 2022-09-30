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
import { useLocation } from "react-router-dom";
import RestrictedRoute from "./components/RestrictedRoute";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");
  // const [user, setUser] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [myUser, setMyUser] = useState([]);
  const initialAnime = {};
  const [allTopAnime, updateAllTopAnime] = useReducer(
    (allTopAnime, updates) => ({ ...allTopAnime, ...updates }),
    initialAnime
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const location = useLocation();

  useEffect(() => {
    // console.log(location.pathname);
    // if (location.pathname !== "/") {
    // return;
    // }

    if (location.pathname !== "/") return;
    if (allTopAnime.length === 4) return;
    // getTopAnime();
    const getAllMyTopAnime = async () => {
      // we can set all at the end at once: updateAllTopAnime({movies: topMovies, airing: topAiring, popular: topPopular})
      // but then the user would have to wait several seconds before our content displays.
      // Let's set each one individually as soon as it's ready:

      // ---------------
      // -----------------CONTINUE HERE:
      // Found an edge case:
      // If user asks for a search (whether autocomplete or full)
      // within 1 second of a category fetching, we get 428:
      // too many requests. Let's find a way around it!

      if (!allTopAnime.overall) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const topOverall = await fetchTopTen("overall");
        updateAllTopAnime({ overall: topOverall });
      }

      if (!allTopAnime.movies) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const topMovies = await fetchTopTen("movies");
        updateAllTopAnime({ movies: topMovies });
      }

      if (!allTopAnime.airing) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const topAiring = await fetchTopTen("airing");
        updateAllTopAnime({ airing: topAiring });
      }

      if (!allTopAnime.popular) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const topPopular = await fetchTopTen("popular");
        updateAllTopAnime({ popular: topPopular });
      }

      // We're still missing --specials--, --upcoming--, --OVAs--...

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
    /*eslint-disable-next-line*/
  }, [allTopAnime.length, location.pathname]);

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
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
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
              <Dashboard myUser={myUser} setMyUser={setMyUser} />
            </ProtectedRoute>
          }
        ></Route>

        {/* We could protect these routes, make them accessible only if there's no user */}
        <Route
          path="/login"
          element={
            // <RestrictedRoute user={user}>
            <Login setMyUser={setMyUser} />
            // </RestrictedRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={<RegisterUser setMyUser={setMyUser} />}
        />
        <Route path="/reset" element={<PasswordReset />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </AppContainer>
  );
}

export default App;
