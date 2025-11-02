// // GrTestV2.jsx
// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Checkbox,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     Divider,
//     Grid,
//     IconButton,
//     FormGroup,
//     TableContainer,
//     Paper,
//     Radio,
//     RadioGroup,
//     FormControlLabel,
//     Stack,
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     TextField,
//     Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { QRCodeSVG } from "qrcode.react";

// /*
//   GrTestV2
//   - Shows 4 filter buttons
//   - Table with dummyData (status: pending/completed/rejected)
//   - Row select fills the "inspection form" on the right (layout inspired by uploaded photos)
//   - Sampling % -> sample qty auto-calc
//   - 2nd form area (simple inspection report)
//   - Accept QR / Reject QR -> show horizontal QR card (green/red) with payload
// */

// // Dummy dataset (three rows). Each row has a `status` field.
// const dummyData = [
//     {
//         id: 1,
//         partNumber: "7896541230",
//         mpn: "ABCTEMP-16.000000MHZ",
//         batchNo: "220240200011-002",
//         quantity: 12000,
//         poNo: "BEPO/EP/4100161001",
//         status: "pending",
//     },
//     {
//         id: 2,
//         partNumber: "1234567990",
//         mpn: "XYZTEMP-8.000000MHZ",
//         batchNo: "220240200011-005",
//         quantity: 5000,
//         poNo: "BEPO/EP/4100161002",
//         status: "completed",
//     },
//     {
//         id: 3,
//         partNumber: "9876543210",
//         mpn: "LMNTEMP-12.000000MHZ",
//         batchNo: "320240200011-003",
//         quantity: 8000,
//         poNo: "BEPO/EP/4100161003",
//         status: "rejected",
//     },
// ];

// export default function GrTestV2() {
//     // filter (pending/completed/rejected/total)
//     const [filter, setFilter] = useState("pending");

//     // table selection (single select)
//     const [selectedId, setSelectedId] = useState(null);

//     // form state (inspection form - left / main)
//     const [form, setForm] = useState({
//         partNumber: "",
//         mpn: "",
//         batchNo: "",
//         poNo: "",
//         totalQty: 0,
//         samplingPercent: 10,
//         sampleQty: 0,
//         acceptedInSample: "",
//         rejectedInSample: "",
//         inspectedBy: "",
//         date: "",
//         signature: "",
//     });

//     // second form (inspection report) - simplified
//     const [report, setReport] = useState({
//         controlNo: "",
//         vendor: "",
//         remarks: "",
//     });

//     // QR dialog state
//     const [qrOpen, setQrOpen] = useState(false);
//     const [qrType, setQrType] = useState(null); // "accept" | "reject"
//     const [qrPayload, setQrPayload] = useState("");

//     // update list based on filter
//     const filteredData = dummyData.filter((d) => (filter === "total" ? true : d.status === filter));

//     // when selectedId changes populate form
//     useEffect(() => {
//         if (selectedId == null) {
//             // reset
//             setForm((f) => ({
//                 ...f,
//                 partNumber: "",
//                 mpn: "",
//                 batchNo: "",
//                 poNo: "",
//                 totalQty: 0,
//                 sampleQty: 0,
//                 samplingPercent: 10,
//                 acceptedInSample: "",
//                 rejectedInSample: "",
//             }));
//             return;
//         }
//         const row = dummyData.find((r) => r.id === selectedId);
//         if (!row) return;
//         setForm((f) => ({
//             ...f,
//             partNumber: row.partNumber,
//             mpn: row.mpn,
//             batchNo: row.batchNo,
//             poNo: row.poNo,
//             totalQty: row.quantity,
//             samplingPercent: 10,
//             sampleQty: Math.round((row.quantity * 10) / 100),
//             acceptedInSample: "",
//             rejectedInSample: "",
//         }));
//     }, [selectedId]);

//     // recalc sample qty when samplingPercent or totalQty changes
//     useEffect(() => {
//         const p = Number(form.samplingPercent || 0);
//         const total = Number(form.totalQty || 0);
//         if (isNaN(p) || p < 0) return;
//         const s = Math.round((total * Math.max(0, Math.min(100, p))) / 100);
//         setForm((f) => ({ ...f, sampleQty: s }));
//     }, [form.samplingPercent, form.totalQty]);

