import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../../api/authAPI";
import { loginSuccess } from "../../features/auth/authSlice";

import styles from "./Login.module.css";


const Login = () => {


    const dispatch = useDispatch();

    const navigate = useNavigate();



    const [formData,setFormData] = useState({

        email:"",
        password:""

    });



    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);





    const handleChange = (e)=>{

        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value

        });

    };







    const handleSubmit = async(e)=>{

        e.preventDefault();


        try{


            setLoading(true);

            setError("");



            const data =
            await login(formData);



            dispatch(
                loginSuccess(data)
            );



            navigate("/dashboard");



        }
        catch(error){


            setError(

                error.response?.data?.message ||
                "Login failed"

            );


        }
        finally{


            setLoading(false);


        }


    };







return (

<div className={styles.container}>


    <div className={styles.loginCard}>


        <h1>
            Shepherd
        </h1>


        <p>
            Church Management System
        </p>




        {
            error &&

            <div className={styles.error}>
                {error}
            </div>

        }






        <form
        onSubmit={handleSubmit}
        >


            <div className={styles.inputGroup}>

                <label>
                    Email
                </label>


                <input

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}

                placeholder="Enter email"

                />

            </div>







            <div className={styles.inputGroup}>


                <label>
                    Password
                </label>


                <input

                type="password"

                name="password"

                value={formData.password}

                onChange={handleChange}

                placeholder="Enter password"

                />


            </div>







            <button
            disabled={loading}
            >

                {
                    loading
                    ?
                    "Logging in..."
                    :
                    "Login"
                }

            </button>



        </form>


    </div>


</div>

);


};


export default Login;