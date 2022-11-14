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
  const [currentView, setCurrentView] = useState("search");
  const isMobile = useMediaQuery({ query: "(max-width:428px)" });
  const [isFetchInProgress, setIsFetchInProgress] = useState(false);
  // --------------ATTENTION: Changed initialUserLogs = { completed: null, watching: null, "plan to watch": null}, to be:
  // ----------EDIT: OUR NEW FUNCTIONALITY BREAKS WHEN SWITCHING CATEGORIES. LOOK FOR THE CULPRIT.-----------------------
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
  // indicates whether the log for the category should be updated.
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
  const [thumbnailURL, setThumbnailURL] = useState("");

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
    // if (currentView !== "explore") return;
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

      // airing
      if (!allTopAnime.airing && currentView === "explore") {
        if (currentView !== "explore") {
          const controller = new AbortController();
          console.log("aborting fetch...");
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const topUpcoming = await fetchTopTen("upcoming");
        updateAllTopAnime({ upcoming: topUpcoming });
        setIsFetchInProgress(false);
      }

      // overall
      if (!allTopAnime.overall && currentView === "explore") {
        if (currentView !== "explore") return;
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const topOverall = await fetchTopTen("overall");
        updateAllTopAnime({ overall: topOverall });
        setIsFetchInProgress(false);
      }

      // movies
      if (!allTopAnime.movies && currentView === "explore") {
        //if (currentView !== "explore") {
        //  const controller = new AbortController();
        //  console.log("aborting fetch...");
        //  return () => controller.abort();
        //}
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const topMovies = await fetchTopTen("movies");
        updateAllTopAnime({ movies: topMovies });
        setIsFetchInProgress(false);
      }

      // popular
      if (!allTopAnime.popular && currentView === "explore") {
        if (currentView !== "explore") return;
        setIsFetchInProgress(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const topPopular = await fetchTopTen("popular");
        updateAllTopAnime({ popular: topPopular });
        setIsFetchInProgress(false);
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
  }, [allTopAnime.length, location.pathname, currentView]);

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
              updateShouldCategoryUpdate={updateShouldCategoryUpdate}
              setThumbnailURL={setThumbnailURL}
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
              {/* <Profile /> */}
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
              />
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