//     // when acceptedInSample changes recalc rejectedInSample
//     useEffect(() => {
//         const acc = form.acceptedInSample === "" ? null : Number(form.acceptedInSample);
//         if (acc === null || isNaN(acc)) {
//             setForm((f) => ({ ...f, rejectedInSample: "" }));
//             return;
//         }
//         const rej = Number(form.sampleQty) - acc;
//         setForm((f) => ({ ...f, rejectedInSample: String(rej >= 0 ? rej : 0) }));
//     }, [form.acceptedInSample, form.sampleQty]);

//     // helper: create QR payload as multiline text
//     function buildQrPayload(type) {
//         const payload = {
//             result: type === "accept" ? "ACCEPTED" : "REJECTED",
//             partNumber: form.partNumber,
//             mpn: form.mpn,
//             batchNo: form.batchNo,
//             poNo: form.poNo,
//             totalQuantity: form.totalQty,
//             samplingPercent: form.samplingPercent,
//             sampleQty: form.sampleQty,
//             acceptedInSample: form.acceptedInSample || (type === "accept" && form.totalQty) || 0,
//             rejectedInSample: form.rejectedInSample || (type === "reject" && form.totalQty) || 0,
//             inspectedBy: form.inspectedBy,
//             date: form.date,
//             signature: form.signature,
//             controlNo: report.controlNo,
//             vendor: report.vendor,
//             remarks: report.remarks,
//         };

//         return Object.entries(payload)
//             .map(([k, v]) => `${k}: ${v}`)
//             .join("\n");
//     }

//     // validation before QR
//     function validateBeforeQr() {
//         if (!form.partNumber) return "Select a row first.";
//         if (form.totalQty <= 0) return "Invalid total quantity.";
//         if (!form.inspectedBy) return "Enter 'Inspected By' in the form.";
//         if (!form.date) return "Enter Date.";
//         // if sampling, acceptedInSample must be within range (or we allow empty for 'accept all' behavior)
//         const acc = form.acceptedInSample === "" ? null : Number(form.acceptedInSample);
//         if (form.sampleQty > 0 && acc !== null) {
//             if (isNaN(acc) || acc < 0 || acc > form.sampleQty) {
//                 return `Accepted must be between 0 and ${form.sampleQty}`;
//             }
//         }
//         return null;
//     }

//     function handleOpenQr(type) {
//         const err = validateBeforeQr();
//         if (err) {
//             alert(err);
//             return;
//         }
//         setQrType(type);
//         const payload = buildQrPayload(type);
//         setQrPayload(payload);
//         setQrOpen(true);
//     }

//     function handleCloseQr() {
//         setQrOpen(false);
//         setQrPayload("");
//         setQrType(null);
//     }

//     // simple UI pieces
//     const FilterButton = ({ value, label, color }) => (
//         <Button
//             variant={filter === value ? "contained" : "outlined"}
//             onClick={() => setFilter(value)}
//             sx={{
//                 mr: 1,
//                 textTransform: "none",
//                 minWidth: 160,
//                 background: filter === value ? undefined : "transparent",
//             }}
//         >
//             {label}
//         </Button>
//     );

//     // 
//     const [checks, setChecks] = useState({
//         vendorDim: "",
//         visual: "",
//         rawMat: "",
//         rawMatReport: "",
//     });

//     const handleCheck = (name, value) => {
//         setChecks({ ...checks, [name]: value });
//     };

//     const renderCheckboxGroup = (name, options) => (
//         <FormGroup row sx={{ justifyContent: "space-evenly" }}>
//             {options.map((opt) => (
//                 <FormControlLabel
//                     key={opt}
//                     control={
//                         <Checkbox
//                             checked={checks[name] === opt}
//                             onChange={() => handleCheck(name, opt)}
//                         />
//                     }
//                     label={opt}
//                 />
//             ))}
//         </FormGroup>
//     );
//     // 
//     const rows = Array.from({ length: 10 }, (_, i) => ({
//         slno: i + 1,
//         instrument: "",
//         basicDimension: "",
//         min: "",
//         max: "",
//         observed: ["", "", "", "", ""],
//     }));
//     return (
//         <Box sx={{ p: 3, minHeight: "100vh", background: "#f4f6f9" }}>
//             <Card sx={{ maxWidth: 1200, mx: "auto", borderRadius: 3 }}>
//                 <CardContent>
//                     <Typography variant="h5" align="center" sx={{ fontWeight: 800, mb: 2 }}>
//                         Inspection Dashboard
//                     </Typography>

