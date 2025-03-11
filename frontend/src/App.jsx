import "./App.css";
import { StudentDashboard } from "./Pages/Student/StudentDashboard";
import { DriverDashboard } from "./Pages/Driver/DriverDashboard";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/*<StudentDashboard></StudentDashboard> */}
      <DriverDashboard></DriverDashboard>
    </div>
  );
}

export default App;
