// navigation/AdminRouter.js
import { Route, Redirect } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";
import { useUser } from "../contexts/UserContext";

const AdminRouter = () => {
  const { user } = useUser();

  return (
    <Route
      render={() =>
        user?.isAdmin ? <AdminDashboard /> : <Redirect to="/login" />
      }
    />
  );
};

export default AdminRouter;
