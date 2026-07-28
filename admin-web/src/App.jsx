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

</Routes>


</BrowserRouter>

);


}


export default App;