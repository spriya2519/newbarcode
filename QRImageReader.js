import React, { useState } from "react";
import jsQR from "jsqr";
import {
  Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button
} from "@mui/material";

export default function QRImageReader() {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      setPreview(image.src);

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        const qrCode = jsQR(imageData.data, image.width, image.height);
        if (qrCode) {
          try {
            const parsed = JSON.parse(qrCode.data);
            setData(parsed);
          } catch {
            setData({ text: qrCode.data });
          }
        } else {
          alert("No QR code detected. Try a clearer image.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>QR Reader (From Image)</Typography>

      <Box textAlign="center" mb={2}>
        <Button variant="contained" component="label">
          Upload QR Image
          <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
        </Button>
      </Box>

      {preview && (
        <Box textAlign="center" mb={2}>
          <img
            src={preview}
            alt="QR Preview"
            style={{ width: 200, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </Box>
      )}

      {data ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Field</b></TableCell>
                <TableCell><b>Value</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Upload an image containing a QR code to view details.
        </Typography>
      )}
    </Paper>
  );
}
