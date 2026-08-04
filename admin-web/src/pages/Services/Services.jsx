import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import styles from "./Services.module.css";

const Services = () => {

    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {

        const fetchServices = async () => {

            try {

                const response = await api.get("/services");

                setServices(response.data.services || []);

            } catch (error) {

                console.log(
                    error.response?.data || error.message
                );

            } finally {

                setLoading(false);

            }

        };

        fetchServices();

    }, []);

    const filteredServices = services.filter(service => {

        const text =
            `${service.name} ${service.serviceType}`
                .toLowerCase();

        return text.includes(search.toLowerCase());

    });

    if (loading) {
        return <h2>Loading Services...</h2>;
    }

    return (

        <div className={styles.services}>

            <div className={styles.header}>

                <div>

                    <h1>Services</h1>

                    <p>
                        Manage church services
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate("/services/add")
                    }
                >
                    + New Service
                </button>

            </div>

            <div className={styles.searchBox}>

                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <div className={styles.tableContainer}>

                <table>

                    <thead>

                        <tr>

                            <th>Service</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Code</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredServices.map(service => (

                            <tr key={service._id}>

                                <td>{service.name}</td>

                                <td>{service.serviceType}</td>

                                <td>
                                    {new Date(
                                        service.serviceDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>

                                    <span
                                        className={
                                            service.status === "Active"
                                                ? styles.active
                                                : styles.completed
                                        }
                                    >
                                        {service.status}
                                    </span>

                                </td>

                                <td>

                                    {
                                        service.status === "Active"
                                            ? service.attendanceCode
                                            : "-"
                                    }

                                </td>

                                <td>

                                    <button
                                        className={styles.viewBtn}
                                        onClick={() =>
                                            navigate(`/services/${service._id}`)
                                        }
                                    >
                                        View
                                    </button>

                                    {
                                        service.status === "Active" && (

                                            <button
                                                className={styles.endBtn}
                                            >
                                                End
                                            </button>

                                        )
                                    }

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default Services;