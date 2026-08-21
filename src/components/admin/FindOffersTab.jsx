'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PhoneIcon from '@mui/icons-material/Phone';
import toast from 'react-hot-toast';

import {
  getFeedbacks,
  updateFeedbackStatus,
  selectFeedbacks,
  selectFeedbackCount,
  selectFeedbackLoading,
  selectFeedbackError,
  selectUpdatingFeedbackIds,
} from '@/app/features/adminPanel/userFeedbackSlice';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const FindOffersTab = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const feedbacks = useSelector(selectFeedbacks);
  const count = useSelector(selectFeedbackCount);
  const loading = useSelector(selectFeedbackLoading);
  const error = useSelector(selectFeedbackError);
  const updatingIds = useSelector(selectUpdatingFeedbackIds);

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  const handleContacted = async (feedbackId) => {
    try {
      const resultAction = await dispatch(
        updateFeedbackStatus({ FeedbackId: feedbackId })
      );
      if (updateFeedbackStatus.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message || 'Status updated to Completed successfully!'
        );
      } else {
        toast.error(
          resultAction.payload || 'Failed to update status. Please try again.'
        );
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    }
  };

  const rows = (feedbacks || []).map((item, index) => ({
    id: item.FeedbackId || `feedback-${index}`,
    FeedbackId: item.FeedbackId,
    PhoneNo: item.PhoneNo || item.Phoneno || item.phoneNo || '—',
    Feedback: item.Feedback,
    Status: item.Status || 'Pending',
    CreatedAt: item.CreatedAt,
  }));

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      field: 'PhoneNo',
      headerName: 'Phone Number',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
          <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600 }}>
            {params.value || '—'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'Feedback',
      headerName: 'Feedback Details',
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const isCompleted =
          params.value === 'Completed' || params.value === 'completed';
        return (
          <Chip
            icon={
              isCompleted ? (
                <CheckCircleIcon sx={{ fontSize: '14px !important', color: '#15803d !important' }} />
              ) : (
                <PendingIcon sx={{ fontSize: '14px !important', color: '#b45309 !important' }} />
              )
            }
            label={isCompleted ? 'Completed' : 'Pending'}
            size="small"
            sx={{
              backgroundColor: isCompleted ? '#dcfce7' : '#fef3c7',
              color: isCompleted ? '#15803d' : '#b45309',
              fontWeight: 700,
              fontSize: '0.78rem',
              px: 0.5,
            }}
          />
        );
      },
    },
    {
      field: 'CreatedAt',
      headerName: 'Created At',
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <EventIcon sx={{ fontSize: 16, color: '#6b7280' }} />
          <Typography variant="body2" sx={{ color: '#374151' }}>
            {formatDate(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isUpdating = updatingIds.includes(params.row.FeedbackId);
        const isCompleted =
          params.row.Status === 'Completed' || params.row.Status === 'completed';

        return (
          <Button
            size="small"
            variant={isCompleted ? 'outlined' : 'contained'}
            disabled={isCompleted || isUpdating}
            startIcon={
              isUpdating ? (
                <CircularProgress size={14} color="inherit" />
              ) : isCompleted ? (
                <CheckCircleIcon sx={{ fontSize: 16 }} />
              ) : (
                <PhoneInTalkIcon sx={{ fontSize: 16 }} />
              )
            }
            onClick={() => handleContacted(params.row.FeedbackId)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: '8px',
              px: 2,
              py: 0.6,
              boxShadow: isCompleted ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.25)',
              backgroundColor: isCompleted ? 'transparent' : '#2563eb',
              borderColor: isCompleted ? '#86efac' : 'transparent',
              color: isCompleted ? '#16a34a' : '#ffffff',
              '&:hover': {
                backgroundColor: isCompleted ? '#f0fdf4' : '#1d4ed8',
              },
            }}
          >
            {isUpdating ? 'Updating...' : isCompleted ? 'Contacted' : 'Contacted'}
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <LocalOfferIcon sx={{ color: '#2563eb', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
          Find Offers
        </Typography>
        <Chip
          label={`${filteredRows.length} requests`}
          size="small"
          sx={{
            ml: 1,
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search offers & feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 340 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading & DataGrid */}
      {loading ? (
        <Box
          sx={{
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#2563eb' }} />
        </Box>
      ) : (
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            disableSelectionOnClick
            sx={{
              borderRadius: 3,
              borderColor: '#e5e7eb',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#334155',
                borderBottom: '1px solid #e2e8f0',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f1f5f9',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.84rem',
                alignItems: 'center',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FindOffersTab;
