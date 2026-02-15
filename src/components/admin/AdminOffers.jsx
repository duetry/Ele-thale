import {
  getAdminOffers,
  deleteAdminOffer,
} from '@/app/features/adminPanel/adminPanelSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton } from '@mui/material';
import AddAdminOffers from './AddAdminOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminOffers = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      await dispatch(deleteAdminOffer(id));
      dispatch(getAdminOffers());
    }
  };

  const columns = [
    { field: 'ProductName', headerName: 'Product Name', width: 150 },
    { field: 'Brand', headerName: 'Brand', width: 130 },
    { field: 'Type', headerName: 'Type', width: 150 },
    { field: 'Price', headerName: 'Price', width: 100 },
    { field: 'Finalprice', headerName: 'Final Price', width: 120 },
    { field: 'Discount', headerName: 'Discount', width: 100 },
    { field: 'Isactive', headerName: 'Active', width: 100 },
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
          rows={rows}
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
