import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Box
} from "@mui/material";

export default function QRReaderComponent() {
  const [data, setData] = useState(null);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>QR Code Reader</Typography>

      <Box sx={{ width: "100%", maxWidth: 320, margin: "auto" }}>
        
        <QrReader
  constraints={{ facingMode: "user" }}
  onResult={(result, error) => {
    if (!!result) {
      try {
        const parsed = JSON.parse(result.text);
        setData(parsed);
      } catch {
        setData({ text: result.text });
      }
    }
  }}
  style={{ width: "100%" }}
/>

      </Box>

      <Box mt={3}>
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
          <Typography variant="body2" color="text.secondary">
            Scan a QR to view details.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
