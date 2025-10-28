import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";

// 🌈 Lucide React Icons
import {
  Clock,
  CheckCircle2,
  Printer,
  QrCode,
  Barcode as BarcodeIcon,
  X,
} from "lucide-react";

// ---------- Dummy Data ----------
const dummyData = [
  {
    partNumber: "4515138201",
    mpn: "XIHEECNASF-12.000000MHZ",
    batchNo: "118,250900019-001",
    dateCode: "2534",
    quantity: "65000",
    poNo: "BEPO/EP/4100162120",
    oemMake: "TAITIEN",
    manufacture: "CHINA",
    grNo: "",
    grDate: "",
    receiptNo: "",
  },
  {
    partNumber: "7896541230",
    mpn: "ABCTEMP-16.000000MHZ",
    batchNo: "220,240200011-002",
    dateCode: "2512",
    quantity: "12000",
    poNo: "BEPO/EP/4100161001",
    oemMake: "EPSON",
    manufacture: "JAPAN",
    grNo: "15500",
    grDate: "28/10/2025",
    receiptNo: "457",
  },
];

// ---------- Field Labels ----------
const FIELD_LABELS = {
  partNumber: "Part Number",
  mpn: "MPN",
  batchNo: "Batch/Lot No",
  dateCode: "Date Code",
  quantity: "Quantity",
  poNo: "PO No",
  oemMake: "OEM/Make",
  manufacture: "Manufacture",
  grNo: "GR No",
  grDate: "GR Date",
  receiptNo: "Receipt No",
};

export default function GrTable() {
  const [tab, setTab] = useState(0);
  const [pendingRows, setPendingRows] = useState([]);
  const [successRows, setSuccessRows] = useState([]);
  const [showQR, setShowQR] = useState(null);
  const [showBarcode, setShowBarcode] = useState(null);
  const [reprintPartNo, setReprintPartNo] = useState("");

  // Initialize data
  useEffect(() => {
    const pending = dummyData.filter(
      (r) => !r.grNo || !r.grDate || !r.receiptNo
    );
    const success = dummyData.filter(
      (r) => r.grNo && r.grDate && r.receiptNo
    );
    setPendingRows(pending);
    setSuccessRows(success);
  }, []);

  const handleEdit = (idx, field, value) => {
    const updated = pendingRows.map((r, i) =>
      i === idx ? { ...r, [field]: value } : r
    );
    setPendingRows(updated);
  };

  const isFilled = (r) => r.grNo && r.grDate && r.receiptNo;

  const TAB_COLORS = ["#f44336", "#4caf50", "#1e88e5"];
  const TAB_ICONS = [Clock, CheckCircle2, Printer];

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fce4ec 0%, #e3f2fd 100%)",
      }}
    >
      <Card
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff, #fafafa)",
          boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          centered
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: TAB_COLORS[tab] },
            "& .Mui-selected": { color: TAB_COLORS[tab] + "!important" },
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {["Pending", "Success", "Reprint"].map((label, index) => {
            const Icon = TAB_ICONS[index];
            return (
              <Tab
                key={label}
                icon={<Icon size={18} />}
                iconPosition="start"
                label={label}
              />
            );
          })}
        </Tabs>

        {/* ---------- PENDING TABLE ---------- */}
        {tab === 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                mb: 1,
                color: "#d32f2f",
                fontWeight: "bold",
              }}
            >
              Pending GR Entries
            </Typography>
            <Table
              component={Paper}
              sx={{
                "& td, & th": { fontSize: 13 },
                backgroundColor: "#fff5f5",
                borderRadius: 3,
              }}
            >
              <TableHead sx={{ backgroundColor: "#ffcdd2" }}>
                <TableRow>
                  {Object.values(FIELD_LABELS).map((label) => (
                    <TableCell key={label} sx={{ fontWeight: "bold" }}>
                      {label}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#ffeaea",
                        transition: "0.3s",
                      },
                    }}
                  >
                    {Object.keys(FIELD_LABELS).map((field) => (
                      <TableCell key={field}>
                        {["grNo", "grDate", "receiptNo"].includes(field) ? (
                          <TextField
                            size="small"
                            value={row[field]}
                            onChange={(e) =>
                              handleEdit(idx, field, e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          <TextField
                            size="small"
                            value={row[field]}
                            InputProps={{ readOnly: true }}
                            fullWidth
                          />
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        startIcon={<QrCode size={18} />}
                        sx={{
                          backgroundColor: "#e53935",
                          "&:hover": { backgroundColor: "#c62828" },
                          borderRadius: 3,
                        }}
                        disabled={!isFilled(row)}
                        onClick={() => setShowQR(row)}
                      >
                        QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {/* ---------- SUCCESS TABLE ---------- */}
        {tab === 1 && (
          <>
            <Typography
              variant="h6"
              sx={{ mt: 2, mb: 1, color: "#388e3c", fontWeight: "bold" }}
            >
              Successful GR Entries
            </Typography>
            <Table
              component={Paper}
              sx={{
                "& td, & th": { fontSize: 13 },
                backgroundColor: "#f1f8e9",
                borderRadius: 3,
              }}
            >
              <TableHead sx={{ backgroundColor: "#c8e6c9" }}>
                <TableRow>
                  {Object.values(FIELD_LABELS).map((label) => (
                    <TableCell key={label} sx={{ fontWeight: "bold" }}>
                      {label}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {successRows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      "&:hover": { backgroundColor: "#dcedc8" },
                    }}
                  >
                    {Object.keys(FIELD_LABELS).map((field) => (
                      <TableCell key={field}>{row[field]}</TableCell>
                    ))}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<QrCode size={18} />}
                        onClick={() => setShowQR(row)}
                        sx={{ borderRadius: 3 }}
                      >
                        QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {/* ---------- REPRINT TAB ---------- */}
        {tab === 2 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mt={4}
          >
            <TextField
              label="Enter Part Number"
              value={reprintPartNo}
              onChange={(e) => setReprintPartNo(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<QrCode size={18} />}
              sx={{
                backgroundColor: "#1e88e5",
                borderRadius: 3,
              }}
              disabled={!reprintPartNo}
              onClick={() => setShowQR({ partNumber: reprintPartNo })}
            >
              Generate QR
            </Button>
            <Button
              variant="contained"
              startIcon={<BarcodeIcon size={18} />}
              sx={{
                backgroundColor: "#3949ab",
                borderRadius: 3,
              }}
              disabled={!reprintPartNo}
              onClick={() => setShowBarcode(reprintPartNo)}
            >
              Generate Barcode
            </Button>
          </Box>
        )}
      </Card>

      {/* ---------- QR DIALOG ---------- */}
      <Dialog open={!!showQR} onClose={() => setShowQR(null)}>
        <DialogTitle>
          QR Code
          <IconButton
            onClick={() => setShowQR(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          {showQR && <QRCodeSVG value={JSON.stringify(showQR)} size={200} />}
        </DialogContent>
      </Dialog>

      {/* ---------- BARCODE DIALOG ---------- */}
      <Dialog open={!!showBarcode} onClose={() => setShowBarcode(null)}>
        <DialogTitle>
          Barcode
          <IconButton
            onClick={() => setShowBarcode(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          {showBarcode && (
            <Barcode value={showBarcode} width={2} height={80} displayValue />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
