'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import {
  getReactions,
  selectReactions,
  selectReactionLoading,
  selectReactionError,
} from '@/app/features/adminPanel/reactionSlice';

const ReactionsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const reactions = useSelector(selectReactions);
  const loading   = useSelector(selectReactionLoading);
  const error     = useSelector(selectReactionError);

  useEffect(() => {
    dispatch(getReactions());
  }, [dispatch]);

  const rows =
    reactions?.map((item, index) => ({
      ...item,
      id: item.Productid || `reaction-${index}`,
    })) || [];

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      field: 'ProductName',
      headerName: 'Product Name',
      width: 280,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'LikeCount',
      headerName: 'Likes',
      width: 160,
      renderCell: (params) => (
        <Chip
          icon={<ThumbUpIcon sx={{ fontSize: '14px !important', color: '#2e7d32 !important' }} />}
          label={params.value ?? 0}
          size="small"
          sx={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            fontWeight: 700,
            fontSize: '0.82rem',
          }}
        />
      ),
    },
    {
      field: 'DislikeCount',
      headerName: 'Dislikes',
      width: 160,
      renderCell: (params) => (
        <Chip
          icon={<ThumbDownIcon sx={{ fontSize: '14px !important', color: '#c62828 !important' }} />}
          label={params.value ?? 0}
          size="small"
          sx={{
            backgroundColor: '#fce4ec',
            color: '#c62828',
            fontWeight: 700,
            fontSize: '0.82rem',
          }}
        />
      ),
    },
    {
      field: 'TotalReactionCount',
      headerName: 'Total Reactions',
      width: 180,
      renderCell: (params) => (
        <Chip
          icon={<FavoriteIcon sx={{ fontSize: '14px !important', color: '#c2185b !important' }} />}
          label={params.value ?? 0}
          size="small"
          sx={{
            backgroundColor: '#fdf2f8',
            color: '#c2185b',
            fontWeight: 700,
            fontSize: '0.82rem',
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FavoriteIcon sx={{ color: '#e91e63', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Reactions
        </Typography>
        <Chip
          label={`${filteredRows.length} products`}
          size="small"
          sx={{
            ml: 1,
            backgroundColor: '#fce4ec',
            color: '#c2185b',
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search reactions..."
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
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading / Grid */}
      {loading ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#e91e63' }} />
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
                backgroundColor: '#fdf2f8',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#4a4a4a',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#fdf2f8',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.84rem',
              },
            }}
          />
        </Box>
      )}

    </Box>
  );
};

export default ReactionsTab;