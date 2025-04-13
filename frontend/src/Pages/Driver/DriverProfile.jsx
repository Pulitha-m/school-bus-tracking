import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  BadgeIcon,
  CalendarIcon,
  UserIcon,
  PencilIcon,
  SaveIcon,
  TruckIcon,
} from "lucide-react";
import backendUrl from "../../config/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    if (!sessionData) return;

    const { id } = JSON.parse(sessionData);

    axios
      .get(`${backendUrl}/getDriverById/${id}`)
      .then((res) => {
        const data = res.data;
        setDriver(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          emergencyContact: data.emergencyContact || "",
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
        });
        if (data.imageBase64) {
          setImagePreview(`data:image/jpeg;base64,${data.imageBase64}`);
        }

        if (data.busId) {
          axios
            .get(`${backendUrl}/getBusById/${data.busId}`)
            .then((res) => setBusInfo(res.data))
            .catch(() => toast.error("Failed to load bus info"));
        }
      })
      .catch(() => toast.error("Failed to load driver profile"));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const sessionData = sessionStorage.getItem("user");
    const { id } = JSON.parse(sessionData);

    const updateForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) updateForm.append(key, value);
    });
    if (imageFile) updateForm.append("image", imageFile);

    try {
      const res = await axios.put(
        `${backendUrl}/updateDriver/${id}`,
        updateForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setDriver(res.data);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (!driver) return <div>Loading profile...</div>;

  return (
    <div>
      <ToastContainer />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Driver Profile</h1>
          <p className="text-gray-600">Manage your personal details</p>
        </div>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
        >
          {editMode ? (
            <SaveIcon className="mr-2" />
          ) : (
            <PencilIcon className="mr-2" />
          )}
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-[#28282B] rounded-lg p-6 mb-6 flex items-center gap-4 ">
        <div>
          <img
            src={imagePreview || "https://source.unsplash.com/120x120/?person"}
            alt="Driver"
            className="w-20 h-20 rounded-full border-4 border-white object-cover"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-sm text-white"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {driver.firstName || "Unnamed"} {driver.lastName || "Driver"}
          </h2>
          <div className="flex items-center text-amber-50">
            <BadgeIcon size={16} className="mr-2" />
            <span>
              ID: DR{driver.id} •{" "}
              {driver.user?.emailVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>
        <div className="ml-auto">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            On Duty
          </span>
        </div>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <UserIcon size={20} className="mr-2 text-amber-500" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
            "emergencyContact",
            "dob",
          ].map((field) => (
            <div key={field}>
              <label className="text-sm text-gray-500 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              {editMode ? (
                <input
                  type={field === "dob" ? "date" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              ) : (
                <p className="text-gray-800 mt-1">{driver[field] || "N/A"}</p>
              )}
            </div>
          ))}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-gray-800 mt-1">{driver.user?.username}</p>
          </div>
        </div>
      </div>

      {/* Assigned Bus Card */}
      {busInfo && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <TruckIcon size={20} className="mr-2 text-amber-500" />
            Assigned Bus Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bus No Plate</p>
              <p className="text-gray-800 font-medium">{busInfo.noPlate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bus Capacity</p>
              <p className="text-gray-800 font-medium">
                {busInfo.capacity} students
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
