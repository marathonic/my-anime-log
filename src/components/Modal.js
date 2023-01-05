import React, { useState, useEffect } from "react";
import "../styles/modal-style.css";
import { OptionSelector, Selector } from "./primedComps";
import { AiFillPlusCircle, AiFillTrophy } from "react-icons/ai";
import { FcPlanner } from "react-icons/fc";
import { auth, db } from "../firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  fetchedUserLogs,
  updateLatestEntryFetched,
  setIsAlphabReorderRequired,
  updateFetchedUserLogs,
  updateCategLeftoverLength,
  updateIsCategFullyFetched,
}) {
  const [listSelector, setListSelector] = useState(
    animeDataFromLog.status || "watching"
  );
  const [episodesWatched, setEpisodesWatched] = useState(
    animeDataFromLog.watched || 0
  );
  const [myScore, setMyScore] = useState(animeDataFromLog.score || "");
  const [user] = useAuthState(auth);
  const [isLoadingLog, setIsLoadingLog] = useState(false);

  // Search the Firestore user map for the animeID
  // structure:
  // The animeLog object sits side by side with name, email, uid, etc.

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
    const { value } = e.target;
    if (Number(value) === "-") return;
    if (!value) {
      setMyScore(value);
      return;
    }

    // no decimals allowed if input is less than 1
    if (value + myScore < 1) return;

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
    // score is a float number, for better user experience.
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

    //Avoid calling Firestore if animeLog data hasn't changed
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

    // using our constructor function:
    let myAnime = AnimeLogEntry();
    console.log("myAnime", "==>", myAnime);
    console.log("animeDataFromLog", "==>", animeDataFromLog);

    if (_.isEqual(myAnime, animeDataFromLog)) {
      setIsModalOpen(false);
      return;
    }

    // Check for alphabetical order:
    function addNewEntryToLog() {
      setDoc(doc(db, "theNewUsers", user.uid, "animeLog", animeID), myAnime);
      setThumbnailURL(animeThumbnailURL);
      updateShouldCategoryUpdate({ [`${listSelector}`]: true });
      setIsFetchLocked(false);
      setIsModalOpen(false);
    }

    // We know that data has changed, because the code above did not trigger a return:
    updateIsCategFullyFetched({ [`${listSelector}`]: false });

    if (fetchedUserLogs[`${listSelector}`].length < 1) {
      //Always works as expected if the category log hasn't been rendered yet.
      addNewEntryToLog();
    } else {
      // the category has been rendered before
      // check whether the new entry comes before our last rendered entry in alphabetical order
      const newEntryName = myAnime.name;
      const currentLog = fetchedUserLogs[`${listSelector}`];
      const lastRenderedName = currentLog[currentLog.length - 1].name;

      const isNewEntryBeforeLastRendered =
        lastRenderedName.localeCompare(newEntryName);

      // Handle case where the new entry comes before the last rendered entry alphabetically:
      if (isNewEntryBeforeLastRendered === 1) {
        setIsAlphabReorderRequired({ [`${listSelector}`]: true });
        //Entry should come before last rendered (alphabetically)
        //Find out where exactly:
        let currentlyRenderedInCateg = [...fetchedUserLogs[`${listSelector}`]];
        for (let i = 0; i < currentlyRenderedInCateg.length; i++) {
          let currentRender = currentlyRenderedInCateg[i];
          let newEntryComesBeforeCurrentEntry = newEntryName.localeCompare(
            currentRender.name
          );
          if (newEntryComesBeforeCurrentEntry === -1) {
            let trimmedCategTest = [...currentLog.slice(0, i), myAnime];
            // Handle leftover log entries
            updateCategLeftoverLength({
              [`${listSelector}`]:
                currentlyRenderedInCateg.length - trimmedCategTest.length,
            });
            updateFetchedUserLogs({ [`${listSelector}`]: trimmedCategTest });
            // we could wait() between these two functions if switching back end to a low bandwidth option.
            addNewEntryToLog();
            const wait = async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            };
            wait();
            updateLatestEntryFetched({ [`${listSelector}`]: myAnime });
            const getTestModifiedCategoryLog = async () => {
              const docRef = doc(
                db,
                "theNewUsers",
                user?.uid,
                "animeLog",
                animeID
              );
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                updateLatestEntryFetched({
                  [`${listSelector}`]: docSnap,
                });
              }
            };
            getTestModifiedCategoryLog();
            return;
          }
        }
        // The loop above returns on match.
        // We're here, so the loop didn't find entries that come alphabetically before the last entry.

        // Handle case where the new entry does not come before the last rendered
        const getModifiedCategoryLog = async () => {
          const docRef = doc(db, "theNewUsers", user?.uid, "animeLog", animeID);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            updateLatestEntryFetched({
              [`${listSelector}`]: docSnap,
            });
          }
        };
        getModifiedCategoryLog();
      }
      setDoc(doc(db, "theNewUsers", user.uid, "animeLog", animeID), myAnime);
      setThumbnailURL(animeThumbnailURL);
      updateShouldCategoryUpdate({ [`${listSelector}`]: true });
      setIsFetchLocked(false);
      setIsModalOpen(false);
    }

    // If scaling app in the future, we should change how we retrieve the images to display on the users' dashboard (myLog) page.
    // Solving it now would be over-engineering for a problem that does not currently exist.
    // We don't want to spam request the cdn
    // in case a million users decided to spam reload their myLog at the same time.
    // We could store a low res webp of the cover of each anime that the user adds to their log.
    // And keep those images in a database such as Firebase Storage.
    // That would reduce load on the cdn considerably. However, we only need to limit log length.
  };

  const loadingLogSkeleton = (
    <>
      <div className="darkBG">
        <div className="centered">
          <div className="modal">
            <form>
              <div className="modalHeader">
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
          setAnimeDataFromLog(snapResponse);
          setListSelector(snapResponse.status);
          setEpisodesWatched(snapResponse.watched);
          setMyScore(snapResponse.score);
          setAnimeExistsInLog(true);
        } else {
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
                {listSelector === "plan to watch" && (
                  <span className="details-span plan-to-watch">
                    <FcPlanner size={125} />
                  </span>
                )}
                <Selector value={listSelector} onChange={handleSelection}>
                  <OptionSelector value="plan to watch">
                    Plan to watch
                  </OptionSelector>
                  <OptionSelector value="watching">Watching</OptionSelector>
                  <OptionSelector value="completed">Completed</OptionSelector>
                </Selector>
              </div>
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
