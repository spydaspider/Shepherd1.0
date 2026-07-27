import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }) => {


    const {
        token
    } = useSelector(
        state => state.auth
    );


    if (!token) {

        return <Navigate to="/" replace />;

    }


    return children;


};


export default ProtectedRoute;