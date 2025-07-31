import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Loading from "../../components/shared/Loading";

const ProtectedRoutes = () => {

    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    return <Outlet />;
    
};

export default ProtectedRoutes;
