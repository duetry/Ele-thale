import React, { useState } from "react";
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
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddAdminOffers = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      Description: editData?.Description || "",
      Finalprice: editData?.Finalprice || "",
      Isactive: editData?.Isactive || "true",
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
      Finalprice: Yup.number().required("Required"),
      ProductName: Yup.string().required("Required"),
      Price: Yup.number().required("Required"),
      Discount: Yup.number().required("Required"),
      Brand: Yup.string().required("Required"),
      Type: Yup.string().required("Required"),
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

        await dispatch(postAdminOffers(payload));
        await dispatch(getAdminOffers());

        setLoading(false);
        resetForm();
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"   // 👈 Increased width
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {editData ? "Edit Offer" : "Create Offer"}

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
              fullWidth
            />

            <TextField
              label="Type"
              name="Type"
              value={formik.values.Type}
              onChange={formik.handleChange}
              fullWidth
            />

            <TextField
              label="Price"
              name="Price"
              type="number"
              value={formik.values.Price}
              onChange={formik.handleChange}
              fullWidth
            />

            <TextField
              label="Final Price"
              name="Finalprice"
              type="number"
              value={formik.values.Finalprice}
              onChange={formik.handleChange}
              fullWidth
            />

            <TextField
              label="Discount"
              name="Discount"
              type="number"
              value={formik.values.Discount}
              onChange={formik.handleChange}
              fullWidth
            />

            <TextField
              label="Description"
              name="Description"
              multiline
              rows={3}
              value={formik.values.Description}
              onChange={formik.handleChange}
              fullWidth
            />

            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  formik.setFieldValue("Imagefile", e.target.files[0])
                }
              />
            </Button>

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
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
          >
            {editData ? "Update" : "Submit"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAdminOffers;
