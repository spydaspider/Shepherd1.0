import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";


const Sidebar = () => {


const menu = [

{
name:"Dashboard",
path:"/dashboard"
},

{
name:"Members",
path:"/members"
},

{
name:"Services",
path:"/services"
},

{
name:"Attendance",
path:"/attendance"
},

{
    name:"Attendance History",
    path:"/attendance/history"
},

{
name:"Follow Ups",
path:"/followups"
},

{
name:"Reports",
path:"/reports"
},

{
name:"Notifications",
path:"/notifications"
}

];


return (

<aside className={styles.sidebar}>


<h2>
Shepherd
</h2>


<nav>

{
menu.map(item=>(

<NavLink

key={item.path}

to={item.path}

className={({isActive})=>
isActive
?
styles.active
:
""
}

>

{item.name}

</NavLink>

))
}


</nav>


</aside>

);


};


export default Sidebar;