import "./style.css";
import { AppContainer, Stars, Stars2, Stars3 } from "./components/primedComps";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
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

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");
  const [user] = useAuthState(auth);
  const [myUser, setMyUser] = useState([]);
  const initialAnime = {};
  // updates to allTopAnime: updateAllTopAnime({ category: response.data })
  const [allTopAnime, updateAllTopAnime] = useReducer(
    (allTopAnime, updates) => ({ ...allTopAnime, ...updates }),
    initialAnime
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("search");
  const isMobile = useMediaQuery({ query: "(max-width:428px)" });
  const [isFetchInProgress, setIsFetchInProgress] = useState(false);

  const initialUserLogs = {
    completed: [],
    watching: [],
    "plan to watch": [],
  };
  const [fetchedUserLogs, updateFetchedUserLogs] = useReducer(
    (fetchedUserLogs, updates) => ({ ...fetchedUserLogs, ...updates }),
    initialUserLogs
  );
  const [loggedCompleted, setLoggedCompleted] = useState(null);
  const [userListSelector, setUserListSelector] = useState("choose category");
  // indicate whether the log for the category should be updated.
  const initialUserCategories = {
    completed: true,
    watching: true,
    "plan to watch": true,
  };
  const [shouldCategoryUpdate, updateShouldCategoryUpdate] = useReducer(
    (shouldCategoryUpdate, updates) => ({
      ...shouldCategoryUpdate,
      ...updates,
    }),
    initialUserCategories
  );
  const initialEntries = {
    completed: null,
    watching: null,
    "plan to watch": null,
  };
  const [latestEntryFetched, updateLatestEntryFetched] = useReducer(
    (latestEntryFetched, updates) => ({ ...latestEntryFetched, ...updates }),
    initialEntries
  );
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [currentCategoryLog, setCurrentCategoryLog] = useState([]);
  // indicate whether most recently added entry comes before last rendered (triggers alphabetical reorder before next render)
  const initialAlphabStatus = {
    completed: false,
    watching: false,
    "plan to watch": false,
  };
  const [isAlphabReorderRequired, setIsAlphabReorderRequired] = useReducer(
    (isAlphabReorderRequired, updates) => ({
      ...isAlphabReorderRequired,
      ...updates,
    }),
    initialAlphabStatus
  );
  const initialLeftoverLengths = {
    completed: 0,
    watching: 0,
    "plan to watch": 0,
  };
  const [categLeftoverLength, updateCategLeftoverLength] = useReducer(
    (categLeftoverLength, updates) => ({ ...categLeftoverLength, ...updates }),
    initialLeftoverLengths
  );
  const initialFullyFetched = {
    completed: false,
    watching: false,
    "plan to watch": false,
  };
  const [isCategFullyFetched, updateIsCategFullyFetched] = useReducer(
    (isCategFullyFetched, updates) => ({ ...isCategFullyFetched, ...updates }),
    initialFullyFetched
  );

  const waitTime = 1200;

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
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search);
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
    if (location.pathname !== "/") return;
    if (allTopAnime.length === 4) return;
    const getAllMyTopAnime = async () => {
      if (!allTopAnime.airing && currentView === "explore") {
        if (currentView !== "explore") {
          const controller = new AbortController();
          return () => controller.abort();
        }
        if (currentView !== "explore") return;
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, 1100));
        const topAiring = await fetchTopTen("airing");
        updateAllTopAnime({ airing: topAiring });
        setIsFetchInProgress(false);
      }

      // upcoming

      if (!allTopAnime.upcoming && currentView === "explore") {
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        const topUpcoming = await fetchTopTen("upcoming");
        updateAllTopAnime({ upcoming: topUpcoming });
        setIsFetchInProgress(false);
      }

      // overall
      if (!allTopAnime.overall && currentView === "explore") {
        if (currentView !== "explore") return;
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        const topOverall = await fetchTopTen("overall");
        updateAllTopAnime({ overall: topOverall });
        setIsFetchInProgress(false);
      }

      // popular
      if (!allTopAnime.popular && currentView === "explore") {
        if (currentView !== "explore") return;
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        const topPopular = await fetchTopTen("popular");
        updateAllTopAnime({ popular: topPopular });
        setIsFetchInProgress(false);
      }

      // movies
      if (!allTopAnime.movies && currentView === "explore") {
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        const topMovies = await fetchTopTen("movies");
        updateAllTopAnime({ movies: topMovies });
        setIsFetchInProgress(false);
      }
    };

    getAllMyTopAnime();
    /*eslint-disable-next-line*/
  }, [allTopAnime.length, location.pathname, currentView]);

  return (
    <AppContainer>
      {/*
      Background Themes (Dark mode, etc...):
      Unnecessary at this point, but could easily be implemented in the future, if so desired. 
      There's many different ways to add Light / Dark or other theme options. The quickest, but least elegant: 
      wrap the <div className="stars-test"> below in a stateful var: {currentTheme === "stars" && <div className="stars-test"> }, 
      and do the same for the other theme. Evidently, create a stateful var for the theme first. NOTE: This would only change the bg*/}

      <Navbar isMobile={isMobile} />
      <div className="stars-test">
        <Stars></Stars>
        <Stars2></Stars2>
        <Stars3></Stars3>
      </div>
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
              updateShouldCategoryUpdate={updateShouldCategoryUpdate}
              setThumbnailURL={setThumbnailURL}
              fetchedUserLogs={fetchedUserLogs}
              latestEntryFetched={latestEntryFetched}
              updateLatestEntryFetched={updateLatestEntryFetched}
              isAlphabReorderRequired={isAlphabReorderRequired}
              setIsAlphabReorderRequired={setIsAlphabReorderRequired}
              updateFetchedUserLogs={updateFetchedUserLogs}
              categLeftoverLength={categLeftoverLength}
              updateCategLeftoverLength={updateCategLeftoverLength}
              updateIsCategFullyFetched={updateIsCategFullyFetched}
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
              upcoming={allTopAnime.upcoming}
              isMobile={isMobile}
              handleSearch={handleSearch}
              currentView={currentView}
              setCurrentView={setCurrentView}
              isFetchInProgress={isFetchInProgress}
              setIsFetchInProgress={setIsFetchInProgress}
            />
          }
        ></Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard
                myUser={myUser}
                setMyUser={setMyUser}
                fetchedUserLogs={fetchedUserLogs}
                updateFetchedUserLogs={updateFetchedUserLogs}
                loggedCompleted={loggedCompleted}
                setLoggedCompleted={setLoggedCompleted}
                userListSelector={userListSelector}
                setUserListSelector={setUserListSelector}
                fetchedUserCompleted={fetchedUserLogs.completed}
                fetchedUserWatching={fetchedUserLogs.watching}
                fetchedUserPlanToWatch={fetchedUserLogs.planToWatch}
                shouldCategoryUpdate={shouldCategoryUpdate}
                updateShouldCategoryUpdate={updateShouldCategoryUpdate}
                thumbnailURL={thumbnailURL}
                isMobile={isMobile}
                latestEntryFetched={latestEntryFetched}
                updateLatestEntryFetched={updateLatestEntryFetched}
                currentCategoryLog={currentCategoryLog}
                setCurrentCategoryLog={setCurrentCategoryLog}
                isAlphabReorderRequired={isAlphabReorderRequired}
                setIsAlphabReorderRequired={setIsAlphabReorderRequired}
                categLeftoverLength={categLeftoverLength}
                updateCategLeftoverLength={updateCategLeftoverLength}
                isCategFullyFetched={isCategFullyFetched}
                updateIsCategFullyFetched={updateIsCategFullyFetched}
              />
            </ProtectedRoute>
          }
        ></Route>

        {/* Instead of using a RestrictedRoute, redirect from within the Login component */}
        <Route
          path="/login"
          element={<Login setMyUser={setMyUser} isMobile={isMobile} />}
        ></Route>
        <Route
          path="/register"
          element={<RegisterUser setMyUser={setMyUser} isMobile={isMobile} />}
        />
        <Route path="/reset" element={<PasswordReset />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
