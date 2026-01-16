'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import { Search, Users, TrendingUp, FileText } from 'lucide-react';
import { getUserTracking } from '@/app/features/adminPanel/adminPanelSlice';

/* ---------- Stat Card ---------- */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const UsertrackingTab = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const adminState = useSelector((state) => state?.adminPanel);


  const {
  userTrackingData,
  userTrackingLoading,
  userTrackingError,
} = useSelector((state) => state.adminPanel);


  console.log("userTrackingData" , userTrackingData)
  useEffect(() => {
    setMounted(true);
    dispatch(getUserTracking());
  }, [dispatch]);

  /* ---------- Loading ---------- */
  if (!mounted || userTrackingLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (userTrackingError) {
    return <Alert severity="error">{userTrackingError}</Alert>;
  }

  /* ---------- No Data ---------- */
  if (!userTrackingData || userTrackingData.length === 0) {
    return <Alert severity="info">No tracking data available</Alert>;
  }

  /* ---------- Prepare Rows ---------- */
  const rows = userTrackingData.map((item, index) => ({
    id: `${item.Phoneno}-${index}`,
    Phoneno: item.Phoneno,
    Pagename: item.Pagename,
    CreatedDate: item.CreatedDate,
  }));

  /* ---------- Search ---------- */
  const filteredData = rows.filter((item) =>
    Object.values(item).some((val) =>
      Array.isArray(val)
        ? val.join(',').toLowerCase().includes(searchTerm.toLowerCase())
        : String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* ---------- Stats ---------- */
  const totalUsers = new Set(rows.map((r) => r.Phoneno)).size;
  const totalPageVisits = rows.reduce(
    (acc, r) => acc + (r.Pagename?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          User Tracking Details
        </h2>
        <p className="text-gray-600">
          Monitor user navigation and page visits
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label="Total Users" value={totalUsers} />
        <StatCard
          icon={FileText}
          label="Total Page Visits"
          value={totalPageVisits}
        />
        <StatCard
          icon={TrendingUp}
          label="Tracking Records"
          value={rows.length}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by phone, page name, or date..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Page Names
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Viewed Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {row.Phoneno}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {row.Pagename.map((page, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold"
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {row.CreatedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
              {filteredData.length}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsertrackingTab;
