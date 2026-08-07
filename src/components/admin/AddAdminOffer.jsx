


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   postAdminOffers,
//   getAdminOffers,
//   updateAdminOffers,
//   getLocationList,
// } from "@/app/features/adminPanel/adminPanelSlice";

// import {
//   Dialog,
//   DialogContent,
//   TextField,
//   Button,
//   Box,
//   IconButton,
//   Switch,
//   Divider,
//   Chip,
//   Typography,
//   InputAdornment,
//   Fade,
//   Slide,
//   Autocomplete,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import PercentIcon from "@mui/icons-material/Percent";
// import LabelIcon from "@mui/icons-material/Label";
// import CategoryIcon from "@mui/icons-material/Category";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import BoltIcon from "@mui/icons-material/Bolt";
// import { LoadingButton } from "@mui/lab";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { getShops, selectShops } from "@/app/features/adminPanel/shopSlice";

// // ─── Styled helpers ──────────────────────────────────────────────────────────

// const sectionLabel = {
//   fontSize: "11px",
//   fontWeight: 700,
//   letterSpacing: "0.12em",
//   textTransform: "uppercase",
//   color: "#94a3b8",
//   mb: 2,
//   display: "flex",
//   alignItems: "center",
//   gap: 1,
// };

// const fieldSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "12px",
//     background: "#f8fafc",
//     fontSize: "14px",
//     transition: "all 0.2s",
//     "& fieldset": { borderColor: "#e2e8f0" },
//     "&:hover fieldset": { borderColor: "#94a3b8" },
//     "&.Mui-focused": {
//       background: "#fff",
//       "& fieldset": { borderColor: "#6366f1", borderWidth: "2px" },
//     },
//   },
//   "& .MuiInputLabel-root": {
//     fontSize: "13px",
//     color: "#94a3b8",
//     "&.Mui-focused": { color: "#6366f1" },
//   },
// };

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const AddAdminOffers = ({ open, handleClose, editData }) => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const locationData = useSelector((state) => state?.adminPanel?.locationData);
//   const shops = useSelector(selectShops);

//   // ── Fetch lookup lists on mount ─────────────────────────────────────────
//   useEffect(() => {
//     dispatch(getLocationList());
//     dispatch(getShops());
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       Description: editData?.Description || "",
//       Finalprice: editData?.Finalprice || "",
//       Isactive: editData?.Isactive === "true" ?? true,
//       ProductName: editData?.ProductName || "",
//       Price: editData?.Price || "",
//       Brand: editData?.Brand || "",
//       Type: editData?.Type || "",
//       Imagefile: null,
//       Store: null,
//       Location: null,
//       Power: editData?.Power ?? "",
//       OfferStartTime: editData?.OfferStartTime || "",
//       OfferEndTime: editData?.OfferEndTime || "",
//       CoupounActive: editData?.CoupounActive === "true" || editData?.CoupounActive === true || !editData ? true : false,
//       // ── NEW: FlashDeal field ──
//       FlashDeal: editData?.FlashDeal === "true" || editData?.FlashDeal === true ? true : false,
//     },
//     enableReinitialize: true,
//     validationSchema: Yup.object({
//       Description: Yup.string().required("Required"),
//       ProductName: Yup.string().required("Required"),
//       Brand: Yup.string(),
//       Type: Yup.string().required("Required"),
//       Price: Yup.number().required("Required").min(1, "Must be > 0"),
//       Finalprice: Yup.number().required("Required").min(0, "Cannot be negative"),
//       Location: Yup.object().nullable().required("Location is required"),
//       Store: Yup.object().nullable().required("Store is required"),
//       Power: Yup.number()
//         .required("Required")
//         .min(0, "Min 0")
//         .max(10, "Max 10"),
//       OfferStartTime: Yup.string().required("Start date & time is required"),
//       OfferEndTime: Yup.string()
//         .nullable()
//         .optional()
//         .test("after-start", "End time must be after start time", function (value) {
//           const { OfferStartTime } = this.parent;
//           if (!value || !OfferStartTime) return true;
//           return new Date(value) > new Date(OfferStartTime);
//         }),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       setLoading(true);
//       let base64Image = editData?.Imageurl || "";

//       const sendPayload = async (image) => {
//         const payload = {
//           Productid: editData?.Productid,
//           Description: values.Description,
//           Finalprice: values.Finalprice,
//           Isactive: values.Isactive,
//           ProductName: values.ProductName,
//           Price: values.Price,
//           Brand: values.Brand,
//           Type: values.Type,
//           Imageurl: image,
//           LocationId: values.Location?.LocationId || "",
//           LocationName: values.Location?.Name || "",
//           OfferStartTime: values.OfferStartTime,
//           OfferEndTime: values.OfferEndTime || null,
//           Power: values.Power ?? null,
//           Storeid: values.Store?.Storeid || "",
//           CoupounActive: values.CoupounActive,
//           // ── NEW: include FlashDeal in payload ──
//           Flashdeal: values.FlashDeal,
//         };

//         if (editData?.Productid) {
//           await dispatch(updateAdminOffers(payload));
//         } else {
//           await dispatch(postAdminOffers(payload));
//         }

