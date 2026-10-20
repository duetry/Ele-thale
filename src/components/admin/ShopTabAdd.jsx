'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Switch,
  MenuItem,
  Autocomplete,
  Chip,
  Paper,
  Divider,
  Grid
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import LocationMapPicker from "./LocationMapPicker";

import { getShopOwner, selectShopOwners } from "@/app/features/adminPanel/shopOwnerSlice";
import { createShop, updateShop, getShops } from "@/app/features/adminPanel/shopSlice";
import { getLocationList } from "@/app/features/adminPanel/adminPanelSlice";
import {
  getCategories,
  getSubCategories,
  selectCategories,
  selectSubCategories,
} from "@/app/features/adminPanel/categorySlice";

const parseSubCategoryArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const ShopTabAdd = ({ onBack, editData }) => {
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

  if (editData !== prevEditData) {
    setPrevEditData(editData);
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
      IsActive: editData?.Deleted === "false" || editData?.Isactive === "true" || !editData,
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
      Email: Yup.string()
        .trim()
        .email("Invalid email")
        .nullable(),
      Phoneno: Yup.string()
        .trim()
        .matches(/^[0-9]{10}$/, {
          message: "Enter valid 10 digit phone number",
          excludeEmptyString: true,
        })
        .nullable(),
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
        Email: (values.Email || "").trim(),
        Phoneno: (values.Phoneno || "").trim(),
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
      if (onBack) onBack();
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

  const [gmapsImportInput, setGmapsImportInput] = useState("");
  const [importingGmaps, setImportingGmaps] = useState(false);
  const [importFeedback, setImportFeedback] = useState(null);

  const handleImportGoogleMaps = async (inputStr) => {
    const raw = (inputStr || "").trim();
    if (!raw) {
      setImportFeedback({ type: "error", message: "Please paste a Google Maps link or coordinates." });
      return;
    }

    setImportingGmaps(true);
    setImportFeedback(null);

    try {
      const res = await fetch("/api/resolve-maps-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });
      const data = await res.json();

      if (data && (data.lat || data.placeName)) {
        if (data.placeName) {
          formik.setFieldValue("Storename", data.placeName);
        }

        if (data.lat !== null && data.lng !== null) {
          formik.setFieldValue("Latitude", data.lat);
          formik.setFieldValue("Longitude", data.lng);

          const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`;
          formik.setFieldValue(
            "StoreLocation",
            data.resolvedUrl && data.resolvedUrl.startsWith("http") ? data.resolvedUrl : gmapsUrl
          );

          try {
            const revRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.lat}&lon=${data.lng}&addressdetails=1`,
              { headers: { "Accept-Language": "en" } }
            );
            const revData = await revRes.json();
            const addr = revData?.address || {};

            const road = addr.road || addr.pedestrian || addr.street || addr.footway || "";
            const area = addr.suburb || addr.neighbourhood || addr.residential || "";
            const cityOrTown = addr.town || addr.city || addr.village || addr.municipality || "";
            const state = addr.state || "Tamil Nadu";
            const postcode = addr.postcode || "";

            const addrParts = [
              data.placeName,
              road,
              area,
              cityOrTown,
              state,
              postcode
            ].filter(Boolean);

            if (addrParts.length > 0) {
              formik.setFieldValue("Storeaddress", addrParts.join(", "));
            }

            if (locationData?.length && cityOrTown) {
              const matchedLoc = locationData.find(
                (l) =>
                  (l.Name && l.Name.toLowerCase().includes(cityOrTown.toLowerCase())) ||
                  (cityOrTown.toLowerCase().includes((l.Name || "").toLowerCase()))
              );
              if (matchedLoc) {
                formik.setFieldValue("Location", matchedLoc);
              }
            }
          } catch (e) {
            console.error("Reverse geocoding error during import:", e);
            if (data.placeName) {
              formik.setFieldValue("Storeaddress", `${data.placeName}, Lat: ${data.lat}, Lng: ${data.lng}`);
            }
          }
        }

        setImportFeedback({
          type: "success",
          message: `✅ Imported "${data.placeName || 'Shop'}" successfully! Location & coordinates pinned.`,
        });
        setGmapsImportInput("");
      } else {
        setImportFeedback({
          type: "error",
          message: "Could not detect coordinates or shop name. Please check the URL or try searching on Google Maps.",
        });
      }
    } catch (err) {
      console.error("Import error:", err);
      setImportFeedback({
        type: "error",
        message: "Failed to resolve link. Please ensure valid Google Maps URL or enter coordinates.",
      });
    } finally {
      setImportingGmaps(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* ── Page Header Bar ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={onBack}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.3)",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#fff",
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Back to Shops
          </Button>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              <StorefrontIcon sx={{ color: "#818cf8" }} />
              {editData ? "Edit Shop Details" : "Create New Shop"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Fill in shop information and pinpoint the exact store location on the wide screen map below.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={onBack}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { color: "#fff" },
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={formik.handleSubmit}
            variant="contained"
            loading={loading}
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: "10px",
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #4338ca)",
              },
            }}
          >
            {editData ? "Update Shop" : "Save Shop"}
          </LoadingButton>
        </Box>
      </Paper>

      {/* ── Main Full-Width Form Content Layout ── */}
      <form onSubmit={formik.handleSubmit}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4 },
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {/* ── Quick Google Maps Import Card ── */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
              border: "1px solid #bae6fd",
              boxShadow: "0 4px 16px rgba(14, 165, 233, 0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TravelExploreIcon sx={{ color: "#0284c7" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Quick Import Shop from Google Maps
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                onClick={() => {
                  const query = formik.values.Storename || "Mathi bakes Manapparai";
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                }}
                sx={{
                  textTransform: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  borderColor: "#38bdf8",
                  color: "#0284c7",
                  background: "#fff",
                  "&:hover": { borderColor: "#0284c7", background: "#f0f9ff" },
                }}
              >
                Find &quot;{formik.values.Storename || "Shop"}&quot; on Google Maps ↗
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: "#475569", mb: 1.5 }}>
              Paste any Google Maps link, share URL (e.g. <code>maps.app.goo.gl/...</code>), or coordinates to automatically fill Store Name, Address, Latitude, Longitude & Map pin.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Paste Google Maps link (e.g. https://maps.app.goo.gl/... or place link or 10.6058, 78.4180)"
                value={gmapsImportInput}
                onChange={(e) => setGmapsImportInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleImportGoogleMaps(gmapsImportInput);
                  }
                }}
                sx={{
                  background: "#fff",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              />
              <LoadingButton
                variant="contained"
                loading={importingGmaps}
                onClick={() => handleImportGoogleMaps(gmapsImportInput)}
                sx={{
                  whiteSpace: "nowrap",
                  borderRadius: "8px",
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #0284c7, #0369a1)",
                  "&:hover": { background: "#0284c7" },
                }}
              >
                Auto-Fill Shop
              </LoadingButton>
            </Box>
            {importFeedback && (
              <Typography sx={{ fontSize: "12px", mt: 1, color: importFeedback.type === 'error' ? '#dc2626' : '#15803d', fontWeight: 600 }}>
                {importFeedback.message}
              </Typography>
            )}
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", pb: 1, borderBottom: "1px solid #f1f5f9" }}>
            🏪 Shop Basic Details
          </Typography>

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
                fullWidth
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
            multiline
            rows={2}
            value={formik.values.Description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Description && Boolean(formik.errors.Description)}
            helperText={formik.touched.Description && formik.errors.Description}
            fullWidth
          />

          <TextField
            label="Store Address"
            name="Storeaddress"
            multiline
            rows={2}
            value={formik.values.Storeaddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Storeaddress && Boolean(formik.errors.Storeaddress)}
            helperText={formik.touched.Storeaddress && formik.errors.Storeaddress}
            fullWidth
          />

          <TextField
            label="Location Link / Address"
            name="StoreLocation"
            value={formik.values.StoreLocation}
            onChange={(e) => {
              const val = e.target.value;
              formik.handleChange(e);
              if (
                val &&
                (val.includes("google.com/maps") ||
                  val.includes("goo.gl") ||
                  /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(val.trim()))
              ) {
                handleImportGoogleMaps(val);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.StoreLocation && Boolean(formik.errors.StoreLocation)}
            helperText={formik.touched.StoreLocation && formik.errors.StoreLocation}
            placeholder="Paste Google Maps link (e.g. https://maps.app.goo.gl/... or place link) or address"
            fullWidth
          />

          {/* Location City Dropdown & Kilometer */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
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
                    label="Select Location City"
                    placeholder="Search location..."
                    error={formik.touched.Location && Boolean(formik.errors.Location)}
                    helperText={formik.touched.Location && formik.errors.Location}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
          </Grid>

          {/* Lat & Lng Inputs */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
          </Grid>

          {/* Interactive Location Map Picker */}
          <Box sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 1 }}>
                <MapIcon sx={{ color: "#6366f1" }} />
                Interactive Store Location Map
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Search for an address or drag/click the map pin below. Latitude, Longitude & Store Address will be auto-calculated.
              </Typography>
            </Box>

            <LocationMapPicker
              latitude={formik.values.Latitude}
              longitude={formik.values.Longitude}
              address={formik.values.Storeaddress || formik.values.StoreLocation}
              shopName={formik.values.Storename}
              mapHeight="420px"
              onLocationSelect={({ lat, lng, address, placeName, googleMapsUrl }) => {
                formik.setFieldValue("Latitude", lat);
                formik.setFieldValue("Longitude", lng);
                if (address) {
                  formik.setFieldValue("Storeaddress", address);
                }
                if (googleMapsUrl) {
                  formik.setFieldValue("StoreLocation", googleMapsUrl);
                }
                if (placeName && (!formik.values.Storename || formik.values.Storename.trim() === "")) {
                  formik.setFieldValue("Storename", placeName);
                }
              }}
              label="Map Location Selector"
            />
          </Box>

          {/* Contact Info */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email (Optional)"
                name="Email"
                value={formik.values.Email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Email && Boolean(formik.errors.Email)}
                helperText={formik.touched.Email && formik.errors.Email}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone (Optional)"
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
            </Grid>
          </Grid>

          {/* Hours & Rating */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            </Grid>
          </Grid>

          {/* Image Upload */}
          <Box sx={{ border: "1px dashed #cbd5e1", p: 2, borderRadius: "12px", textAlign: "center", background: "#f8fafc" }}>
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
              Upload Shop Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {formik.touched.ImageBase64 && formik.errors.ImageBase64 && (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                {formik.errors.ImageBase64}
              </Typography>
            )}

            {preview && (
              <Box sx={{ mt: 2 }}>
                <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 8 }} />
              </Box>
            )}
          </Box>

          {/* Active Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, bg: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
            <Typography sx={{ fontWeight: 600, color: "#334155" }}>Active Store Status</Typography>
            <Switch
              checked={formik.values.IsActive}
              onChange={(e) => formik.setFieldValue("IsActive", e.target.checked)}
            />
          </Box>

          {/* Bottom Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2, borderTop: "1px solid #f1f5f9" }}>
            <Button
              onClick={onBack}
              variant="outlined"
              sx={{
                borderRadius: "10px",
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#cbd5e1",
                color: "#64748b",
                "&:hover": { borderColor: "#94a3b8", background: "#f8fafc" },
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: "10px",
                px: 3.5,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                },
              }}
            >
              {editData ? "Update Shop" : "Save Shop"}
            </LoadingButton>
          </Box>
        </Paper>
      </form>
    </Box>
  );
};

export default ShopTabAdd;