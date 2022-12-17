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
  const [warningMessage, setWarningMessage] = useState(null);
  const navigate = useNavigate();

  const validateSignUp = (e) => {
    e.preventDefault();
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
      if (err.code === "auth/invalid-email") {
        setWarningMessage("invalid email");
        return;
      }

      // if (err.code === "auth/wrong-password") {
      //   setWarningMessage("wrong password");
      // }
    }

    registerWithEmailAndPassword(auth, email, password);

    //register();
  };

  const register = (e) => {
    // if (!userName) alert("Please enter a name");
    e.preventDefault();
    if (!email.trim() || !password.trim() || !userName.trim()) return;
    if (!userName || !email || !password) return;
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
          {/* <h3>Join MyAnimeLog to start tracking your anime</h3> */}
        </span>
        <form className="login-form">
          <button onClick={signInWithGoogle} className="login-btn with-google">
            <span className="btn-icon-span">
              <FcGoogle size={25} style={{ pointerEvents: "none" }} />
            </span>
            Sign Up With Google
          </button>
          <hr />
          <span style={{ color: "white" }}>or</span>
          {/* <br /> */}
          {/* <p>Sign up with email</p> */}
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
            placeholder="e.g: kimi@email.com"
          />
          <label htmlFor="registration-pw">Password:</label>
          <input
            name="registration-pw"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button
            onClick={(e) => validateSignUp(e)}
            className="register-user-btn"
          >
            <span className="btn-icon-span">
              <MdMail size={25} style={{ pointerEvents: "none" }} />
            </span>
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
