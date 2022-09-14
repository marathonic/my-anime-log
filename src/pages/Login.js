import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";

import {
  auth,
  db,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase.js";

function Login({ setMyUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
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
    }
  };

  useEffect(() => {
    if (loading) {
      // loading screen...
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div>
      <h3>Log in</h3>
      <form className="login-form" onSubmit={handleFormSubmit}>
        <label htmlFor="email-input">email: </label>
        <input
          name="email-input"
          type="text"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g: john@example.com"
        />
        <label htmlFor="email-password">password: </label>
        <input
          name="email-password"
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password here"
        />
        <button
          className="login-btn"
          onClick={() => signInWithEmailAndPassword(auth, email, password)}
        >
          Log In
        </button>
        <div className="forgot-pw">
          <span className="forgot-pw-span">
            <Link to="/reset">
              <span
                style={{
                  textDecoration: "underline",
                  letterSpacing: "1px",
                  fontSize: "1.1rem",
                  marginTop: "1rem",
                }}
              >
                Forgot password
              </span>
            </Link>
          </span>
        </div>
        <hr />
        <span style={{ color: "white" }}>or</span>
        <button className="login-btn with-google" onClick={signInWithGoogle}>
          Log in with Google
        </button>
      </form>

      <div className="login-signup-div">
        <h3>Don't have an account?</h3>
        <Link to="/register">
          {" "}
          <br /> <h3 style={{ color: "lightgreen" }}>Sign up</h3>
        </Link>
      </div>
    </div>
  );
}

export default Login;
