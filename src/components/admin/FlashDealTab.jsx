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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';

import {
  getFlashDeals,
  selectFlashDeals,
  selectFlashDealLoading,
  selectFlashDealError,
} from '@/app/features/adminPanel/flashDealSlice';

const FlashDealTab = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const flashDeals = useSelector(selectFlashDeals);
  const loading = useSelector(selectFlashDealLoading);
  const error = useSelector(selectFlashDealError);

  useEffect(() => {
    dispatch(getFlashDeals());
  }, [dispatch]);

  // ✅ Row mapping using exact API field: Productid
  const rows =
    flashDeals?.map((item, index) => ({
      ...item,
      id: item.Productid || `deal-${index}`,
    })) || [];

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [

    {
      field: 'ProductName',
      headerName: 'Product Name',
      width: 280,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: '#1a1a1a' }}
        >
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'SupperDealRequestCount',
      headerName: 'Super Deal Request Count',
      width: 220,
      renderCell: (params) => (
        <Chip
          icon={<BoltIcon sx={{ fontSize: '14px !important', color: '#e65100 !important' }} />}
          label={params.value ?? 0}
          size="small"
          sx={{
            backgroundColor: '#fff3e0',
            color: '#e65100',
            fontWeight: 700,
            fontSize: '0.82rem',
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BoltIcon sx={{ color: '#f57c00', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Flash Deals
        </Typography>
        <Chip
          label={`${filteredRows.length} deals`}
          size="small"
          sx={{
            ml: 1,
            backgroundColor: '#fff3e0',
            color: '#e65100',
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search flash deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#f57c00' }} />
        </Box>
      ) : (
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            sx={{
              borderRadius: 2,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fff8f0',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#4a4a4a',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#fff8f0',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.84rem',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FlashDealTab;