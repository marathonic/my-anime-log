import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const navigate = useNavigate();

  // we're making a slightly modified version of sendPasswordReset here,
  // so that we can easily display an "Email not found" message on screen.
  // --------------------------CONTINUE HERE-------------------
  // Next, upon clicking the "Send password request" button,
  // we want to disable it for the next 60 seconds.

  const mySendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      setEmailNotFound(true);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="pw-reset">
      <h1>Reset password</h1>
      <div className="pw-reset-container">
        {emailNotFound && (
          <div>
            <p className="cyber-yellow">Email not found</p>
          </div>
        )}
        <input
          type="text"
          className="pw-reset-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g: example@email.com"
        />

        <button
          className="pw-reset-btn"
          onClick={() => mySendPasswordReset(email)}
        >
          Send password reset email
        </button>
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
