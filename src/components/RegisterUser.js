import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import {
  auth,
  db,
  mobileSignInWithGoogle,
  registerWithEmailAndPassword,
} from "../firebase.js";
import { FcGoogle } from "react-icons/fc";

function RegisterUser({ setMyUser, isMobile }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [user, loading] = useAuthState(auth);
  const [warningMessage, setWarningMessage] = useState(null);
  const navigate = useNavigate();

  const setEditedWarningMessage = (errorCode) => {
    let trimmedErrorMsg = errorCode.substr(5);
    setWarningMessage(trimmedErrorMsg.replace(/-/g, " "));
  };

  const validateSignUp = (e) => {
    if (!userName) {
      setWarningMessage("please provide a Name");
      return;
    }
    if (!email) {
      setWarningMessage("please provide an Email");
      return;
    }
    let isValidEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length <= 5 || !isValidEmail.test(email)) {
      setWarningMessage("Invalid email address");
      return;
    }
    if (!userName.trim() || !email.trim() || !password.trim()) {
      setWarningMessage("fields cannot be empty");
      return;
    }
    if (password.length < 8) {
      setWarningMessage("password must be at least 8 characters long");
      return;
    }

    try {
      register();
    } catch (err) {
      console.error(err);
    }
  };

  const register = (e) => {
    if (!email.trim() || !password.trim() || !userName.trim()) return;
    if (!userName || !email || !password) return;
    registerWithEmailAndPassword(
      auth,
      userName,
      email,
      password,
      setEditedWarningMessage
    );
  };

  useEffect(() => {
    if (loading) return;
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
          setUserName(data.name);
          setMyUser(data.name);
        } catch (err) {
          console.error(err);
          alert("error fetching user data");
        }
      };
      fetchUserName();
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line
  }, [user, userName, loading]);

  useEffect(() => {
    if (warningMessage) {
      setWarningMessage(null);
    }
    //eslint-disable-next-line
  }, [userName, email]);

  return (
    <div className="login-register-container-frame">
      <div className="login-register-container">
        <span className="login-header">
          <h3>Sign-up</h3>
        </span>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <button
            onClick={mobileSignInWithGoogle}
            className="login-btn with-google"
          >
            <span className="btn-icon-span">
              <FcGoogle size={25} style={{ pointerEvents: "none" }} />
            </span>
            <span className="login-google-text">Sign up with Google</span>
          </button>
          <hr />
          <span style={{ color: "white" }}>or</span>
          <label htmlFor="registration-user-name">Name:</label>
          <input
            name="registration-user-name"
            type="text"
            className="login-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
            autoComplete="off"
          />
          <label htmlFor="registration-email">Email:</label>
          <input
            name="registration-email"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
          <label htmlFor="registration-pw">Password:</label>
          <input
            name="registration-pw"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={(e) => validateSignUp(e)} className="login-btn">
            Sign Up With Email
          </button>
          <p>{warningMessage && warningMessage}</p>
        </form>
        <div className="login-signup-div">
          <hr />
          <h3>Already registered?</h3>
          <Link to="/login">
            {""}
            <br />
            <h3 className="action-link">Log In</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
