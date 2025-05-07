import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ClockIcon,
  PlayIcon,
  StopCircleIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  BarChart3Icon,
  FilterIcon,
} from 'lucide-react';
import backendUrl from '../../config/config';

const DriverShift = () => {
  const [activeShift, setActiveShift] = useState({
    startTime: null,
    endTime: null,
  });
  const [shiftHistory, setShiftHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [username, setUsername] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all',
    minHours: '',
    maxHours: '',
  });

  // Fetch driver details
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const sessionData = sessionStorage.getItem('user');
        if (!sessionData) {
          setError('No user session found');
          return;
        }
        const { username, id } = JSON.parse(sessionData);
        setUsername(username);
        const response = await axios.get(`${backendUrl}/getDriverById/${id}`, {
          withCredentials: true,
        });
        setDriverId(response.data.id);
      } catch (err) {
        console.error('Error fetching driver details:', err);
        setError('Failed to load driver profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, []);

  // Fetch shift history when driverId or filters change
  useEffect(() => {
    if (driverId) {
      fetchShiftHistory();
    }
  }, [driverId, filters]);

  // Update current time and elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed time for active shift
  useEffect(() => {
    if (!activeShift.startTime || activeShift.endTime) {
      setElapsedTime('00:00:00');
      return;
    }

    const timer = setInterval(() => {
      const start = new Date(activeShift.startTime);
      if (isNaN(start.getTime())) {
        console.warn('Invalid activeShift.startTime:', activeShift.startTime);
        setElapsedTime('00:00:00');
        return;
      }

      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      if (diffMs < 0) {
        console.warn('Negative time difference detected:', diffMs);
        setElapsedTime('00:00:00');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [activeShift]);

  // Parse duration from ISO 8601 format to HH:MM:SS
  const parseDuration = (durationStr) => {
    if (!durationStr) return '-';
    const match = durationStr.match(/PT(?:(\d+\.?\d*)H)?(?:(\d+\.?\d*)M)?(?:(\d+\.?\d*)S)?/);
    if (!match) return '-';
    const hours = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
  };

  // Parse duration to decimal hours
  const parseDurationToHours = (durationStr) => {
    if (!durationStr) return 0;
    const match = durationStr.match(/PT(?:(\d+\.?\d*)H)?(?:(\d+\.?\d*)M)?(?:(\d+\.?\d*)S)?/);
    if (!match) return 0;
    const hours = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    return hours + minutes / 60 + seconds / 3600;
  };

  const fetchShiftHistory = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.minHours) queryParams.append('minHours', filters.minHours);
      if (filters.maxHours) queryParams.append('maxHours', filters.maxHours);

      const response = await axios.get(
        `${backendUrl}/api/shifts/driver/${driverId}?${queryParams.toString()}`,
        { withCredentials: true }
      );
      const shifts = Array.isArray(response.data) ? response.data : [];
      const mappedShifts = shifts.map((shift) => {
        const startTime = shift.date && shift.shiftStart
          ? new Date(`${shift.date}T${shift.shiftStart}`)
          : null;
        const endTime = shift.date && shift.shiftEnd
          ? new Date(`${shift.date}T${shift.shiftEnd}`)
          : null;
        return {
          id: shift.id,
          startTime: startTime && !isNaN(startTime.getTime()) ? startTime.toISOString() : null,
          endTime: endTime && !isNaN(endTime.getTime()) ? endTime.toISOString() : null,
          totalHours: parseDuration(shift.totalWorkedTime),
          totalHoursNumeric: parseDurationToHours(shift.totalWorkedTime),
          status: shift.isLate ? 'late' : 'on-time',
          username: shift.username,
        };
      });
      setShiftHistory(mappedShifts);
    } catch (err) {
      console.error('Error fetching shift history:', err);
      setError('Failed to fetch shift history');
    } finally {
      setLoading(false);
    }
  };

  const hasShiftToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return shiftHistory.some((shift) => {
      if (!shift.startTime) return false;
      const shiftDate = new Date(shift.startTime).toISOString().split('T')[0];
      return shiftDate === today;
    });
  };

  const handleStartShift = async () => {
    try {
      setLoading(true);
      if (hasShiftToday()) {
        setError('Shift already started today');
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/shifts/start/${driverId}`,
        { username },
        { withCredentials: true }
      );
      const newShift = response.data;
      const startTime = newShift.startTime ? new Date(newShift.startTime) : new Date();
      if (isNaN(startTime.getTime())) {
        console.error('Invalid start time from API:', newShift.startTime);
        setError('Invalid shift start time');
        return;
      }
      setActiveShift({
        startTime,
        endTime: null,
      });
      await fetchShiftHistory();
    } catch (err) {
      console.error('Error starting shift:', err);
      setError('Failed to start shift');
    } finally {
      setLoading(false);
    }
  };

  const handleEndShift = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/shifts/end/${driverId}`,
        { username },
        { withCredentials: true }
      );
      const endedShift = response.data;
      const endTime = endedShift.endTime ? new Date(endedShift.endTime) : new Date();
      if (isNaN(endTime.getTime())) {
        console.error('Invalid end time from API:', endedShift.endTime);
        setError('Invalid shift end time');
        return;
      }
      setActiveShift({
        ...activeShift,
        endTime,
      });
      await fetchShiftHistory();
      setTimeout(() => {
        setActiveShift({
          startTime: null,
          endTime: null,
        });
      }, 3000);
    } catch (err) {
      console.error('Error ending shift:', err);
      setError('Failed to end shift');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: 'all',
      minHours: '',
      maxHours: '',
    });
  };

  const isLateShift = (startTime) => {
    if (!startTime) return true;
    const hours = new Date(startTime).getHours();
    const minutes = new Date(startTime).getMinutes();
    return hours > 6 || (hours === 6 && minutes > 30);
  };

  const isLate = !activeShift.startTime && isLateShift(currentTime);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Calculate analytics based on filtered data
  const analytics = {
    totalShifts: shiftHistory.length,
    onTimeShifts: shiftHistory.filter((shift) => shift.status === 'on-time').length,
    lateShifts: shiftHistory.filter((shift) => shift.status === 'late').length,
    onTimePercentage:
      shiftHistory.length > 0
        ? Math.round(
            (shiftHistory.filter((shift) => shift.status === 'on-time').length /
              shiftHistory.length) *
              100
          )
        : 0,
    avgWorkingTime: (() => {
      let totalHours = 0;
      let validShifts = 0;
      shiftHistory.forEach((shift) => {
        if (shift.totalHoursNumeric) {
          totalHours += shift.totalHoursNumeric;
          validShifts += 1;
        }
      });
      const avgHours = validShifts > 0 ? Math.floor(totalHours / validShifts) : 0;
      const avgMinutes = validShifts > 0 ? Math.round((totalHours / validShifts) * 60) % 60 : 0;
      return `${avgHours}h ${avgMinutes}m`;
    })(),
  };

  if (!driverId && loading) {
    return <div>Loading driver profile...</div>;
  }

  if (!driverId && error) {
    return (
      <div className="p-6">
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
          <AlertCircleIcon size={20} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
          <AlertCircleIcon size={20} className="mr-2" />
          {error}
        </div>
      )}
      {/* Shift Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon size={20} className="text-yellow-500" />
          <h3 className="text-lg font-semibold">Shift Controls</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Current Time</p>
            <p className="text-2xl font-bold">{formattedTime}</p>
            <p className="text-sm text-gray-500 mt-2">
              Scheduled: 06:00 - 14:00
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Shift Status</p>
            {activeShift.startTime && !activeShift.endTime ? (
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
            ) : activeShift.startTime && activeShift.endTime ? (
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <p className="text-xl font-bold text-blue-600">Completed</p>
              </div>
            ) : isLate ? (
              <div className="flex items-center">
                <AlertCircleIcon size={20} className="text-red-500 mr-2" />
                <p className="text-xl font-bold text-red-600">Late</p>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                <p className="text-xl font-bold text-gray-600">Not Started</p>
              </div>
            )}
            {activeShift.startTime && !activeShift.endTime && (
              <p className="text-sm font-medium mt-2">
                Started at{' '}
                {activeShift.startTime instanceof Date &&
                !isNaN(activeShift.startTime.getTime())
                  ? activeShift.startTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  : '-'}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
            {activeShift.startTime && !activeShift.endTime ? (
              <>
                <p className="text-sm text-gray-500 mb-1">Elapsed Time</p>
                <p className="text-2xl font-bold">{elapsedTime}</p>
                <button
                  onClick={handleEndShift}
                  disabled={loading}
                  className={`mt-4 px-4 py-2 rounded-md flex items-center gap-2 ${
                    loading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <StopCircleIcon size={18} />
                  End Shift
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-1">Shift Controls</p>
                <button
                  onClick={handleStartShift}
                  disabled={activeShift.endTime !== null || loading || hasShiftToday()}
                  className={`mt-2 px-4 py-2 rounded-md flex items-center gap-2 ${
                    activeShift.endTime || loading || hasShiftToday()
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <PlayIcon size={18} />
                  Start Shift
                </button>
                {(activeShift.endTime || hasShiftToday()) && (
                  <p className="text-sm text-gray-500 mt-2">
                    Shift completed or already started today
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Analytics and History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3Icon size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Attendance Analytics</h3>
          </div>
          {shiftHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No shift data available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon size={16} className="text-blue-500" />
                  <h4 className="font-medium">Average Working Time</h4>
                </div>
                <p className="text-2xl font-bold">{analytics.avgWorkingTime}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {analytics.totalShifts} shifts
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon size={16} className="text-green-500" />
                  <h4 className="font-medium">Attendance Rate</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${analytics.onTimePercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {analytics.onTimePercentage}%
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>On time: {analytics.onTimeShifts}</span>
                  <span>Late: {analytics.lateShifts}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Shift History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon size={20} className="text-yellow-500" />
              <h3 className="text-lg font-semibold">Shift History</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>
          {shiftHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No shift history available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shiftHistory.map((shift, index) => {
                    const startDate = shift.startTime ? new Date(shift.startTime) : null;
                    const endDate = shift.endTime ? new Date(shift.endTime) : null;
                    const isValidStartDate = startDate && !isNaN(startDate.getTime());
                    const isValidEndDate = endDate && !isNaN(endDate.getTime());

                    return (
                      <tr key={`${shift.id}-${index}`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {shift.username || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {isValidStartDate
                            ? startDate.toISOString().split('T')[0]
                            : 'Invalid Date'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {isValidStartDate
                            ? startDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                              })
                            : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {isValidEndDate
                            ? endDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                              })
                            : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {shift.totalHours || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {shift.status === 'on-time' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <CheckCircleIcon size={14} className="mr-1" /> On Time
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <AlertCircleIcon size={14} className="mr-1" /> Late
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverShift;