'use client';

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Slide,
  Switch
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  createShopOwner,
  updateShopOwner,
  getShopOwner
} from "@/app/features/adminPanel/shopOwnerSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShopOwnerTabAdd = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      Name: editData?.Name || "",
      Username: editData?.Username || "",
      Email: editData?.Email || "",
      Phoneno: editData?.Phoneno || "",
      Password: "",
      IsActive: editData?.Deleted === "false",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      Name: Yup.string().required("Required"),
      Username: Yup.string().required("Required"),
      Email: Yup.string().email("Invalid email").required("Required"),
      Phoneno: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone number")
        .required("Required"),
      Password: editData
        ? Yup.string()
        : Yup.string().min(6, "Minimum 6 characters").required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const payload = {
        ShopOwnerId: editData?.ShopOwnerId,
        Name: values.Name.trim(),
        Username: values.Username.trim(),
        Email: values.Email.trim(),
        Phoneno: values.Phoneno,
        Password: values.Password || editData?.Password,
        Deleted: values.IsActive ? "false" : "true",
      };

      if (editData?.ShopOwnerId) {
        await dispatch(updateShopOwner(payload));
      } else {
        await dispatch(createShopOwner(payload));
      }

      await dispatch(getShopOwner());

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
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          px: 3,
          py: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StorefrontIcon sx={{ color: "#fff" }} />
          <Typography sx={{ color: "#fff", fontWeight: 700 }}>
            {editData ? "Edit ShopOwner" : "Create ShopOwner"}
          </Typography>
        </Box>

        <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ p: 3, background: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <TextField
              label="Shop Owner Name"
              name="Name"
              value={formik.values.Name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Name && Boolean(formik.errors.Name)}
              helperText={formik.touched.Name && formik.errors.Name}
              fullWidth
            />

            <TextField
              label="Shop Owner Username"
              name="Username"
              value={formik.values.Username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Username && Boolean(formik.errors.Username)}
              helperText={formik.touched.Username && formik.errors.Username}
              fullWidth
            />

            <TextField
              label="Email"
              name="Email"
              value={formik.values.Email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Email && Boolean(formik.errors.Email)}
              helperText={formik.touched.Email && formik.errors.Email}
              fullWidth
            />

            <TextField
              label="Phone"
              name="Phoneno"
              value={formik.values.Phoneno}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Phoneno && Boolean(formik.errors.Phoneno)}
              helperText={formik.touched.Phoneno && formik.errors.Phoneno}
              fullWidth
            />

            {!editData && (
              <TextField
                label="Password"
                name="Password"
                type="password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Password && Boolean(formik.errors.Password)}
                helperText={formik.touched.Password && formik.errors.Password}
                fullWidth
              />
            )}

            {/* Active Toggle */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Active</Typography>
              <Switch
                checked={formik.values.IsActive}
                onChange={(e) =>
                  formik.setFieldValue("IsActive", e.target.checked)
                }
              />
            </Box>
          </Box>
        </DialogContent>

        {/* Footer */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
          >
            {editData ? "Update" : "Create"}
          </LoadingButton>
        </Box>
      </form>
    </Dialog>
  );
};

export default ShopOwnerTabAdd;