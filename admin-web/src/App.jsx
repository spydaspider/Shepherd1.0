import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Login from "./pages/Login/Login";

import ProtectedRoute from "./routes/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";


import Dashboard from "./pages/Dashboard/Dashboard";

import Members from "./pages/Members/Members";
import AddMember from "./pages/AddMember/AddMember";
import ViewMember from "./pages/Members/ViewMember";
import EditMember from "./pages/Members/EditMember";


import Services from "./pages/Services/Services";
import AddService from "./pages/Services/AddService";
import ViewService from "./pages/Services/ViewService";


import Attendance from "./pages/Attendance/Attendance";
import AttendanceHistory from "./pages/Attendance/AttendanceHistory";
import ViewAttendance from "./pages/Attendance/ViewAttendance";

import AttendanceDashboard from "./pages/AttendanceDashboard/AttendanceDashboard";
import FollowUps from "./pages/Followups/FollowUps";
import FollowUpDetails from "./pages/Followups/FollowUpDetails";

import Reports from "./pages/Reports/Reports";
import AttendanceReport from "./pages/Reports/AttendanceReport";


function App(){


return (

<BrowserRouter>


<Routes>


<Route
path="/"
element={<Login />}
/>




<Route
path="/dashboard"
element={
<ProtectedRoute>

<AdminLayout>

<Dashboard />

</AdminLayout>

</ProtectedRoute>
}
/>





<Route
path="/members"
element={
<ProtectedRoute>

<AdminLayout>

<Members />

</AdminLayout>

</ProtectedRoute>
}
/>



<Route
path="/members/add"
element={
<ProtectedRoute>

<AdminLayout>

<AddMember />

</AdminLayout>

</ProtectedRoute>
}
/>



<Route
path="/members/:id"
element={
<ProtectedRoute>

<AdminLayout>

<ViewMember />

</AdminLayout>

</ProtectedRoute>
}
/>



<Route
path="/members/edit/:id"
element={
<ProtectedRoute>

<AdminLayout>

<EditMember />

</AdminLayout>

</ProtectedRoute>
}
/>






<Route
path="/services"
element={
<ProtectedRoute>

<AdminLayout>

<Services />

</AdminLayout>

</ProtectedRoute>
}
/>



<Route
path="/services/add"
element={
<ProtectedRoute>

<AdminLayout>

<AddService />

</AdminLayout>

</ProtectedRoute>
}
/>



<Route
path="/services/:id"
element={
<ProtectedRoute>

<AdminLayout>

<ViewService />

</AdminLayout>

</ProtectedRoute>
}
/>







{/* Attendance */}

<Route
path="/attendance-dashboard"
element={
<ProtectedRoute>

<AdminLayout>

<AttendanceDashboard />

</AdminLayout>

</ProtectedRoute>
}
/>




<Route
path="/attendance/mark"
element={
<ProtectedRoute>

<AdminLayout>

<Attendance />

</AdminLayout>

</ProtectedRoute>
}
/>



<Route
path="/attendance/history"
element={
<ProtectedRoute>

<AdminLayout>

<AttendanceHistory />

</AdminLayout>

</ProtectedRoute>
}
/>




<Route
path="/attendance/:serviceId"
element={
<ProtectedRoute>

<AdminLayout>

<ViewAttendance />

</AdminLayout>

</ProtectedRoute>
}
/>
{/* Follow Ups */}

<Route
    path="/followups"
    element={
        <ProtectedRoute>

            <AdminLayout>

                <FollowUps />

            </AdminLayout>

        </ProtectedRoute>
    }
/>
<Route
path="/followups/:id"
element={
<ProtectedRoute>

<AdminLayout>

<FollowUpDetails />

</AdminLayout>

</ProtectedRoute>
}
/>

<Route
    path="/reports"
    element={
        <ProtectedRoute>

            <AdminLayout>

                <Reports />

            </AdminLayout>

        </ProtectedRoute>
    }
/>
<Route
    path="/reports/attendance/:serviceId"
    element={
        <ProtectedRoute>

            <AdminLayout>

                <AttendanceReport />

            </AdminLayout>

        </ProtectedRoute>
    }
/>
</Routes>


</BrowserRouter>

);


}


export default App;