'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Slide,
  Switch,
  MenuItem
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

import { getShopOwner, selectShopOwners } from "@/app/features/adminPanel/shopOwnerSlice";
import { createShop, updateShop, getShops } from "@/app/features/adminPanel/shopSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShopTabAdd = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const shopOwners = useSelector(selectShopOwners);

  useEffect(() => {
    dispatch(getShopOwner());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      StoreOwnerId: editData?.StoreOwnerId || "",
      Storename: editData?.Storename || "",
      Description: editData?.Description || "",
      Storeaddress: editData?.Storeaddress || "",
      Email: editData?.Email || "",
      Phoneno: editData?.Phoneno || "",
      StoreLocation: editData?.StoreLocation || "",
      Rating: editData?.Rating || "",
      ImageBase64: editData?.ImageBase64 || "",
      IsActive: editData?.Deleted === "false",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      StoreOwnerId: Yup.string().required("Required"),
      Storename: Yup.string().required("Required"),
      Email: Yup.string().email("Invalid email").required("Required"),
      Phoneno: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone number")
        .required("Required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const payload = {
        Storeid: editData?.Storeid,
        StoreOwnerId: values.StoreOwnerId,
        Storename: values.Storename.trim(),
        Description: values.Description,
        Storeaddress: values.Storeaddress,
        Email: values.Email.trim(),
        Phoneno: values.Phoneno,
        StoreLocation: values.StoreLocation,
        Rating: values.Rating,
        ImageBase64: values.ImageBase64,
        Isactive: values.IsActive ? "true" : "false",
        Deleted: values.IsActive ? "false" : "true",
      };

      if (editData?.Storeid) {
        await dispatch(updateShop(payload));
      } else {
        await dispatch(createShop(payload));
      }

      await dispatch(getShops());

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
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
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
            {editData ? "Edit Shop" : "Create Shop"}
          </Typography>
        </Box>

        <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{
            p: 3,
            background: "#f8fafc",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {/* Shop Owner */}
            <TextField
              select
              label="Shop Owner"
              name="StoreOwnerId"
              value={formik.values.StoreOwnerId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.StoreOwnerId && Boolean(formik.errors.StoreOwnerId)}
              helperText={formik.touched.StoreOwnerId && formik.errors.StoreOwnerId}
              fullWidth
            >
              {shopOwners?.map((owner) => (
                <MenuItem key={owner.ShopOwnerId} value={owner.ShopOwnerId}>
                  {owner.Name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Store Name"
              name="Storename"
              value={formik.values.Storename}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Storename && Boolean(formik.errors.Storename)}
              helperText={formik.touched.Storename && formik.errors.Storename}
              fullWidth
            />

            <TextField
              label="Description"
              name="Description"
              value={formik.values.Description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            />

            <TextField
              label="Address"
              name="Storeaddress"
              value={formik.values.Storeaddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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

            <TextField
              label="Location"
              name="StoreLocation"
              value={formik.values.StoreLocation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            />

            <TextField
              label="Rating"
              name="Rating"
              value={formik.values.Rating}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            />

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
            {editData ? "Update Shop" : "Create Shop"}
          </LoadingButton>
        </Box>
      </form>
    </Dialog>
  );
};

export default ShopTabAdd;