import "./App.css";
import { StudentDashboard } from "./Pages/Student/StudentDashboard";
import { DriverDashboard } from "./Pages/Driver/DriverDashboard";
import { AdminDashboard } from "./Pages/Admin/AdminDashboard";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {
        /*<StudentDashboard></StudentDashboard> 
        <DriverDashboard></DriverDashboard>*/
        <AdminDashboard />
      }
    </div>
  );
}

export default App;
