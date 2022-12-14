import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import {
  auth,
  db,
  signInWithEmailAndPassword,
  mobileSignInWithGoogle,
} from "../firebase.js";
import { FcGoogle } from "react-icons/fc";

function Login({ setMyUser, isMobile }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [warningMessage, setWarningMessage] = useState(null);
  const [isBtnOnTimeout, setIsBtnOnTimeout] = useState(true);
  const navigate = useNavigate();

  const validateSignIn = async () => {
    if (!email.trim() || !password.trim()) return;
    let isValidEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length <= 5 || !isValidEmail.test(email)) {
      setWarningMessage("Invalid email address");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      let errorCode = err.code;
      let trimmedErrorMsg = errorCode.substr(5);
      setWarningMessage(trimmedErrorMsg.replace(/-/g, " "));
    }

    handleFormSubmit();
  };

  const handleFormSubmit = () => {
    if (user) {
      const fetchUserName = async () => {
        try {
          const q = query(
            collection(db, "theNewUsers"),
            where("uid", "==", user?.uid)
          );
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
          // console.log(data);
          //set the user name (username)
          setMyUser(data.name);
        } catch (err) {
          console.error(err);
          alert("error fetching user data");
        }
      };
      fetchUserName();
    }
  };

  const handleEmailInputChange = (e) => {
    if (warningMessage) {
      setWarningMessage(null);
    }
    setEmail(e.target.value);
  };

  const hanldePasswordInputChange = (e) => {
    if (warningMessage) {
      setWarningMessage(null);
    }
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  useEffect(() => {
    setIsBtnOnTimeout(true);
    const initBtn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsBtnOnTimeout(false);
    };
    initBtn();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-register-container-frame">
      <div className="login-register-container">
        <span className="login-header">
          <h3>Login</h3>
        </span>
        <form className="login-form" onSubmit={handleSubmit}>
          {warningMessage && (
            <span className="cyber-yellow warning-span">{warningMessage}</span>
          )}
          <button
            className="login-btn with-google"
            onClick={mobileSignInWithGoogle}
            disabled={isBtnOnTimeout}
          >
            <span className="btn-icon-span">
              <FcGoogle size={25} style={{ pointerEvents: "none" }} />
            </span>
            <span className="login-google-text">Log in with Google</span>
          </button>
          <hr />
          <span style={{ color: "white" }}>or</span>
          <label htmlFor="email-input">email: </label>
          <input
            name="email-input"
            type="email"
            className="login-input"
            value={email}
            onChange={handleEmailInputChange}
            placeholder="e.g: john@example.com"
          />
          <label htmlFor="email-password">password: </label>
          <input
            name="email-password"
            type="password"
            className="login-input"
            value={password}
            onChange={hanldePasswordInputChange}
            placeholder="your password here"
          />
          <button className="login-btn" onClick={validateSignIn}>
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
        </form>
        <div className="login-signup-div">
          <hr />
          <h3>Don't have an account?</h3>
          <Link to="/register">
            {" "}
            <br /> <h3 className="action-link">Sign up</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