//                     {/* Top filter buttons */}
//                     <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
//                         <FilterButton value="pending" label="INSPECTION PENDING" />
//                         <FilterButton value="completed" label="INSPECTION COMPLETED" />
//                         <FilterButton value="rejected" label="REJECTED" />
//                         <FilterButton value="total" label="TOTAL" />
//                     </Stack>

//                     <Grid container spacing={2}>
//                         {/* LEFT: Table */}
//                         <Grid item xs={12} md={7}>
//                             <Paper sx={{ p: 2, mb: 2 }}>
//                                 <Typography variant="h6" sx={{ mb: 1 }}>
//                                     GR List
//                                 </Typography>

//                                 <Table size="small">
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell>Select</TableCell>
//                                             <TableCell>Part No</TableCell>
//                                             <TableCell>MPN</TableCell>
//                                             <TableCell>Batch No</TableCell>
//                                             <TableCell align="right">Quantity</TableCell>
//                                             <TableCell>Status</TableCell>
//                                         </TableRow>
//                                     </TableHead>

//                                     <TableBody>
//                                         {filteredData.map((r) => (
//                                             <TableRow
//                                                 key={r.id}
//                                                 hover
//                                                 selected={selectedId === r.id}
//                                                 sx={{ cursor: "pointer" }}
//                                                 onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
//                                             >
//                                                 <TableCell padding="checkbox">
//                                                     <Checkbox checked={selectedId === r.id} />
//                                                 </TableCell>
//                                                 <TableCell sx={{ fontWeight: 600 }}>{r.partNumber}</TableCell>
//                                                 <TableCell>{r.mpn}</TableCell>
//                                                 <TableCell>{r.batchNo}</TableCell>
//                                                 <TableCell align="right" sx={{ fontWeight: 700 }}>
//                                                     {r.quantity}
//                                                 </TableCell>
//                                                 <TableCell>{r.status}</TableCell>
//                                             </TableRow>
//                                         ))}
//                                         {filteredData.length === 0 && (
//                                             <TableRow>
//                                                 <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                                                     No items in this category.
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </Paper>

//                             {/* second form area (inspection report) - simplified "pic1" */}
//                             <Paper sx={{ p: 2 }}>
//                                 <Box p={2} sx={{ backgroundColor: "#fafafa" }}>
//                                     <Typography
//                                         variant="h6"
//                                         align="center"
//                                         sx={{ fontWeight: "bold", textDecoration: "underline", mb: 1 }}
//                                     >
//                                         SUB CONTRACTOR INSPECTION - MCE DIVISION
//                                     </Typography>
//                                     <Typography
//                                         variant="h6"
//                                         align="center"
//                                         sx={{ fontWeight: "bold", textDecoration: "underline", mb: 2 }}
//                                     >
//                                         INSPECTION REPORT
//                                     </Typography>

