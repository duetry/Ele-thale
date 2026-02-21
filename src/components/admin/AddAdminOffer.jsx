import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  postAdminOffers,
  getAdminOffers,
  updateAdminOffers,
} from "@/app/features/adminPanel/adminPanelSlice";

import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  Switch,
  Divider,
  Chip,
  Typography,
  InputAdornment,
  Fade,
  Slide,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import LabelIcon from "@mui/icons-material/Label";
import CategoryIcon from "@mui/icons-material/Category";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

// ─── Styled helpers using inline sx (no extra deps) ─────────────────────────

const sectionLabel = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#94a3b8",
  mb: 2,
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#f8fafc",
    fontSize: "14px",
    transition: "all 0.2s",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused": {
      background: "#fff",
      "& fieldset": { borderColor: "#6366f1", borderWidth: "2px" },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px",
    color: "#94a3b8",
    "&.Mui-focused": { color: "#6366f1" },
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddAdminOffers = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      Description: editData?.Description || "",
      Finalprice: editData?.Finalprice || "",
      Isactive: editData?.Isactive ?? true,
      ProductName: editData?.ProductName || "",
      Price: editData?.Price || "",
      Discount: editData?.Discount || "",
      Brand: editData?.Brand || "",
      Type: editData?.Type || "",
      Imagefile: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      Description: Yup.string().required("Required"),
      ProductName: Yup.string().required("Required"),
      Brand: Yup.string().required("Required"),
      Type: Yup.string().required("Required"),
      Price: Yup.number().required("Required").min(1, "Must be > 0"),
      Discount: Yup.number()
        .required("Required")
        .min(0, "Cannot be negative")
        .max(100, "Cannot exceed 100%"),
      Finalprice: Yup.number()
        .required("Required")
        .test("not-greater", "Final Price cannot be greater than Price", function (value) {
          return value <= this.parent.Price;
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let base64Image = editData?.Imageurl || "";

      const sendPayload = async (image) => {
        const payload = {
          Productid: editData?.Productid,
          Description: values.Description,
          Finalprice: values.Finalprice,
          Isactive: values.Isactive,
          ProductName: values.ProductName,
          Price: values.Price,
          Discount: values.Discount,
          Brand: values.Brand,
          Type: values.Type,
          Imageurl: image,
        };

        if (editData?.Productid) {
          await dispatch(updateAdminOffers(payload));
        } else {
          await dispatch(postAdminOffers(payload));
        }

        await dispatch(getAdminOffers());
        setLoading(false);
        resetForm();
        setImagePreview(null);
        handleClose();
      };

      if (values.Imagefile) {
        const reader = new FileReader();
        reader.readAsDataURL(values.Imagefile);
        reader.onload = async () => {
          await sendPayload(reader.result);
        };
      } else {
        await sendPayload(base64Image);
      }
    },
  });

  useEffect(() => {
    const price = parseFloat(formik.values.Price);
    const discount = parseFloat(formik.values.Discount);
    if (!isNaN(price) && !isNaN(discount)) {
      const final = price - (price * discount) / 100;
      if (final >= 0) formik.setFieldValue("Finalprice", final.toFixed(2));
    }
  }, [formik.values.Discount, formik.values.Price]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("Imagefile", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    formik.setFieldValue("Imagefile", null);
    setImagePreview(null);
  };

  const discountPct = parseFloat(formik.values.Discount) || 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalOfferIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>
              {editData ? "Edit Offer" : "Create New Offer"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
              {editData ? "Update your offer details" : "Fill in the details to publish an offer"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Active toggle in header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: "rgba(255,255,255,0.15)",
              borderRadius: "20px",
              px: 1.5,
              py: 0.5,
            }}
          >
            <Switch
              checked={formik.values.Isactive}
              onChange={(e) => formik.setFieldValue("Isactive", e.target.checked)}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(255,255,255,0.5)",
                },
              }}
            />
            <Typography sx={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
              {formik.values.Isactive ? "Active" : "Inactive"}
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              color: "#fff",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "10px",
              width: 36,
              height: 36,
              "&:hover": { background: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ p: 3, background: "#f8fafc", maxHeight: "70vh", overflowY: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

            {/* ── Section: Product Info ── */}
            <Box sx={sectionLabel}>
              <InventoryIcon sx={{ fontSize: 14 }} />
              Product Information
            </Box>

            {/* Row 1: Product Name | Brand */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Product Name"
                name="ProductName"
                value={formik.values.ProductName}
                onChange={formik.handleChange}
                error={formik.touched.ProductName && Boolean(formik.errors.ProductName)}
                helperText={formik.touched.ProductName && formik.errors.ProductName}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StorefrontIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Brand"
                name="Brand"
                value={formik.values.Brand}
                onChange={formik.handleChange}
                error={formik.touched.Brand && Boolean(formik.errors.Brand)}
                helperText={formik.touched.Brand && formik.errors.Brand}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LabelIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Row 2: Type | Offer Display Type */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Type"
                name="Type"
                value={formik.values.Type}
                onChange={formik.handleChange}
                error={formik.touched.Type && Boolean(formik.errors.Type)}
                helperText={formik.touched.Type && formik.errors.Type}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                label="Offer Display Type"
                name="Description"
                value={formik.values.Description}
                onChange={formik.handleChange}
                error={formik.touched.Description && Boolean(formik.errors.Description)}
                helperText={formik.touched.Description && formik.errors.Description}
                fullWidth
                sx={fieldSx}
                SelectProps={{ native: true }}
              >
                <option value="">Select Display Type</option>
                <option value="Card">Card</option>
                <option value="Banner">Banner</option>
              </TextField>
            </Box>

            {/* ── Divider ── */}
            <Divider sx={{ borderColor: "#e2e8f0" }} />
            <Box sx={{ ...sectionLabel, mb: 0 }}>
              <AttachMoneyIcon sx={{ fontSize: 14 }} />
              Pricing Details
            </Box>

            {/* Row 3: Price | Discount */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Original Price"
                name="Price"
                type="number"
                value={formik.values.Price}
                onChange={formik.handleChange}
                error={formik.touched.Price && Boolean(formik.errors.Price)}
                helperText={formik.touched.Price && formik.errors.Price}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>₹</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Discount"
                name="Discount"
                type="number"
                value={formik.values.Discount}
                onChange={formik.handleChange}
                error={formik.touched.Discount && Boolean(formik.errors.Discount)}
                helperText={formik.touched.Discount && formik.errors.Discount}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PercentIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Final Price — full width summary card */}
            <Box>
              <Box
                sx={{
                  background: discountPct > 0
                    ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                    : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: discountPct > 0 ? "2px solid #6ee7b7" : "2px dashed #e2e8f0",
                  borderRadius: "14px",
                  px: 3,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.3 }}>
                      Final Customer Price
                    </Typography>
                    <Typography sx={{ fontSize: "22px", fontWeight: 800, color: discountPct > 0 ? "#059669" : "#94a3b8", lineHeight: 1 }}>
                      {formik.values.Finalprice ? `₹${formik.values.Finalprice}` : "—"}
                    </Typography>
                  </Box>

                  {discountPct > 0 && formik.values.Price && (
                    <Box sx={{ borderLeft: "1px solid #a7f3d0", pl: 3 }}>
                      <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.3 }}>
                        Customer Saves
                      </Typography>
                      <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#dc2626" }}>
                        ₹{(parseFloat(formik.values.Price) - parseFloat(formik.values.Finalprice)).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {discountPct > 0 && (
                  <Chip
                    label={`${discountPct}% OFF`}
                    sx={{
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "13px",
                      height: "32px",
                      px: 0.5,
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px rgba(5,150,105,0.35)",
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* ── Image Upload ── */}
            <Divider sx={{ borderColor: "#e2e8f0" }} />
            <Box sx={{ ...sectionLabel, mb: 0 }}>
              <CloudUploadIcon sx={{ fontSize: 14 }} />
              Product Image
            </Box>

            <Box>
              {imagePreview || editData?.Imageurl ? (
                <Fade in>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background: "#fff",
                      border: "2px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 200,
                    }}
                  >
                    <img
                      src={imagePreview || editData?.Imageurl}
                      alt="preview"
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                    {/* overlay actions */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        transition: "background 0.2s",
                        "&:hover": { background: "rgba(0,0,0,0.35)" },
                        "&:hover .img-actions": { opacity: 1 },
                      }}
                    >
                      <Box className="img-actions" sx={{ opacity: 0, transition: "opacity 0.2s", display: "flex", gap: 1 }}>
                        <Button
                          component="label"
                          variant="contained"
                          size="small"
                          sx={{ borderRadius: "10px", background: "#6366f1", textTransform: "none", fontWeight: 600, fontSize: "12px" }}
                        >
                          Change
                          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        <IconButton
                          onClick={removeImage}
                          sx={{ background: "#ef4444", color: "#fff", borderRadius: "10px", "&:hover": { background: "#dc2626" } }}
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    {/* badge */}
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
                      label="Image uploaded"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10, right: 10,
                        background: "#059669",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "11px",
                        "& .MuiChip-icon": { color: "#fff" },
                      }}
                    />
                  </Box>
                </Fade>
              ) : (
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    border: "2px dashed #c7d2fe",
                    borderRadius: "16px",
                    background: "#eef2ff",
                    height: 160,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { background: "#e0e7ff", borderColor: "#6366f1" },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.5,
                    }}
                  >
                    <CloudUploadIcon sx={{ color: "#fff", fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#4338ca" }}>
                    Click to upload image
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
                    PNG, JPG, WEBP — max 5MB
                  </Typography>
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        {/* ── Footer ── */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "#fff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              color: "#64748b",
              "&:hover": { background: "#f1f5f9" },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 4,
              fontSize: "14px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: "0 6px 20px rgba(99,102,241,0.5)",
              },
            }}
          >
            {editData ? "Update Offer" : "Publish Offer"}
          </LoadingButton>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddAdminOffers;