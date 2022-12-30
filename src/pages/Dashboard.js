import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase.js";
import { query, collection, getDocs, where } from "firebase/firestore";
import UsersAnimeLog from "../components/UsersAnimeLog.js";
import SignOutModal from "../components/SignOutModal.js";

function Dashboard({
  myUser,
  setMyUser,
  fetchedUserLogs,
  updateFetchedUserLogs,
  loggedCompleted,
  setLoggedCompleted,
  userListSelector,
  setUserListSelector,
  shouldCategoryUpdate,
  updateShouldCategoryUpdate,
  thumbnailURL,
  isMobile,
  latestEntryFetched,
  updateLatestEntryFetched,
  currentCategoryLog,
  setCurrentCategoryLog,
  isAlphabReorderRequired,
  setIsAlphabReorderRequired,
  categLeftoverLength,
  updateCategLeftoverLength,
  isCategFullyFetched,
  updateIsCategFullyFetched,
}) {
  const [user, loading] = useAuthState(auth);

  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false);

  const navigate = useNavigate();

  console.log(latestEntryFetched);

  useEffect(() => {
    if (loading) return <h1>LOADING...</h1>;
    if (!user) return navigate("/");
    if (user) {
      const fetchUserName = async () => {
        try {
          const q = query(
            collection(db, "theNewUsers"),
            where("uid", "==", user?.uid)
          );
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
          // console.log(data);
          setMyUser(data.name);
        } catch (err) {
          console.error(err);
          alert("error fetching user data");
        }
      };
      fetchUserName();
    }
    // eslint-disable-next-line
  }, [user, loading]);

  return (
    <div>
      <UsersAnimeLog
        loggedCompleted={loggedCompleted}
        setLoggedCompleted={setLoggedCompleted}
        userListSelector={userListSelector}
        setUserListSelector={setUserListSelector}
        updateFetchedUserLogs={updateFetchedUserLogs}
        fetchedUserLogs={fetchedUserLogs}
        shouldCategoryUpdate={shouldCategoryUpdate}
        updateShouldCategoryUpdate={updateShouldCategoryUpdate}
        user={user}
        animeThumbnailURL={thumbnailURL}
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

      <div></div>

      <div className="user-details-foot">
        <span className="user-foot-span">
          <hr className={!isMobile ? "foot-margin-exception" : ""} />
        </span>

        <div>
          <h3>signed in as {myUser} </h3>
        </div>
        <div>
          <h3>{user?.email}</h3>
        </div>
        <button
          onClick={() => setIsSignoutModalOpen(true)}
          className="log-out-btn"
        >
          Sign out
        </button>
        {isSignoutModalOpen && (
          <SignOutModal
            logout={logout}
            setIsSignoutModalOpen={setIsSignoutModalOpen}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
