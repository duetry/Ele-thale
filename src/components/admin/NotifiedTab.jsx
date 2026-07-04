'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

import {
  getNotified,
  selectNotified,
  selectNotifiedLoading,
  selectNotifiedError,
} from '@/app/features/adminPanel/notifiedSlice';

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

/* =========================================================
   USERS DIALOG — shows all users (phone/date/status) for
   a single product. Handles 100s of rows via its own
   paginated grid + search, without bloating the main table.
   ========================================================= */
const ProductUsersDialog = ({ open, onClose, product }) => {
  const [userSearch, setUserSearch] = useState('');

  const userRows = useMemo(() => {
    if (!product?.Users) return [];
    return product.Users.map((user, idx) => ({
      id: user.Userid ? `${user.Userid}-${idx}` : idx,
      Phoneno: user.Phoneno,
      Datetime: user.Datetime,
      IsNotified: user.IsNotified,
    }));
  }, [product]);

  const filteredUserRows = userRows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  const userColumns = [
    {
      field: 'Phoneno',
      headerName: 'Phone Number',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <PhoneIcon sx={{ fontSize: 16, color: '#757575' }} />
          <Typography variant="body2" sx={{ color: '#333' }}>
            {params.value || '—'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'Datetime',
      headerName: 'Requested On',
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <EventIcon sx={{ fontSize: 16, color: '#757575' }} />
          <Typography variant="body2" sx={{ color: '#333' }}>
            {formatDate(params.value)}
          </Typography>
        </Box>
      ),
    },
    // {
    //   field: 'IsNotified',
    //   headerName: 'Status',
    //   width: 140,
    //   renderCell: (params) => {
    //     const isNotified =
    //       params.value === true || params.value === 'true';
    //     return (
    //       <Chip
    //         label={isNotified ? 'Notified' : 'Pending'}
    //         size="small"
    //         sx={{
    //           backgroundColor: isNotified ? '#e8f5e9' : '#fff3e0',
    //           color: isNotified ? '#2e7d32' : '#e65100',
    //           fontWeight: 700,
    //           fontSize: '0.75rem',
    //         }}
    //       />
    //     );
    //   },
    // },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {product?.ProductName || 'Requests'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575' }}>
            {userRows.length} user{userRows.length !== 1 ? 's' : ''} requested
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          size="small"
          placeholder="Search phone number..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ height: 420 }}>
          <DataGrid
            rows={filteredUserRows}
            columns={userColumns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50, 100]}
            disableSelectionOnClick
            sx={{
              borderRadius: 2,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fff8f0',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#4a4a4a',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.82rem',
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

/* =========================================================
   MAIN TAB — one row per PRODUCT (not per user), so the
   grid stays fast/readable even with 100+ requests on a
   single product. Click "View Requests" to drill in.
   ========================================================= */
const NotifiedTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const flashDeals = useSelector(selectNotified);
  const loading = useSelector(selectNotifiedLoading);
  const error = useSelector(selectNotifiedError);

  useEffect(() => {
    dispatch(getNotified());
  }, [dispatch]);

  const rows = (flashDeals || []).map((product, index) => {
    const users = product.Users || [];
    const notifiedCount = users.filter(
      (u) => u.IsNotified === true || u.IsNotified === 'true'
    ).length;
    // most recent request date, for a quick glance without opening the dialog
    const latestDate = users.reduce((latest, u) => {
      if (!u.Datetime) return latest;
      return !latest || new Date(u.Datetime) > new Date(latest)
        ? u.Datetime
        : latest;
    }, null);

    return {
      id: product.Productid || `deal-${index}`,
      Productid: product.Productid,
      ProductName: product.ProductName,
      NotifyRequestCount: product.NotifyRequestCount ?? users.length,
      notifiedCount,
      pendingCount: users.length - notifiedCount,
      latestDate,
      _product: product,
    };
  });

  const filteredRows = rows.filter((row) =>
    row.ProductName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRequests = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const columns = [
    {
      field: 'ProductName',
      headerName: 'Product Name',
      width: 260,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'NotifyRequestCount',
      headerName: 'Total Requests',
      width: 150,
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
    {
      field: 'notifiedCount',
      headerName: 'Notified',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ?? 0}
          size="small"
          sx={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        />
      ),
    },
    {
      field: 'pendingCount',
      headerName: 'Pending',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ?? 0}
          size="small"
          sx={{
            backgroundColor: '#fff3e0',
            color: '#e65100',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        />
      ),
    },
    {
      field: 'latestDate',
      headerName: 'Latest Request',
      width: 210,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <EventIcon sx={{ fontSize: 16, color: '#757575' }} />
          <Typography variant="body2" sx={{ color: '#333' }}>
            {formatDate(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Requests',
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
          onClick={() => handleViewRequests(params.row._product)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: '#f57c00',
            '&:hover': { backgroundColor: '#fff3e0' },
          }}
        >
          View Requests
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BoltIcon sx={{ color: '#f57c00', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Notified
        </Typography>
        <Chip
          label={`${filteredRows.length} products`}
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
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 320 }}
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

      <ProductUsersDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={selectedProduct}
      />
    </Box>
  );
};

export default NotifiedTab;