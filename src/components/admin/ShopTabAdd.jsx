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
  MenuItem,
  Autocomplete,
  Chip
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

import { getShopOwner, selectShopOwners } from "@/app/features/adminPanel/shopOwnerSlice";
import { createShop, updateShop, getShops } from "@/app/features/adminPanel/shopSlice";
import { getLocationList } from "@/app/features/adminPanel/adminPanelSlice";
import {
  getCategories,
  getSubCategories,
  selectCategories,
  selectSubCategories,
} from "@/app/features/adminPanel/categorySlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const parseSubCategoryArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const ShopTabAdd = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(editData?.ImageBase64 || editData?.ImageUrl || editData?.Imageurl || "");

  const shopOwners = useSelector(selectShopOwners);
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);
  const locationData = useSelector((state) => state?.adminPanel?.locationData);

  useEffect(() => {
    dispatch(getShopOwner());
    dispatch(getCategories());
    dispatch(getLocationList());
  }, [dispatch]);

  const [prevEditData, setPrevEditData] = useState(editData);
  const [prevOpen, setPrevOpen] = useState(open);

  if (editData !== prevEditData || open !== prevOpen) {
    setPrevEditData(editData);
    setPrevOpen(open);
    if (editData?.ImageBase64) {
      setPreview(editData.ImageBase64);
    } else if (editData?.ImageUrl || editData?.Imageurl) {
      setPreview(editData.ImageUrl || editData.Imageurl);
    } else {
      setPreview("");
    }
  }

  const formik = useFormik({
    initialValues: {
      StoreOwnerId: editData?.StoreOwnerId || "",
      Categoryid: editData?.Categoryid || editData?.CategoryId || "",
      Categoryname: editData?.Categoryname || editData?.Category || "",
      SubCategoryname: parseSubCategoryArray(editData?.SubCategoryname || editData?.Subcategoryname || editData?.SubCategory),
      Storename: editData?.Storename || "",
      Description: editData?.Description || "",
      Storeaddress: editData?.Storeaddress || "",
      Email: editData?.Email || "",
      Phoneno: editData?.Phoneno || "",
      StoreLocation: editData?.StoreLocation || "",
      Rating: editData?.Rating || "",
      StartTime: editData?.StartTime || "",
      EndTime: editData?.EndTime || "",
      ImageBase64: editData?.ImageBase64 || "",
      ImageUrl: editData?.ImageUrl || editData?.Imageurl || "",
      IsActive: editData?.Deleted === "false",
      Location: null,
      Kilometer: editData?.Kilometer ?? editData?.kilometer ?? "",
      Latitude: editData?.Latitude ?? editData?.latitude ?? "",
      Longitude: editData?.Longitude ?? editData?.longitude ?? editData?.langitude ?? "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      StoreOwnerId: Yup.string().required("Required"),
      Categoryid: Yup.string().required("Category is required"),
      Storename: Yup.string().required("Required"),
      Description: Yup.string().required("Required"),
      Storeaddress: Yup.string().required("Required"),
      Email: Yup.string().email("Invalid email").required("Required"),
      Phoneno: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone number")
        .required("Required"),
      StoreLocation: Yup.string().required("Required"),
      Rating: Yup.string()
        .matches(/^[0-9]+(\.[0-9]+)?$/, "Rating must be a valid number")
        .required("Required"),
      StartTime: Yup.string().required("Required"),
      EndTime: Yup.string().required("Required"),
      Location: Yup.object().nullable().required("Location is required"),
      Kilometer: Yup.number()
        .typeError("Must be a number")
        .required("Kilometer is required")
        .min(0, "Cannot be negative"),
      Latitude: Yup.number()
        .typeError("Must be a number")
        .required("Latitude is required")
        .min(-90, "Min -90")
        .max(90, "Max 90"),
      Longitude: Yup.number()
        .typeError("Must be a number")
        .required("Longitude is required")
        .min(-180, "Min -180")
        .max(180, "Max 180"),
      // Only require base64 if there's no existing ImageUrl
      ImageBase64: Yup.string().when("ImageUrl", {
        is: (val) => !val,
        then: (schema) => schema.required("Image required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const subCategoryStr = Array.isArray(values.SubCategoryname)
        ? values.SubCategoryname.join(",")
        : values.SubCategoryname || "";

      const payload = {
        Storeid: editData?.Storeid,
        StoreOwnerId: values.StoreOwnerId,
        Categoryid: values.Categoryid,
        Categoryname: values.Categoryname,
        CategoryId: values.Categoryid,
        Category: values.Categoryname,
        SubCategoryname: subCategoryStr,
        Subcategoryname: subCategoryStr,
        SubCategory: subCategoryStr,
        Storename: values.Storename.trim(),
        Description: values.Description,
        Storeaddress: values.Storeaddress,
        Email: values.Email.trim(),
        Phoneno: values.Phoneno,
        StoreLocation: values.StoreLocation,
        Rating: values.Rating,
        StartTime: values.StartTime,
        EndTime: values.EndTime,
        ImageBase64: values.ImageBase64,
        ImageUrl: values.ImageUrl,
        Isactive: values.IsActive ? "true" : "false",
        Deleted: values.IsActive ? "false" : "true",
        LocationId: values.Location?.LocationId || "",
        LocationName: values.Location?.Name || values.Location?.LocationName || "",
        Location: values.Location?.Name || values.Location?.LocationName || "",
        Kilometer: values.Kilometer,
        Latitude: values.Latitude,
        Longitude: values.Longitude,
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

  const selectedCategoryid = formik.values.Categoryid;
  useEffect(() => {
    if (selectedCategoryid) {
      dispatch(getSubCategories(selectedCategoryid));
    }
  }, [selectedCategoryid, dispatch]);

  useEffect(() => {
    if (!editData) return;

    const locId = editData.LocationId || editData.Locationid;
    const locName = editData.LocationName || editData.Location;
    if (locationData?.length) {
      const matched = locationData.find(
        (l) => l.LocationId === locId || l.Name === locName || l.LocationId === editData.Location
      ) || null;
      if (matched && formik.values.Location?.LocationId !== matched.LocationId) {
        formik.setFieldValue("Location", matched);
      }
    }

    if (editData.Kilometer !== undefined && editData.Kilometer !== null && formik.values.Kilometer === "") {
      formik.setFieldValue("Kilometer", editData.Kilometer);
    }
    if (editData.Latitude !== undefined && editData.Latitude !== null && formik.values.Latitude === "") {
      formik.setFieldValue("Latitude", editData.Latitude);
    }
    if (editData.Longitude !== undefined && editData.Longitude !== null && formik.values.Longitude === "") {
      formik.setFieldValue("Longitude", editData.Longitude);
    }
  }, [locationData, editData]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      formik.setFieldValue("ImageBase64", base64);
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" TransitionComponent={Transition}>

      {/* Header */}
      <Box sx={{
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        px: 3, py: 2.5,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
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
        <DialogContent sx={{ p: 3, background: "#f8fafc", overflowY: "auto", flex: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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

            {/* Category Dropdown */}
            <TextField
              select
              label="Category"
              name="Categoryid"
              value={formik.values.Categoryid}
              onChange={(e) => {
                const catId = e.target.value;
                const selectedCat = categories?.find(
                  (c) => (c.Categoryid || c.CategoryId) === catId
                );
                formik.setFieldValue("Categoryid", catId);
                formik.setFieldValue(
                  "Categoryname",
                  selectedCat ? (selectedCat.Categoryname || selectedCat.Name || "") : ""
                );
                formik.setFieldValue("SubCategoryname", []);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.Categoryid && Boolean(formik.errors.Categoryid)}
              helperText={formik.touched.Categoryid && formik.errors.Categoryid}
              fullWidth
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.Categoryid || cat.CategoryId} value={cat.Categoryid || cat.CategoryId}>
                  {cat.Categoryname || cat.Name}
                </MenuItem>
              ))}
            </TextField>

            {/* SubCategory Selection */}
            <Autocomplete
              multiple
              freeSolo
              options={
                subCategories
                  ?.map((sub) => sub.SubCategoryname || sub.Subcategoryname || sub.Name)
                  .filter(Boolean) || []
              }
              value={Array.isArray(formik.values.SubCategoryname) ? formik.values.SubCategoryname : []}
              onChange={(event, newValue) => {
                formik.setFieldValue("SubCategoryname", newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} key={index} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subcategory"
                  placeholder={formik.values.Categoryid ? "Select subcategory" : "Select a category first"}
                  disabled={!formik.values.Categoryid}
                  error={formik.touched.SubCategoryname && Boolean(formik.errors.SubCategoryname)}
                  helperText={formik.touched.SubCategoryname && formik.errors.SubCategoryname}
                />
              )}
            />

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
              error={formik.touched.Description && Boolean(formik.errors.Description)}
              helperText={formik.touched.Description && formik.errors.Description}
              fullWidth
            />

            <TextField
              label="Address"
              name="Storeaddress"
              value={formik.values.Storeaddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Storeaddress && Boolean(formik.errors.Storeaddress)}
              helperText={formik.touched.Storeaddress && formik.errors.Storeaddress}
              fullWidth
            />

            {/* Location Autocomplete */}
            <Autocomplete
              options={locationData || []}
              getOptionLabel={(option) => option?.Name || option?.LocationName || ""}
              isOptionEqualToValue={(option, value) => option?.LocationId === value?.LocationId}
              value={formik.values.Location}
              onChange={(_, newValue) => formik.setFieldValue("Location", newValue)}
              onBlur={() => formik.setFieldTouched("Location", true)}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.LocationId || option.Name} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                    {option.Name || option.LocationName}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Location"
                  placeholder="Search location..."
                  error={formik.touched.Location && Boolean(formik.errors.Location)}
                  helperText={formik.touched.Location && formik.errors.Location}
                  fullWidth
                />
              )}
            />

            {/* Kilometer, Latitude, Longitude Inputs */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Kilometer (KM)"
                name="Kilometer"
                type="number"
                value={formik.values.Kilometer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Kilometer && Boolean(formik.errors.Kilometer)}
                helperText={formik.touched.Kilometer && formik.errors.Kilometer}
                fullWidth
              />
              <TextField
                label="Latitude"
                name="Latitude"
                type="number"
                value={formik.values.Latitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Latitude && Boolean(formik.errors.Latitude)}
                helperText={formik.touched.Latitude && formik.errors.Latitude}
                fullWidth
              />
              <TextField
                label="Longitude"
                name="Longitude"
                type="number"
                value={formik.values.Longitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Longitude && Boolean(formik.errors.Longitude)}
                helperText={formik.touched.Longitude && formik.errors.Longitude}
                fullWidth
              />
            </Box>

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
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                formik.setFieldValue('Phoneno', digitsOnly);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.Phoneno && Boolean(formik.errors.Phoneno)}
              helperText={formik.touched.Phoneno && formik.errors.Phoneno}
              inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              fullWidth
            />

            <TextField
              label="Location Link"
              name="StoreLocation"
              value={formik.values.StoreLocation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.StoreLocation && Boolean(formik.errors.StoreLocation)}
              helperText={formik.touched.StoreLocation && formik.errors.StoreLocation}
              fullWidth
            />

            <TextField
              label="Rating"
              name="Rating"
              value={formik.values.Rating}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                const parts = val.split('.');
                const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                formik.setFieldValue('Rating', cleanVal);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.Rating && Boolean(formik.errors.Rating)}
              helperText={formik.touched.Rating && formik.errors.Rating}
              inputProps={{ inputMode: 'decimal' }}
              fullWidth
            />

            {/* Start Time */}
            <TextField
              label="Start Time"
              name="StartTime"
              type="time"
              value={formik.values.StartTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.StartTime && Boolean(formik.errors.StartTime)}
              helperText={formik.touched.StartTime && formik.errors.StartTime}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            {/* End Time */}
            <TextField
              label="End Time"
              name="EndTime"
              type="time"
              value={formik.values.EndTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.EndTime && Boolean(formik.errors.EndTime)}
              helperText={formik.touched.EndTime && formik.errors.EndTime}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            {/* Image Upload */}
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>

            {preview && (
              <Box>
                <Typography variant="body2">Preview:</Typography>
                <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 200 }} />
              </Box>
            )}

            {/* Active Toggle */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Active</Typography>
              <Switch
                checked={formik.values.IsActive}
                onChange={(e) => formik.setFieldValue("IsActive", e.target.checked)}
              />
            </Box>

          </Box>
        </DialogContent>

        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {editData ? "Update Shop" : "Create Shop"}
          </LoadingButton>
        </Box>
      </form>
    </Dialog>
  );
};

export default ShopTabAdd;