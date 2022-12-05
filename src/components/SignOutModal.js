import React from "react";

function SignOutModal({ logout, setIsSignoutModalOpen }) {
  return (
    <div className="blur-bg">
      <div className="signout-modal">
        <p style={{ fontWeight: "bold", fontSize: "2rem" }}> </p>
        <br />
        <p>Are you sure you want to sign out?</p>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <button onClick={logout}>Yes</button>
          <button onClick={() => setIsSignoutModalOpen(false)}>Nope</button>
        </div>
      </div>
    </div>
  );
}

export default SignOutModal;
