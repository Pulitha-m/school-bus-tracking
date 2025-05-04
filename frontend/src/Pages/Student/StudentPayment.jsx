import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  CreditCard, 
  Banknote, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Calendar,
  Loader,
  AlertCircle
} from "lucide-react";

// Configure API base URL - works for both dev and production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const StudentPayment = () => {
  // State management
  const [paymentInfo, setPaymentInfo] = useState({
    amount: 0,
    nextDueDate: null,
    status: "LOADING",
    isOverdue: false
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState({
    info: true,
    history: true
  });
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Format currency (LKR)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status icon
  const getPaymentStatusIcon = (status) => {
    const statusMap = {
      'PAID': <CheckCircle className="h-5 w-5 text-green-500" />,
      'PENDING': <Clock className="h-5 w-5 text-yellow-500" />,
      'PENDING_APPROVAL': <Clock className="h-5 w-5 text-yellow-500" />,
      'UNPAID': <XCircle className="h-5 w-5 text-red-500" />,
      'OVERDUE': <XCircle className="h-5 w-5 text-red-500" />
    };
    return statusMap[status?.toUpperCase()] || null;
  };

  // Get authenticated student email from session
  const getAuthStudentEmail = () => {
    try {
      const userData = sessionStorage.getItem("user");
      if (!userData) throw new Error("No session data");
      const user = JSON.parse(userData);
      return user.username || user.email;
    } catch (error) {
      toast.error("Please login to access payment services");
      return null;
    }
  };

  // Fetch payment data from backend
  const fetchPaymentData = async () => {
    const studentEmail = getAuthStudentEmail();
    if (!studentEmail) return;

    try {
      setLoading(prev => ({ ...prev, info: true }));
      setError(null);
      
      // Fetch current payment info
      const [infoResponse, historyResponse] = await Promise.all([
        api.get(`/api/stripe/payment-details?username=${encodeURIComponent(studentEmail)}`),
        api.get(`/api/stripe/getAllPayments?studentEmail=${encodeURIComponent(studentEmail)}`)
      ]);
      
      setPaymentInfo({
        amount: infoResponse.data?.amount || 0,
        nextDueDate: infoResponse.data?.nextDueDate || null,
        status: infoResponse.data?.status || 'UNPAID',
        isOverdue: infoResponse.data?.isOverdue || false
      });

      // Ensure paymentHistory is always an array
      setPaymentHistory(Array.isArray(historyResponse?.data) ? historyResponse.data : []);
      
    } catch (error) {
      console.error("Payment data fetch error:", error);
      setError(error.response?.data?.message || "Failed to load payment data");
      setPaymentHistory([]);
      toast.error("Failed to load payment information");
    } finally {
      setLoading(prev => ({ info: false, history: false }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (JPEG, PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setPaymentSlip(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Process Stripe payment
  const processStripePayment = async () => {
    const studentEmail = getAuthStudentEmail();
    if (!studentEmail) return;

    try {
      setIsProcessing(true);
      const response = await api.post("/api/stripe/create-payment-intent", {
        amount: paymentInfo.amount,
        email: studentEmail,
        description: `Bus fee payment for ${studentEmail}`
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error(error.response?.data?.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit bank slip
  const submitBankSlip = async () => {
    const studentEmail = getAuthStudentEmail();
    if (!studentEmail || !paymentSlip) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", paymentSlip);
      formData.append("studentEmail", studentEmail);
      formData.append("amount", paymentInfo.amount);

      await api.post("/api/stripe/upload-slip", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Payment slip submitted for verification");
      await fetchPaymentData();
      setPaymentSlip(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Slip upload error:", error);
      toast.error(error.response?.data?.message || "Slip upload failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchPaymentData();
  }, []);

  // Loading state
  if (loading.info || loading.history) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-yellow-500" />
        <span className="ml-3">Loading payment information...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Payment Error</h2>
        </div>
        <p className="mt-3 text-red-700">{error}</p>
        <button
          onClick={fetchPaymentData}
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Current Payment Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Banknote className="text-yellow-500" />
          Current Payment Status
        </h2>

        {/* Payment Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Amount Due</p>
            <p className="text-lg font-medium">{formatCurrency(paymentInfo.amount)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="text-lg font-medium flex items-center gap-1">
              <Calendar className="h-5 w-5" />
              {paymentInfo.nextDueDate ? formatDate(paymentInfo.nextDueDate) : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center gap-2">
              {getPaymentStatusIcon(paymentInfo.status)}
              <span className="text-lg font-medium capitalize">
                {paymentInfo.status?.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        {paymentInfo.status !== 'PAID' && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Make Payment</h3>
            
            {/* Payment Method Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod("STRIPE")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  paymentMethod === "STRIPE" 
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Credit/Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod("SLIP")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  paymentMethod === "SLIP" 
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Banknote className="h-5 w-5" />
                Bank Transfer
              </button>
            </div>

            {/* Payment Form */}
            {paymentMethod === "STRIPE" ? (
              <button
                onClick={processStripePayment}
                disabled={isProcessing}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay Now with Stripe
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                {previewImage ? (
                  <div>
                    <img 
                      src={previewImage} 
                      alt="Payment slip preview" 
                      className="h-40 mx-auto mb-4 border rounded"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setPaymentSlip(null);
                          setPreviewImage(null);
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                      >
                        Change Slip
                      </button>
                      <button
                        onClick={submitBankSlip}
                        disabled={isProcessing}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="animate-spin h-4 w-4" />
                            Uploading...
                          </>
                        ) : (
                          "Submit Payment Slip"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <p className="mb-4">Upload your bank payment slip</p>
                    <label className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded inline-block">
                      Select File
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPEG or PNG, max 5MB</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment History Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        
        {paymentHistory?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id || payment.paymentDate}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {payment.method?.toLowerCase() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(payment.status)}
                        <span className="capitalize">
                          {payment.status?.toLowerCase().replace('_', ' ') || '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No payment history found</p>
        )}
      </div>
    </div>
  );
};

export default StudentPayment;