//         await dispatch(getAdminOffers());
//         setLoading(false);
//         resetForm();
//         setImagePreview(null);
//         handleClose();
//       };

//       if (values.Imagefile) {
//         const reader = new FileReader();
//         reader.readAsDataURL(values.Imagefile);
//         reader.onload = async () => {
//           await sendPayload(reader.result);
//         };
//       } else {
//         await sendPayload(base64Image);
//       }
//     },
//   });

//   // ── KEY FIX ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!editData) return;

//     // Store
//     if (shops?.length && editData.Storeid) {
//       const matched = shops.find((s) => s.Storeid === editData.Storeid) || null;
//       if (matched && formik.values.Store?.Storeid !== matched.Storeid) {
//         formik.setFieldValue("Store", matched);
//       }
//     }

//     // Location
//     if (locationData?.length && editData.Locationid) {
//       const matched = locationData.find((l) => l.LocationId === editData.Locationid) || null;
//       if (matched && formik.values.Location?.LocationId !== matched.LocationId) {
//         formik.setFieldValue("Location", matched);
//       }
//     }

//     // Power
//     if (
//       editData.Power !== undefined &&
//       editData.Power !== null &&
//       formik.values.Power === ""
//     ) {
//       formik.setFieldValue("Power", editData.Power);
//     }

//     // CoupounActive
//     if (editData.CoupounActive !== undefined && editData.CoupounActive !== null) {
//       const val = editData.CoupounActive === "true" || editData.CoupounActive === true;
//       if (formik.values.CoupounActive !== val) {
//         formik.setFieldValue("CoupounActive", val);
//       }
//     }

