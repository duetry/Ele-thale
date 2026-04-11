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
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import ShopTabAdd from './ShopTabAdd'; // 👉 create similar to ShopOwnerTabAdd

// ✅ IMPORT SHOP SLICE

import { getShops  ,
  deleteShop,
  selectShops } from '@/app/features/adminPanel/shopSlice';

const ShopTab = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const dispatch = useDispatch();

  const shops = useSelector(selectShops);

  useEffect(() => {
    dispatch(getShops());
  }, [dispatch]);

  // ✅ Row mapping (adjust based on API response)
  const rows =
    shops?.map((item, index) => ({
      ...item,
      id: item.shopId || item.StoreId || index, // 🔥 fallback safe
    })) || [];

  // ✅ Delete confirm
  const confirmDelete = async () => {
    await dispatch(deleteShop(deleteId));
    dispatch(getShops()); // optional
    setOpenDelete(false);
  };
console.log("shops" , shops)
  const columns = [
    { field: 'StoreName', headerName: 'Store Name', width: 200 },
    { field: 'OwnerName', headerName: 'Owner Name', width: 180 },
    { field: 'Email', headerName: 'Email', width: 220 },
    { field: 'Phone', headerName: 'Phone', width: 150 },
    { field: 'Address', headerName: 'Address', width: 250 },

    {
      field: 'Deleted',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value === 'false' ? 'green' : 'red' }}>
          {params.value === 'false' ? 'Active' : 'Deleted'}
        </span>
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
              setSelectedShop(params.row);
              setShowAdd(true);
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => {
              setDeleteId(
                params.row.shopId || params.row.StoreId
              );
              setOpenDelete(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
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

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Shop</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this shop?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopTab;

