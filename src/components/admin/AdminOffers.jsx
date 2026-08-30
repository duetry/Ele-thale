import {
  getAdminOffers,
  deleteAdminOffer,
} from '@/app/features/adminPanel/adminPanelSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  Typography,
  CircularProgress,
} from '@mui/material';
import AddAdminOffers from './AddAdminOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const AdminOffers = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete confirmation popup state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) return;
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.Productid) return;
    setDeleting(true);
    try {
      await dispatch(deleteAdminOffer(productToDelete.Productid));
      dispatch(getAdminOffers());
    } catch (error) {
      console.error("Failed to delete offer:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const columns = [
    { field: 'ProductName', headerName: 'Product Name', width: 150 },
    { field: 'Brand', headerName: 'Brand', width: 230 },
    { field: 'Type', headerName: 'Type', width: 150 },
    { field: 'GameName', headerName: 'Game Name', width: 140 },
    { field: 'Price', headerName: 'Price', width: 100 },
    { field: 'Finalprice', headerName: 'Final Price', width: 120 },
    { field: 'Description', headerName: 'Type', width: 100 },
    { field: 'LocationName', headerName: 'LocationName', width: 100 },
    { field: 'Kilometer', headerName: 'Kilometer', width: 100 },
    { field: 'Latitude', headerName: 'Latitude', width: 100 },
    { field: 'Longitude', headerName: 'Longitude', width: 100 },
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
            onClick={() => handleOpenDeleteDialog(params.row)}
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

      {/* Delete Product Confirmation Popup */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            background: "#ffffff",
          },
        }}
      >
        <Box sx={{ textAlign: "center", pt: 1 }}>
          {/* Centered warning icon badge with outer ring effect */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#fef2f2",
              outline: "6px solid #fff5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
              mx: "auto",
              mb: 2.5,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              color: "#0f172a",
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Delete Product
          </Typography>

          <Typography
            sx={{
              fontSize: "14px",
              color: "#64748b",
              lineHeight: 1.55,
              px: 1,
            }}
          >
            Are you sure you want to delete{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              "{productToDelete?.ProductName}"
            </Box>
            ? This action cannot be undone.
          </Typography>
        </Box>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 1.5,
            pt: 3.5,
            pb: 0.5,
            px: 0,
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              py: 1.2,
              color: "#475569",
              borderColor: "#cbd5e1",
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            variant="contained"
            color="error"
            fullWidth
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              py: 1.2,
              backgroundColor: "#ef4444",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",
              "&:hover": {
                backgroundColor: "#dc2626",
                boxShadow: "0 6px 18px rgba(239, 68, 68, 0.45)",
              },
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOffers;
