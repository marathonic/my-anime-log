import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase.js";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard({ myUser }) {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
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
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);
  return (
    <div>
      <div>
        <h1>My Profile</h1>
        <div>
          {/* <h3>{userName}</h3> */}
          <h3>My User: </h3>
          <h3> {myUser} </h3>
        </div>
        <div>
          <h3>{user?.email}</h3>
        </div>
        <h3>Email verified: {user.emailVerified}</h3>
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
}

export default Dashboard;