//                                     <TableContainer component={Paper} sx={{ border: "1px solid black" }}>
//                                         <Table size="small">
//                                             <TableBody>
//                                                 {/* ROW 1 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black", width: "16.6%" }}>
//                                                         CONTROL NO:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black", width: "16.6%" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black", width: "16.6%" }}>
//                                                         SAMPLE:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black", width: "16.6%" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black", width: "16.6%" }}>
//                                                         DATE:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black", width: "16.6%" }}>
//                                                         <TextField variant="standard" fullWidth type="date" />
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 2 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>PART NO:</TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         DRG ISSUE LEVEL:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         PROJECT / SALE ORDER:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 3 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>DESCRIPTION:</TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         VENDOR DIMENSION REPORT:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }} colSpan={3}>
//                                                         {renderCheckboxGroup("vendorDim", ["Received", "Not Received"])}
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 4 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>SAN NO:</TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         VISUAL INSPECTION 100%:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }} colSpan={3}>
//                                                         {renderCheckboxGroup("visual", ["OK", "Not OK"])}
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 5 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>PO NO:</TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         RAW MATERIAL SUPPLIED:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }} colSpan={3}>
//                                                         {renderCheckboxGroup("rawMat", ["BE", "Vendor"])}
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 6 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>VENDOR:</TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         RAW MATERIAL TEST REPORT:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }} colSpan={3}>
//                                                         {renderCheckboxGroup("rawMatReport", ["Received", "Not Received"])}
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 7 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         QUANTITY RECEIVED:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         QTY INSPECTED PER SAMPLING PLAN:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }} colSpan={3}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {/* ROW 8 */}
//                                                 <TableRow>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         QUANTITY ACCEPTED:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         QUANTITY REJECTED:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         ANY SPECIAL PROCESS CALLED:
//                                                     </TableCell>
//                                                     <TableCell sx={{ border: "1px solid black" }}>
//                                                         <TextField variant="standard" fullWidth />
//                                                     </TableCell>
//                                                 </TableRow>
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 </Box>


//                             </Paper>
//                         </Grid>

//                         {/* RIGHT: Selected item details & inspection form */}
//                         <Grid item xs={12} md={5}>
//                             <Paper sx={{ p: 2, mb: 2 }}>
//                                 <Typography variant="h6" sx={{ mb: 1 }}>
//                                     Selected Item (Important Details)
//                                 </Typography>

//                                 <Grid container spacing={1}>
//                                     <Grid item xs={6}>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Part No
//                                         </Typography>
//                                         <Typography sx={{ fontWeight: 700 }}>{form.partNumber || "-"}</Typography>
//                                     </Grid>

//                                     <Grid item xs={6}>
//                                         <Typography variant="caption" color="text.secondary">
//                                             MPN
//                                         </Typography>
//                                         <Typography sx={{ fontWeight: 700 }}>{form.mpn || "-"}</Typography>
//                                     </Grid>

//                                     <Grid item xs={12}>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Batch No
//                                         </Typography>
//                                         <Typography sx={{ fontWeight: 700 }}>{form.batchNo || "-"}</Typography>
//                                     </Grid>

//                                     <Grid item xs={12} sx={{ mt: 1 }}>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Total Qty
//                                         </Typography>
//                                         <Box
//                                             sx={{
//                                                 mt: 0.5,
//                                                 display: "inline-block",
//                                                 px: 2,
//                                                 py: 0.5,
//                                                 borderRadius: 1,
//                                                 background: "#e8f5e9",
//                                             }}
//                                         >
//                                             <Typography sx={{ fontWeight: 800 }}>{form.totalQty}</Typography>
//                                         </Box>
//                                     </Grid>

//                                     <Grid item xs={12}>
//                                         <Divider sx={{ my: 1 }} />
//                                         <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                                             Sampling Options
//                                         </Typography>
//                                         <Stack direction="row" spacing={1} alignItems="center">
//                                             <TextField
//                                                 label="Sampling %"
//                                                 type="number"
//                                                 size="small"
//                                                 value={form.samplingPercent}
//                                                 onChange={(e) =>
//                                                     setForm((f) => ({ ...f, samplingPercent: e.target.value === "" ? "" : Number(e.target.value) }))
//                                                 }
//                                                 inputProps={{ min: 0, max: 100 }}
//                                                 sx={{ width: 120 }}
//                                             />
//                                             <Box sx={{ ml: 1 }}>
//                                                 <Typography variant="caption">Sample Qty</Typography>
//                                                 <Typography sx={{ fontWeight: 700 }}>{form.sampleQty}</Typography>
//                                             </Box>
//                                         </Stack>
//                                     </Grid>

