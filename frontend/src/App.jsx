import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes from react-router-dom
import { StudentDashboard } from "./Pages/Student/StudentDashboard";
import { DriverDashboard } from "./Pages/Driver/DriverDashboard";
import { AdminDashboard } from "./Pages/Admin/AdminDashboard";
import OwnerDashboard from "./Pages/Owner/OwnerDashboard";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {
        /*<StudentDashboard></StudentDashboard>*/
        // <DriverDashboard></DriverDashboard>
        <AdminDashboard />
        /*<BrowserRouter>
          <Routes>
            <Route path="/*" element={<OwnerDashboard />} />
          </Routes>
        </BrowserRouter>
        */
      }
    </div>
  );
}

export default App;
