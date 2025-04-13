import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TruckIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../../config/config";

export default function EditBus() {
  const navigate = useNavigate();
  const { busId } = useParams();

  const [bus, setBus] = useState({
    make: "",
    model: "",
    noPlate: "",
    capacity: "",
    status: "ACTIVE",
    busImg: null,
    busImgBase64: "",
    keepExistingImage: true,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const plateRegex = /^[A-Z]{2,3}-[0-9]{4}$/;

  useEffect(() => {
    if (busId) {
      loadBusDetails();
    }
  }, [busId]);

  useEffect(() => {
    const valid = validateForm();
    setIsFormValid(valid);
  }, [bus]);

  const loadBusDetails = async () => {
    try {
      const result = await axios.get(`${backendUrl}/getBusById/${busId}`);
      setBus({
        ...result.data,
        make: result.data.make || "",
        model: result.data.model || "",
        busImgBase64: result.data.busImage || "",
        keepExistingImage: true,
      });
    } catch (error) {
      console.error("Error fetching bus details:", error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "make" || name === "model") {
      const clean = value.replace(/[^A-Za-z\s]/g, "").slice(0, 15);
      setBus({ ...bus, [name]: clean });
    } else if (name === "noPlate") {
      let formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
      const parts = formatted.split("-");
      if (parts.length > 1) {
        const [letters, numbers] = parts;
        formatted =
          letters.slice(0, 3) +
          "-" +
          numbers.replace(/[^0-9]/g, "").slice(0, 4);
      } else {
        formatted = formatted.slice(0, 3);
        if (formatted.length === 3) formatted += "-";
      }
      setBus({ ...bus, noPlate: formatted });
    } else if (name === "capacity") {
      const num = Number(value);
      if (!isNaN(num) && num <= 55) {
        setBus({ ...bus, capacity: num });
      }
    } else {
      setBus({ ...bus, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setErrors({ ...errors, busImg: "Only image files are allowed" });
    } else {
      setBus({
        ...bus,
        busImg: file,
        keepExistingImage: false,
      });
      setErrors({ ...errors, busImg: "" });
    }
  };

  const validateForm = () => {
    return (
      bus.make.trim() &&
      bus.model.trim() &&
      plateRegex.test(bus.noPlate) &&
      bus.capacity >= 1 &&
      bus.capacity <= 55 &&
      bus.status &&
      (bus.keepExistingImage || bus.busImg)
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!bus.make.trim()) newErrors.make = "Make is required";
    if (!bus.model.trim()) newErrors.model = "Model is required";
    if (!plateRegex.test(bus.noPlate)) {
      newErrors.noPlate = "License plate must be in format AB-1234 or ABC-1234";
    }
    if (!bus.capacity || bus.capacity < 1 || bus.capacity > 55) {
      newErrors.capacity = "Capacity must be between 1 and 55";
    }
    if (!bus.status) newErrors.status = "Status is required";
    if (!bus.keepExistingImage && !bus.busImg) {
      newErrors.busImg = "Bus image is required";
    }

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    Object.keys(bus).forEach((key) => {
      if (
        key !== "busImgBase64" &&
        key !== "keepExistingImage" &&
        key !== "busImg"
      ) {
        formData.append(key, bus[key]);
      }
    });

    if (bus.keepExistingImage) {
      formData.append("keepExistingImage", "true");
    } else if (bus.busImg) {
      formData.append("busImg", bus.busImg);
    }

    try {
      await axios.put(`${backendUrl}/updateBus/${busId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Bus updated successfully!", {
        autoClose: 2000,
        onClose: () => navigate("/admin/vehicles"),
      });
    } catch (error) {
      console.error("Error updating bus:", error);
      toast.error("Failed to update bus.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <TruckIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Edit Bus</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Make */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <input
                      type="text"
                      name="make"
                      value={bus.make}
                      onChange={onInputChange}
                      required
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {bus.make.length}/15 characters
                    </p>
                    {errors.make && (
                      <p className="text-red-600 text-sm mt-1">{errors.make}</p>
                    )}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={bus.model}
                      onChange={onInputChange}
                      required
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {bus.model.length}/15 characters
                    </p>
                    {errors.model && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.model}
                      </p>
                    )}
                  </div>

                  {/* License Plate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Plate
                    </label>
                    <input
                      type="text"
                      name="noPlate"
                      placeholder="e.g. AB-1234"
                      value={bus.noPlate}
                      onChange={onInputChange}
                      required
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.noPlate && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.noPlate}
                      </p>
                    )}
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity (Max 55)
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={bus.capacity}
                      onChange={onInputChange}
                      min="1"
                      max="55"
                      required
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.capacity && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.capacity}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={bus.status}
                      onChange={onInputChange}
                      required
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="UNDER_MAINTENANCE">Maintenance</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>

                {/* Current Image Preview */}
                {bus.busImgBase64 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Bus Image
                    </label>
                    <img
                      src={`data:image/jpeg;base64,${bus.busImgBase64}`}
                      alt="Bus"
                      className="w-32 h-24 object-cover rounded shadow"
                    />
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="keepImage"
                        checked={bus.keepExistingImage}
                        onChange={() =>
                          setBus({
                            ...bus,
                            keepExistingImage: !bus.keepExistingImage,
                          })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="keepImage"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Keep existing image
                      </label>
                    </div>
                  </div>
                )}

                {/* New Image Upload */}
                {!bus.keepExistingImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload New Bus Image
                    </label>
                    <input
                      type="file"
                      name="busImg"
                      accept="image/*"
                      onChange={onFileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.busImg && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.busImg}
                      </p>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/vehicles")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors ${
                      isFormValid
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Update Bus
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
