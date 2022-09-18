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
import { FcGoogle } from "react-icons/fc";
import { MdMail } from "react-icons/md";

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
      <div className="registration-header">
        <h1>Sign Up</h1>
        <h3>Join MyAnimeLog to start tracking your anime. It's free!</h3>
        <br />
      </div>
      <form className="user-registration-form">
        <br />
        <button
          onClick={signInWithGoogle}
          className="register-user-btn with-google"
        >
          <span className="btn-icon-span">
            <FcGoogle size={25} style={{ pointerEvents: "none" }} />
          </span>
          Sign Up With Google
        </button>
        <hr />
        <h3>OR</h3>
        {/* <br /> */}
        {/* <p>Sign up with email</p> */}
        <label htmlFor="registration-user-name">Name:</label>
        <input
          name="registration-user-name"
          type="text"
          className="register-user-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your Name"
        />
        <label htmlFor="registration-email">Email:</label>
        <input
          name="registration-email"
          type="email"
          className="register-user-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g: kimi@email.com"
        />
        <label htmlFor="registration-pw">Password:</label>
        <input
          name="registration-pw"
          type="password"
          className="register-user-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button onClick={register} className="register-user-btn">
          <span className="btn-icon-span">
            <MdMail size={25} style={{ pointerEvents: "none" }} />
          </span>
          Sign Up With Email
        </button>
      </form>
      <div className="signup-foot">
        <span>
          <h3>Already registered?</h3>
          <Link to="/login">Log In</Link>
        </span>
      </div>
    </div>
  );
}

export default RegisterUser;
