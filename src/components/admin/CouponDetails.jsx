'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Snackbar } from '@mui/material';
import { Search, Tag, TrendingUp } from 'lucide-react';
import { getCouponCodeList } from '@/app/features/adminPanel/adminPanelSlice';
import { validateCoupon } from '@/app/features/auth/authSlice';

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className="flex items-center text-green-600 text-sm font-semibold">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </div>
      )}
    </div>
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const CouponDetails = () => {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ TOAST STATE (ADDED)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const adminState = useSelector((state) => state?.adminPanel);

  if (!adminState) {
    return (
      <Alert severity="error">
        Redux store not properly configured. Please ensure the Provider is set up correctly.
      </Alert>
    );
  }

  const {
    couponCodes = [],
    couponLoading = false,
    couponError = null,
  } = adminState;

  useEffect(() => {
    setMounted(true);
    dispatch(getCouponCodeList());
  }, [dispatch]);

  if (!mounted || couponLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (couponError) {
    return <Alert severity="error">{couponError}</Alert>;
  }

  const rows = Array.isArray(couponCodes)
    ? couponCodes.map((item, index) => ({
        id: item.CouponId || index,
        PhoneNo: item.PhoneNo,
        ProductName: item.ProductName,
        CouponCode: item.CouponCode,
        IsUsed: item.IsUsed,
        UserId: item.UserId,
        CouponId: item.CouponId,
      }))
    : [];

  const filteredData = rows.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ VALIDATE COUPON HANDLER (UNCHANGED)
  const handleValidateCoupon = (row) => {
    dispatch(
      validateCoupon({
        couponId: row.CouponId,
        userId: row.UserId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getCouponCodeList());
        setToast({
          open: true,
          message: 'Coupon validated successfully 🎉',
          severity: 'success',
        });
      })
      .catch((err) => {
        setToast({
          open: true,
          message: err,
          severity: 'error',
        });
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Coupon Code Details
        </h2>
        <p className="text-gray-600">
          Track coupon usage and assignments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard icon={Tag} label="Total Coupons" value={rows.length} />
        <StatCard
          icon={Tag}
          label="Unique Products"
          value={new Set(rows.map((r) => r.ProductName)).size}
        />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by phone, product, or coupon code..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {rows.length === 0 ? (
        <Alert severity="info">No coupon data available</Alert>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Coupon Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Validate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.PhoneNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.ProductName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <code className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-mono text-sm font-semibold">
                        {row.CouponCode}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm">
                    <Button
  variant="contained"
  color="success"
  disabled={row.IsUsed === "true"}
  onClick={() => handleValidateCoupon(row)}
>
  {row.IsUsed === "true" ? 'Validated' : 'Validate'}
</Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
                {filteredData.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ TOAST UI */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CouponDetails;
