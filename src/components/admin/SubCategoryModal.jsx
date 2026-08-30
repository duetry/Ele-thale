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
  Tooltip,
  TextField,
  InputAdornment,
  Typography,
  Slide,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  selectSubCategories,
  selectSubCategoryLoading,
  selectSubCategoryError,
} from '@/app/features/adminPanel/categorySlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SubCategoryModal = ({ open, handleClose, category }) => {
  const dispatch = useDispatch();
  const subCategories = useSelector(selectSubCategories);
  const loading = useSelector(selectSubCategoryLoading);
  const error = useSelector(selectSubCategoryError);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteSubCategoryId, setDeleteSubCategoryId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch subcategories when category changes or modal opens
  useEffect(() => {
    if (open && category?.Categoryid) {
      dispatch(getSubCategories(category.Categoryid));
    }
  }, [open, category, dispatch]);

  // Formik for Add/Edit SubCategory
  const formik = useFormik({
    initialValues: {
      SubCategoryname: editingSubCategory?.SubCategoryname || editingSubCategory?.Subcategoryname || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      SubCategoryname: Yup.string()
        .trim()
        .required('Subcategory Name is required')
        .min(2, 'Subcategory Name must be at least 2 characters'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setFormLoading(true);
      try {
        const payload = {
          Categoryid: category.Categoryid,
          Categoryname: category.Categoryname,
          SubCategoryname: values.SubCategoryname.trim(),
        };

        if (editingSubCategory) {
          payload.SubCategoryid = editingSubCategory.SubCategoryid || editingSubCategory.Subcategoryid;
          const res = await dispatch(updateSubCategory(payload));
          if (updateSubCategory.fulfilled.match(res)) {
            toast.success('Subcategory updated successfully');
          } else {
            toast.error(res.payload || 'Failed to update subcategory');
          }
        } else {
          const res = await dispatch(createSubCategory(payload));
          if (createSubCategory.fulfilled.match(res)) {
            toast.success('Subcategory added successfully');
          } else {
            toast.error(res.payload || 'Failed to add subcategory');
          }
        }

        // Refresh subcategory list
        await dispatch(getSubCategories(category.Categoryid));
        resetForm();
        setShowAddEdit(false);
        setEditingSubCategory(null);
      } catch (err) {
        toast.error(err.message || 'An error occurred');
      } finally {
        setFormLoading(false);
      }
    },
  });

  const confirmDelete = async () => {
    if (!deleteSubCategoryId) return;
    setDeleteLoading(true);
    try {
      const res = await dispatch(deleteSubCategory(deleteSubCategoryId));
      if (deleteSubCategory.fulfilled.match(res)) {
        toast.success('Subcategory deleted successfully');
        await dispatch(getSubCategories(category?.Categoryid));
      } else {
        toast.error(res.payload || 'Failed to delete subcategory');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete subcategory');
    } finally {
      setDeleteLoading(false);
      setOpenDelete(false);
      setDeleteSubCategoryId(null);
    }
  };

  // Format rows for DataGrid
  const rows = (Array.isArray(subCategories) ? subCategories : [])
    .filter((item) => {
      if (!category?.Categoryid) return true;
      // Filter by Categoryid if present in subcategory object
      const itemCatId = item.Categoryid || item.CategoryId || item.categoryid;
      return !itemCatId || itemCatId === category.Categoryid;
    })
    .map((item, index) => ({
      ...item,
      id: item.SubCategoryid || item.Subcategoryid || `sub-${index}`,
      subName: item.SubCategoryname || item.Subcategoryname || item.Name || '—',
      subId: item.SubCategoryid || item.Subcategoryid || '—',
    }));

  const filteredRows = rows.filter((row) =>
    (row.subName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.subId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      field: 'subName',
      headerName: 'Subcategory Name',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: '#1e293b' }}>{params.value}</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit Subcategory" placement="top">
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setEditingSubCategory(params.row);
                setShowAddEdit(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Subcategory" placement="top">
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setDeleteSubCategoryId(params.row.subId);
                setOpenDelete(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'hidden' }
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            px: 3,
            py: 2.5,
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccountTreeIcon sx={{ color: '#fff', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
                Subcategories
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)', display: 'block', mt: 0.3 }}>
                Category: <strong>{category?.Categoryname || 'Selected Category'}</strong>
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <DialogContent sx={{ p: 3, background: '#f8fafc' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Controls Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 280, background: '#fff', borderRadius: 1 }}
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
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingSubCategory(null);
                setShowAddEdit(true);
              }}
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                },
              }}
            >
              Add SubCategory
            </Button>
          </Box>

          {/* Data Table */}
          <Box sx={{ height: 380, width: '100%', background: '#fff', borderRadius: 2 }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f1f5f9',
                  fontWeight: 700,
                  color: '#334155',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, background: '#fff', borderTop: '1px solid #e2e8f0' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': {
                borderColor: '#94a3b8',
                background: '#f8fafc',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add / Edit SubCategory Modal */}
      <Dialog
        open={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setEditingSubCategory(null);
        }}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Transition}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            px: 3,
            py: 2,
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 700 }}>
            {editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}
          </Typography>
          <IconButton
            onClick={() => {
              setShowAddEdit(false);
              setEditingSubCategory(null);
            }}
            sx={{ color: '#fff' }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ p: 3, background: '#f8fafc' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField
                label="Category Name"
                value={category?.Categoryname || ''}
                disabled
                fullWidth
                size="small"
                variant="outlined"
              />

              <TextField
                label="Subcategory Name"
                name="SubCategoryname"
                value={formik.values.SubCategoryname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.SubCategoryname && Boolean(formik.errors.SubCategoryname)}
                helperText={formik.touched.SubCategoryname && formik.errors.SubCategoryname}
                fullWidth
                size="small"
                variant="outlined"
                autoFocus
                placeholder="e.g. Laptop, Smartphone, Shoes"
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', background: '#fff' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowAddEdit(false);
                setEditingSubCategory(null);
              }}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#cbd5e1',
                color: '#64748b',
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={formLoading}
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                },
              }}
            >
              {editingSubCategory ? 'Save Changes' : 'Create'}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Subcategory</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subcategory? This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <LoadingButton
            color="error"
            variant="contained"
            loading={deleteLoading}
            onClick={confirmDelete}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubCategoryModal;
