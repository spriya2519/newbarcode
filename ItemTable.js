import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import Barcode from "react-barcode";

export default function ItemTable({ user }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/items", {
          params: { name: user.name, staffNo: user.staffNo, date: user.date },
        });
        setParts(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user]);

  const updatePart = async (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    setParts(updated);

    const row = updated[index];
    if (field === "comment" || field === "accepted") {
      if (row.comment && row.accepted !== null) {
        try {
          await axios.post("http://127.0.0.1:8000/update_item", {
            partno: row.partno,
            comment: row.comment,
            accepted: row.accepted,
            staffNo: user.staffNo,
          });
        } catch (err) {
          console.error("Error saving comment:", err);
        }
      }
    }
  };

  const generateBarcodeValue = (row) =>
    `${row.partno}-${row.gr_no}-${row.accepted ? "ACCEPTED" : "REJECTED"}`;

  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography mt={2}>Loading items...</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: "90%",
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f9fafb",
        boxShadow: 3,
      }}
    >
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Item Verification
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.name} — {user.staffNo} — {user.date}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
            <TableRow>
              <TableCell>Part No</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>GR No</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Barcode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <TextField
                    size="small"
                    value={row.partno}
                    onChange={(e) => updatePart(idx, "partno", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={row.desc}
                    onChange={(e) => updatePart(idx, "desc", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.qty}
                    onChange={(e) => updatePart(idx, "qty", e.target.value)}
                    sx={{ width: "70px" }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={row.gr_no}
                    onChange={(e) => updatePart(idx, "gr_no", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    multiline
                    placeholder="Add comment..."
                    value={row.comment}
                    onChange={(e) => updatePart(idx, "comment", e.target.value)}
                    sx={{ width: 180 }}
                  />
                </TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={
                      row.accepted === true
                        ? "accept"
                        : row.accepted === false
                        ? "reject"
                        : ""
                    }
                    onChange={(e) =>
                      updatePart(
                        idx,
                        "accepted",
                        e.target.value === "accept" ? true : false
                      )
                    }
                  >
                    <FormControlLabel
                      value="accept"
                      control={<Radio color="success" />}
                      label="Accept"
                    />
                    <FormControlLabel
                      value="reject"
                      control={<Radio color="error" />}
                      label="Reject"
                    />
                  </RadioGroup>
                </TableCell>
                <TableCell>
                  {row.comment && row.accepted !== null && (
                    <Barcode
                      value={generateBarcodeValue(row)}
                      format="CODE128"
                      width={1.4}
                      height={50}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
