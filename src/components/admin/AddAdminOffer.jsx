import React from "react";
import { useDispatch } from "react-redux";
import {
  postAdminOffers,
  getAdminOffers,
} from "@/app/features/adminPanel/adminPanelSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddAdminOffers = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      Description: "",
      Finalprice: "",
      Isactive: "true",
      ProductName: "",
      Price: "",
      Discount: "",
      Brand: "",
      Type: "",
      Imagefile: null,
    },
    validationSchema: Yup.object({
      Description: Yup.string().required("Required"),
      Finalprice: Yup.number().required("Required"),
      ProductName: Yup.string().required("Required"),
      Price: Yup.number().required("Required"),
      Discount: Yup.number().required("Required"),
      Brand: Yup.string().required("Required"),
      Type: Yup.string().required("Required"),
      Imagefile: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();

      formData.append("Description", values.Description);
      formData.append("Finalprice", values.Finalprice);
      formData.append("Isactive", values.Isactive);
      formData.append("ProductName", values.ProductName);
      formData.append("Price", values.Price);
      formData.append("Discount", values.Discount);
      formData.append("Brand", values.Brand);
      formData.append("Type", values.Type);

      if (values.Imagefile) {
        formData.append("Imagefile", values.Imagefile);
      }


      console.log("formData" , formData)
      await dispatch(postAdminOffers(formData));
      await dispatch(getAdminOffers());

      resetForm();
      handleClose();
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">

      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Create Admin Offer

        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>

            <TextField
              label="Product Name"
              name="ProductName"
              value={formik.values.ProductName}
              onChange={formik.handleChange}
              error={formik.touched.ProductName && Boolean(formik.errors.ProductName)}
              helperText={formik.touched.ProductName && formik.errors.ProductName}
              fullWidth
            />

            <TextField
              label="Brand"
              name="Brand"
              value={formik.values.Brand}
              onChange={formik.handleChange}
              error={formik.touched.Brand && Boolean(formik.errors.Brand)}
              helperText={formik.touched.Brand && formik.errors.Brand}
              fullWidth
            />

            <TextField
              label="Type"
              name="Type"
              value={formik.values.Type}
              onChange={formik.handleChange}
              error={formik.touched.Type && Boolean(formik.errors.Type)}
              helperText={formik.touched.Type && formik.errors.Type}
              fullWidth
            />

            <TextField
              label="Price"
              name="Price"
              type="number"
              value={formik.values.Price}
              onChange={formik.handleChange}
              error={formik.touched.Price && Boolean(formik.errors.Price)}
              helperText={formik.touched.Price && formik.errors.Price}
              fullWidth
            />

            <TextField
              label="Final Price"
              name="Finalprice"
              type="number"
              value={formik.values.Finalprice}
              onChange={formik.handleChange}
              error={formik.touched.Finalprice && Boolean(formik.errors.Finalprice)}
              helperText={formik.touched.Finalprice && formik.errors.Finalprice}
              fullWidth
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
            />

            <TextField
              label="Description"
              name="Description"
              multiline
              rows={3}
              value={formik.values.Description}
              onChange={formik.handleChange}
              error={formik.touched.Description && Boolean(formik.errors.Description)}
              helperText={formik.touched.Description && formik.errors.Description}
              fullWidth
            />

            {/* Upload Button */}
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("Imagefile", file);
                }}
              />
            </Button>

            {formik.errors.Imagefile && formik.touched.Imagefile && (
              <Box color="error.main">{formik.errors.Imagefile}</Box>
            )}

            {/* Image Preview */}
            {formik.values.Imagefile && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(formik.values.Imagefile)}
                  alt="preview"
                  width="100%"
                  style={{ maxHeight: 200, objectFit: "contain" }}
                />
              </Box>
            )}

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAdminOffers;