//     // ── NEW: FlashDeal patch ──
//     if (editData.FlashDeal !== undefined && editData.FlashDeal !== null) {
//       const val = editData.FlashDeal === "true" || editData.FlashDeal === true;
//       if (formik.values.FlashDeal !== val) {
//         formik.setFieldValue("FlashDeal", val);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [shops, locationData, editData]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       formik.setFieldValue("Imagefile", file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const removeImage = () => {
//     formik.setFieldValue("Imagefile", null);
//     setImagePreview(null);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       fullWidth
//       maxWidth="md"
//       TransitionComponent={Transition}
//       PaperProps={{
//         sx: {
//           borderRadius: "20px",
//           overflow: "hidden",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
//         },
//       }}
//     >
//       {/* ── Header ── */}
//       <Box
//         sx={{
//           background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
//           px: 3,
//           py: 2.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           <Box
//             sx={{
//               width: 40,
//               height: 40,
//               borderRadius: "12px",
//               background: "rgba(255,255,255,0.2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <LocalOfferIcon sx={{ color: "#fff", fontSize: 20 }} />
//           </Box>
//           <Box>
//             <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>
//               {editData ? "Edit Offer" : "Create New Offer"}
//             </Typography>
//             <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
//               {editData ? "Update your offer details" : "Fill in the details to publish an offer"}
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           {/* Isactive switch — unchanged */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               background: "rgba(255,255,255,0.15)",
//               borderRadius: "20px",
//               px: 1.5,
//               py: 0.5,
//             }}
//           >
//             <Switch
//               checked={formik.values.Isactive}
//               onChange={(e) => formik.setFieldValue("Isactive", e.target.checked)}
//               size="small"
//               sx={{
//                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
//                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                   backgroundColor: "rgba(255,255,255,0.5)",
//                 },
//               }}
//             />
//             <Typography sx={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
//               {formik.values.Isactive ? "Active" : "Inactive"}
//             </Typography>
//           </Box>

//           {/* CoupounActive switch — unchanged */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               background: "rgba(255,255,255,0.15)",
//               borderRadius: "20px",
//               px: 1.5,
//               py: 0.5,
//             }}
//           >
//             <Switch
//               checked={formik.values.CoupounActive}
//               onChange={(e) => formik.setFieldValue("CoupounActive", e.target.checked)}
//               size="small"
//               sx={{
//                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
//                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                   backgroundColor: "rgba(255,255,255,0.5)",
//                 },
//               }}
//             />
//             <Typography sx={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
//               {formik.values.CoupounActive ? "Coupon On" : "Coupon Off"}
//             </Typography>
//           </Box>

//           {/* ── NEW: FlashDeal switch ── */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               background: "rgba(255,255,255,0.15)",
//               borderRadius: "20px",
//               px: 1.5,
//               py: 0.5,
//             }}
//           >
//             <BoltIcon sx={{ color: formik.values.FlashDeal ? "#fbbf24" : "#fff", fontSize: 16, transition: "color 0.2s" }} />
//             <Switch
//               checked={formik.values.FlashDeal}
//               onChange={(e) => formik.setFieldValue("FlashDeal", e.target.checked)}
//               size="small"
//               sx={{
//                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#fbbf24" },
//                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                   backgroundColor: "rgba(251,191,36,0.5)",
//                 },
//               }}
//             />
//             <Typography sx={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
//               {formik.values.FlashDeal ? "Flash On" : "Flash Off"}
//             </Typography>
//           </Box>

//           <IconButton
//             onClick={handleClose}
//             sx={{
//               color: "#fff",
//               background: "rgba(255,255,255,0.15)",
//               borderRadius: "10px",
//               width: 36,
//               height: 36,
//               "&:hover": { background: "rgba(255,255,255,0.25)" },
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       </Box>

//       <form onSubmit={formik.handleSubmit}>
//         <DialogContent sx={{ p: 3, background: "#f8fafc", maxHeight: "70vh", overflowY: "auto" }}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

//             {/* ── Section: Product Info ── */}
//             <Box sx={sectionLabel}>
//               <InventoryIcon sx={{ fontSize: 14 }} />
//               Product Information
//             </Box>

//             {/* Row 1: Product Name | Brand */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Product Name"
//                 name="ProductName"
//                 value={formik.values.ProductName}
//                 onChange={formik.handleChange}
//                 error={formik.touched.ProductName && Boolean(formik.errors.ProductName)}
//                 helperText={formik.touched.ProductName && formik.errors.ProductName}
//                 fullWidth
//                 sx={fieldSx}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <StorefrontIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 label="Brand"
//                 name="Brand"
//                 value={formik.values.Brand}
//                 onChange={formik.handleChange}
//                 error={formik.touched.Brand && Boolean(formik.errors.Brand)}
//                 helperText={formik.touched.Brand && formik.errors.Brand}
//                 fullWidth
//                 sx={fieldSx}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LabelIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box>

//             {/* Row 2: Shop Autocomplete | Power */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Autocomplete
//                 options={shops || []}
//                 getOptionLabel={(option) => option?.Storename || ""}
//                 isOptionEqualToValue={(option, value) => option?.Storeid === value?.Storeid}
//                 value={formik.values.Store}
//                 onChange={(_, newValue) => formik.setFieldValue("Store", newValue)}
//                 onBlur={() => formik.setFieldTouched("Store", true)}
//                 fullWidth
//                 renderOption={(props, option) => (
//                   <Box
//                     component="li"
//                     {...props}
//                     sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5 }}
//                   >
//                     <Box
//                       sx={{
//                         width: 32,
//                         height: 32,
//                         borderRadius: "8px",
//                         background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <StorefrontIcon sx={{ fontSize: 16, color: "#7c3aed" }} />
//                     </Box>
//                     <Box>
//                       <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
//                         {option.Storename}
//                       </Typography>
//                       {option.Storeid && (
//                         <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
//                           ID: {option.Storeid}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>
//                 )}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Shop"
//                     placeholder="Search shop..."
//                     error={formik.touched.Store && Boolean(formik.errors.Store)}
//                     helperText={formik.touched.Store && formik.errors.Store}
//                     sx={fieldSx}
//                     InputProps={{
//                       ...params.InputProps,
//                       startAdornment: (
//                         <>
//                           <InputAdornment position="start">
//                             <StorefrontIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                           </InputAdornment>
//                           {params.InputProps.startAdornment}
//                         </>
//                       ),
//                     }}
//                   />
//                 )}
//                 PaperComponent={({ children, ...paperProps }) => (
//                   <Box
//                     {...paperProps}
//                     sx={{
//                       borderRadius: "14px",
//                       boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//                       border: "1px solid #e2e8f0",
//                       overflow: "hidden",
//                       mt: 0.5,
//                       background: "#fff",
//                     }}
//                   >
//                     {children}
//                   </Box>
//                 )}
//               />

//               <TextField
//                 label="Power (0 – 10)"
//                 name="Power"
//                 type="number"
//                 value={formik.values.Power}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.Power && Boolean(formik.errors.Power)}
//                 helperText={formik.touched.Power && formik.errors.Power}
//                 fullWidth
//                 sx={fieldSx}
//                 inputProps={{ min: 0, max: 10 }}
//               />
//             </Box>

//             {/* Row 3: Type | Description */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Type"
//                 name="Type"
//                 value={formik.values.Type}
//                 onChange={formik.handleChange}
//                 error={formik.touched.Type && Boolean(formik.errors.Type)}
//                 helperText={formik.touched.Type && formik.errors.Type}
//                 fullWidth
//                 sx={fieldSx}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CategoryIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <TextField
//                 select
//                 name="Description"
//                 value={formik.values.Description}
//                 onChange={formik.handleChange}
//                 error={formik.touched.Description && Boolean(formik.errors.Description)}
//                 helperText={formik.touched.Description && formik.errors.Description}
//                 fullWidth
//                 sx={fieldSx}
//                 SelectProps={{ native: true }}
//               >
//                 <option value="">Select Display Type</option>
//                 <option value="Card">Card</option>
//                 <option value="Banner">Banner</option>
//               </TextField>
//             </Box>

//             {/* Row 4: Location Autocomplete */}
//             <Autocomplete
//               options={locationData || []}
//               getOptionLabel={(option) => option?.Name || ""}
//               isOptionEqualToValue={(option, value) => option?.LocationId === value?.LocationId}
//               value={formik.values.Location}
//               onChange={(_, newValue) => formik.setFieldValue("Location", newValue)}
//               onBlur={() => formik.setFieldTouched("Location", true)}
//               renderOption={(props, option) => (
//                 <Box
//                   component="li"
//                   {...props}
//                   sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5 }}
//                 >
//                   <Box
//                     sx={{
//                       width: 32,
//                       height: 32,
//                       borderRadius: "8px",
//                       background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <LocationOnIcon sx={{ fontSize: 16, color: "#7c3aed" }} />
//                   </Box>
//                   <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
//                     {option.Name}
//                   </Typography>
//                 </Box>
//               )}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Location"
//                   placeholder="Search location..."
//                   error={formik.touched.Location && Boolean(formik.errors.Location)}
//                   helperText={formik.touched.Location && formik.errors.Location}
//                   sx={fieldSx}
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <>
//                         <InputAdornment position="start">
//                           <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                         </InputAdornment>
//                         {params.InputProps.startAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               PaperComponent={({ children, ...paperProps }) => (
//                 <Box
//                   {...paperProps}
//                   sx={{
//                     borderRadius: "14px",
//                     boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//                     border: "1px solid #e2e8f0",
//                     overflow: "hidden",
//                     mt: 0.5,
//                     background: "#fff",
//                   }}
//                 >
//                   {children}
//                 </Box>
//               )}
//             />

//             {/* ── Divider ── */}
//             <Divider sx={{ borderColor: "#e2e8f0" }} />
//             <Box sx={{ ...sectionLabel, mb: 0 }}>
//               <AttachMoneyIcon sx={{ fontSize: 14 }} />
//               Pricing Details
//             </Box>

//             {/* Row 5: Price | Final Price */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Original Price"
//                 name="Price"
//                 type="number"
//                 value={formik.values.Price}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.Price && Boolean(formik.errors.Price)}
//                 helperText={formik.touched.Price && formik.errors.Price}
//                 fullWidth
//                 sx={fieldSx}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>₹</Typography>
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <TextField
//                 label="Final Price"
//                 name="Finalprice"
//                 type="number"
//                 value={formik.values.Finalprice}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.Finalprice && Boolean(formik.errors.Finalprice)}
//                 helperText={formik.touched.Finalprice && formik.errors.Finalprice}
//                 fullWidth
//                 sx={fieldSx}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>₹</Typography>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Box>

//             {/* ── Section: Offer Validity ── */}
//             <Divider sx={{ borderColor: "#e2e8f0" }} />
//             <Box sx={{ ...sectionLabel, mb: 0 }}>
//               <AccessTimeIcon sx={{ fontSize: 14 }} />
//               Offer Validity
//             </Box>

//             {/* Row 6: Start Time | End Time */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Offer Start Date & Time"
//                 name="OfferStartTime"
//                 type="datetime-local"
//                 value={formik.values.OfferStartTime}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.OfferStartTime && Boolean(formik.errors.OfferStartTime)}
//                 helperText={formik.touched.OfferStartTime && formik.errors.OfferStartTime}
//                 fullWidth
//                 sx={fieldSx}
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                     </InputAdornment>
//                   ),
//                   inputProps: { style: { colorScheme: "light" } },
//                 }}
//               />
//               <TextField
//                 label="Offer End Date & Time (Optional)"
//                 name="OfferEndTime"
//                 type="datetime-local"
//                 value={formik.values.OfferEndTime}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.OfferEndTime && Boolean(formik.errors.OfferEndTime)}
//                 helperText={
//                   formik.touched.OfferEndTime && formik.errors.OfferEndTime
//                     ? formik.errors.OfferEndTime
//                     : "Leave empty for no expiry"
//                 }
//                 fullWidth
//                 sx={fieldSx}
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                     </InputAdornment>
//                   ),
//                   endAdornment: formik.values.OfferEndTime ? (
//                     <InputAdornment position="end">
//                       <IconButton
//                         size="small"
//                         onClick={() => formik.setFieldValue("OfferEndTime", "")}
//                         sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
//                       >
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     </InputAdornment>
//                   ) : null,
//                   inputProps: {
//                     min: formik.values.OfferStartTime || undefined,
//                     style: { colorScheme: "light" },
//                   },
//                 }}
//               />
//             </Box>

//             {/* Validity duration badge */}
//             {formik.values.OfferStartTime &&
//               formik.values.OfferEndTime &&
//               new Date(formik.values.OfferEndTime) > new Date(formik.values.OfferStartTime) && (
//                 <Fade in>
//                   <Box
//                     sx={{
//                       background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
//                       border: "2px solid #bfdbfe",
//                       borderRadius: "14px",
//                       px: 3,
//                       py: 1.5,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                       <Box
//                         sx={{
//                           width: 36,
//                           height: 36,
//                           borderRadius: "10px",
//                           background: "linear-gradient(135deg, #3b82f6, #6366f1)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <AccessTimeIcon sx={{ color: "#fff", fontSize: 18 }} />
//                       </Box>
//                       <Box>
//                         <Typography
//                           sx={{
//                             fontSize: "10px",
//                             fontWeight: 700,
//                             color: "#64748b",
//                             letterSpacing: "0.08em",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           Offer Duration
//                         </Typography>
//                         <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1e40af" }}>
//                           {(() => {
//                             const diffMs =
//                               new Date(formik.values.OfferEndTime) -
//                               new Date(formik.values.OfferStartTime);
//                             const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//                             const diffHrs = Math.floor(
//                               (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//                             );
//                             const diffMins = Math.floor(
//                               (diffMs % (1000 * 60 * 60)) / (1000 * 60)
//                             );
//                             if (diffDays > 0) return `${diffDays}d ${diffHrs}h ${diffMins}m`;
//                             if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
//                             return `${diffMins} minutes`;
//                           })()}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Chip
//                       icon={
//                         <CheckCircleIcon
//                           sx={{ fontSize: "14px !important", color: "#fff !important" }}
//                         />
//                       }
//                       label="Valid Period"
//                       size="small"
//                       sx={{
//                         background: "linear-gradient(135deg, #3b82f6, #6366f1)",
//                         color: "#fff",
//                         fontWeight: 600,
//                         fontSize: "11px",
//                         "& .MuiChip-icon": { color: "#fff" },
//                       }}
//                     />
//                   </Box>
//                 </Fade>
//               )}

//             {/* ── Image Upload ── */}
//             <Divider sx={{ borderColor: "#e2e8f0" }} />
//             <Box sx={{ ...sectionLabel, mb: 0 }}>
//               <CloudUploadIcon sx={{ fontSize: 14 }} />
//               Product Image
//             </Box>

//             <Box>
//               {imagePreview || editData?.Imageurl ? (
//                 <Fade in>
//                   <Box
//                     sx={{
//                       position: "relative",
//                       borderRadius: "16px",
//                       overflow: "hidden",
//                       background: "#fff",
//                       border: "2px solid #e2e8f0",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       height: 200,
//                     }}
//                   >
//                     <img
//                       src={imagePreview || editData?.Imageurl}
//                       alt="preview"
//                       style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
//                     />
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         background: "rgba(0,0,0,0)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 1.5,
//                         transition: "background 0.2s",
//                         "&:hover": { background: "rgba(0,0,0,0.35)" },
//                         "&:hover .img-actions": { opacity: 1 },
//                       }}
//                     >
//                       <Box
//                         className="img-actions"
//                         sx={{ opacity: 0, transition: "opacity 0.2s", display: "flex", gap: 1 }}
//                       >
//                         <Button
//                           component="label"
//                           variant="contained"
//                           size="small"
//                           sx={{
//                             borderRadius: "10px",
//                             background: "#6366f1",
//                             textTransform: "none",
//                             fontWeight: 600,
//                             fontSize: "12px",
//                           }}
//                         >
//                           Change
//                           <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                         </Button>
//                         <IconButton
//                           onClick={removeImage}
//                           sx={{
//                             background: "#ef4444",
//                             color: "#fff",
//                             borderRadius: "10px",
//                             "&:hover": { background: "#dc2626" },
//                           }}
//                           size="small"
//                         >
//                           <DeleteOutlineIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </Box>
//                     <Chip
//                       icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
//                       label="Image uploaded"
//                       size="small"
//                       sx={{
//                         position: "absolute",
//                         top: 10,
//                         right: 10,
//                         background: "#059669",
//                         color: "#fff",
//                         fontWeight: 600,
//                         fontSize: "11px",
//                         "& .MuiChip-icon": { color: "#fff" },
//                       }}
//                     />
//                   </Box>
//                 </Fade>
//               ) : (
//                 <Box
//                   component="label"
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 1,
//                     border: "2px dashed #c7d2fe",
//                     borderRadius: "16px",
//                     background: "#eef2ff",
//                     height: 160,
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                     "&:hover": { background: "#e0e7ff", borderColor: "#6366f1" },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 52,
//                       height: 52,
//                       borderRadius: "14px",
//                       background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       mb: 0.5,
//                     }}
//                   >
//                     <CloudUploadIcon sx={{ color: "#fff", fontSize: 26 }} />
//                   </Box>
//                   <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#4338ca" }}>
//                     Click to upload image
//                   </Typography>
//                   <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
//                     PNG, JPG, WEBP — max 5MB
//                   </Typography>
//                   <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </DialogContent>

//         {/* ── Footer ── */}
//         <Box
//           sx={{
//             px: 3,
//             py: 2,
//             background: "#fff",
//             borderTop: "1px solid #e2e8f0",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end",
//             gap: 1.5,
//           }}
//         >
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             sx={{
//               borderRadius: "12px",
//               textTransform: "none",
//               fontWeight: 600,
//               px: 3,
//               color: "#64748b",
//               "&:hover": { background: "#f1f5f9" },
//             }}
//           >
//             Cancel
//           </Button>

//           <LoadingButton
//             type="submit"
//             variant="contained"
//             loading={loading}
//             sx={{
//               borderRadius: "12px",
//               textTransform: "none",
//               fontWeight: 700,
//               px: 4,
//               fontSize: "14px",
//               background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//               boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
//                 boxShadow: "0 6px 20px rgba(99,102,241,0.5)",
//               },
//             }}
//           >
//             {editData ? "Update Offer" : "Publish Offer"}
//           </LoadingButton>
//         </Box>
//       </form>
//     </Dialog>
//   );
// };

// export default AddAdminOffers;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postAdminOffers,
  getAdminOffers,
  updateAdminOffers,
  getLocationList,
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
  Autocomplete,
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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BoltIcon from "@mui/icons-material/Bolt";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getShops, selectShops } from "@/app/features/adminPanel/shopSlice";
import { getCategories, selectCategories } from "@/app/features/adminPanel/categorySlice";

// ─── Styled helpers ──────────────────────────────────────────────────────────

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
  const locationData = useSelector((state) => state?.adminPanel?.locationData);
  const shops = useSelector(selectShops);
  const categories = useSelector(selectCategories);

  // ── Fetch lookup lists on mount ─────────────────────────────────────────
  useEffect(() => {
    dispatch(getLocationList());
    dispatch(getShops());
    dispatch(getCategories());
  }, []);

  const formik = useFormik({
    initialValues: {
      Description: editData?.Description || "",
      Finalprice: editData?.Finalprice || "",
      Isactive: editData?.Isactive === "true" ?? true,
      ProductName: editData?.ProductName || "",
      Price: editData?.Price || "",
      Brand: editData?.Brand || "",
      Type: editData?.Type || "",
      Imagefile: null,
      Store: null,
      Location: null,
      Categoryid: editData?.Categoryid || editData?.CategoryId || "",
      Power: editData?.Power ?? "",
      OfferStartTime: editData?.OfferStartTime || "",
      OfferEndTime: editData?.OfferEndTime || "",
      CoupounActive: editData?.CoupounActive === "true" || editData?.CoupounActive === true || !editData ? true : false,
      // ── FlashDeal field ──
      FlashDeal: editData?.FlashDeal === "true" || editData?.FlashDeal === true ? true : false,
      // ── NEW: Kilometer / Latitude / Longitude ──
      Kilometer: editData?.Kilometer ?? "",
      Latitude: editData?.Latitude ?? "",
      Longitude: editData?.Longitude ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      Description: Yup.string().required("Required"),
      ProductName: Yup.string().required("Required"),
      Brand: Yup.string(),
      Type: Yup.string().required("Required"),
      Price: Yup.number().required("Required").min(1, "Must be > 0"),
      Finalprice: Yup.number().required("Required").min(0, "Cannot be negative"),
      Location: Yup.object().nullable().required("Location is required"),
      Store: Yup.object().nullable().required("Store is required"),
      Categoryid: Yup.string().required("Category is required"),
      Power: Yup.number()
        .required("Required")
        .min(0, "Min 0")
        .max(10, "Max 10"),
      OfferStartTime: Yup.string().required("Start date & time is required"),
      OfferEndTime: Yup.string()
        .nullable()
        .optional()
        .test("after-start", "End time must be after start time", function (value) {
          const { OfferStartTime } = this.parent;
          if (!value || !OfferStartTime) return true;
          return new Date(value) > new Date(OfferStartTime);
        }),
      // ── NEW: Kilometer / Latitude / Longitude validation ──
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
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let base64Image = editData?.Imageurl || "";

      const sendPayload = async (image) => {
        const selectedCat = categories?.find((c) => c.Categoryid === values.Categoryid);
        const categoryName = selectedCat ? selectedCat.Categoryname : "";
        const payload = {
          Productid: editData?.Productid,
          Description: values.Description,
          Finalprice: values.Finalprice,
          Isactive: values.Isactive,
          ProductName: values.ProductName,
          Price: values.Price,
          Brand: values.Brand,
          Type: values.Type,
          Imageurl: image,
          LocationId: values.Location?.LocationId || "",
          LocationName: values.Location?.Name || "",
          OfferStartTime: values.OfferStartTime,
          OfferEndTime: values.OfferEndTime || null,
          Power: values.Power ?? null,
          Storeid: values.Store?.Storeid || "",
          Categoryid: values.Categoryid,
          Categoryname: categoryName,
          CoupounActive: values.CoupounActive,
          // ── FlashDeal in payload ──
          Flashdeal: values.FlashDeal,
          // ── NEW: Kilometer / Latitude / Longitude in payload ──
          Kilometer: values.Kilometer,
          Latitude: values.Latitude,
          Longitude: values.Longitude,
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

  // ── KEY FIX ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!editData) return;

    // Store
    if (shops?.length && editData.Storeid) {
      const matched = shops.find((s) => s.Storeid === editData.Storeid) || null;
      if (matched && formik.values.Store?.Storeid !== matched.Storeid) {
        formik.setFieldValue("Store", matched);
      }
    }

    // Category
    const catId = editData.Categoryid || editData.CategoryId;
    if (categories?.length && catId) {
      if (formik.values.Categoryid === "") {
        formik.setFieldValue("Categoryid", catId);
      }
    }

    // Location
    if (locationData?.length && editData.Locationid) {
      const matched = locationData.find((l) => l.LocationId === editData.Locationid) || null;
      if (matched && formik.values.Location?.LocationId !== matched.LocationId) {
        formik.setFieldValue("Location", matched);
      }
    }

    // Power
    if (
      editData.Power !== undefined &&
      editData.Power !== null &&
      formik.values.Power === ""
    ) {
      formik.setFieldValue("Power", editData.Power);
    }

    // CoupounActive
    if (editData.CoupounActive !== undefined && editData.CoupounActive !== null) {
      const val = editData.CoupounActive === "true" || editData.CoupounActive === true;
      if (formik.values.CoupounActive !== val) {
        formik.setFieldValue("CoupounActive", val);
      }
    }

    // ── FlashDeal patch ──
    if (editData.FlashDeal !== undefined && editData.FlashDeal !== null) {
      const val = editData.FlashDeal === "true" || editData.FlashDeal === true;
      if (formik.values.FlashDeal !== val) {
        formik.setFieldValue("FlashDeal", val);
      }
    }

    // ── NEW: Kilometer / Latitude / Longitude patch ──
    if (
      editData.Kilometer !== undefined &&
      editData.Kilometer !== null &&
      formik.values.Kilometer === ""
    ) {
      formik.setFieldValue("Kilometer", editData.Kilometer);
    }

    if (
      editData.Latitude !== undefined &&
      editData.Latitude !== null &&
      formik.values.Latitude === ""
    ) {
      formik.setFieldValue("Latitude", editData.Latitude);
    }

    if (
      editData.Longitude !== undefined &&
      editData.Longitude !== null &&
      formik.values.Longitude === ""
    ) {
      formik.setFieldValue("Longitude", editData.Longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops, locationData, editData, categories]);

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
          {/* Isactive switch — unchanged */}
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

          {/* CoupounActive switch — unchanged */}
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
              checked={formik.values.CoupounActive}
              onChange={(e) => formik.setFieldValue("CoupounActive", e.target.checked)}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(255,255,255,0.5)",
                },
              }}
            />
            <Typography sx={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
              {formik.values.CoupounActive ? "Coupon On" : "Coupon Off"}
            </Typography>
          </Box>

          {/* FlashDeal switch */}
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
            <BoltIcon sx={{ color: formik.values.FlashDeal ? "#fbbf24" : "#fff", fontSize: 16, transition: "color 0.2s" }} />
            <Switch
              checked={formik.values.FlashDeal}
              onChange={(e) => formik.setFieldValue("FlashDeal", e.target.checked)}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#fbbf24" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(251,191,36,0.5)",
                },
              }}
            />
            <Typography sx={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
              {formik.values.FlashDeal ? "Flash On" : "Flash Off"}
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

            {/* Row 2: Shop Autocomplete | Power */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Autocomplete
                options={shops || []}
                getOptionLabel={(option) => option?.Storename || ""}
                isOptionEqualToValue={(option, value) => option?.Storeid === value?.Storeid}
                value={formik.values.Store}
                onChange={(_, newValue) => formik.setFieldValue("Store", newValue)}
                onBlur={() => formik.setFieldTouched("Store", true)}
                fullWidth
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <StorefrontIcon sx={{ fontSize: 16, color: "#7c3aed" }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                        {option.Storename}
                      </Typography>
                      {option.Storeid && (
                        <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
                          ID: {option.Storeid}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Shop"
                    placeholder="Search shop..."
                    error={formik.touched.Store && Boolean(formik.errors.Store)}
                    helperText={formik.touched.Store && formik.errors.Store}
                    sx={fieldSx}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <StorefrontIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                PaperComponent={({ children, ...paperProps }) => (
                  <Box
                    {...paperProps}
                    sx={{
                      borderRadius: "14px",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                      mt: 0.5,
                      background: "#fff",
                    }}
                  >
                    {children}
                  </Box>
                )}
              />

              <TextField
                label="Power (0 – 10)"
                name="Power"
                type="number"
                value={formik.values.Power}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Power && Boolean(formik.errors.Power)}
                helperText={formik.touched.Power && formik.errors.Power}
                fullWidth
                sx={fieldSx}
                inputProps={{ min: 0, max: 10 }}
              />
            </Box>

            {/* Row 3: Type | Description */}
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

            {/* Category Autocomplete */}
            <Autocomplete
              options={categories || []}
              getOptionLabel={(option) => option?.Categoryname || ""}
              isOptionEqualToValue={(option, value) => option?.Categoryid === value?.Categoryid}
              value={categories?.find((c) => c.Categoryid === formik.values.Categoryid) || null}
              onChange={(_, newValue) => formik.setFieldValue("Categoryid", newValue?.Categoryid || "")}
              onBlur={() => formik.setFieldTouched("Categoryid", true)}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5 }}
                  key={option.Categoryid}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 16, color: "#7c3aed" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                      {option.Categoryname}
                    </Typography>
                    {option.Categoryid && (
                      <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
                        ID: {option.Categoryid}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Category"
                  placeholder="Search category..."
                  error={formik.touched.Categoryid && Boolean(formik.errors.Categoryid)}
                  helperText={formik.touched.Categoryid && formik.errors.Categoryid}
                  sx={fieldSx}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <CategoryIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              PaperComponent={({ children, ...paperProps }) => (
                <Box
                  {...paperProps}
                  sx={{
                    borderRadius: "14px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    mt: 0.5,
                    background: "#fff",
                  }}
                >
                  {children}
                </Box>
              )}
            />

            {/* Row 4: Location Autocomplete */}
            <Autocomplete
              options={locationData || []}
              getOptionLabel={(option) => option?.Name || ""}
              isOptionEqualToValue={(option, value) => option?.LocationId === value?.LocationId}
              value={formik.values.Location}
              onChange={(_, newValue) => formik.setFieldValue("Location", newValue)}
              onBlur={() => formik.setFieldTouched("Location", true)}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 16, color: "#7c3aed" }} />
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                    {option.Name}
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
                  sx={fieldSx}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              PaperComponent={({ children, ...paperProps }) => (
                <Box
                  {...paperProps}
                  sx={{
                    borderRadius: "14px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    mt: 0.5,
                    background: "#fff",
                  }}
                >
                  {children}
                </Box>
              )}
            />

            {/* ── NEW: Row 4b — Kilometer | Latitude | Longitude ── */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Kilometer"
                name="Kilometer"
                type="number"
                value={formik.values.Kilometer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Kilometer && Boolean(formik.errors.Kilometer)}
                helperText={formik.touched.Kilometer && formik.errors.Kilometer}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MyLocationIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: "any" }}
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
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ step: "any", min: -90, max: 90 }}
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
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ step: "any", min: -180, max: 180 }}
              />
            </Box>

            {/* ── Divider ── */}
            <Divider sx={{ borderColor: "#e2e8f0" }} />
            <Box sx={{ ...sectionLabel, mb: 0 }}>
              <AttachMoneyIcon sx={{ fontSize: 14 }} />
              Pricing Details
            </Box>

            {/* Row 5: Price | Final Price */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Original Price"
                name="Price"
                type="number"
                value={formik.values.Price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                label="Final Price"
                name="Finalprice"
                type="number"
                value={formik.values.Finalprice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Finalprice && Boolean(formik.errors.Finalprice)}
                helperText={formik.touched.Finalprice && formik.errors.Finalprice}
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
            </Box>

            {/* ── Section: Offer Validity ── */}
            <Divider sx={{ borderColor: "#e2e8f0" }} />
            <Box sx={{ ...sectionLabel, mb: 0 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              Offer Validity
            </Box>

            {/* Row 6: Start Time | End Time */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Offer Start Date & Time"
                name="OfferStartTime"
                type="datetime-local"
                value={formik.values.OfferStartTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.OfferStartTime && Boolean(formik.errors.OfferStartTime)}
                helperText={formik.touched.OfferStartTime && formik.errors.OfferStartTime}
                fullWidth
                sx={fieldSx}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  inputProps: { style: { colorScheme: "light" } },
                }}
              />
              <TextField
                label="Offer End Date & Time (Optional)"
                name="OfferEndTime"
                type="datetime-local"
                value={formik.values.OfferEndTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.OfferEndTime && Boolean(formik.errors.OfferEndTime)}
                helperText={
                  formik.touched.OfferEndTime && formik.errors.OfferEndTime
                    ? formik.errors.OfferEndTime
                    : "Leave empty for no expiry"
                }
                fullWidth
                sx={fieldSx}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: formik.values.OfferEndTime ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => formik.setFieldValue("OfferEndTime", "")}
                        sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  inputProps: {
                    min: formik.values.OfferStartTime || undefined,
                    style: { colorScheme: "light" },
                  },
                }}
              />
            </Box>

            {/* Validity duration badge */}
            {formik.values.OfferStartTime &&
              formik.values.OfferEndTime &&
              new Date(formik.values.OfferEndTime) > new Date(formik.values.OfferStartTime) && (
                <Fade in>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                      border: "2px solid #bfdbfe",
                      borderRadius: "14px",
                      px: 3,
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AccessTimeIcon sx={{ color: "#fff", fontSize: 18 }} />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#64748b",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Offer Duration
                        </Typography>
                        <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1e40af" }}>
                          {(() => {
                            const diffMs =
                              new Date(formik.values.OfferEndTime) -
                              new Date(formik.values.OfferStartTime);
                            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                            const diffHrs = Math.floor(
                              (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                            );
                            const diffMins = Math.floor(
                              (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                            );
                            if (diffDays > 0) return `${diffDays}d ${diffHrs}h ${diffMins}m`;
                            if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
                            return `${diffMins} minutes`;
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={
                        <CheckCircleIcon
                          sx={{ fontSize: "14px !important", color: "#fff !important" }}
                        />
                      }
                      label="Valid Period"
                      size="small"
                      sx={{
                        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "11px",
                        "& .MuiChip-icon": { color: "#fff" },
                      }}
                    />
                  </Box>
                </Fade>
              )}

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
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
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
                      <Box
                        className="img-actions"
                        sx={{ opacity: 0, transition: "opacity 0.2s", display: "flex", gap: 1 }}
                      >
                        <Button
                          component="label"
                          variant="contained"
                          size="small"
                          sx={{
                            borderRadius: "10px",
                            background: "#6366f1",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "12px",
                          }}
                        >
                          Change
                          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        <IconButton
                          onClick={removeImage}
                          sx={{
                            background: "#ef4444",
                            color: "#fff",
                            borderRadius: "10px",
                            "&:hover": { background: "#dc2626" },
                          }}
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
                      label="Image uploaded"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
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