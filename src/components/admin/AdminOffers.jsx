import { getAdminOffers } from '@/app/features/adminPanel/adminPanelSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import AddAdminOffers from './AddAdminOffer';

const AdminOffers = () => {
  const [showAdd , setShowAdd] = useState(false)
  const dispatch = useDispatch();

  const adminOffers = useSelector(
    (state) => state?.adminPanel?.adminOffers
  );

  useEffect(() => {
    dispatch(getAdminOffers());
  }, [dispatch]);

  const rows =
    adminOffers?.map((item) => ({
      ...item,
      id: item.Productid,
    })) || [];

  const columns = [
    { field: 'ProductName', headerName: 'Product Name', width: 150 },
    { field: 'Brand', headerName: 'Brand', width: 130 },
    { field: 'Type', headerName: 'Type', width: 150 },
    { field: 'Price', headerName: 'Price', width: 100 },
    { field: 'Finalprice', headerName: 'Final Price', width: 120 },
    { field: 'Discount', headerName: 'Discount', width: 100 },
    { field: 'Isactive', headerName: 'Active', width: 100 },
    { field: 'Isbestoffer', headerName: 'Best Offer', width: 120 },
    { field: 'Datetime', headerName: 'Date', width: 180 },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      
      {/* Top Button Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAdd(true)}
        >
          New Offer
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

    {/* Dialog Form */}
<AddAdminOffers
  open={showAdd}
  handleClose={() => setShowAdd(false)}
/>

    </Box>
  );
};

export default AdminOffers;
