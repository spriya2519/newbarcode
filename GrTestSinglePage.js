// GrTestFinal.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Stack,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { QRCodeSVG } from "qrcode.react";

/*
  Dummy dataset (3 rows) — you can replace/fetch from API later
*/
const dummyData = [
  {
    partNumber: "7896541230",
    mpn: "ABCTEMP-16.000000MHZ",
    batchNo: "220,240200011-002",
    quantity: 12000,
    poNo: "BEPO/EP/4100161001",
  },
  {
    partNumber: "1234567890",
    mpn: "XYZTEMP-8.000000MHZ",
    batchNo: "120,240200011-005",
    quantity: 5000,
    poNo: "BEPO/EP/4100161002",
  },
  {
    partNumber: "9876543210",
    mpn: "LMNTEMP-12.000000MHZ",
    batchNo: "320,240200011-003",
    quantity: 8000,
    poNo: "BEPO/EP/4100161003",
  },
];

export default function GrTestFinal() {
  // selection
  const [selectedIndex, setSelectedIndex] = useState(null);

  // testing state
  const [mode, setMode] = useState("all"); // 'all' or 'sample'
  const [percent, setPercent] = useState(10); // sampling %
  const [sampleQty, setSampleQty] = useState(0);

  // accepted / rejected in sampling context
  const [accepted, setAccepted] = useState(""); // number or empty
  const [rejected, setRejected] = useState(""); // computed

  // errors
  const [errorMsg, setErrorMsg] = useState("");

  // QR dialog state
  const [openDialog, setOpenDialog] = useState(null); // 'accepted'|'rejected'|null
  const [qrPayload, setQrPayload] = useState("");

  // update sampleQty when mode / percent / selection changes
  useEffect(() => {
    if (selectedIndex === null) {
      setSampleQty(0);
      setAccepted("");
      setRejected("");
      setErrorMsg("");
      return;
    }

    const total = Number(dummyData[selectedIndex].quantity || 0);

    if (mode === "all") {
      setSampleQty(total);
      setAccepted(String(total));
      setRejected("0");
      setErrorMsg("");
    } else {
      // sampling
      const p = Math.max(0, Math.min(100, Number(percent || 0)));
      const s = Math.round((total * p) / 100);
      setSampleQty(s);

      // reset accepted/rejected (user will input accepted)
      setAccepted("");
      setRejected("");
      setErrorMsg("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, percent, selectedIndex]);

  // when accepted changes in sampling, auto calc rejected and validate
  useEffect(() => {
    if (selectedIndex === null) return;

    const total = Number(dummyData[selectedIndex].quantity || 0);

    if (mode === "all") {
      // already handled
      setErrorMsg("");
      return;
    }

    // in sampling, accepted must be 0..sampleQty
    const acc = accepted === "" ? "" : Number(accepted);
    if (accepted === "") {
      setRejected("");
      setErrorMsg("");
      return;
    }
    if (isNaN(acc) || acc < 0) {
      setErrorMsg("Accepted must be a non-negative number.");
      setRejected("");
      return;
    }
    if (acc > sampleQty) {
      setErrorMsg(`Accepted cannot exceed sample quantity (${sampleQty}).`);
      setRejected("");
      return;
    }
    // valid
    setErrorMsg("");
    setRejected(String(sampleQty - acc));
  }, [accepted, sampleQty, mode, selectedIndex]);

  // helper: build readable QR payload (Key: Value lines)
  function buildPayload(resultType) {
    if (selectedIndex === null) return "";
    const row = dummyData[selectedIndex];
    const payloadObj = {
      partNumber: row.partNumber,
      mpn: row.mpn,
      batchNo: row.batchNo,
      totalQuantity: String(row.quantity),
      testingMode: mode === "all" ? "ACCEPT ALL" : `SAMPLING (${percent}%)`,
      sampleQuantity: String(sampleQty),
      result: resultType === "accepted" ? "ACCEPTED" : "REJECTED",
      acceptedQuantity: resultType === "accepted" ? String(accepted || (mode === "all" ? row.quantity : "")) : "0",
      rejectedQuantity: resultType === "rejected" ? String(rejected || (mode === "all" ? 0 : "")) : "0",
      poNo: row.poNo,
    };

    return Object.entries(payloadObj).map(([k, v]) => `${k}: ${v}`).join("\n");
  }

  // open dialog for accepted or rejected
  function handleOpenDialog(type) {
    // validation before open:
    if (selectedIndex === null) return;
    const row = dummyData[selectedIndex];
    const total = Number(row.quantity);
    if (mode === "all") {
      // ok
      setAccepted(String(total));
      setRejected("0");
    } else {
      // sampling — accepted must be a number and <= sampleQty
      const acc = accepted === "" ? NaN : Number(accepted);
      if (isNaN(acc)) {
        setErrorMsg("Please enter accepted quantity for the sample.");
        return;
      }
      if (acc < 0 || acc > sampleQty) {
        setErrorMsg(`Accepted must be between 0 and sample quantity (${sampleQty}).`);
        return;
      }
    }

    const payload = buildPayload(type);
    setQrPayload(payload);
    setOpenDialog(type);
  }

  function handleCloseDialog() {
    setOpenDialog(null);
    setQrPayload("");
  }

  // checkbox selection handler (only one allowed at a time)
  function toggleSelect(idx) {
    if (selectedIndex === idx) {
      setSelectedIndex(null);
      setMode("all");
      setPercent(10);
      setAccepted("");
      setRejected("");
      setErrorMsg("");
      setQrPayload("");
    } else {
      setSelectedIndex(idx);
      setMode("all");
      setPercent(10);
      setAccepted("");
      setRejected("");
      setErrorMsg("");
      setQrPayload("");
    }
  }

  // small UI helpers
  const selectedRow = selectedIndex === null ? null : dummyData[selectedIndex];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f7f9fc 0%,#e8f1f8 100%)",
        p: { xs: 2, md: 4 },
      }}
    >
      <Card
        sx={{
          maxWidth: 1160,
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: "linear-gradient(90deg,#1565c0,#43a047)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GR Testing & QR Generator
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Select a row from the list below, perform testing, then view QR for accepted/rejected result.
          </Typography>

          {/* MAIN TABLE */}
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            GR List
          </Typography>

          <Paper elevation={2} sx={{ overflowX: "auto", mb: 3 }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ background: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Select</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Part No</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>MPN</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Batch No</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Quantity</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>PO No</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dummyData.map((r, i) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{
                      backgroundColor: selectedIndex === i ? "rgba(33,150,243,0.06)" : "transparent",
                    }}
                  >
                    <TableCell>
                      <Checkbox checked={selectedIndex === i} onChange={() => toggleSelect(i)} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{r.partNumber}</TableCell>
                    <TableCell>{r.mpn}</TableCell>
                    <TableCell>{r.batchNo}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{r.quantity}</TableCell>
                    <TableCell>{r.poNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* SECOND: Selected Row (important fields only) */}
          {selectedRow ? (
            <>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                Selected Item (Important Details)
              </Typography>

              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={9}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Part No
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>{selectedRow.partNumber}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          MPN
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>{selectedRow.mpn}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Batch No
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>{selectedRow.batchNo}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Qty
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 20,
                          color: "#0b8043",
                          background: "#e8f5e9",
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {selectedRow.quantity}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Testing options */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Testing Options
                </Typography>

                <RadioGroup
                  row
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value);
                    setErrorMsg("");
                  }}
                >
                  <FormControlLabel value="all" control={<Radio color="success" />} label="Accept All" />
                  <FormControlLabel value="sample" control={<Radio color="primary" />} label="Sampling" />
                </RadioGroup>

                {mode === "sample" && (
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mt: 2 }}>
                    <TextField
                      label="Sampling %"
                      type="number"
                      value={percent}
                      onChange={(e) => {
                        const v = e.target.value === "" ? "" : Number(e.target.value);
                        setPercent(v);
                      }}
                      helperText="Percent of total quantity to sample (0–100)"
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Sample Qty:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {sampleQty}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* If sampling allow accepted input (accepted <= sampleQty) */}
                {mode === "sample" && (
                  <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <TextField
                      label="Accepted (within sample)"
                      type="number"
                      value={accepted}
                      onChange={(e) => setAccepted(e.target.value === "" ? "" : Number(e.target.value))}
                      size="small"
                      helperText={`Enter accepted qty (0 - ${sampleQty})`}
                    />
                    <TextField
                      label="Rejected (auto)"
                      value={rejected}
                      size="small"
                      disabled
                      helperText="Rejected = sampleQty − accepted"
                    />
                  </Box>
                )}

                {/* If accept all show fixed accepted/rejected */}
                {mode === "all" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography>
                      <strong>Accepted:</strong> {selectedRow.quantity} &nbsp;&nbsp;
                      <strong>Rejected:</strong> 0
                    </Typography>
                  </Box>
                )}

                {/* validation */}
                {errorMsg && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="error">{errorMsg}</Alert>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!selectedRow || (mode === "sample" && (accepted === "" || Number(accepted) < 0 || Number(accepted) > sampleQty))}
                    onClick={() => handleOpenDialog("accepted")}
                  >
                    View Accepted QR
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    disabled={!selectedRow || (mode === "sample" && (accepted === "" || Number(accepted) < 0 || Number(accepted) > sampleQty))}
                    onClick={() => handleOpenDialog("rejected")}
                  >
                    View Rejected QR
                  </Button>
                </Box>
              </Paper>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select a row from the GR list to start testing.
            </Typography>
          )}

          {/* QR Dialog */}
          <Dialog open={Boolean(openDialog)} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 700 }}>
              {openDialog === "accepted" ? "Accepted QR" : "Rejected QR"}
              <IconButton onClick={handleCloseDialog} sx={{ position: "absolute", right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center", pb: 4 }}>
              <Box sx={{ mb: 2 }}>
                <QRCodeSVG value={qrPayload} size={220} />
              </Box>
              <Paper elevation={1} sx={{ p: 2, textAlign: "left", whiteSpace: "pre-line" }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Scannable payload (Key: Value)
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {qrPayload}
                </Typography>
              </Paper>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}
