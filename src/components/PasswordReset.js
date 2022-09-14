import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="pw-reset">
      <div className="pw-reset-container">
        <input
          type="text"
          className="pw-reset-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g: example@email.com"
        />
        <button
          className="pw-reset-btn"
          onClick={() => sendPasswordReset(email)}
        >
          Send password reset email
        </button>
      </div>
      <span>
        <h3>Dont have an account yet?</h3>{" "}
      </span>
      <Link to="/register">Sign up for free!</Link>
    </div>
  );
}

export default PasswordReset;
