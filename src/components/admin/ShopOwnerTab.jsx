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

import ShopOwnerTabAdd from './ShopOwnerTabAdd';

// ✅ UPDATED IMPORTS
import {
  getShopOwner,
  deleteShopOwner,
  selectShopOwners
} from '@/app/features/adminPanel/shopOwnerSlice';

const ShopOwnerTab = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const dispatch = useDispatch();

  // ✅ UPDATED SELECTOR
  const shops = useSelector(selectShopOwners);

  useEffect(() => {
    dispatch(getShopOwner()); // ✅ UPDATED
  }, [dispatch]);

  // ✅ Row mapping
  const rows =
    shops?.map((item) => ({
      ...item,
      id: item.ShopOwnerId,
    })) || [];

  // ✅ Delete confirm
  const confirmDelete = async () => {
    await dispatch(deleteShopOwner(deleteId)); // ✅ UPDATED
    dispatch(getShopOwner()); // optional (can remove later)
    setOpenDelete(false);
  };

  const columns = [
    { field: 'Name', headerName: 'Name', width: 180 },
    { field: 'Username', headerName: 'Username', width: 180 },
    { field: 'Email', headerName: 'Email', width: 220 },
    { field: 'Phoneno', headerName: 'Phone', width: 150 },
    { field: 'CreatedAt', headerName: 'Created At', width: 200 },

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
              setDeleteId(params.row.ShopOwnerId);
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
      <ShopOwnerTabAdd
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

export default ShopOwnerTab;