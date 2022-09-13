import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
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
      <form className="login-form">
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
          onClick={() => signInWithEmailAndPassword(email, password)}
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