//                                     {/* accepted/rejected in sampling */}
//                                     <Grid item xs={12} sx={{ mt: 1 }}>
//                                         <Stack spacing={1}>
//                                             <TextField
//                                                 label={`Accepted (0 - ${form.sampleQty})`}
//                                                 type="number"
//                                                 size="small"
//                                                 value={form.acceptedInSample}
//                                                 onChange={(e) =>
//                                                     setForm((f) => ({ ...f, acceptedInSample: e.target.value === "" ? "" : Number(e.target.value) }))
//                                                 }
//                                             />
//                                             <TextField label="Rejected (auto)" size="small" value={form.rejectedInSample} disabled />
//                                         </Stack>
//                                     </Grid>

//                                     <Grid item xs={12}>
//                                         <Divider sx={{ my: 1 }} />

//                                         <Box p={2} sx={{ backgroundColor: "#fff" }}>
//                                             <Typography
//                                                 variant="h6"
//                                                 align="center"
//                                                 sx={{ fontWeight: "bold", mb: 2, textDecoration: "underline" }}
//                                             >
//                                                 DIMENSIONAL INSPECTION REPORT
//                                             </Typography>

//                                             <TableContainer component={Paper} sx={{ border: "1px solid black" }}>
//                                                 <Table size="small">
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell
//                                                                 sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}
//                                                                 rowSpan={2}
//                                                             >
//                                                                 SL NO
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}
//                                                                 rowSpan={2}
//                                                             >
//                                                                 Instrument Used
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}
//                                                                 rowSpan={2}
//                                                             >
//                                                                 Basic Dimension
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}
//                                                                 colSpan={2}
//                                                             >
//                                                                 Acceptable Dimensions (in mm)
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}
//                                                                 colSpan={5}
//                                                             >
//                                                                 Observed Dimensions (Samples)
//                                                             </TableCell>
//                                                         </TableRow>
//                                                         <TableRow>
//                                                             <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>
//                                                                 Min
//                                                             </TableCell>
//                                                             <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>
//                                                                 Max
//                                                             </TableCell>
//                                                             {[1, 2, 3, 4, 5].map((s) => (
//                                                                 <TableCell
//                                                                     key={s}
//                                                                     sx={{ border: "1px solid black", textAlign: "center" }}
//                                                                 >
//                                                                     {s}
//                                                                 </TableCell>
//                                                             ))}
//                                                         </TableRow>
//                                                     </TableHead>

//                                                     <TableBody>
//                                                         {rows.map((row, i) => (
//                                                             <TableRow key={i}>
//                                                                 <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>
//                                                                     {row.slno}
//                                                                 </TableCell>
//                                                                 <TableCell sx={{ border: "1px solid black" }}>
//                                                                     <TextField variant="standard" fullWidth />
//                                                                 </TableCell>
//                                                                 <TableCell sx={{ border: "1px solid black" }}>
//                                                                     <TextField variant="standard" fullWidth />
//                                                                 </TableCell>
//                                                                 <TableCell sx={{ border: "1px solid black" }}>
//                                                                     <TextField variant="standard" fullWidth />
//                                                                 </TableCell>
//                                                                 <TableCell sx={{ border: "1px solid black" }}>
//                                                                     <TextField variant="standard" fullWidth />
//                                                                 </TableCell>
//                                                                 {row.observed.map((_, j) => (
//                                                                     <TableCell key={j} sx={{ border: "1px solid black" }}>
//                                                                         <TextField variant="standard" fullWidth />
//                                                                     </TableCell>
//                                                                 ))}
//                                                             </TableRow>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>

//                                             <Typography sx={{ mt: 2, fontWeight: "bold" }}>General Tolerance: ± 0.3 mm</Typography>

//                                             <Box mt={3} display="flex" justifyContent="space-between">
//                                                 <Box>
//                                                     <Typography>INSPECTED BY:</Typography>
//                                                     <Typography>Signature:</Typography>
//                                                     <Typography>Date:</Typography>
//                                                     <Typography>Stamp:</Typography>
//                                                 </Box>
//                                                 <Box>
//                                                     <Typography>APPROVED BY:</Typography>
//                                                     <Typography>Signature:</Typography>
//                                                     <Typography>Date:</Typography>
//                                                     <Typography>Stamp:</Typography>
//                                                 </Box>
//                                             </Box>
//                                         </Box>
//                                     </Grid>

