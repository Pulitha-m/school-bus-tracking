import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import backendUrl from "../../config/config";
import { toast } from "react-toastify";

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [driverBusId, setDriverBusId] = useState(null);
  const videoElementRef = useRef(null);
  const codeReaderRef = useRef(null);
  const lastScannedDataRef = useRef("");
  const debounceTimeoutRef = useRef(null);
  const pauseScanningRef = useRef(false);
  const previousDriverBusIdRef = useRef(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    if (!sessionData) {
      setError("No user session found. Please log in.");
      setInitialLoading(false);
      return;
    }

    const { username } = JSON.parse(sessionData);

    axios
      .get(`${backendUrl}/getDriverByEmail/${username}`, {
        withCredentials: true,
      })
      .then((res) => {
        const driverData = res.data;
        if (driverData && driverData.busId) {
          setDriverBusId(driverData.busId);
        } else {
          setDriverBusId("N/A");
        }
      })
      .catch(() => {
        toast.error("Failed to fetch driver data");
        setDriverBusId("N/A");
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, []);

  useEffect(() => {
    if (driverBusId !== "N/A" && driverBusId !== null) {
      previousDriverBusIdRef.current = driverBusId;
    }
  }, [driverBusId]);

  const playBeep = () => {
    const beep = new Audio("/beep.mp3");
    beep.play().catch((err) => console.warn("Beep sound error:", err));
  };

  const fetchAllAttendanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/attendance`, {
        withCredentials: true,
      });
      let records = response.data || [];

      const today = new Date().toISOString().split("T")[0];
      records = records.filter((record) => {
        const recordDate = new Date(record.scannedAt)
          .toISOString()
          .split("T")[0];
        return recordDate === today && record.busId === driverBusId;
      });

      records.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
      setAttendanceRecords(records);
    } catch (err) {
      setError("Failed to fetch attendance records. Please try again later.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const processScannedQRCode = async (qrCode) => {
    try {
      setLoading(true);
      setError(null);

      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail(qrCode)) {
        throw new Error("Invalid QR code format. Expected a valid email.");
      }

      if (
        previousDriverBusIdRef.current === "N/A" ||
        previousDriverBusIdRef.current === null
      ) {
        throw new Error(
          "No bus assigned to driver. Please contact the administrator."
        );
      }

      const response = await axios.get(
        `${backendUrl}/getStudentByEmail/${qrCode}`,
        {
          withCredentials: true,
        }
      );

      if (!response.data) {
        throw new Error("User not found in the system.");
      }

      const student = response.data;

      if (student.busId !== previousDriverBusIdRef.current) {
        throw new Error("This student is not assigned to this bus.");
      }

      let allRecords = [];
      try {
        const attendanceResponse = await axios.get(
          `${backendUrl}/api/attendance/${qrCode}`,
          {
            withCredentials: true,
          }
        );
        allRecords = attendanceResponse.data || [];
      } catch (err) {
        if (err.response?.status !== 404) {
          throw err;
        }
      }

      // Step 1: Determine new status using latest full record
      let newStatus = "On-Board";
      if (allRecords.length > 0) {
        allRecords.sort(
          (a, b) => new Date(b.scannedAt) - new Date(a.scannedAt)
        );
        const lastStatus = allRecords[0].status;
        newStatus = lastStatus === "On-Board" ? "Dropped-Off" : "On-Board";

        // Prevent duplicate status
        if (lastStatus === newStatus) {
          throw new Error(`Already marked as "${newStatus}".`);
        }
      }

      const statusResponse = await axios.post(
        `${backendUrl}/api/addStatus`,
        null,
        {
          params: {
            email: qrCode,
            status: newStatus,
            busId: previousDriverBusIdRef.current,
          },
          withCredentials: true,
        }
      );

      if (statusResponse.status === 200) {
        playBeep();

        // Step 2: Filter today's records for table
        const today = new Date().toISOString().split("T")[0];
        const filteredRecords = allRecords
          .concat({
            email: qrCode,
            status: newStatus,
            scannedAt: new Date().toISOString(),
            busId: previousDriverBusIdRef.current,
            student,
          })
          .filter((record) => {
            const recordDate = new Date(record.scannedAt)
              .toISOString()
              .split("T")[0];
            return recordDate === today && record.busId === driverBusId;
          })
          .sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));

        setAttendanceRecords(filteredRecords);
      }
    } catch (err) {
      console.error("QR processing error:", err);
      if (err.response?.status === 404) {
        setError(
          "Student not found. Please ensure the QR code contains a registered email."
        );
      } else {
        setError(
          `Error processing scanned QR code: ${
            err.response?.data || err.message || "Unknown error"
          }`
        );
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        pauseScanningRef.current = false;
      }, 3000);
    }
  };

  const handleScanAgain = () => {
    lastScannedDataRef.current = "";
    pauseScanningRef.current = false;
    setError(null);
    fetchAllAttendanceRecords();
  };

  useEffect(() => {
    fetchAllAttendanceRecords();

    if (!videoElementRef.current) return;

    codeReaderRef.current = new BrowserMultiFormatReader();
    codeReaderRef.current
      .decodeFromVideoDevice(null, videoElementRef.current, (result, err) => {
        if (pauseScanningRef.current) return;

        if (result) {
          const scannedText = result.getText().trim();
          if (scannedText && scannedText !== lastScannedDataRef.current) {
            lastScannedDataRef.current = scannedText;
            pauseScanningRef.current = true;

            if (debounceTimeoutRef.current) {
              clearTimeout(debounceTimeoutRef.current);
            }

            debounceTimeoutRef.current = setTimeout(() => {
              processScannedQRCode(scannedText);
            }, 2000); // increased debounce
          }
        } else if (err && !(err instanceof NotFoundException)) {
          setError("Scanner error: " + err.message);
        }
      })
      .catch((err) => {
        setError("Scanner initialization error: " + err.message);
      });

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [driverBusId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-4">
          Student Bus Tracking - Scan QR Code 🔍
        </h2>

        <div className="flex justify-center mb-6">
          <video
            ref={videoElementRef}
            className="w-1/2 border border-black shadow-lg"
            autoPlay
            muted
            playsInline
          ></video>
        </div>

        {initialLoading && (
          <div className="mt-6 text-yellow-500">Loading initial data...</div>
        )}

        {!initialLoading && loading && (
          <div className="mt-6 text-yellow-500">Processing...</div>
        )}

        {!initialLoading && error && (
          <div className="mt-6 text-red-600">{error}</div>
        )}

        <div className="mt-6">
          <button
            onClick={handleScanAgain}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Scan Again
          </button>
        </div>

        {!initialLoading && (
          <div className="mt-8">
            {attendanceRecords.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Attendance Records
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-[#FFC312] text-black">
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Scanned At</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Student ID</th>
                        <th className="py-2 px-4 border">Bus ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record, index) => (
                        <tr key={index} className="text-center">
                          <td className="py-2 px-4 border">{record.email}</td>
                          <td className="py-2 px-4 border">
                            {new Date(record.scannedAt).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">{record.status}</td>
                          <td className="py-2 px-4 border">
                            {record.student?.id || "N/A"}
                          </td>
                          <td className="py-2 px-4 border">
                            {record.busId || driverBusId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                No attendance records found for today. Scan a student's QR code
                to start.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
