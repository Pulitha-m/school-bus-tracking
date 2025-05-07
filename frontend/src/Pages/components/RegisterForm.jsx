import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import {
  EyeIcon,
  EyeOffIcon,
  Upload,
  CreditCard,
  FileText,
} from "lucide-react";

// Fix for default marker icons
const iconRetinaUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RouteMachine = ({ routeCoordinates }) => {
  const map = useMap();
  const routingControlRef = React.useRef(null);

  useEffect(() => {
    if (routeCoordinates.length < 2) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: routeCoordinates.map(([lat, lng]) => L.latLng(lat, lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null,
      show: false,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [routeCoordinates, map]);

  return null;
};

const LocationSelector = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
    />
  </div>
);

const MultiStepRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    selectedRoute: "",
    startLocation: null,
    endLocation: "",
    estimatedFare: null,
    distanceKm: null,
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    allergies: "",
    medicalNotes: "",
  });
  const [routes, setRoutes] = useState([]);
  const [availableSchools, setAvailableSchools] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 4);
  const maxDateString = maxDate.toISOString().split("T")[0];

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getAllRoutes");
        setRoutes(response.data);
      } catch (err) {
        console.error("Route fetch error:", err);
        toast.error("Failed to load routes. Please try again later.");
      }
    };
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setPaymentSlip(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRouteSelect = (e) => {
    const selectedId = e.target.value;
    const route = routes.find((r) => r.id === parseInt(selectedId));

    if (route) {
      setRouteDetails(route);
      setAvailableSchools(route.schools || []);
      setFormData((prev) => ({
        ...prev,
        selectedRoute: selectedId,
        endLocation: "",
        estimatedFare: null,
        distanceKm: null,
      }));
      setRouteCoordinates([
        [route.startLat, route.startLng],
        ...route.schools.map((s) => [s.latitude, s.longitude]),
        [route.endLat, route.endLng],
      ]);
    }
  };

  const registerStudent = async () => {
    try {
      const nameParts = formData.fullName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const payload = {
        firstName,
        lastName,
        dob: formData.dateOfBirth,
        startLocation: formData.startLocation
          ? `${formData.startLocation.lat},${formData.startLocation.lng}`
          : null,
        endLocation: formData.endLocation,
        busId: routeDetails?.busId,
        routeId: formData.selectedRoute,
        distanceKm: formData.distanceKm,
        monthlyAmount: formData.estimatedFare,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelation: formData.emergencyRelation,
        allergies: formData.allergies,
        medicalNotes: formData.medicalNotes,
        user: {
          username: formData.email,
          password: formData.password,
          role: "STUDENT",
          isEmailVerified: true,
        },
      };

      // Register student
      const response = await axios.post(
        "http://localhost:8080/registerStudent",
        payload
      );

      if (response.data && response.data.id) {
        setStudentId(response.data.id);

        // Add student pickup location to the route table
        const params = new URLSearchParams();
        params.append("latitude", formData.startLocation.lat);
        params.append("longitude", formData.startLocation.lng);
        params.append("studentEmail", formData.email);

        // Send pickup data to server
        await axios.post(
          `http://localhost:8080/addStudentPickup/${formData.selectedRoute}`,
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        setPaymentInfo({
          amount: formData.estimatedFare,
          email: formData.email,
        });
        return true;
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      throw err;
    }
    return false;
  };

  const uploadPaymentSlip = async () => {
    if (!paymentSlip || !studentId) return false;

    try {
      const formData = new FormData();
      formData.append("file", paymentSlip);
      formData.append("studentId", studentId);
      formData.append("amount", paymentInfo.amount);

      const response = await axios.post(
        "http://localhost:8080/api/stripe/upload-slip",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        return true;
      }
    } catch (err) {
      console.error("Payment slip upload error:", err);
      throw err;
    }
    return false;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (
        !formData.fullName.trim() ||
        !formData.email.trim() ||
        !formData.dateOfBirth ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Please fill out all fields to continue");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (formData.fullName.split(" ").length < 2) {
        toast.error("Please enter both first and last name");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (formData.password.length > 8) {
        toast.error("Password must not exceed 8 characters");
        return;
      }
    }

    if (step === 2) {
      if (
        !formData.selectedRoute ||
        !formData.startLocation ||
        !formData.endLocation
      ) {
        toast.error("Please select route, pickup and drop-off points");
        return;
      }

      try {
        const school = availableSchools.find(
          (s) => s.name === formData.endLocation
        );
        if (!school) {
          toast.error("Selected school not found");
          return;
        }

        const origin = `${formData.startLocation.lat},${formData.startLocation.lng}`;
        const destination = `${school.latitude},${school.longitude}`;

        const res = await axios.get("http://localhost:8080/api/getDistance", {
          params: { origins: origin, destinations: destination },
        });

        if (!res.data.routes || res.data.routes.length === 0) {
          toast.error("No route found between selected points");
          return;
        }

        const meters = res.data.routes[0].distanceMeters;
        const distanceKm = (meters / 1000).toFixed(2);
        const monthlyFare = (distanceKm * 20 * 20 * 2).toFixed(2);

        setFormData((prev) => ({
          ...prev,
          distanceKm,
          estimatedFare: monthlyFare,
        }));
        toast.success(`Fare calculated: Rs. ${monthlyFare}`);
      } catch (error) {
        console.error("Fare calculation error:", error);
        toast.error("Failed to calculate fare. Please try again.");
        return;
      }
    }

    if (step === 3) {
      if (
        !formData.emergencyName.trim() ||
        !formData.emergencyPhone.trim() ||
        !formData.emergencyRelation.trim()
      ) {
        toast.error("Please complete emergency contact info");
        return;
      }
      if (!/^[0-9]{10}$/.test(formData.emergencyPhone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      setIsSubmitting(true);
      try {
        const registered = await registerStudent();
        if (registered) {
          setStep(4);
          toast.success("Registration complete! Please proceed with payment.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setStep(step + 1);
  };

  const handlePaymentMethodSubmit = async (method) => {
    if (method === "STRIPE") {
      setIsSubmitting(true);
      try {
        const res = await axios.post(
          "http://localhost:8080/api/stripe/create-checkout-session",
          null,
          {
            params: {
              email: paymentInfo.email,
              amount: paymentInfo.amount,
            },
          }
        );

        if (res.data.url) {
          window.location.href = res.data.url; // Redirect to Stripe Checkout
        } else {
          toast.error("Stripe checkout URL not received.");
        }
      } catch (err) {
        toast.error("Failed to initiate Stripe payment.");
        console.error("Stripe error:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else if (method === "SLIP") {
      setIsSubmitting(true);
      try {
        const uploaded = await uploadPaymentSlip();
        if (uploaded) {
          toast.success("Payment slip uploaded successfully!");
          window.location.href = "/registration-success";
        }
      } catch (err) {
        toast.error("Failed to upload payment slip. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              onKeyDown={(e) => {
                // Prevent "@" symbol and any number (0-9) from being typed
                if (e.key === "@" || /\d/.test(e.key)) {
                  e.preventDefault(); // Prevent the character from being typed
                }
              }}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              max={maxDateString}
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  if (e.target.value.length <= 8) {
                    handleChange(e);
                  }
                }}
                required
                minLength={6}
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            <div className="relative">
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            <button
              onClick={handleNext}
              type="button"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Route
              </label>
              <select
                name="selectedRoute"
                value={formData.selectedRoute}
                onChange={handleRouteSelect}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.startName} →{" "}
                    {route.schools.map((s) => s.name).join(" → ")} →{" "}
                    {route.endName}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-64 border rounded-lg overflow-hidden">
              <MapContainer
                center={[6.9271, 79.8612]}
                zoom={12}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {formData.startLocation && (
                  <Marker position={formData.startLocation}>
                    <Popup>Your Pickup Location</Popup>
                  </Marker>
                )}
                {routeDetails && (
                  <>
                    <Marker
                      position={[routeDetails.startLat, routeDetails.startLng]}
                    >
                      <Popup>Start: {routeDetails.startName}</Popup>
                    </Marker>
                    {routeDetails.schools.map((school, index) => (
                      <Marker
                        key={`school-${index}`}
                        position={[school.latitude, school.longitude]}
                      >
                        <Popup>School: {school.name}</Popup>
                      </Marker>
                    ))}
                    <Marker
                      position={[routeDetails.endLat, routeDetails.endLng]}
                    >
                      <Popup>End: {routeDetails.endName}</Popup>
                    </Marker>
                  </>
                )}
                <LocationSelector
                  setLocation={(loc) =>
                    setFormData((prev) => ({ ...prev, startLocation: loc }))
                  }
                />
                <RouteMachine routeCoordinates={routeCoordinates} />
              </MapContainer>
            </div>

            <select
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              disabled={!formData.selectedRoute}
              required
            >
              <option value="">Select Drop-off Location</option>
              {availableSchools.map((school, index) => (
                <option key={index} value={school.name}>
                  {school.name}
                </option>
              ))}
            </select>

            {formData.estimatedFare && (
              <div className="text-green-700 font-medium bg-green-100 p-3 rounded-lg border">
                Estimated Monthly Fare: Rs. {formData.estimatedFare} (
                {formData.distanceKm} km)
              </div>
            )}

            <button
              onClick={handleNext}
              type="button"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all"
              disabled={isSubmitting}
            >
              {formData.estimatedFare
                ? "Continue"
                : "Calculate Fare & Continue"}
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <InputField
              label="Emergency Contact Name"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Relationship"
              name="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={handleChange}
              required
            />
            <InputField
              label="Emergency Phone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              required
            />
            <InputField
              label="Allergies (optional)"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Notes
              </label>
              <textarea
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                rows="3"
              />
            </div>
            <button
              onClick={handleNext}
              type="button"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all"
              disabled={isSubmitting}
            >
              Next
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            {!studentId ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing registration...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <CreditCard className="mx-auto h-12 w-12 text-yellow-500" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Complete Your Payment
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Total Amount: Rs. {formData.estimatedFare}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stripe Payment Card */}
                  <div
                    className="border rounded-lg p-4 cursor-pointer hover:border-yellow-500 transition-colors"
                    onClick={() => handlePaymentMethodSubmit("STRIPE")}
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-yellow-500 mr-2" />
                      <h4 className="font-medium">Credit/Debit Card</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Pay securely with Stripe
                    </p>
                    <button
                      type="button"
                      className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
                      disabled={isSubmitting}
                    >
                      Pay with Stripe
                    </button>
                  </div>

                  {/* Bank Slip Payment Card */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-yellow-500 mr-2" />
                      <h4 className="font-medium">Bank Payment Slip</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload your payment slip
                    </p>

                    {previewImage ? (
                      <div className="mt-4">
                        <img
                          src={previewImage}
                          alt="Payment slip preview"
                          className="h-32 object-contain mx-auto mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handlePaymentMethodSubmit("SLIP")}
                          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Uploading..." : "Submit Slip"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Payment Slip
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <div className="flex text-sm text-gray-600 justify-center">
                              <label
                                htmlFor="paymentSlip"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="paymentSlip"
                                  name="paymentSlip"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-sm mb-2">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Student ID:</div>
                    <div>{studentId}</div>
                    <div className="text-gray-500">Amount:</div>
                    <div>Rs. {formData.estimatedFare}</div>
                    <div className="text-gray-500">Payment Date:</div>
                    <div>{new Date().toLocaleDateString()}</div>
                    <div className="text-gray-500">Next Due Date:</div>
                    <div>
                      {new Date(
                        new Date().setMonth(new Date().getMonth() + 1)
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
          <div
            className={`bg-yellow-500 h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-1 text-gray-600">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => {
                if (num <= step) setStep(num);
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  step >= num ? "bg-yellow-500" : "bg-gray-300"
                }`}
              >
                {num === 4 ? <CreditCard size={16} /> : num}
              </div>
              <span>{["Info", "Route", "Emergency", "Payment"][num - 1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Register for School Bus Service
        </h2>
        <p className="text-sm text-gray-500">
          Follow the steps to complete your student registration
        </p>
      </div>

      <form className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {renderStep()}
      </form>
    </div>
  );
};

export default MultiStepRegisterForm;
