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
children:[

{
name:"Dashboard",
path:"/attendance-dashboard"
},

{
name:"Mark Attendance",
path:"/attendance/mark"
},

{
name:"History",
path:"/attendance/history"
}

]
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


item.children ?


<div 
key={item.name}
className={styles.dropdown}
>


<div className={styles.sectionTitle}>
{item.name}
</div>



{
item.children.map(child=>(

<NavLink

key={child.path}

to={child.path}

className={({isActive})=>
isActive
?
styles.active
:
""
}

>

{child.name}

</NavLink>

))
}


</div>


:


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