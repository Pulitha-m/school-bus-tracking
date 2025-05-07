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
  AlertCircle,
  ArrowRight
} from "lucide-react";

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8080' 
  : '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const StudentPayment = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    amount: 0,
    nextDueDate: null,
    status: "LOADING",
    isOverdue: false,
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState({
    info: true,
    history: true,
  });
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("current");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'PAID': {
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-green-100 text-green-800'
      },
      'PENDING': {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-yellow-100 text-yellow-800'
      },
      'PENDING_APPROVAL': {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-yellow-100 text-yellow-800'
      },
      'UNPAID': {
        icon: <XCircle className="h-4 w-4" />,
        color: 'bg-red-100 text-red-800'
      },
      'OVERDUE': {
        icon: <XCircle className="h-4 w-4" />,
        color: 'bg-red-100 text-red-800'
      }
    };

    const statusData = statusMap[status?.toUpperCase()] || {
      icon: null,
      color: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusData.color}`}>
        {statusData.icon}
        <span className="ml-1 capitalize">
          {status?.toLowerCase().replace('_', ' ')}
        </span>
      </span>
    );
  };

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

  const fetchPaymentData = async () => {
    const studentEmail = getAuthStudentEmail();
    if (!studentEmail) return;

    try {
      setLoading(prev => ({ ...prev, info: true, history: true }));
      setError(null);

      const [infoResponse, historyResponse] = await Promise.all([
        api.get(`/api/stripe/payment-details?username=${encodeURIComponent(studentEmail)}`),
        api.get(`/api/stripe/getAllPayments`)
      ]);

      // Process current payment info
      const paymentData = infoResponse.data || {};
      const dueDate = paymentData.nextDueDate ? new Date(paymentData.nextDueDate) : null;
      const isOverdue = dueDate ? new Date() > dueDate : false;

      setPaymentInfo({
        amount: paymentData.amount || 0,
        nextDueDate: paymentData.nextDueDate || null,
        status: paymentData.status || 'UNPAID',
        isOverdue
      });

      // Process payment history
      const allPayments = Array.isArray(historyResponse?.data) ? historyResponse.data : [];
      const studentPayments = allPayments
        .filter(p => p.studentEmail === studentEmail)
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

      setPaymentHistory(studentPayments);
      
    } catch (error) {
      console.error("Payment data fetch error:", error);
      setError(error.response?.data?.error || "Failed to load payment data");
      toast.error("Failed to load payment information");
    } finally {
      setLoading(prev => ({ ...prev, info: false, history: false }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image/(jpeg|png)')) {
      toast.error("Please upload a JPEG or PNG image");
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

  const processStripePayment = async () => {
    const studentEmail = getAuthStudentEmail();
    if (!studentEmail) return;

    try {
      setIsProcessing(true);
      const response = await api.post("/api/stripe/create-checkout-session", {
        amount: paymentInfo.amount,
        email: studentEmail,
        description: `Bus fee payment for ${studentEmail}`,
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

  const submitBankSlip = async () => {
    const studentEmail = getAuthStudentEmail();
    if (!studentEmail || !paymentSlip) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", paymentSlip);
      formData.append("studentId", studentEmail); // Using email as ID in this example
      formData.append("amount", paymentInfo.amount.toString());

      await api.post("/api/stripe/upload-slip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  useEffect(() => {
    fetchPaymentData();
  }, []);

  if (loading.info || loading.history) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-yellow-500" />
        <span className="ml-3 text-gray-600">Loading payment information...</span>
      </div>
    );
  }

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
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Payment Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-2 rounded-md ${activeTab === "current" ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Current Payment
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md ${activeTab === "history" ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Payment History
          </button>
        </div>
      </div>

      {activeTab === "current" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Current Payment Status */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Banknote className="text-yellow-500" />
              Current Payment Status
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Amount Due Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Amount Due</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {formatCurrency(paymentInfo.amount)}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Banknote className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Due Date Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {paymentInfo.nextDueDate ? formatDate(paymentInfo.nextDueDate) : 'Not set'}
                  </p>
                  {paymentInfo.isOverdue && (
                    <p className="text-xs text-red-500 mt-1">Payment overdue</p>
                  )}
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getPaymentStatusBadge(paymentInfo.status)}
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  {paymentInfo.status === 'PAID' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Clock className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          {paymentInfo.status !== 'PAID' && (
            <div className="p-6 border-t">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Make Payment</h3>

              {/* Payment Method Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={`py-3 px-4 font-medium text-sm flex items-center gap-2 ${paymentMethod === "STRIPE" ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <CreditCard className="h-5 w-5" />
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod("SLIP")}
                  className={`py-3 px-4 font-medium text-sm flex items-center gap-2 ${paymentMethod === "SLIP" ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Banknote className="h-5 w-5" />
                  Bank Transfer
                </button>
              </div>

              {/* Payment Form */}
              {paymentMethod === "STRIPE" ? (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          You will be redirected to Stripe's secure payment page to complete your transaction.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={processStripePayment}
                    disabled={isProcessing}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="animate-spin h-5 w-5" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Pay {formatCurrency(paymentInfo.amount)} with Stripe
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {previewImage ? (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <img
                          src={previewImage}
                          alt="Payment slip preview"
                          className="h-48 mx-auto object-contain"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setPaymentSlip(null);
                            setPreviewImage(null);
                          }}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
                        >
                          Change Slip
                        </button>
                        <button
                          onClick={submitBankSlip}
                          disabled={isProcessing}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
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
                      <div className="mx-auto h-12 w-12 text-gray-400 mb-3 flex items-center justify-center">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload a clear photo or scan of your bank payment slip
                      </p>
                      <label className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded inline-flex items-center transition-colors">
                        <span>Select File</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-3">
                        JPEG or PNG only, max 5MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Payment History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View all your past payment transactions
            </p>
          </div>

          {paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {payment.method?.toLowerCase() || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getPaymentStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method === 'STRIPE' ? (
                          <span className="text-yellow-600">Stripe Receipt</span>
                        ) : payment.slipImage ? (
                          <button
                            onClick={() => window.open(`data:image/jpeg;base64,${payment.slipImage}`, '_blank')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Slip
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Banknote className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No payment history</h3>
              <p className="text-sm text-gray-500">
                You haven't made any payments yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPayment;
