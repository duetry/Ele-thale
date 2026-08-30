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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import CategoryTabAdd from './CategoryTabAdd';
import SubCategoryModal from './SubCategoryModal';
import { getCategories, deleteCategory, selectCategories, selectCategoryLoading } from '@/app/features/adminPanel/categorySlice';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const CategoryTab = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Subcategories modal state
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const rows =
    categories?.map((item, index) => ({
      ...item,
      id: item.Categoryid || index,
    })) || [];

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const confirmDelete = async () => {
    await dispatch(deleteCategory(deleteId));
    dispatch(getCategories());
    setOpenDelete(false);
  };

  const columns = [
    {
      field: 'Categoryname',
      headerName: 'Category Name',
      width: 220,
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: '#1e293b' }}>{params.value}</span>
      ),
    },
    {
      field: 'Power',
      headerName: 'Power',
      width: 100,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <span style={{ fontWeight: 500, color: '#4f46e5' }}>{params.value}</span>
      ),
    },
    {
      field: 'subcategories',
      headerName: 'Subcategories',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Chip
          icon={<AccountTreeIcon sx={{ fontSize: '16px !important' }} />}
          label="View Subcategories"
          size="small"
          clickable
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCategoryForSub(params.row);
            setShowSubModal(true);
          }}
          sx={{
            background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
            color: '#4f46e5',
            fontWeight: 600,
            border: '1px solid #c7d2fe',
            '&:hover': {
              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
            },
          }}
        />
      ),
    },
    {
      field: 'DateTime',
      headerName: 'Date Created',
      width: 200,
      renderCell: (params) => {
        if (!params.value) return '—';
        try {
          const date = new Date(params.value);
          return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
          return params.value;
        }
      }
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
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory(params.row);
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
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(params.row.Categoryid);
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
      {/* Search and Add controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search categories..."
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
            setSelectedCategory(null);
            setShowAdd(true);
          }}
          sx={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)",
            '&:hover': {
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            }
          }}
        >
          New Category
        </Button>
      </Box>

      {/* Table grid */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          onRowClick={(params, event) => {
            if (event.target.closest('button') || event.target.closest('.MuiIconButton-root')) {
              return;
            }
            setSelectedCategoryForSub(params.row);
            setShowSubModal(true);
          }}
          sx={{
            borderRadius: 2,
            cursor: 'pointer',
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

      {/* Add/Edit Category Modal */}
      <CategoryTabAdd
        open={showAdd}
        handleClose={() => {
          setShowAdd(false);
          setSelectedCategory(null);
        }}
        editData={selectedCategory}
      />

      {/* SubCategory Management Modal */}
      <SubCategoryModal
        open={showSubModal}
        handleClose={() => {
          setShowSubModal(false);
          setSelectedCategoryForSub(null);
        }}
        category={selectedCategoryForSub}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category? This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenDelete(false)}
            sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={confirmDelete}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryTab;

