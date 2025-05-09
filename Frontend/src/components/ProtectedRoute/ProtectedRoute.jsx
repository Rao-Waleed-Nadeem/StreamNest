import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const user = useSelector((state) => state?.user?.user);

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
