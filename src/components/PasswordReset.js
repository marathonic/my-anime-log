import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [warningMessage, setWarningMessage] = useState(null);
  // const [buttonCooldown, setButtonCooldown] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const persistentTimer = sessionStorage.getItem("timer");
  const [countdownActive, setCountdownActive] = useState(false);
  const navigate = useNavigate();

  // we're making a slightly modified version of sendPasswordReset here,
  // so that we can easily display an "Email not found" message on screen.
  // --------------------------CONTINUE HERE-------------------
  // Next, upon clicking the "Send password request" button,
  // we want to disable it for the next 60 seconds.
  // next day:
  // NOTE: We may wish to implement a verifyE

  const mySendPasswordReset = async (email) => {
    try {
      if (!email.trim()) return;
      // if (email.length <= 3) return;
      let reggae =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email.length <= 5 || !reggae.test(email)) {
        setWarningMessage("Invalid email address");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
      setCountdownActive(true);
    } catch (err) {
      console.error(err);
      setWarningMessage("User not found");
      alert(err.message);
      console.log(email);
    }
  };

  const handleEmailInputChange = (e) => {
    if (warningMessage) {
      setWarningMessage(null);
    }
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mySendPasswordReset(email);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  useEffect(() => {
    let latestTime = sessionStorage.getItem("timer");
    if (latestTime < 60) {
      setCountdown(latestTime);
      setCountdownActive(true);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (countdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdownActive(false);
      setCountdown(60);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countdownActive, countdown]);

  window.onbeforeunload = function (e) {
    sessionStorage.setItem("timer", countdown);
  };

  return (
    <div className="pw-reset">
      <h1>Reset password</h1>
      <div className="pw-reset-container">
        {countdownActive && (
          <span>
            <h3 className="cyber-yellow">
              Email sent, check your Spam folder!
            </h3>
          </span>
        )}
        {warningMessage && (
          <div>
            <p className="cyber-yellow">{warningMessage}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="pw-reset-form">
          <input
            type="email"
            className="pw-reset-input"
            value={email}
            disabled={countdownActive}
            onChange={handleEmailInputChange}
            placeholder="e.g: example@email.com"
          />

          <button
            className="pw-reset-btn"
            disabled={countdownActive}
            // onClick={() => }
          >
            {!countdownActive && <span>Send password reset email</span>}
            {countdownActive && <span>Try again in {countdown}</span>}
            {/* {countdownActive && countdown} */}
          </button>
        </form>
      </div>

      <span className="pw-reset-foot">
        <h3>Dont have an account yet?</h3>{" "}
      </span>
      <Link to="/register">
        <span className="cyber-yellow">Sign up for free!</span>
      </Link>
    </div>
  );
}

export default PasswordReset;
