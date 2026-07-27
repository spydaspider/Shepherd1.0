import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

import styles from "./AdminLayout.module.css";


const AdminLayout = ({children})=>{


return (

<div className={styles.layout}>


<Sidebar/>


<div className={styles.main}>


<Navbar/>


<main className={styles.content}>

{children}

</main>


</div>


</div>

);


};


export default AdminLayout;