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



function App(){


return (

<BrowserRouter>


<Routes>


{/* Public Route */}

<Route

path="/"

element={<Login />}

/>



{/* Protected Admin Routes */}

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
element={<Members />} 
/>

<Route
path="/members/add"
element={<AddMember />}
/>

<Route
path="/members/:id"
element={<ViewMember />}
/>

<Route
path="/members/edit/:id"
element={<EditMember />}
/>
</Routes>


</BrowserRouter>

);


}


export default App;