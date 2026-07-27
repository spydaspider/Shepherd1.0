import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { logout } from "../../features/auth/authSlice";

import { useNavigate } from "react-router-dom";


import styles from "./Navbar.module.css";


const Navbar = ()=>{


const user =
useSelector(
state=>state.auth.user
);


const dispatch=useDispatch();

const navigate=useNavigate();



const handleLogout=()=>{

dispatch(logout());

navigate("/");

};



return (

<header className={styles.navbar}>


<div>

<h3>
Welcome, {user?.firstName}
</h3>

<p>
{user?.role}
</p>

</div>


<button onClick={handleLogout}>
Logout
</button>


</header>

);


};


export default Navbar;