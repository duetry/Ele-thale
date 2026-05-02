import {
  getAdminOffers,
  deleteAdminOffer,
} from '@/app/features/adminPanel/adminPanelSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, TextField, InputAdornment } from '@mui/material';
import AddAdminOffers from './AddAdminOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const AdminOffers = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const adminOffers = useSelector(
    (state) => state?.adminPanel?.adminOffers
  );

  useEffect(() => {
    dispatch(getAdminOffers());
  }, [dispatch]);

  const rows =
    adminOffers?.map((item, index) => ({
      ...item,
      id: item.Productid || `product-${index}`,
    })) || [];

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      await dispatch(deleteAdminOffer(id));
      dispatch(getAdminOffers());
    }
  };

  const columns = [
    { field: 'ProductName', headerName: 'Product Name', width: 150 },
    { field: 'Brand', headerName: 'Brand', width: 230 },
    { field: 'Type', headerName: 'Type', width: 150 },
    { field: 'Price', headerName: 'Price', width: 100 },
    { field: 'Finalprice', headerName: 'Final Price', width: 120 },
    { field: 'Description', headerName: 'Type', width: 100 },
    {
      field: 'Isactive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            color: (params.value === "true" || params.value === true) ? '#2e7d32' : '#d32f2f',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {(params.value === "true" || params.value === true) ? 'Active' : 'Inactive'}
        </Box>
      ),
    },
    {
      field: 'CoupounActive',
      headerName: 'Coupon Active',
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{
            color: (params.value === "true" || params.value === true) ? '#2e7d32' : '#d32f2f',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {(params.value === "true" || params.value === true) ? 'Active' : 'Inactive'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedOffer(params.row);
              setShowAdd(true);
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.Productid)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search products..."
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
            setSelectedOffer(null);
            setShowAdd(true);
          }}
        >
          New Offer
        </Button>
      </Box>

      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <AddAdminOffers
        open={showAdd}
        handleClose={() => {
          setShowAdd(false);
          setSelectedOffer(null);
        }}
        editData={selectedOffer}
      />
    </Box>
  );
};

export default AdminOffers;
