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

function Modal({
  setIsModalOpen,
  episodesAired,
  animeID,
  setIsFetchLocked,
  isFetchLocked,
}) {
  const [listSelector, setListSelector] = useState("watching");
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [myScore, setMyScore] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [animeLog, setAnimeLog] = useState({});
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

  const handleWatchedInputChange = (e) => {
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
  };
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
      try {
        //        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        //        const docu = await getDocs(q);
        //        const data = docu.docs[0].data();
        //        console.log(data);
        //        console.log(data.altStructureAnimeLog);

        //DOES THE animeID EXIST IN THE COLLECTION userAnimeLogs?
        /* CHECK IF AN animeId EXISTS IN THE USER'S ANIME LOG  */
        // const animeIdRef = doc(db, "usersAnimeLogs", user.uid, "all", animeID);
        const animeIdRef = doc(db, "userData", user.uid, "animeLog", animeID);
        const animeSnap = await getDoc(animeIdRef);

        if (animeSnap.exists()) {
          console.log("Document data:", animeSnap.data());
        } else {
          console.log("No such anime in the user's log");
        }

        //^^^^^^^^ If the above works, now we just need to
        // have our Confirm button actually log the anime,
        // for which, we'll use setDoc.
        //
        //
        // ignore below for now, focus on the above ^^^

        // Perhaps we were on the right track signing up users again.
        // If upon registration we assign each user a doc like so:
        // users --> user.uid --> userData: {...}, animeLog: {...},
        // we could do the above, like
        // doc(db, "userData", user.uid, "animeLog", animeID);
        // Let's try that.

        // when retrieving all anime by status (completed, etc.):

        // const animeLogRef = collection(db, "usersAnimeLogs", user.uid, "all");

        //

        /* GET MULTIPLE DOCUMENTS FROM A COLLECTION */
        // example: get all completed anime:
        /*
        const q = query(
          collection(db, "usersAnimeLogs", user.uid, "all"),
          where("status", "==", "completed")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((anime) => {
          console.log(anime.animeId);
        }); 
        */

        // Ok this creates a new "user" with id of our current user's uid, which isn't what we're trying to do here.
        // EDIT: ^^^That is now exactly what we're doing lol, let's experiment.

        // let singleAnimeID = await getDoc(db, "userAnimeLogs", user.uid,  )
        // const userAnimeLogsRef = collection(db, "userAnimeLogs");
        // const q = query(userAnimeLogsRef, where("animeId", "==", animeID ))

        // --------USE LATER:
        // Ok, this is good for when we want to CONFIRM, to log our anime:
        // but, in this function we're not doing that, we're just checking if it's in our log already.
        //setDoc(doc(db, 'userAnimeLogs', user.uid, "animeLog", "watching"), {
        //  [animeID]: {
        //    'name': 'myFirstAnimeSaved',
        //  }
        //})

        // So 9969 is actually a document.
        // We alternate <collection, document> to get a document with doc()
        // /Parent path: users/GX6mrv50HSfK0b0LFtRc/animeLog
        // Parent path: /users/GX6mrv50HSfK0b0LFtRc/animeLog/mSjjRrcCKEUkk7Ppvc1m
        // .collection("animeLog")
        // /users/GX6mrv50HSfK0b0LFtRc/animeLog/structureVersion3-Watching

        // setAnimeLog(data);
        setIsFetchLocked(true);
      } catch (err) {
        console.error(err);
        alert("err");
      }
    };
    getAnimeLogFromDatabase();
    /*eslint-disable-next-line */
  }, []);

  return (
    <>
      <div className="darkBG">
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              {/* <h1>Modal</h1> */}
              <h5 className="heading">Add to my log</h5>
              <button
                className="closeBtn"
                onClick={() => setIsModalOpen(false)}
              >
                X
              </button>
            </div>
            {/* delete? */}
            {/* WE COULD TURN THIS INTO A FUNCTION:
            We can put the function in our utils folder
            In that document, we will make 3 other functions:
            registerWatching, registerCompleted, registerPlanToWatch.
            The function we will be exporting is our main function: 
            That main function takes 3 parameters: (selector, epsAired, epsWatched);
            // Inside the function, perform a switch statement.
            // switch(selector), case x: registerWatching() break; case y: registerCompleted etc...
            To call it here, pass (listSelector, episodesAired, episodesWatched).
            In case of x  */}
            <div className="modalContent">
              {listSelector === "watching" && (
                <div className="watching-container">
                  <span className="details-span watching">
                    <p className="sky-blue">Episodes: {episodesAired}</p>
                  </span>
                  <span className="details-span watching">
                    <p>Watched: </p>
                    {/* <div className="eps-input-div"> */}
                    {/* might want to experiment with a green + circle just off the top right corner of the input */}
                    <input
                      type="number"
                      min={1}
                      max={2000}
                      value={episodesWatched}
                      onChange={handleWatchedInputChange}
                      onKeyDown={preventDecimalWatched}
                    ></input>
                    {episodesWatched < episodesAired && (
                      <button
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
                    <p>My score: </p>
                    <input
                      type="number"
                      className="score-input"
                      value={myScore}
                      onKeyDown={preventMinus}
                      onPaste={preventPasteNegative}
                      onChange={handleScoreInputChange}
                      placeholder="1 to 10"
                    ></input>
                  </span>
                </div>
              )}
              {listSelector === "completed" && (
                <AiFillTrophy size={100} color="gold" />
              )}
              {/* END ------------------^^^^^^^^^^^  */}
              {/* ------------------^^^^^^^^^^^  */}
              <Selector value={listSelector} onChange={handleSelection}>
                <OptionSelector value="plan-to-watch">
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
                className="cancelBtn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="confirmBtn"
                onClick={() => setIsModalOpen(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
