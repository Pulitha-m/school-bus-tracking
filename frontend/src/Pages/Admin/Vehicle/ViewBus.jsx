import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TruckIcon, XIcon } from "lucide-react";
import backendUrl from "../../../config/config";

export default function ViewBus({ onClose }) {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (busId) {
      loadBusDetails();
    }
  }, [busId]);

  const loadBusDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/getBusById/${busId}`);
      setBus(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bus details:", error);
      setError("Failed to load bus details. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // Go back if no onClose prop provided
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TruckIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Bus Details</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-blue-500">Loading bus details...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={loadBusDetails}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {bus && (
            <div className="space-y-6">
              {/* Bus Image */}
              <div className="text-center">
                {bus.busImage ? (
                  <img
                    src={`data:image/jpeg;base64,${bus.busImage}`}
                    alt="Bus"
                    className="w-full max-w-md h-64 object-contain mx-auto rounded-lg shadow"
                  />
                ) : (
                  <div className="bg-gray-100 w-full max-w-md h-64 flex items-center justify-center mx-auto rounded-lg">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}
              </div>

              {/* Bus Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Bus ID:</span> {bus.busId}
                    </p>
                    <p>
                      <span className="font-medium">Make:</span>{" "}
                      {bus.make || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Model:</span> {bus.model}
                    </p>
                    <p>
                      <span className="font-medium">License Plate:</span>{" "}
                      {bus.noPlate}
                    </p>
                    <p>
                      <span className="font-medium">Capacity:</span>{" "}
                      {bus.capacity}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Operational Details
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          bus.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : bus.status === "MAINTENANCE"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bus.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate(`/admin/vehicles/edit/${bus.busId}`)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Edit Bus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
