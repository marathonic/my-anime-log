import React, { useState, useEffect } from "react";
import "../styles/modal-style.css";
import { OptionSelector, Selector } from "./primedComps";
import { AiFillPlusCircle, AiFillTrophy } from "react-icons/ai";
import { auth, db, logout } from "../firebase.js";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from "react-loading-skeleton";
import _ from "lodash";

function Modal({
  setIsModalOpen,
  episodesAired,
  animeID,
  setIsFetchLocked,
  isFetchLocked,
  animeTitle,
  animeDataFromLog,
  setAnimeDataFromLog,
  animeExistsInLog,
  setAnimeExistsInLog,
  updateShouldCategoryUpdate,
  animeThumbnailURL,
  setThumbnailURL,
}) {
  const [listSelector, setListSelector] = useState(
    animeDataFromLog.status || "watching"
  );
  const [episodesWatched, setEpisodesWatched] = useState(
    animeDataFromLog.watched || 0
  ); // <-- useState(loggedEps || 0);
  const [myScore, setMyScore] = useState(animeDataFromLog.score || ""); // <-- useState(loggedScore) || "";
  // ^^ for both of the above: Set to user's log data for that anime. If null, set to 0 or "";
  // To set the user's log data, use state.
  // const [loggedEpisodes, setLoggedEpisodes] = useState(0).
  // Then, inside a function: setLoggedEpisodes()
  const [user, loading, error] = useAuthState(auth);
  const [animeLog, setAnimeLog] = useState({});
  const [isLoadingLog, setIsLoadingLog] = useState(false); //<-- SET TO FALSE TO TURN OFF

  // We want to search the Firestore user for the animeID
  // structure:
  // users --> randomStringDocument --> name, email, uid !== userID ? (castleracer: bolPu0WO...) -->
  // We want the randomStringDocument, because the uid itself only holds the uid string, it doesn't hold our anime objects there.
  // WE'RE GETTING KIRITO FROM name: Kirito. That's on the same level as our anime would be.
  // The anime objects sit side by side with name, email, uid, etc.

  const handleSelection = (e) => {
    setListSelector(e.target.value);
  };

  const preventDecimalWatched = (e) => {
    if (e.key === ".") {
      e.preventDefault();
      return;
    }
  };

  const handleRedInputBorder = (inputId, addOrRemove) => {
    if (addOrRemove === "add") {
      document.querySelector(`#${inputId}`).classList.add("attention-input");
    } else if (addOrRemove === "remove") {
      document.querySelector(`#${inputId}`).classList.remove("attention-input");
    }
  };

  const handleWatchedInputChange = (e) => {
    handleRedInputBorder("epsWatchedInput", "remove");

    const { value } = e.target;
    if (!value || value <= 0) {
      setEpisodesWatched(0);
      //OR: setEpisodesWatched(value); <--- experiment with this
      return;
    }
    if (value === episodesAired) return;
    if (value > episodesAired) return;
    if (value.toString().length > episodesAired.toString().length + 1) return;
    setEpisodesWatched(parseInt(value, 10));
  };

  const handleIncreaseWatchedBtn = () => {
    if (episodesWatched === episodesAired) return;
    if (episodesWatched > episodesAired) return;
    handleRedInputBorder("epsWatchedInput", "remove");
    setEpisodesWatched(Number(episodesWatched) + 1);
  };

  const preventMinus = (e) => {
    if (e.key === "-") {
      e.preventDefault();
      return;
    }
    console.log(myScore);
    if (Number(myScore) === 10) {
      if (e.key === ".") {
        e.preventDefault();
        return;
      }
    }
  };

  const preventPasteNegative = (e) => {
    e.preventDefault();
    return;
  };

  const handleScoreInputChange = (e) => {
    // --------------BUG!!!
    //User can input - subtraction sign right after a number.
    // After which, user can link a lot of numbers, like so:
    // 1-1.0167.957-301, etc...
    // This is very alarming, solve ASAP.

    const { value } = e.target;
    if (Number(value) === "-") return;
    if (!value) {
      setMyScore(value);
      return;
    }

    // no decimals allowed if input is less than 1
    if (value + myScore < 1) return;

    // idea: if value.length >= 3 and there's no decimal point...
    // other idea: if there is at least one leading zero and there is a decimal point, remove all leading zeroes (slice(n position that isnt zero))

    if (value === "1") {
      console.log("check for 10");
      console.log(e.key);
      if (e.key === ".") return;
    }

    if (value.length >= 3 && Number(value - 10 === 0)) {
      console.log("Should be 10");
      setMyScore(value.slice(0, 2));
      return;
    }

    if (value.toString().length > 3) {
      setMyScore(value.slice(0, 3));
      return;
    }
    if (value > 10) return;
    // score is a float number, for greater user experience.
    // console.log(typeof value);
    setMyScore(parseFloat(value, 10));

    if (
      listSelector === "completed" &&
      document
        .querySelector("#completedScoreInput")
        .classList.contains("attention-input")
    ) {
      handleRedInputBorder("completedScoreInput", "remove");
    }
  };

  const handleConfirmClick = (e) => {
    e.preventDefault();
    if (listSelector === "completed" && !myScore) {
      handleRedInputBorder("completedScoreInput", "add");
      return;
    }
    if (listSelector === "watching" && !episodesWatched) {
      handleRedInputBorder("epsWatchedInput", "add");
      return;
    }
    // -----------------------
    // ----------CONTINUE HERE!!!
    // NEXT STEP: Populate the inputs with the Firestore data in the useEffect.
    // ^^^^^^^^

    console.log("running handleConfirmClick");
    // Let's just create a constructor function instead!

    // We'd like to avoid calling Firestore if the data hasn't changed (if the inputs are === animeLog).
    // constructor function:
    function AnimeLogEntry() {
      if (listSelector === "completed") {
        return {
          name: animeTitle,
          status: listSelector,
          watched: episodesAired,
          score: myScore || "",
          mal_id: animeID,
          thumbnailURL: animeThumbnailURL,
        };
      } else {
        return {
          name: animeTitle,
          status: listSelector,
          watched: episodesWatched || 0,
          score: myScore || "",
          mal_id: animeID,
          thumbnailURL: animeThumbnailURL,
        };
      }
    }

    // our possible solution, using our constructor function:
    let myAnime = AnimeLogEntry();
    console.log("myAnime", "==>", myAnime);
    console.log("animeDataFromLog", "==>", animeDataFromLog);

    // I suspect the line below might have been rendered obsolete when we changed our Firestore structure
    if (_.isEqual(myAnime, animeDataFromLog)) {
      console.log("data has not changed, returning...");
      // updateShouldCategoryUpdate({ [`${listSelector}`]: false });
      setIsModalOpen(false);
      return;
    }
    // data has changed, so log the new data:
    setDoc(doc(db, "theNewUsers", user.uid, "animeLog", animeID), myAnime);
    setThumbnailURL(animeThumbnailURL);
    updateShouldCategoryUpdate({ [`${listSelector}`]: true });
    setIsFetchLocked(false);
    setIsModalOpen(false);
  };

  const loadingLogSkeleton = (
    <>
      <div className="darkBG">
        <div className="centered">
          <div className="modal">
            <form>
              <div className="modalHeader">
                {/* <h1>Modal</h1> */}
                <button type="button" className="closeBtn" disabled={true}>
                  -
                </button>
              </div>

              <div className="modalContent">
                <div className="watching-container loading">
                  <span className="details-span watching"></span>

                  <span className="details-span watching">
                    <Skeleton
                      width={"9rem"}
                      height={"72%"}
                      duration={0.5}
                      highlightColor="#E8F0F2"
                      baseColor="#cdcccc"
                    ></Skeleton>
                  </span>
                  <span className="details-span watching">
                    <Skeleton
                      width={"9rem"}
                      height={"72%"}
                      duration={0.5}
                      highlightColor="#E8F0F2"
                      baseColor="#cdcccc"
                    ></Skeleton>
                  </span>
                </div>
                <div className="loading-list-selector">
                  <Skeleton
                    width={"72%"}
                    height={"1.6rem"}
                    duration={0.5}
                    highlightColor="#E8F0F2"
                    baseColor="#cdcccc"
                  ></Skeleton>
                </div>
              </div>
              {/* Save should also close the modal when clicked */}
              <div className="actionsContainer">
                <Skeleton className="cancel-btn" width={"30%"} height={"20%"}>
                  baseColor="silver"
                </Skeleton>
                <Skeleton
                  className="confirmBtn"
                  width={"30%"}
                  height={"20%"}
                  baseColor="silver"
                ></Skeleton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  // Let's try to avoid unnecessary requests to firebase.
  // if data has been fetched and nothing has changed, don't fetch again.
  // for this, we will want to run a check when we click Confirm:
  // We will save the info from the first fetch to state
  // inside onClick for Confirm btn, check if the input value matches state.
  // As long as the input values (completed: false, watched: n, rating: n, planToWatch: true)
  // As long as those input values don't change, it'll never refetch new data from firebase, regardless of how many times we click the button.
  // However, if the data is indeed different, we want to setShouldFetchNewData(true);
  // useEffect(() => {
  // if (loading) return;

  //    if (user) {
  //      const fetchUserData = async () => {
  //        try {
  //          const q = query(
  //            collection(db, "users"),
  //            where("uid", "==", user?.uid)
  //          );
  //          const doc = await getDocs(q);
  //
  //          //
  //          const data = doc.docs[0].data();
  //          //
  //          console.log("user data below this line---");
  //          console.log(data);
  //          console.log("--ANIMEID WE'RE VIEWING:");
  //          console.log(animeID);
  //        } catch (err) {
  //          console.error(err);
  //          alert("error fetching user data");
  //        }
  //      };
  //      fetchUserData();
  //    }
  //  }, [user, loading, animeID]);

  useEffect(() => {
    if (isFetchLocked) return;
    const getAnimeLogFromDatabase = async () => {
      setIsLoadingLog(true);
      try {
        const animeIdRef = doc(
          db,
          "theNewUsers",
          user.uid,
          "animeLog",
          animeID
        );
        const animeSnap = await getDoc(animeIdRef);

        if (animeSnap.exists()) {
          console.log("Document data:", animeSnap.data());
          const snapResponse = animeSnap.data();
          // const snapResponse = snapResponse[`${animeID}`];
          setAnimeDataFromLog(snapResponse);
          // test if the following are needed, since on first render they'll be sent to SingleAnime:
          // and if not found, useState OR (  ||  ) clause sets them.
          setListSelector(snapResponse.status);
          setEpisodesWatched(snapResponse.watched);
          setMyScore(snapResponse.score);
          setAnimeExistsInLog(true);
          // const animeDataInLog = animeSnap.data();

          console.log(snapResponse);
        } else {
          console.log("No such anime in the user's log");
          setAnimeExistsInLog(false);
        }

        setIsFetchLocked(true);
      } catch (err) {
        console.error(err);
        alert("err");
      }
      setIsLoadingLog(false);
    };
    getAnimeLogFromDatabase();
    /*eslint-disable-next-line */
  }, []);

  if (isLoadingLog) return loadingLogSkeleton;

  return (
    <>
      <div className="darkBG">
        <div className="centered">
          <div className="modal">
            <form>
              <div className="modalHeader">
                {/* <h1>Modal</h1> */}
                <h5 className="heading">
                  {animeExistsInLog ? "Update" : "Add to my log"}
                </h5>
                <button
                  type="button"
                  className="closeBtn"
                  onClick={() => setIsModalOpen(false)}
                >
                  X
                </button>
              </div>

              <div className="modalContent">
                {listSelector === "watching" && (
                  <div className="watching-container">
                    <span className="details-span watching">
                      <p className="sky-blue">Episodes: {episodesAired}</p>
                    </span>

                    <span className="details-span watching">
                      <label htmlFor="epsWatchedInput">Watched: </label>
                      {/* <div className="eps-input-div"> */}
                      {/* might want to experiment with a green + circle just off the top right corner of the input */}
                      <input
                        type="number"
                        min={1}
                        max={2000}
                        value={episodesWatched}
                        onChange={handleWatchedInputChange}
                        onKeyDown={preventDecimalWatched}
                        id="epsWatchedInput"
                        required
                      ></input>
                      {episodesWatched < episodesAired && (
                        <button
                          type="button"
                          className="ep-count"
                          onClick={handleIncreaseWatchedBtn}
                        >
                          <AiFillPlusCircle
                            size={27}
                            style={{ pointerEvents: "none" }}
                          />
                        </button>
                      )}
                      {/* </div> */}
                    </span>

                    <span className="details-span watching">
                      <label htmlFor="scoreInput">My score: </label>
                      <input
                        type="number"
                        className="score-input"
                        value={myScore}
                        onKeyDown={preventMinus}
                        onPaste={preventPasteNegative}
                        onChange={handleScoreInputChange}
                        placeholder="1 to 10"
                        id="scoreInput"
                        required
                      ></input>
                    </span>
                  </div>
                )}
                {listSelector === "completed" && (
                  <span className="details-span completed">
                    <AiFillTrophy size={76} color="gold" />
                    <span className="completed-score-span">
                      <label htmlFor="completedScoreInput">My score: </label>
                      <input
                        type="number"
                        className="score-input"
                        value={myScore}
                        onKeyDown={preventMinus}
                        onPaste={preventPasteNegative}
                        onChange={handleScoreInputChange}
                        placeholder="1 to 10"
                        id="completedScoreInput"
                        required
                      ></input>
                    </span>
                  </span>
                )}
                {/* END ------------------^^^^^^^^^^^  */}
                {/* ------------------^^^^^^^^^^^  */}
                <Selector value={listSelector} onChange={handleSelection}>
                  <OptionSelector value="plan to watch">
                    Plan to watch
                  </OptionSelector>
                  <OptionSelector value="watching">Watching</OptionSelector>
                  <OptionSelector value="completed">Completed</OptionSelector>
                  {/* <option ></option> */}
                  {/* <option ></option> */}
                  {/* <option ></option> */}
                </Selector>
              </div>
              {/* Save should also close the modal when clicked */}
              <div className="actionsContainer">
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="confirmBtn" onClick={handleConfirmClick}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
