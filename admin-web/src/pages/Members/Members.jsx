import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import styles from "./Members.module.css";

const Members = () => {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get("/members");

                console.log("Members:", response.data);

                setMembers(response.data.members || []);
            } catch (error) {
                console.log(
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const handleStatusChange = async (member) => {
        const newStatus =
            member.status === "Active"
                ? "Inactive"
                : "Active";

        const confirmed = window.confirm(
            `Are you sure you want to ${newStatus.toLowerCase()} ${member.firstName} ${member.lastName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.patch(
                `/members/${member._id}/status`,
                {
                    status: newStatus,
                }
            );

            setMembers((prevMembers) =>
                prevMembers.map((m) =>
                    m._id === member._id
                        ? {
                              ...m,
                              status: newStatus,
                              isActive:
                                  newStatus === "Active",
                          }
                        : m
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to update member status."
            );
        }
    };

    const filteredMembers = members.filter((member) => {
        const name =
            `${member.firstName || ""} ${member.lastName || ""}`
                .toLowerCase();

        return name.includes(
            search.toLowerCase()
        );
    });

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading Members...
            </div>
        );
    }

    return (
        <div className={styles.members}>

            <div className={styles.header}>

                <div>
                    <h1>Members</h1>

                    <p>
                        Manage church members
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/members/add")
                    }
                >
                    + Add Member
                </button>

            </div>

            <div className={styles.searchBox}>

                <input
                    type="text"
                    placeholder="Search members..."
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
                            <th>Member</th>
                            <th>Gender</th>
                            <th>Type</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredMembers.map((member) => (

                            <tr key={member._id}>

                                <td>

                                    <div
                                        className={
                                            styles.memberInfo
                                        }
                                    >

                                        <div
                                            className={
                                                styles.avatar
                                            }
                                        >
                                            {member.firstName?.charAt(0)}
                                            {member.lastName?.charAt(0)}
                                        </div>

                                        <span>
                                            {member.firstName}{" "}
                                            {member.lastName}
                                        </span>

                                    </div>

                                </td>

                                <td>
                                    {member.gender || "-"}
                                </td>

                                <td>
                                    {member.isChild
                                        ? "Child"
                                        : "Adult"}
                                </td>

                                <td>
                                    {member.role || "-"}
                                </td>

                                <td>

                                    <span
                                        className={
                                            member.status === "Active"
                                                ? styles.active
                                                : styles.inactive
                                        }
                                    >
                                        {member.status}
                                    </span>

                                </td>

                                <td>

                                    <div
                                        className={
                                            styles.actionButtons
                                        }
                                    >

                                        <button
                                            className={
                                                styles.viewBtn
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/members/${member._id}`
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className={
                                                styles.editBtn
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/members/edit/${member._id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className={
                                                styles.reportBtn
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/reports/member/${member._id}`
                                                )
                                            }
                                        >
                                            Report
                                        </button>

                                        <button
                                            className={
                                                styles.deleteBtn
                                            }
                                            onClick={() =>
                                                handleStatusChange(
                                                    member
                                                )
                                            }
                                        >
                                            {member.status === "Active"
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        {filteredMembers.length === 0 && (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign: "center",
                                    }}
                                >
                                    No members found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Members;