import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase.js";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "===", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setUserName(data.name);
    } catch (err) {
      console.error(err);
      alert("error fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div>
      <div>
        Logged in as
        <div>{userName}</div>
        <div>{user?.email}</div>
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
}

export default Dashboard;
