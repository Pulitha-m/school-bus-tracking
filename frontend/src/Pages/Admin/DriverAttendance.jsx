import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UsersIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  DownloadIcon,
  FilterIcon,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import backendUrl from '../../config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    status: 'all',
    maxDuration: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch shifts based on filters and debounced search query
  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (filters.date) queryParams.append('date', filters.date);
      if (debouncedSearchQuery) queryParams.append('username', debouncedSearchQuery);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.maxDuration) queryParams.append('maxDuration', filters.maxDuration);

      const response = await fetch(`${backendUrl}/api/shifts/getAll?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch shifts');
      const data = await response.json();
      setShifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      setError('Failed to load shift data. Please try again.');
      toast.error('Failed to load shift data');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearchQuery]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  // Format time and duration helpers
  const formatTime = (timeStr) =>
    timeStr ? new Date(`1970-01-01T${timeStr}Z`).toLocaleTimeString('en-GB', { hour12: false }) : '-';

  const formatDuration = (durationStr) => {
    if (!durationStr) return "-";
    const match = durationStr.match(
      /PT(?:(\d+\.?\d*)H)?(?:(\d+\.?\d*)M)?(?:(\d+\.?\d*)S)?/
    );
    if (!match) return "-";
    const hours = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
  };

  const parseDurationToHours = (durationStr) => {
    if (!durationStr) return 0;
    const match = durationStr.match(
      /PT(?:(\d+\.?\d*)H)?(?:(\d+\.?\d*)M)?(?:(\d+\.?\d*)S)?/
    );
    if (!match) return 0;
    const hours = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    return hours + minutes / 60 + seconds / 3600;
  };

  // Memoized filtered shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const matchesSearch = debouncedSearchQuery
        ? shift.username && typeof shift.username === 'string'
          ? shift.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          : false
        : true;
      const matchesDate = filters.date
        ? new Date(shift.date).toISOString().slice(0, 10) === filters.date
        : true;
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'late' && shift.isLate) ||
        (filters.status === 'on-time' && !shift.isLate);
      const matchesMaxDuration = filters.maxDuration
        ? parseDurationToHours(shift.totalWorkedTime) <= parseFloat(filters.maxDuration)
        : true;
      return matchesSearch && matchesDate && matchesStatus && matchesMaxDuration;
    });
  }, [shifts, debouncedSearchQuery, filters]);

  // Calculate statistics
  const totalShifts = filteredShifts.length;
  const lateShifts = filteredShifts.filter((shift) => shift.isLate).length;
  const onTimeShifts = totalShifts - lateShifts;
  const avgDuration =
    filteredShifts.reduce((acc, shift) => {
      const hours = parseDurationToHours(shift.totalWorkedTime);
      return acc + hours;
    }, 0) / totalShifts;
  const formattedAvgDuration = isNaN(avgDuration)
    ? "-"
    : `${Math.floor(avgDuration)}h ${Math.round((avgDuration % 1) * 60)}m`;

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'maxDuration' && value < 0) {
      toast.error('Max duration cannot be negative');
      return;
    }
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      date: '',
      status: 'all',
      maxDuration: '',
    });
    setSearchQuery('');
    toast.info('Filters reset');
  };

  // Enhanced PDF Export
  const exportToPDF = async () => {
    try {
      setIsDownloading(true);

      if (filteredShifts.length === 0) {
        toast.error('No data available to export');
        return;
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });

      let currentY = 10;

      // Add logo
      try {
        const logoUrl = '/logost.png';
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = logoUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const imgWidth = 50;
        const imgHeight = (img.height * imgWidth) / img.width;
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoX = (pageWidth - imgWidth) / 2;
        doc.addImage(img, 'PNG', logoX, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 10;
      } catch (error) {
        console.error('Failed to load logo:', error);
        toast.warn('Logo not included in PDF due to loading issue.');
        currentY += 10;
      }

      // Report title
      const title = `Driver Shift Management Report for ${filters.date || 'All Dates'}`;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const titleWidth = doc.getTextWidth(title);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(title, (pageWidth - titleWidth) / 2, currentY);
      currentY += 10;

      // Generated date
      const generatedDate = `Generated on: ${new Date().toLocaleDateString()}`;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const dateWidth = doc.getTextWidth(generatedDate);
      doc.text(generatedDate, (pageWidth - dateWidth) / 2, currentY);
      currentY += 15;

      // Summary metrics
      doc.setFontSize(14);
      doc.text('Summary Statistics', 15, currentY);
      currentY += 10;

      doc.setFontSize(12);
      doc.text(`Total Shifts: ${totalShifts}`, 15, currentY);
      currentY += 8;
      doc.text(`On Time Shifts: ${onTimeShifts} (${totalShifts > 0 ? Math.round((onTimeShifts / totalShifts) * 100) : 0}%)`, 15, currentY);
      currentY += 8;
      doc.text(`Late Shifts: ${lateShifts} (${totalShifts > 0 ? Math.round((lateShifts / totalShifts) * 100) : 0}%)`, 15, currentY);
      currentY += 8;
      doc.text(`Average Shift Duration: ${formattedAvgDuration}`, 15, currentY);
      currentY += 15;

      // Display applied filters
      const appliedFilters = [
        filters.date ? `Date: ${filters.date}` : '',
        debouncedSearchQuery ? `Username: ${debouncedSearchQuery}` : '',
        filters.status !== 'all' ? `Status: ${filters.status}` : '',
        filters.maxDuration ? `Max Duration: ${filters.maxDuration}h` : '',
      ].filter(Boolean).join(', ');
      doc.setFontSize(12);
      doc.text(`Filters Applied: ${appliedFilters || 'None'}`, 15, currentY);
      currentY += 15;

      // Table data preparation
      const tableData = filteredShifts.map((shift) => [
        shift.username || 'Unknown',
        new Date(shift.date).toLocaleDateString(),
        formatTime(shift.shiftStart),
        formatTime(shift.shiftEnd),
        formatDuration(shift.totalWorkedTime),
        shift.isLate ? 'Late' : 'On Time',
      ]);

      // Add the table using autoTable
      autoTable(doc, {
        startY: currentY,
        head: [['Username', 'Date', 'Shift Start', 'Shift End', 'Duration', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: 'center',
          overflow: 'linebreak',
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' },
        },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }

      doc.save(`shift_management_report_${filters.date || 'all_dates'}.pdf`);
      toast.success('PDF report downloaded successfully');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsDownloading(false);
    }
  };


  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <ClockIcon className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
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
    <div className="p-6 space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Shift Management Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={exportToPDF}
            disabled={isDownloading || filteredShifts.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <ClockIcon className="animate-spin" size={18} />
            ) : (
              <DownloadIcon size={18} />
            )}
            {isDownloading ? 'Generating...' : 'Export to PDF'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon size={20} className="text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-800">Report Filters</h3>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Date Filter */}
          <div className="relative min-w-[200px]">
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <ClockIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Status Filter */}
          <div className="min-w-[200px]">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Shifts</option>
              <option value="on-time">On Time</option>
              <option value="late">Late</option>
            </select>
          </div>

          {/* Max Duration Filter */}
          <div className="min-w-[200px]">
            <input
              type="number"
              name="maxDuration"
              value={filters.maxDuration}
              onChange={handleFilterChange}
              placeholder="Max hours"
              min="0"
              step="0.1"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <FilterIcon size={18} />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Search and Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon size={20} className="text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Search Shifts</h3>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Username..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UsersIcon size={20} className="text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Shift Analytics</h3>
          </div>

          {totalShifts === 0 ? (
            <p className="text-sm text-gray-500">No shift data available for selected filters</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Average Duration Card */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon size={16} className="text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">Avg. Duration</h4>
                </div>
                <p className="text-2xl font-bold text-yellow-900">{formattedAvgDuration}</p>
              </div>

              {/* Attendance Rate Card */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon size={16} className="text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">On Time Rate</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${totalShifts > 0 ? (onTimeShifts / totalShifts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-yellow-900">
                    {totalShifts > 0 ? Math.round((onTimeShifts / totalShifts) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-yellow-700">
                  <span>On Time: {onTimeShifts}</span>
                  <span>Late: {lateShifts}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shift Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            <ClockIcon size={20} className="text-yellow-600" />
            <h3 className="text-xl font-bold text-gray-800">Shift Records</h3>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredShifts.length} of {shifts.length} total shifts
          </div>
        </div>

        {filteredShifts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No shifts match your current filters</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShifts.map((shift, index) => (
                  <tr key={`${shift.id}-${index}`} className="hover:bg-blue-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shift.username || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shift.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(shift.shiftStart)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(shift.shiftEnd)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(shift.totalWorkedTime)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {shift.isLate ? (
                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <AlertCircleIcon size={14} className="mr-1" /> Late
                        </span>
                      ) : (
                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircleIcon size={14} className="mr-1" /> On Time
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

};
export default ShiftManagement;
