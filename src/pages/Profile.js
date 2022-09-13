import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);

  // This works very well, and it's a lot shorter than Dashboard.js

  return (
    <div>
      <h1>User Profile</h1>
      <h3>Name: {user.displayName}</h3>
      <h3>Email: {user.email}</h3>
      <h3>Email: {user.emailVerified}</h3>
    </div>
  );
}
