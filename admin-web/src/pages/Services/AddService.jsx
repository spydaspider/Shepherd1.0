import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./Services.module.css";


const AddService = () => {


    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        name:"",
        serviceType:"Sunday Worship",
        serviceDate:"",
        startTime:"",
        endTime:"",
        description:""

    });



    const [loading,setLoading] = useState(false);



    const handleChange = (e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };




    const handleSubmit = async(e)=>{

        e.preventDefault();


        try{


            setLoading(true);


            await api.post(
                "/services",
                formData
            );


            alert(
                "Service created successfully"
            );


            navigate("/services");


        }
        catch(error){


            console.log(
                error.response?.data ||
                error.message
            );


            alert(
                error.response?.data?.message ||
                "Failed to create service"
            );


        }
        finally{

            setLoading(false);

        }


    };




    return (

        <div className={styles.services}>


            <div className={styles.header}>


                <div>

                    <h1>
                        Create Service
                    </h1>


                    <p>
                        Add a new church service
                    </p>


                </div>


            </div>





            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >



                <label>
                    Service Name
                </label>

                <input

                    type="text"

                    name="name"

                    value={formData.name}

                    onChange={handleChange}

                    placeholder="Sunday Worship Service"

                    required

                />





                <label>
                    Service Type
                </label>


                <select

                    name="serviceType"

                    value={formData.serviceType}

                    onChange={handleChange}

                >

                    <option>
                        Sunday Worship
                    </option>

                    <option>
                        Bible Study
                    </option>

                    <option>
                        Prayer Meeting
                    </option>

                    <option>
                        Youth Service
                    </option>

                    <option>
                        Children Service
                    </option>

                    <option>
                        Communion Service
                    </option>

                    <option>
                        Special Event
                    </option>


                </select>







                <label>
                    Service Date
                </label>


                <input

                    type="date"

                    name="serviceDate"

                    value={formData.serviceDate}

                    onChange={handleChange}

                    required

                />







                <label>
                    Start Time
                </label>


                <input

                    type="time"

                    name="startTime"

                    value={formData.startTime}

                    onChange={handleChange}

                />






                <label>
                    End Time
                </label>


                <input

                    type="time"

                    name="endTime"

                    value={formData.endTime}

                    onChange={handleChange}

                />







                <label>
                    Description
                </label>


                <textarea

                    name="description"

                    value={formData.description}

                    onChange={handleChange}

                    rows="4"

                    placeholder="Optional description"

                />







                <button
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                        ?
                        "Creating..."
                        :
                        "Create Service"
                    }


                </button>



            </form>



        </div>

    );

};


export default AddService;