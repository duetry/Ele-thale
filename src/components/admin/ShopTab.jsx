'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import ShopTabAdd from './ShopTabAdd';

import { getShops, deleteShop, selectShops } from '@/app/features/adminPanel/shopSlice';

const ShopTab = () => {
  const [showAdd, setShowAdd]         = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [openDelete, setOpenDelete]   = useState(false);
  const [deleteId, setDeleteId]       = useState(null);

  const dispatch = useDispatch();
  const shops    = useSelector(selectShops);

  useEffect(() => {
    dispatch(getShops());
  }, [dispatch]);

  const rows =
    shops?.map((item, index) => ({
      ...item,
      id: item.Storeid || index,
    })) || [];

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const confirmDelete = async () => {
    await dispatch(deleteShop(deleteId));
    dispatch(getShops());
    setOpenDelete(false);
  };

  const columns = [
    {
      field: 'Imageurl',
      headerName: 'Image',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value || undefined}
          alt={params.row.Storename}
          variant="rounded"
          sx={{ width: 40, height: 40, bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 700 }}
        >
          {params.row.Storename?.[0]?.toUpperCase() || 'S'}
        </Avatar>
      ),
    },
    {
      field: 'Storename',
      headerName: 'Store Name',
      width: 180,
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: '#1e293b' }}>{params.value}</span>
      ),
    },
    {
      field: 'Email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'Phoneno',
      headerName: 'Phone',
      width: 140,
    },
    {
      field: 'Storeaddress',
      headerName: 'Address',
      width: 180,
    },
    {
      field: 'Description',
      headerName: 'Description',
      width: 160,
      renderCell: (params) => (
        <Tooltip title={params.value || ''} placement="top">
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            maxWidth: 140,
          }}>
            {params.value || '—'}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'StoreTime',
      headerName: 'Store Time',
      width: 140,
      renderCell: (params) => (
        <span>{params.value || '—'}</span>
      ),
    },
    {
      field: 'Rating',
      headerName: 'Rating',
      width: 90,
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: '#f59e0b' }}>
          ⭐ {params.value || '—'}
        </span>
      ),
    },
    {
      field: 'StoreLocation',
      headerName: 'Map',
      width: 80,
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <Tooltip title="Open in Maps" placement="top">
            <IconButton
              size="small"
              onClick={() => window.open(params.value, '_blank')}
              sx={{ color: '#4285F4' }}
            >
              🗺️
            </IconButton>
          </Tooltip>
        ) : (
          <span style={{ color: '#94a3b8' }}>—</span>
        ),
    },
    {
      field: 'Isactive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'true' ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            background: params.value === 'true' ? '#dcfce7' : '#fef9c3',
            color:      params.value === 'true' ? '#166534' : '#92400e',
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      ),
    },
    {
      field: 'Deleted',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'false' ? 'Live' : 'Deleted'}
          size="small"
          sx={{
            background: params.value === 'false' ? '#dbeafe' : '#fee2e2',
            color:      params.value === 'false' ? '#1e40af' : '#991b1b',
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit" placement="top">
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setSelectedShop(params.row);
                setShowAdd(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" placement="top">
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setDeleteId(params.row.Storeid);
                setOpenDelete(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search shops..."
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
        <Button
          variant="contained"
          onClick={() => {
            setSelectedShop(null);
            setShowAdd(true);
          }}
        >
          New Shop
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableRowSelectionOnClick
          sx={{
            borderRadius: 2,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </Box>

      {/* Add/Edit Modal */}
      <ShopTabAdd
        open={showAdd}
        handleClose={() => {
          setShowAdd(false);
          setSelectedShop(null);
        }}
        editData={selectedShop}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Shop</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this shop?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopTab;