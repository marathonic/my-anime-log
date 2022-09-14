import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import {
  auth,
  db,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase.js";

function RegisterUser({ setMyUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!userName) alert("Please enter a name");
    // registerWithEmailAndPassword(userName, email, password);
    registerWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      const fetchUserName = async () => {
        try {
          const q = query(
            collection(db, "users"),
            where("uid", "==", user?.uid)
          );
          const doc = await getDocs(q);
          console.log(doc);
          //
          const data = doc.docs[0].data();
          //
          console.log(data);
          //
          setUserName(data.name);
          setMyUser(data.name);
        } catch (err) {
          console.error(err);
          alert("error fetching user data");
        }
      };
      fetchUserName();
      navigate("/dashboard", { replace: true });
      // IT'S NOT REDIRECTING US UPON REGISTRATION. FIND OUT WHY.
      // EDIT: It now redirects us.
    }
  }, [user, userName, loading]);
  return (
    <div className="register-user">
      <div className="register-user-container">
        <input
          type="text"
          className="register-user-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your Name"
        />
        <input
          type="email"
          className="register-user-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g: kimi@email.com"
        />
        <input
          type="password"
          className="register-user-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button onClick={register}>Sign Up</button>
        <hr />
        <button onClick={signInWithGoogle}>Sign Up With Google</button>
        <h3>Already registered?</h3>
        <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}

export default RegisterUser;
