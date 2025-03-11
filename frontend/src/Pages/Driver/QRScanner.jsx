import React, { useState } from "react";
import { CheckCircleIcon, XCircleIcon, CameraIcon } from "lucide-react";

export const QRScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const simulateScan = () => {
    setSuccess(true);
    onScan("STUDENT_123");
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Scan Student QR Code
          </h3>
          <p className="text-sm text-gray-600">
            Position the QR code within the frame
          </p>
        </div>
        <div className="relative">
          {!success && !error && (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="w-48 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-4">
                <CameraIcon className="h-12 w-12 text-gray-400" />
              </div>
              <button
                onClick={simulateScan}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Start Scanning
              </button>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center p-8 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
              <p className="ml-4 text-green-700">Successfully scanned!</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
              <XCircleIcon className="h-16 w-16 text-red-500" />
              <p className="ml-4 text-red-700">{error}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
