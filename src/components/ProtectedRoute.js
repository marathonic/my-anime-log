import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
