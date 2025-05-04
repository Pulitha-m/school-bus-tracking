import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Header } from "./Pages/components/Header";
import { HomePage } from "./Pages/HomePage";
import { RoutesPage } from "./Pages/RoutePage";
import { CareersPage } from "./Pages/CareersPage";
import { Footer } from "./Pages/components/Footer";
import Auth from "./Pages/Auth";
import { AdminDashboard } from "./Pages/Admin/AdminDashboard";
import AddBus from "./Pages/Admin/Vehicle/AddBus";
import AdminLayout from "./Pages/Admin/components/AdminLayout";
import VehicleManagement from "./Pages/Admin/VehicleManagement";
import Dashboard from "./Pages/Admin/Dashboard";
import EditBus from "./Pages/Admin/Vehicle/EditBus";
import ViewBus from "./Pages/Admin/Vehicle/ViewBus";
import AttendanceManagement from "./Pages/Admin/AttendanceManagement";
import RouteManagement from "./Pages/Admin/RouteManagement";
import AddRoute from "./Pages/Admin/Route/AddRoute";
import EditRoute from "./Pages/Admin/Route/EditRoute";
import CareerManagement from "./Pages/Admin/CareerManagement";
import DriverManagement from "./Pages/Admin/DriverManagement";
import StudentManagement from "./Pages/Admin/StudentManagement";
import DriverDashboard from "./Pages/Driver/DriverDashboard";
import DriverLayout from "./Pages/Driver/components/DriverLayout";
import DriverProfile from "./Pages/Driver/DriverProfile";
import ShareLocation from "./Pages/Driver/ShareLocation";
import QRScanner from "./Pages/Driver/QRScanner";
import StudentLocationTracking from "./Pages/Driver/StudentLocationTracking";
import { StudentLayout } from "./Pages/Student/components/StudentLayout";
import { StudentProfile } from "./Pages/Student/StudentProfile";
import StudentAttendance from "./Pages/Student/StudentAttendance";

import StripePayment from "./Pages/components/StripePayment";
import RegistrationSuccess from "./Pages/components/RegistrationSuccess";
import { FinanceManagement } from "./Pages/Admin/FinanceManagement";
import BusLocation from "./Pages/Student/BusLocation";
import DriverAttendance from "./Pages/Admin/DriverAttendance";
import NotificationManagement from "./Pages/Driver/NotficationManagement";
import AdminNotification from "./Pages/Admin/AdminNotification";
import AdminSendNotification from "./Pages/Admin/Notifications/AdminSendNotification";
import Notifications from "./Pages/Student/Notifications";
import AllBusLocations from "./Pages/Admin/AllBusLocations";
import MarkAttendance from "./Pages/Student/MarkAttendance";
import AddAttendance from "./Pages/Student/AddAttendance";
import { ExpectedStudentsSidebar } from "./Pages/Driver/ExpectedStudentsSidebar";
import ExpectedStdMgt from "./Pages/Admin/ExpectedStdMgt";
import StudentPayment from "./Pages/Student/StudentPayment";
import DriverShift from "./Pages/Driver/DriverShift";
import DriverAttendance, { ShiftManagement } from "./Pages/Admin/DriverAttendance";

// changes
import StudentFeedback from "./Pages/Student/StudentFeedback";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
        </Route>

        {/* Admin pages wrapped in AdminLayout with Sidebar */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="students" element={<StudentManagement />} />

            {/* Vehicle management */}
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="vehicles/addVehicle" element={<AddBus />} />
            <Route path="vehicles/editBus/:busId" element={<EditBus />} />
            <Route path="vehicles/viewBus/:busId" element={<ViewBus />} />
            <Route path="expectedStd" element={<ExpectedStdMgt />} />

            {/* Route management */}
            <Route path="routes" element={<RouteManagement />} />
            <Route path="routes/addRoute" element={<AddRoute />} />
            <Route path="routes/editRoute/:routeId" element={<EditRoute />} />
            <Route path="routes/viewRoute/:routeId" element={<EditRoute />} />

            {/* Career management */}
            <Route path="careers" element={<CareerManagement />} />
            <Route path="career/applyCareer" element={<AddRoute />} />

            {/* Driver management */}
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="drivers" element={<DriverManagement />} />

            {/* Finance mgt */}
            <Route path="finance" element={<FinanceManagement />} />

            {/* Driver profile mgt */}
            <Route path="driver-shifts" element={<DriverAttendance />} />

            {/* notifications mgt */}
            <Route path="notifications" element={<AdminNotification />} />
            <Route
              path="notifications/sendNotification"
              element={<AdminSendNotification />}
            />

            {/* {location} */}
            <Route path="location" element={<AllBusLocations />} />
            <Route path="driver-shift" element={<ShiftManagement />} />

          </Route>
        </Route>

        {/* Driver pages wrapped in DriverLayout with Sidebar */}
        <Route element={<DriverLayout />}>
          <Route path="/driver" element={<DriverDashboard />}>
            <Route index element={<Navigate to="profile" />} />
            <Route path="dashboard" element={<DriverProfile />} />
            <Route path="profile" element={<DriverProfile />} />
            {/* <Route path="students" element={<StudentManagement />} />
            <Route path="location" element={<StudentLocationTracking />} />
            
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="vehicle" element={<VehicleInfo />} /> */}
            <Route path="sharelocation" element={<ShareLocation />} />
            <Route path="location" element={<StudentLocationTracking />} />
            <Route path="qrcode" element={<QRScanner />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="exstudent" element={<ExpectedStudentsSidebar />} />
            <Route path="shift" element={<DriverShift />} />
          </Route>
        </Route>

        {/* Student pages wrapped in Student layout with Sidebar */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="buslocation" element={<BusLocation />} />
          <Route path="notifications" element={<Notifications />} />
          {
            /* <Route path="attendance" element={<AttendanceSection />} />

          <Route path="feedback" element={<StudentFeedback />} />

          {/* <Route path="attendance" element={<AttendanceSection />} />
          <Route path="location" element={<LocationTracking />} />
          <Route path="notifications" element={<NotificationsSection />} />
          <Route path="payments" element={<PaymentSection />} />
          <Route path="feedback" element={<FeedbackSection />} />
          <Route path="notes" element={<DriverNotes />} /> */

            <Route path="MarkAttendance" element={<MarkAttendance />} />
          }

            <Route path="add-attendance" element={<AddAttendance />} />




          <Route path="payments" element={<StudentPayment />} />
          {/*<Route path="feedback" element={<FeedbackSection />} />
          <Route path="notes" element={<DriverNotes />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
