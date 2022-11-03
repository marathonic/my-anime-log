import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase.js";
import { query, collection, getDocs, where } from "firebase/firestore";
import UsersAnimeLog from "../components/UsersAnimeLog.js";
import { OptionSelector, Selector } from "../components/primedComps";

function Dashboard({ myUser, setMyUser }) {
  const [user, loading, error] = useAuthState(auth);
  const [listSelector, setListSelector] = useState('');
  const [loggedCompleted, setLoggedCompleted] = useState(null);
  
  const handleSelection = (e) => {
    setListSelector(e.target.value);
    if(e.target.value === 'completed') {
      setLoggedCompleted(['completed 1', 'completed 2', 'completed 3', 'etc...'])
    }
  };

  const navigate = useNavigate();
  // As we can see from the user oject below:
  // console.log(user);
  // That one isn't out uid object that holds our "name",
  // BUT It does hold a "uid" field, which contains a uid.
  // We want to access the check (map?) against our "users"  object in Firestore,
  // and get the one that matches the uid. Then once inside there, we can get the "name"

  // const fetchUserName = async () => {
  //   try {
  //     const q = query(collection(db, "users"), where("uid", "==", user?.uid));
  //     const doc = await getDocs(q);
  //     console.log(doc);
  //     //
  //     const data = doc.docs[0].data();
  //     //
  //     console.log(data);
  //     //
  //     setUserName(data.name);
  //   } catch (err) {
  //     console.error(err);
  //     alert("error fetching user data");
  //   }
  // };
  useEffect(() => {
    // In order to stop the re-fetching every time we navigate here,
    // I think I know how to stop that:
    //
    // Let's fetch the User on the RegisterUser screen,
    // and then pass it as props here.
    // That way, we don't need to fetch the information from this page.
    // To do that, we could pass a function to RegisterUser from App.js
    // Then from App.js, pass that value as a prop to Dashboard.js
    if (loading) return <h1>LOADING...</h1>;
    if (!user) return navigate("/");
    if (user) {
      const fetchUserName = async () => {
        try {
          const q = query(
            collection(db, "users"),
            where("uid", "==", user?.uid)
          );
          const doc = await getDocs(q);

          //
          const data = doc.docs[0].data();
          //
          console.log("-----------data below this line------------");
          console.log(data);
          console.log("--------------NAME BELOW THIS LINE----------");
          console.log(data.name);
          //
          // setUserName(data.name);
          setMyUser(data.name); // <--- set the user name
        } catch (err) {
          console.error(err);
          alert("error fetching user data");
        }
      };
      fetchUserName();
      // 
    }
  }, [user, loading]);
  return (
    <div>
      {/* <UsersAnimeLog /> */}
      <div>
        {/*  */}
      <h1 style={{ color: "white", fontSize: "3rem" }}>my Log</h1>
      <hr />
      <Selector defaultValue={listSelector} onChange={handleSelection}>
                  <OptionSelector value={listSelector}>category</OptionSelector>
                  <OptionSelector value="completed">Completed</OptionSelector>
                  <OptionSelector value="watching">Watching</OptionSelector>
                  <OptionSelector value="plan-to-watch">
                    Plan to watch
                  </OptionSelector>
                </Selector>
                {loggedCompleted && listSelector === "completed" &&
                <p>{loggedCompleted}</p>
                }
    </div>

      {/*  */}
      <div className="user-details-foot">
        <hr />

        {/* <h1>My Profile</h1> */}
        
        <div>
        
          {/* <h3>{userName}</h3> */}
          {/* <h3>My User: </h3> */}
          <h3>signed in as {myUser} </h3>
        </div>
        <div>
          <h3>{user?.email}</h3>
        </div>
        {/* <h3>Name: {user?.name}</h3> */}
        {/* <h3>Email verified: {user.emailVerified}</h3> */}
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
}

export default Dashboard;