//                                     <Grid item xs={12} sx={{ mt: 2 }}>
//                                         <Stack direction="row" spacing={2}>
//                                             <Button
//                                                 fullWidth
//                                                 variant="contained"
//                                                 color="success"
//                                                 onClick={() => handleOpenQr("accept")}
//                                                 disabled={!form.partNumber}
//                                             >
//                                                 ACCEPT QR
//                                             </Button>
//                                             <Button
//                                                 fullWidth
//                                                 variant="contained"
//                                                 color="error"
//                                                 onClick={() => handleOpenQr("reject")}
//                                                 disabled={!form.partNumber}
//                                             >
//                                                 REJECT QR
//                                             </Button>
//                                         </Stack>
//                                     </Grid>
//                                 </Grid>
//                             </Paper>
//                         </Grid>
//                     </Grid>

//                     {/* QR Dialog (horizontal card) */}
//                     <Dialog open={qrOpen} onClose={handleCloseQr} fullWidth maxWidth="md">
//                         <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                             {qrType === "accept" ? "Accepted QR" : "Rejected QR"}
//                             <IconButton onClick={handleCloseQr}>
//                                 <CloseIcon />
//                             </IconButton>
//                         </DialogTitle>

//                         <DialogContent>
//                             <Paper
//                                 elevation={3}
//                                 sx={{
//                                     display: "flex",
//                                     gap: 2,
//                                     alignItems: "center",
//                                     p: 2,
//                                     borderRadius: 2,
//                                     background: qrType === "accept" ? "#e8f5e9" : "#ffebee",
//                                 }}
//                             >
//                                 <Box sx={{ flex: "0 0 260px", textAlign: "center" }}>
//                                     <QRCodeSVG value={qrPayload} size={220} />
//                                 </Box>

//                                 <Box sx={{ flex: 1 }}>
//                                     <Typography variant="h6" sx={{ color: qrType === "accept" ? "green" : "darkred", fontWeight: 800 }}>
//                                         {qrType === "accept" ? "ACCEPTED" : "REJECTED"}
//                                     </Typography>
//                                     <Divider sx={{ my: 1 }} />
//                                     <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                                         Payload (scannable)
//                                     </Typography>

//                                     <Paper variant="outlined" sx={{ p: 1, maxHeight: 300, overflow: "auto", whiteSpace: "pre-line" }}>
//                                         <Typography variant="body2">{qrPayload}</Typography>
//                                     </Paper>

//                                     <Box sx={{ mt: 2 }}>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Note: QR payload contains the inspection & sampling details.
//                                         </Typography>
//                                     </Box>
//                                 </Box>
//                             </Paper>
//                         </DialogContent>
//                     </Dialog>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }
import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
} from "@mui/material";

