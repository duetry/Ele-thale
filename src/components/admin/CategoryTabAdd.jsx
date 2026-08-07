'use client';

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Slide
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

import { createCategory, updateCategory, getCategories } from "@/app/features/adminPanel/categorySlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CategoryTabAdd = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [prevEditData, setPrevEditData] = useState(editData);
  const [prevOpen, setPrevOpen] = useState(open);

  if (editData !== prevEditData || open !== prevOpen) {
    setPrevEditData(editData);
    setPrevOpen(open);
  }

  const formik = useFormik({
    initialValues: {
      Categoryname: editData?.Categoryname || "",
      Power: editData?.Power !== undefined ? editData.Power : "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      Categoryname: Yup.string().required("Category Name is required"),
      Power: Yup.number()
        .typeError("Power must be a number")
        .integer("Power must be an integer")
        .required("Power is required")
        .min(0, "Power cannot be negative"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const payload = {
        Categoryname: values.Categoryname.trim(),
        Power: Number(values.Power),
      };

      if (editData?.Categoryid) {
        payload.Categoryid = editData.Categoryid;
        await dispatch(updateCategory(payload));
      } else {
        await dispatch(createCategory(payload));
      }

      await dispatch(getCategories());

      setLoading(false);
      resetForm();
      handleClose();
    },
  });

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm" 
      TransitionComponent={Transition}
    >
      {/* Header */}
      <Box sx={{
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        px: 3, 
        py: 2.5,
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CategoryIcon sx={{ color: "#fff" }} />
          <Typography sx={{ color: "#fff", fontWeight: 700 }}>
            {editData ? "Edit Category" : "Create Category"}
          </Typography>
        </Box>

        <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ p: 3, background: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            
            <TextField
              label="Category Name"
              name="Categoryname"
              value={formik.values.Categoryname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Categoryname && Boolean(formik.errors.Categoryname)}
              helperText={formik.touched.Categoryname && formik.errors.Categoryname}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Power"
              name="Power"
              type="number"
              value={formik.values.Power}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Power && Boolean(formik.errors.Power)}
              helperText={formik.touched.Power && formik.errors.Power}
              fullWidth
              variant="outlined"
              inputProps={{ min: 0, step: 1 }}
            />

          </Box>
        </DialogContent>

        <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: "1px solid #e2e8f0", background: "#fff" }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#cbd5e1",
              color: "#64748b",
              '&:hover': {
                borderColor: "#94a3b8",
                background: "#f8fafc"
              }
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)",
              '&:hover': {
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              }
            }}
          >
            {editData ? "Save Changes" : "Create"}
          </LoadingButton>
        </Box>
      </form>
    </Dialog>
  );
};

export default CategoryTabAdd;
