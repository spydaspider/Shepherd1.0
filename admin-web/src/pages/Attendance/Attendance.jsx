import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Attendance.module.css";

const Attendance = () => {
    const [service, setService] = useState(null);
    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [selectedMembers, setSelectedMembers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        loadAttendancePage();
    }, []);

    const loadAttendancePage = async () => {
        try {
            setLoading(true);

            const serviceResponse = await api.get("/services/active");

            const activeService = serviceResponse.data.service;

            setService(activeService);

            const membersResponse = await api.get("/members");

            setMembers(membersResponse.data.members || []);

            const attendanceResponse = await api.get(
                `/attendance/service/${activeService._id}`
            );

            setAttendance(attendanceResponse.data.attendance || []);
        } catch (error) {
            console.log(error.response?.data || error.message);

            setError(
                error.response?.data?.message ||
                "Failed to load attendance."
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleMember = (id) => {
        setSelectedMembers((previous) => {
            if (previous.includes(id)) {
                return previous.filter(memberId => memberId !== id);
            }

            return [...previous, id];
        });
    };

    const isPresent = (memberId) => {
        return attendance.some(
            item =>
                item.user?._id === memberId &&
                item.status === "Present"
        );
    };

    const filteredMembers = members.filter(member => {

        if (!member.isActive) return false;

        const text = `
            ${member.firstName}
            ${member.lastName}
            ${member.phone || ""}
            ${member.membershipNumber || ""}
        `
            .toLowerCase();

        return text.includes(search.toLowerCase());

    });

    const selectableMembers = filteredMembers.filter(
        member => !isPresent(member._id)
    );

    const selectAll = () => {

        if (
            selectedMembers.length === selectableMembers.length
        ) {

            setSelectedMembers([]);

        } else {

            setSelectedMembers(
                selectableMembers.map(member => member._id)
            );

        }

    };

    const markAttendance = async () => {

        if (!service) {
            alert("No active service.");
            return;
        }

        if (selectedMembers.length === 0) {
            alert("Please select at least one member.");
            return;
        }

        try {

            const response = await api.post(
                "/attendance/admin-mark",
                {
                    serviceId: service._id,
                    members: selectedMembers
                }
            );

            setMessage(response.data.message);

            setSelectedMembers([]);

            await loadAttendancePage();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to mark attendance."
            );

        }

    };

    if (loading) {
        return <h2>Loading Attendance...</h2>;
    }

    return (
        <div className={styles.attendance}>

            <div className={styles.header}>
                <div>
                    <h1>Attendance Management</h1>
                    <p>Mark attendance for today's service</p>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {message && (
                <div className={styles.success}>
                    {message}
                </div>
            )}

            <div className={styles.summaryCards}>

                <div className={styles.summaryCard}>
                    <h3>Total Members</h3>
                    <h2>{members.length}</h2>
                </div>

                <div className={styles.summaryCard}>
                    <h3>Present</h3>
                    <h2>{attendance.length}</h2>
                </div>

                <div className={styles.summaryCard}>
                    <h3>Selected</h3>
                    <h2>{selectedMembers.length}</h2>
                </div>

            </div>

            <div className={styles.serviceBox}>

                <h2>Active Service</h2>

                {service ? (
                    <>
                        <h3>{service.name}</h3>

                        <p>
                            Date:{" "}
                            {new Date(
                                service.serviceDate
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            Attendance Code:
                            <strong> {service.attendanceCode}</strong>
                        </p>
                    </>
                ) : (
                    <p>No Active Service</p>
                )}

            </div>

            <div className={styles.searchBox}>

                <input
                    type="text"
                    placeholder="Search by name, phone or membership number..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <div className={styles.memberContainer}>

                <table>

                    <thead>

                        <tr>

                            <th>

                                <input
                                    type="checkbox"
                                    checked={
                                        selectableMembers.length > 0 &&
                                        selectedMembers.length ===
                                        selectableMembers.length
                                    }
                                    onChange={selectAll}
                                />

                            </th>

                            <th>Member</th>

                            <th>Gender</th>

                            <th>Type</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredMembers.map(member => {

                            const present = isPresent(member._id);

                            return (

                                <tr key={member._id}>

                                    <td>

                                        <input
                                            type="checkbox"
                                            disabled={present}
                                            checked={
                                                present ||
                                                selectedMembers.includes(member._id)
                                            }
                                            onChange={() =>
                                                toggleMember(member._id)
                                            }
                                        />

                                    </td>

                                    <td>

                                        <div className={styles.memberInfo}>

                                            <div className={styles.avatar}>
                                                {member.firstName?.charAt(0)}
                                                {member.lastName?.charAt(0)}
                                            </div>

                                            <span>
                                                {member.firstName} {member.lastName}
                                            </span>

                                        </div>

                                    </td>

                                    <td>{member.gender}</td>

                                    <td>
                                        {member.isChild ? "Child" : "Adult"}
                                    </td>

                                    <td>

                                        {present ? (
                                            <span className={styles.present}>
                                                Present
                                            </span>
                                        ) : (
                                            <span className={styles.absent}>
                                                Not Marked
                                            </span>
                                        )}

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

            <div className={styles.actions}>

                <button
                    className={styles.markBtn}
                    onClick={markAttendance}
                >
                    Mark Attendance ({selectedMembers.length})
                </button>

            </div>

        </div>
    );
};

export default Attendance;