// Dummy Data
const dummyData = [
  {
    id: 1,
    partNo: "7896541230",
    description: "Crystal Oscillator",
    poNo: "BEPO/EP/4100161001",
    qty: 12000,
  },
  {
    id: 2,
    partNo: "4515138201",
    description: "Resonator Unit",
    poNo: "BEPO/EP/4100161002",
    qty: 8000,
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pending, setPending] = useState(dummyData);
  const [completed, setCompleted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows] = useState([
    { slno: 1, observed: [1, 2, 3, 4, 5] },
    { slno: 2, observed: [1, 2, 3, 4, 5] },
  ]);

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const handleAccept = () => {
    if (selectedRow) {
      setCompleted([...completed, selectedRow]);
      setPending(pending.filter((item) => item.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };

  const handleReject = () => {
    if (selectedRow) {
      setRejected([...rejected, selectedRow]);
      setPending(pending.filter((item) => item.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };

  const renderCheckboxGroup = (name, options) => (
    <Box display="flex" justifyContent="space-around">
      {options.map((option) => (
        <label key={option}>
          <Checkbox name={name} />
          {option}
        </label>
      ))}
    </Box>
  );

  const SamplingTable = () => (
    <Box mt={3}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        SAMPLING INSPECTION
      </Typography>
      <TableContainer component={Paper} sx={{ border: "1px solid black" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid black" }}>Parameter</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>Specification</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>Observed Value</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>Result (OK/Not OK)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell sx={{ border: "1px solid black" }}>
                  <TextField variant="standard" fullWidth />
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  <TextField variant="standard" fullWidth />
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  <TextField variant="standard" fullWidth />
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {renderCheckboxGroup(`sampling_${i}`, ["OK", "Not OK"])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const DimensionalForm = () => (
    <Box p={2} sx={{ backgroundColor: "#fff", mt: 3 }}>
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: "bold", mb: 2, textDecoration: "underline" }}
      >
        DIMENSIONAL INSPECTION REPORT
      </Typography>

      <TableContainer component={Paper} sx={{ border: "1px solid black" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}>
                SL NO
              </TableCell>
              <TableCell rowSpan={2} sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}>
                Instrument Used
              </TableCell>
              <TableCell rowSpan={2} sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}>
                Basic Dimension
              </TableCell>
              <TableCell colSpan={2} sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}>
                Acceptable Dimensions (in mm)
              </TableCell>
              <TableCell colSpan={5} sx={{ border: "1px solid black", textAlign: "center", fontWeight: "bold" }}>
                Observed Dimensions (Samples)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>Min</TableCell>
              <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>Max</TableCell>
              {[1, 2, 3, 4, 5].map((s) => (
                <TableCell key={s} sx={{ border: "1px solid black", textAlign: "center" }}>
                  {s}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>{row.slno}</TableCell>
                <TableCell sx={{ border: "1px solid black" }}><TextField variant="standard" fullWidth /></TableCell>
                <TableCell sx={{ border: "1px solid black" }}><TextField variant="standard" fullWidth /></TableCell>
                <TableCell sx={{ border: "1px solid black" }}><TextField variant="standard" fullWidth /></TableCell>
                <TableCell sx={{ border: "1px solid black" }}><TextField variant="standard" fullWidth /></TableCell>
                {row.observed.map((_, j) => (
                  <TableCell key={j} sx={{ border: "1px solid black" }}>
                    <TextField variant="standard" fullWidth />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ mt: 2, fontWeight: "bold" }}>General Tolerance: ± 0.3 mm</Typography>
    </Box>
  );

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: activeTab === "pending" ? "red" : "grey" }}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: activeTab === "completed" ? "green" : "grey" }}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: activeTab === "rejected" ? "blue" : "grey" }}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </Button>
        </Box>

        {activeTab === "pending" && (
          <Box display="flex" gap={1}>
            <Button variant="contained" color="success" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="contained" color="error" onClick={handleReject}>
              Reject
            </Button>
          </Box>
        )}
      </Box>

      {/* Pending Table */}
      {activeTab === "pending" && (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Part No</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pending.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRow?.id === row.id}
                        onChange={() => handleSelectRow(row)}
                      />
                    </TableCell>
                    <TableCell>{row.partNo}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.poNo}</TableCell>
                    <TableCell>{row.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedRow && (
            <>
              {/* Subcontractor Form */}
              <Paper sx={{ p: 2, mt: 3 }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ fontWeight: "bold", textDecoration: "underline", mb: 2 }}
                >
                  SUB CONTRACTOR INSPECTION - MCE DIVISION
                </Typography>
                <TableContainer component={Paper} sx={{ border: "1px solid black" }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>PART NO:</TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          <TextField variant="standard" fullWidth value={selectedRow.partNo} />
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>DESCRIPTION:</TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          <TextField variant="standard" fullWidth value={selectedRow.description} />
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>PO NUMBER:</TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          <TextField variant="standard" fullWidth value={selectedRow.poNo} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>QUANTITY:</TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          <TextField variant="standard" fullWidth value={selectedRow.qty} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <SamplingTable />
              <DimensionalForm />
            </>
          )}
        </>
      )}

      {/* Completed Table */}
      {activeTab === "completed" && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Part No</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>PO Number</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completed.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.partNo}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.poNo}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Rejected Table */}
      {activeTab === "rejected" && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Part No</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>PO Number</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejected.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.partNo}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.poNo}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
