
// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Checkbox,
//     Divider,
//     Grid,
//     Paper,
//     Stack,
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     TextField,
//     Typography,
//     MenuItem,
//     DialogActions,
//     DialogTitle,
//     Dialog,
//     DialogContent,
// } from "@mui/material";
// import { QRCodeSVG } from "qrcode.react";
// import axios from "axios";
// import DimensionalForm from './DimensionalForm';
// import SubContractForm from "./SubContractForm";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import CancelIcon from "@mui/icons-material/Cancel";
// import SummarizeIcon from "@mui/icons-material/Summarize";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import { QrCode2 } from "@mui/icons-material";
// import { TaskAlt } from "@mui/icons-material";
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// import Tooltip from "@mui/material/Tooltip";
// import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
// import { QRCodeCanvas } from "qrcode.react";


// import PhysicalForm from "../SubContractInspection/PhysicalForm";
// import ElectricalForm from "../SubContractInspection/ElectricalForm";
// import IndenterInterventionSection from "./IndenterInterventionSection";

// export default function SubContractInspection() {
//     // --------------------------------------------
//     // STATE MANAGEMENT
//     // --------------------------------------------
//     const [filter, setFilter] = useState("pending");
//     const [tab, setTab] = useState("pending");
//     const [pendingData, setPendingData] = useState([]);
//     const [showExtra, setShowExtra] = useState(false);
//     const [inspectionSummary, setInspectionSummary] = useState({ accepted: 0, rejected: 0 });
//     const [electricalSummary, setElectricalSummary] = useState({ accepted: 0, rejected: 0 });
//     const [referenceno, setReferenceNo] = useState([]);
//     const [qrDialogOpen, setQrDialogOpen] = useState(false);
//     const [qrDialogType, setQrDialogType] = useState("");  // "accept" | "reject"


//     const [selectedId, setSelectedId] = useState(null);

//     const [form, setForm] = useState({
//         partNumber: "",
//         mpn: "",
//         batchNo: "",
//         poNo: "",
//         vendor: "",
//         totalQty: 0,
//         samplingPercent: 10,
//         sampleQty: 0,
//         Description:"",
//         acceptedInSample: "",
//         rejectedInSample: "",
//         inspectorName: "",
//         inspectorStaffNo: "",
//         inspectorDate: "",
//         inspectorSignature: null,
//         inspectorSignaturePreview: null,
//         fodCheck: false,
//         approverName: "",
//         approverStaffNo: "",
//         approvalDate: "",
//         approverSignature: null,
//         approverSignaturePreview: null,

//     });



//     const [report, setReport] = useState({
//         controlNo: "",
//         remarks: "",
//     });

//     const [qrOpen, setQrOpen] = useState(false);
//     const [qrType, setQrType] = useState(null);
//     const [qrPayload, setQrPayload] = useState("");
//     const [hoveredRow, setHoveredRow] = useState(null);
//     const [dimensiondata, setDimensionData] = useState(null);
//     const [activeCard, setActiveCard] = useState("pending");
//     const [percentError, setPercentError] = useState("");
//     const [indenterIntervention, setIndenterIntervention] = useState(false);
//     const [processOnHold, setProcessOnHold] = useState(false);
//     const [isCardOpen, setIsCardOpen] = useState(true);

//     const [isFormASaveEnabled, setIsFormASaveEnabled] = useState(false);


//     // --------------------------------------------
//     // FETCH PENDING GR LIST
//     // --------------------------------------------
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await axios.get("http://192.168.0.149:8000/generateddetails");
//                 const formattedData = res.data.map((item) => ({
//                     slno: item.SL_No,
//                     partNumber: item.BEL_Part_Number,
//                     description:item.Description,
//                     mpn: item.MPN,
//                     batchNo: item.Batch_Lot_No,
//                     dateCode: item.DateCode,
//                     quantity: item.Quantity,
//                     poNo: item.BEL_PO_No,
//                     vendor: item.Vendor_Name,
//                     oemMake: item.OEM_Make,
//                     manufacture: item.Manufacturing_Place,
//                     grNo: item.GR_No || "",
//                     grDate: item.GR_Date ? item.GR_Date.split("T")[0] : "",
//                     receiptNo: item.Reference_No || "",
//                 }));
//                 setPendingData(formattedData);
//             } catch {
//                 const dummyData = [
//                     {
//                         SL_No: 1,
//                         GR_No: "GR2025-001",
//                         GR_Date: "2025-01-15T10:23:00.000Z",
//                         BEL_Part_Number: "423458754153",
//                         MPN: "MPN-AX45",
//                         Batch_Lot_No: "BATCH-789",
//                         DateCode: "2024-12",
//                         Quantity: 150,
//                         BEL_PO_No: "PO-56789",
//                         Vendor_Name: "ABC Electronics Pvt Ltd",
//                         OEM_Make: "Siemens",
//                         Manufacturing_Place: "Germany",
//                         Reference_No: "RCPT-001"
//                     },
//                     {
//                         SL_No: 2,
//                         GR_No: "GR2025-002",
//                         GR_Date: "2025-01-20T09:10:00.000Z",
//                         BEL_Part_Number: "245875415332",
//                         MPN: "MPN-ZX90",
//                         Batch_Lot_No: "BATCH-456",
//                         DateCode: "2025-01",
//                         Quantity: 300,
//                         BEL_PO_No: "PO-99887",
//                         Vendor_Name: "Global Tech Supplies",
//                         OEM_Make: "Honeywell",
//                         Manufacturing_Place: "USA",
//                         Reference_No: "RCPT-002"
//                     },
//                     {
//                         SL_No: 3,
//                         GR_No: "GR2025-003",
//                         GR_Date: "2025-01-22T14:45:00.000Z",
//                         BEL_Part_Number: "165654678900",
//                         MPN: "MPN-QT12",
//                         Batch_Lot_No: "BATCH-123",
//                         DateCode: "2024-10",
//                         Quantity: 75,
//                         BEL_PO_No: "PO-11223",
//                         Vendor_Name: "Precision Components Ltd",
//                         OEM_Make: "Bosch",
//                         Manufacturing_Place: "India",
//                         Reference_No: "RCPT-003"
//                     }
//                 ];

//                 const formattedDummy = dummyData.map((item) => ({
//                     slno: item.SL_No,
//                     grNo: item.GR_No || "",
//                     grDate: item.GR_Date ? item.GR_Date.split("T")[0] : "",
//                     partNumber: item.BEL_Part_Number,
//                     mpn: item.MPN,
//                     batchNo: item.Batch_Lot_No,
//                     dateCode: item.DateCode,
//                     quantity: item.Quantity,
//                     poNo: item.BEL_PO_No,
//                     vendor: item.Vendor_Name,
//                     oemMake: item.OEM_Make,
//                     manufacture: item.Manufacturing_Place,
//                     receiptNo: item.Reference_No || "",
//                 }));

//                 setPendingData(formattedDummy);
//             }
//         };
//         fetchData();
//     }, []);

//     // --------------------------------------------
//     // AUTOFILL FORM WHEN SELECTED ID CHANGES
//     // --------------------------------------------
//     useEffect(() => {
//         if (selectedId == null) {
//             setForm((f) => ({
//                 ...f,
//                 partNumber: "",
//                 mpn: "",
//                 batchNo: "",
//                 poNo: "",
//                 description:"",
//                 vendor: "",
//                 totalQty: 0,
//                 description:'',
//                 sampleQty: 0,
//                 samplingPercent: 10,
//                 acceptedInSample: "",
//                 rejectedInSample: "",
//             }));
//             return;
//         }

//         const row = pendingData.find((r) => r.slno === selectedId);
//         if (!row) return;

//         setForm((f) => ({
//             ...f,
//             partNumber: row.partNumber,
//             mpn: row.mpn,
//             description:row.description,
//             batchNo: row.batchNo,
//             poNo: row.poNo,
//             totalQty: row.quantity,
//             vendor: row.vendor,
//             samplingPercent: 10,
//             sampleQty: Math.round((row.quantity * 10) / 100),
//             acceptedInSample: "",
//             rejectedInSample: "",
//         }));
//     }, [selectedId]);

//     // --------------------------------------------
//     // RECALC SAMPLE QTY WHEN SAMPLING PERCENT OR TOTAL QTY CHANGES
//     // --------------------------------------------
//     useEffect(() => {
//         const p = Number(form.samplingPercent || 0);
//         const total = Number(form.totalQty || 0);
//         if (isNaN(p) || p < 0) return;
//         const s = Math.round((total * Math.max(0, Math.min(100, p))) / 100);
//         setForm((f) => ({ ...f, sampleQty: s }));
//     }, [form.samplingPercent, form.totalQty]);

//     // --------------------------------------------
//     // RECALC REJECTED WHEN ACCEPTED IN SAMPLE CHANGES
//     // --------------------------------------------
//     useEffect(() => {
//         const acc = form.acceptedInSample === "" ? null : Number(form.acceptedInSample);
//         if (acc === null || isNaN(acc)) {
//             setForm((f) => ({ ...f, rejectedInSample: "" }));
//             return;
//         }
//         const rej = Number(form.sampleQty) - acc;
//         setForm((f) => ({ ...f, rejectedInSample: String(rej >= 0 ? rej : 0) }));
//     }, [form.acceptedInSample, form.sampleQty]);

//     // --------------------------------------------
//     // HANDLE PART NUMBER CLICK (FETCH REPORTS)
//     // --------------------------------------------
//     const handlePartNumberClick = (row) => {
//         const baseURL = "http://192.168.0.149:8000/subcontractinspectionreport";

//         axios.get(baseURL, {
//             params: {
//                 Ref_No: row.receiptNo
//             }
//         })
//             .then((res) => {
//                 setHoveredRow(res.data);
//                 setReferenceNo(res.data.Reference_No);
//                 setIsCardOpen(true);
//             })
//             .catch((err) => console.error("API error:", err));

//         const baseURL2 = "http://192.168.0.149:8000/dimensionreport";

//         axios.get(baseURL2, {
//             params: {
//                 Ref_No: row.receiptNo
//             }
//         })
//             .then((res) => {
//                 setDimensionData(res.data);

//                 console.log("fgfghfh", res.data)
//             })
//             .catch((err) => console.error("API error:", err));
//     };

//     // --------------------------------------------
//     // QR PAYLOAD BUILDER
//     // --------------------------------------------



//     const acceptedItemNo =
//   Number(form.totalQty) - Number(form.rejectedInSample);

// const rejectedItemNo = Number(form.rejectedInSample);

// // FINAL ITEM NO FOR QR
// const finalItemNo =
//   qrDialogType === "accept" ? acceptedItemNo : rejectedItemNo;

//     const buildQrPayload = (type) => {
//         return {
//             status: type === "accept" ? "ACCEPTED" : "REJECTED",
//             partNumber: form.partNumber,
//             itemNo: finalItemNo,
//             description: form.description,
//             quantity: form.totalQty,
//             poNumber: form.poNumber,
//             inspectorName: form.inspectorName,
//             inspectorStaffNo: form.inspectorStaffNo,
//             inspectorDate: form.inspectorDate,
//             approverName: form.approverName,
//             approverStaffNo: form.approverStaffNo,
//             approvalDate: form.approvalDate,
//             reason: form.reason || "",
//         };
//     };


//     const handleInterventionStatus = async (referenceno, status) => {
//         try {
//             const response = await fetch("/api/intervention-status", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ referenceno, status }),
//             });

//             const result = await response.json();
//             console.log("Status updated:", result);
//         } catch (error) {
//             console.error("Error updating status:", error);
//         }
//     };

//     // --------------------------------------------
//     // VALIDATION BEFORE OPENING QR
//     // --------------------------------------------
//     function validateBeforeQr() {
//         // -----------------------------------------
//         // 0. Basic Checks
//         // -----------------------------------------

//         if (!form.partNumber)
//             return "Select a row from the GR list first.";

//         if (form.totalQty <= 0)
//             return "Invalid total quantity.";


//         // ========================================================
//         // 1. INSPECTED BY VALIDATION
//         // ========================================================
//         // Compute inspection totals
//         const totalInspected =
//             Number(inspectionSummary.accepted || 0) +
//             Number(inspectionSummary.rejected || 0) +
//             Number(electricalSummary.accepted || 0) +
//             Number(electricalSummary.rejected || 0);

//         // Ensure Physical/Electrical inspection is done
//         if (totalInspected <= 0)
//             return "Inspection not completed. Perform physical/electrical inspection first.";

//         // If process is ON HOLD — block QR generation
//         if (processOnHold)
//             return "Process is on hold. Resume before generating QR.";

//         // Name
//         if (!form.inspectorName || form.inspectorName.trim() === "")
//             return "Enter Inspector Name.";

//         // Staff No
//         if (!form.inspectorStaffNo || form.inspectorStaffNo.trim() === "")
//             return "Enter Inspector Staff No.";

//         // Signature (File Upload)
//         if (!form.inspectorSignature)
//             return "Upload Inspector Digital Signature.";

//         // Date
//         if (!form.inspectorDate)
//             return "Select Inspector Date.";


//         // ========================================================
//         // 2. APPROVED BY VALIDATION
//         // ========================================================

//         // Name
//         if (!form.approverName || form.approverName.trim() === "")
//             return "Enter Approver Name.";

//         // Staff No
//         if (!form.approverStaffNo || form.approverStaffNo.trim() === "")
//             return "Enter Approver Staff No.";

//         // Signature (File Upload)
//         if (!form.approverSignature)
//             return "Upload Approver Digital Signature.";

//         // Date
//         if (!form.approvalDate)
//             return "Select Approval Date.";

//         // if (!isFormASaveEnabled) {
//         //     alert("Pending");
//         //     return;
//         // }
//         // Continue with Accept action
//         // alert("Accepted!");


//         // ========================================================
//         // If everything is correct → return null
//         // ========================================================

//         return null;
//     }




//     function handleOpenQr(type) {
//         const err = validateBeforeQr();
//         if (err) {
//             alert(err);   // You can replace alert with Snackbar later
//             return;
//         }

//         // Set dialog type ("accept" / "reject")
//         setQrDialogType(type);

//         // Prepare payload for QR (your existing logic)
//         const payload = buildQrPayload(type);
//         setQrPayload(payload);

//         // Open the dialog
//         setQrDialogOpen(true);
//     }



//     function handleCloseQr() {
//         setQrOpen(false);
//         setQrPayload("");
//         setQrType(null);
//     }



//     // --------------------------------------------
//     // STYLES
//     // --------------------------------------------
//     const cardStyle = (active, from, to) => ({
//         background: active ? `linear-gradient(90deg, ${from}, ${to})` : "#f5f7fa",
//         color: active ? "white" : "#222",
//         cursor: "pointer",
//         boxShadow: active ? "0 8px 20px rgba(16,24,40,0.12)" : "0 2px 8px rgba(16,24,40,0.06)",
//         borderRadius: 1,
//         transition: "all 0.18s ease",
//     });

//     // --------------------------------------------
//     // RENDER
//     // --------------------------------------------

//     const handleSave = async () => {
//         try {
//             const formData = new FormData();

//             // Inspector details
//             formData.append("Name", form.inspectorName);
//             formData.append("Staff_No", form.inspectorStaffNo);
//             formData.append("Role", "Inspector");
//             formData.append("Reference_No",referenceno)
//             if (form.inspectorSignature)
//                 formData.append("file", form.inspectorSignature);

//             // FOD check
//             // formData.append("fodCheck", form.fodCheck);

//             // Approver details
//             formData.append("Name", form.approverName);
//             formData.append("Staff_No", form.approverStaffNo);
//             // formData.append("approvalDate", form.approvalDate);
//             formData.append("Role", "Approver");
//             if (form.approverSignature)
//                 formData.append("file", form.approverSignature);

//             console.log("formData", formData);

//             // Axios POST request
//             const response = await axios.post("http://192.168.0.149:8000/authorized-person/upload", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             console.log("Saved successfully:", response.data);
//             alert("Inspection details saved successfully!");
//         } catch (error) {
//             console.error("Error saving inspection details:", error);
//             alert("Failed to save inspection details.");
//         }
//     };

//     return (

//         <Box sx={{ p: 1, minHeight: "100vh" }}>
//             <Card sx={{ maxWidth: 3000, mx: "auto", borderRadius: 3, color: "#bf1212" }}>
//                 <CardContent>
//                     <img src={'http://192.168.0.149:8000/image/1'} alt='noimage' />
//                     <Typography id="title" value="subcontract" variant="h4" align="center" sx={{ fontWeight: 800, mb: 5, fontFamily: 'Roboto' }}>
//                         SUB CONTRACT INSPECTION
//                     </Typography>

//                     <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
//                         <Grid item>
//                             <Card
//                                 onClick={() => setTab("pending")}
//                                 sx={{
//                                     width: 200,
//                                     p: 2,
//                                     cursor: "pointer",
//                                     borderRadius: 3,
//                                     textAlign: "center",
//                                     boxShadow: tab === "pending"
//                                         ? "0 4px 20px rgba(25,118,210,0.4)"
//                                         : "0 2px 8px rgba(0,0,0,0.15)",
//                                     background: tab === "pending"
//                                         ? "linear-gradient(135deg, #1976d2, #42a5f5)"
//                                         : "#e3f2fd",
//                                     color: tab === "pending" ? "white" : "black",
//                                     transition: "0.25s",
//                                     "&:hover": {
//                                         transform: "scale(1.05)",
//                                     },
//                                 }}
//                             >
//                                 <PendingActionsIcon sx={{ fontSize: 40 }} />
//                                 <Typography variant="h6" fontWeight={700}>Pending GR List</Typography>
//                             </Card>
//                         </Grid>

//                         <Grid item>
//                             <Card
//                                 onClick={() => setTab("accepted")}
//                                 sx={{
//                                     width: 200,
//                                     p: 2,
//                                     cursor: "pointer",
//                                     borderRadius: 3,
//                                     textAlign: "center",
//                                     boxShadow: tab === "accepted"
//                                         ? "0 4px 20px rgba(46,125,50,0.4)"
//                                         : "0 2px 8px rgba(0,0,0,0.15)",
//                                     background: tab === "accepted"
//                                         ? "linear-gradient(135deg, #2e7d32, #66bb6a)"
//                                         : "#e8f5e9",
//                                     color: tab === "accepted" ? "white" : "black",
//                                     transition: "0.25s",
//                                     "&:hover": {
//                                         transform: "scale(1.05)",
//                                     },
//                                 }}
//                             >
//                                 <CheckCircleIcon sx={{ fontSize: 40 }} />
//                                 <Typography variant="h6" fontSize={19} fontWeight={700}>Accepted GR List</Typography>
//                             </Card>
//                         </Grid>

//                         <Grid item>
//                             <Card
//                                 onClick={() => setTab("rejected")}
//                                 sx={{
//                                     width: 200,
//                                     p: 2,
//                                     cursor: "pointer",
//                                     borderRadius: 3,
//                                     textAlign: "center",
//                                     boxShadow: tab === "rejected"
//                                         ? "0 4px 20px rgba(211,47,47,0.4)"
//                                         : "0 2px 8px rgba(0,0,0,0.15)",
//                                     background: tab === "rejected"
//                                         ? "linear-gradient(135deg, #d32f2f, #ef5350)"
//                                         : "#ffebee",
//                                     color: tab === "rejected" ? "white" : "black",
//                                     transition: "0.25s",
//                                     "&:hover": {
//                                         transform: "scale(1.05)",
//                                     },
//                                 }}
//                             >
//                                 <CancelIcon sx={{ fontSize: 40 }} />
//                                 <Typography variant="h6" fontWeight={700}>Rejected GR List</Typography>
//                             </Card>
//                         </Grid>

//                         <Grid item>
//                             <Card
//                                 onClick={() => setTab("total")}
//                                 sx={{
//                                     width: 200,
//                                     p: 2,
//                                     cursor: "pointer",
//                                     borderRadius: 3,
//                                     textAlign: "center",
//                                     boxShadow: tab === "total"
//                                         ? "0 4px 20px rgba(25,118,210,0.4)"
//                                         : "0 2px 8px rgba(0,0,0,0.15)",
//                                     background: tab === "total"
//                                         ? "linear-gradient(135deg, #1565c0, #64b5f6)"
//                                         : "#e3f2fd",
//                                     color: tab === "total" ? "white" : "black",
//                                     transition: "0.25s",
//                                     "&:hover": {
//                                         transform: "scale(1.05)",
//                                     },
//                                 }}
//                             >
//                                 <SummarizeIcon sx={{ fontSize: 40 }} />
//                                 <Typography variant="h6" fontWeight={700}>Total</Typography>
//                             </Card>
//                         </Grid>
//                     </Grid>

//                     <Box mt={4}>
//                         {tab === "pending" && (
//                             <>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12} md={12}>
//                                         <Paper
//                                             sx={{
//                                                 p: 2,
//                                                 mb: 2,
//                                                 backgroundColor: "#e3f2fd",
//                                                 borderRadius: "12px",
//                                                 boxShadow: "0px 4px 20px rgba(0,0,0,0.12)",
//                                                 border: "1px solid #bbdefb",
//                                                 transition: "0.3s",
//                                                 "&:hover": {
//                                                     boxShadow: "0px 8px 28px rgba(0,0,0,0.18)",
//                                                 }
//                                             }}
//                                         >
//                                             <Typography
//                                                 variant="h5"
//                                                 align="center"
//                                                 sx={{
//                                                     mb: 2,
//                                                     fontWeight: "bold",
//                                                     fontFamily: "Times New Roman",
//                                                     color: "black",
//                                                     textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
//                                                 }}
//                                             >
//                                                 PENDING GR LIST FOR INSPECTION
//                                             </Typography>

//                                             <Table size="small">
//                                                 <TableHead>
//                                                     <TableRow>
//                                                         {[
//                                                             "Sl No",
//                                                             "BEL Part Number",
//                                                             "MPN",
//                                                             "Description",
//                                                             "Batch No",
//                                                             "Date Code",
//                                                             "Quantity",
//                                                             "BEL PO No",
//                                                             "Vendor",
//                                                             "OEM Make",
//                                                             "Manufacture",
//                                                             "GR No",
//                                                             "GR Date",
//                                                             "Reference No"
//                                                         ].map((h) => (
//                                                             <TableCell
//                                                                 key={h}
//                                                                 sx={{
//                                                                     fontWeight: 700,
//                                                                     color: "white",
//                                                                     backgroundColor: "#1565c0",
//                                                                     fontFamily: "Times New Roman",
//                                                                     borderRight: "1px solid #bbdefb",
//                                                                     "&:last-child": { borderRight: "none" },
//                                                                 }}
//                                                             >
//                                                                 {h}
//                                                             </TableCell>
//                                                         ))}
//                                                     </TableRow>
//                                                 </TableHead>

//                                                 <TableBody>
//                                                     {pendingData.map((row, i) => (
//                                                         <TableRow
//                                                             key={i}
//                                                             hover
//                                                             onClick={() => setSelectedId(row.slno)}
//                                                             sx={{
//                                                                 backgroundColor:
//                                                                     selectedId === row.slno ? "#c8e6c9" : "white",
//                                                                 cursor: "pointer",
//                                                                 fontFamily: "Times New Roman",
//                                                                 transition: "0.2s ease",
//                                                                 "&:hover": {
//                                                                     backgroundColor:
//                                                                         selectedId === row.slno
//                                                                             ? "#aedfae"
//                                                                             : "#f1f8ff",
//                                                                     transform: "scale(1.01)",
//                                                                 },
//                                                             }}
//                                                         >
//                                                             <TableCell>{row.slno}</TableCell>

//                                                             <TableCell
//                                                                 style={{
//                                                                     color: "#0d47a1",
//                                                                     fontWeight: 700,
//                                                                     textDecoration: "underline",
//                                                                     cursor: "pointer",
//                                                                 }}
//                                                                 onClick={() => handlePartNumberClick(row)}
//                                                             >
//                                                                 {row.partNumber}
//                                                             </TableCell>

//                                                             <TableCell>{row.grNo}</TableCell>
//                                                             <TableCell>{row.grDate}</TableCell>
//                                                             <TableCell>{row.mpn}</TableCell>
//                                                             <TableCell>{row.mpn}</TableCell>
//                                                             <TableCell>{row.batchNo}</TableCell>
//                                                             <TableCell>{row.dateCode}</TableCell>
//                                                             <TableCell>{row.quantity}</TableCell>
//                                                             <TableCell>{row.poNo}</TableCell>
//                                                             <TableCell>{row.vendor}</TableCell>
//                                                             <TableCell>{row.oemMake}</TableCell>
//                                                             <TableCell>{row.manufacture}</TableCell>
//                                                             <TableCell>{row.receiptNo}</TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </Paper>

//                                         {isCardOpen && (
//                                             <SubContractForm
//                                                 selectedRow={hoveredRow}
//                                                 onClose={() => setIsCardOpen(false)}
//                                             />
//                                         )}
//                                     </Grid>

//                                     <Grid item xs={12} md={12}>
//                                         <Paper sx={{ p: 2, mb: 2, background: "#e3f2fd" }}>
//                                             <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'black', fontFamily: 'Times New Roman' }}>
//                                                 SELECTED ITEM IMPORTANT DETAILS
//                                             </Typography>

//                                             <Grid container spacing={1}>
//                                                 <Grid container spacing={2} sx={{ width: "100%", mx: "auto" }}>
//                                                     <Grid item xs={12} container spacing={2}>
//                                                         <Grid item xs={3}>
//                                                             <Box
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     borderRadius: 2,
//                                                                     background: "white",
//                                                                     boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
//                                                                     border: "1px solid #bbdefb",
//                                                                     transition: "0.3s",
//                                                                     "&:hover": {
//                                                                         transform: "scale(1.03)",
//                                                                         boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <Typography
//                                                                     variant="caption"
//                                                                     sx={{
//                                                                         fontSize: 16,
//                                                                         fontWeight: 700,
//                                                                         color: "#1565c0",
//                                                                         fontFamily: "Times New Roman",
//                                                                     }}
//                                                                 >
//                                                                     Part No
//                                                                 </Typography>
//                                                                 <Box sx={{ mt: 1 }}>
//                                                                     <Typography sx={{ fontWeight: 700 }}>
//                                                                         {form.partNumber || "-"}
//                                                                     </Typography>
//                                                                 </Box>
//                                                             </Box>
//                                                         </Grid>

//                                                         <Grid item xs={3}>
//                                                             <Box
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     borderRadius: 2,
//                                                                     background: "white",
//                                                                     boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
//                                                                     border: "1px solid #bbdefb",
//                                                                     transition: "0.3s",
//                                                                     "&:hover": {
//                                                                         transform: "scale(1.03)",
//                                                                         boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <Typography
//                                                                     variant="caption"
//                                                                     sx={{
//                                                                         fontSize: 16,
//                                                                         fontWeight: 700,
//                                                                         color: "#1565c0",
//                                                                         fontFamily: "Times New Roman",
//                                                                     }}
//                                                                 >
//                                                                     MPN
//                                                                 </Typography>
//                                                                 <Box sx={{ mt: 1 }}>
//                                                                     <Typography sx={{ fontWeight: 700 }}>
//                                                                         {form.mpn || "-"}
//                                                                     </Typography>
//                                                                 </Box>
//                                                             </Box>
//                                                         </Grid>

//                                                         <Grid item xs={3}>
//                                                             <Box
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     borderRadius: 2,
//                                                                     background: "white",
//                                                                     boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
//                                                                     border: "1px solid #bbdefb",
//                                                                     transition: "0.3s",
//                                                                     "&:hover": {
//                                                                         transform: "scale(1.03)",
//                                                                         boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <Typography
//                                                                     variant="caption"
//                                                                     sx={{
//                                                                         fontSize: 16,
//                                                                         fontWeight: 800,
//                                                                         color: "#1565c0",
//                                                                         fontFamily: "Times New Roman",
//                                                                     }}
//                                                                 >
//                                                                     Batch No
//                                                                 </Typography>
//                                                                 <Box sx={{ mt: 1 }}>
//                                                                     <Typography sx={{ fontWeight: 700 }}>
//                                                                         {form.batchNo || "-"}
//                                                                     </Typography>
//                                                                 </Box>
//                                                             </Box>
//                                                         </Grid>

//                                                         <Grid item xs={3}>
//                                                             <Box
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     borderRadius: 2,
//                                                                     background: "white",
//                                                                     boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
//                                                                     border: "1px solid #c8e6c9",
//                                                                     transition: "0.3s",
//                                                                     "&:hover": {
//                                                                         transform: "scale(1.03)",
//                                                                         boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <Typography
//                                                                     variant="caption"
//                                                                     sx={{
//                                                                         fontSize: 16,
//                                                                         fontWeight: 700,
//                                                                         color: "#2e7d32",
//                                                                         fontFamily: "Times New Roman",
//                                                                     }}
//                                                                 >
//                                                                     Total Qty
//                                                                 </Typography>
//                                                                 <Box sx={{ mt: 1 }}>
//                                                                     <Typography sx={{ fontWeight: 800, color: "green" }}>
//                                                                         {form.totalQty}
//                                                                     </Typography>
//                                                                 </Box>
//                                                             </Box>
//                                                         </Grid>
//                                                     </Grid>
//                                                 </Grid>

//                                                 {/* <Grid item xs={12}>
                                                    

//                                                     <Stack direction="row" spacing={4} justifyContent="center" sx={{ ml: "10rem" }}>
//                                                         <TextField
//                                                             select
//                                                             label="Category"
//                                                             size="small"
//                                                             value={form.category || ""}
//                                                             onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
//                                                             sx={{ width: 200 }}
//                                                             disabled={indenterIntervention || processOnHold}
//                                                         >
//                                                             <MenuItem value="">Select Category</MenuItem>
//                                                             <MenuItem value="Mechanical">Mechanical</MenuItem>
//                                                             <MenuItem value="Electrical">Electrical</MenuItem>
//                                                             <MenuItem value="Electromechanical">Electromechanical</MenuItem>
//                                                         </TextField>

                                                    

//                                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                             <Checkbox
//                                                                 checked={indenterIntervention}
//                                                                 onChange={(e) => {
//                                                                     const isChecked = e.target.checked;

//                                                                     setIndenterIntervention(isChecked);
//                                                                     setProcessOnHold(isChecked);

//                                                                     // status based on checkbox
//                                                                     const status = isChecked ? "pending" : "deleted";

//                                                                     // call your function to send data
//                                                                     handleInterventionStatus(referenceno, status);
//                                                                 }}
//                                                             />

//                                                             <Typography style={{ fontFamily: 'Times New Roman', fontSize: '10' }}>
//                                                                 Indenter Intervention Required
//                                                             </Typography>

//                                                             {processOnHold && (
//                                                                 <Tooltip title="Process is on hold until indenter responds">
//                                                                     <PauseCircleOutlineIcon color="warning" />
//                                                                 </Tooltip>
//                                                             )}
//                                                         </Box>

//                                                     </Stack>
//                                                 </Grid> */}

                                                

//                                                 <Grid item xs={12}>
//                                                     {!processOnHold && form.category && (
//                                                         <Box sx={{ mt: 3 }}>
//                                                             {form.category === "Mechanical" && (
//                                                                 <PhysicalForm sampleCount={15} onSummaryChange={setInspectionSummary} selectedRow={dimensiondata} Ref_no={referenceno} />
//                                                             )}

//                                                             {form.category === "Electrical" && (
//                                                                 <ElectricalForm onSummaryChange={setElectricalSummary} selectedRow={dimensiondata} sampleCount={15} Ref_no={referenceno} />
//                                                             )}

//                                                             {form.category === "Electromechanical" && (
//                                                                 <>
//                                                                     <PhysicalForm sampleCount={15} onSummaryChange={setInspectionSummary} selectedRow={dimensiondata} Ref_no={referenceno} />
//                                                                     <Box sx={{ mt: 4 }} />
//                                                                     <ElectricalForm onSummaryChange={setElectricalSummary} selectedRow={dimensiondata} sampleCount={15} Ref_no={referenceno} />
//                                                                 </>
//                                                             )}
//                                                         </Box>
//                                                     )}

//                                                     <Divider sx={{ my: 1 }} />

//                                                     {processOnHold && (
//                                                         <Paper sx={{ mt: 2, p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
//                                                             <PauseCircleOutlineIcon color="warning" sx={{ fontSize: 40 }} />
//                                                             <Box>
//                                                                 <Typography variant="body1">
//                                                                     Process is on hold awaiting indenter response.
//                                                                 </Typography>
//                                                                 <Typography variant="caption">
//                                                                     Click resume to continue.
//                                                                 </Typography>

//                                                                 <Box sx={{ mt: 1 }}>
//                                                                     <Button
//                                                                         variant="contained"
//                                                                         onClick={() => {
//                                                                             setProcessOnHold(false);
//                                                                             setIndenterIntervention(false);
//                                                                         }}
//                                                                     >
//                                                                         Resume Process
//                                                                     </Button>
//                                                                 </Box>
//                                                             </Box>
//                                                         </Paper>
//                                                     )}
//                                                 </Grid>


//                                                 {/* INSPECTION SUMMARY */}

//                                                 <Grid item xs={12}>
//                                                     <Card
//                                                         sx={{
//                                                             p: 3,
//                                                             borderRadius: 3,
//                                                             boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
//                                                             background: "linear-gradient(145deg, #e3f2fd, #ffffff)",
//                                                         }}
//                                                     >
//                                                         <Typography
//                                                             variant="h6"
//                                                             sx={{ fontWeight: "bold", mb: 2, fontSize: 16, fontWeight: 'bold', color: '#0d47a1', fontFamily: 'Times New Roman' }}


//                                                         >
//                                                             INSPECTION SUMMARY
//                                                         </Typography>

//                                                         <Box
//                                                             sx={{
//                                                                 display: "flex",
//                                                                 flexWrap: "wrap",
//                                                                 justifyContent: "center",
//                                                                 gap: 3,
//                                                                 mt: 2,
//                                                             }}
//                                                         >
//                                                             {/* Qty Received */}
//                                                             <Card
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     width: 200,
//                                                                     borderRadius: 2,
//                                                                     textAlign: "center",
//                                                                     background: "white",
//                                                                     boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
//                                                                     alignContent: "center",

//                                                                 }}
//                                                             >
//                                                                 <Typography sx={{ color: "#555", fontWeight: 600 }}>
//                                                                     Qty Received
//                                                                 </Typography>
//                                                                 <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#1b5e20" }}>
//                                                                     {form.totalQty}
//                                                                 </Typography>
//                                                             </Card>

//                                                             {/* Qty Inspected */}
//                                                             <Card
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     width: 200,
//                                                                     borderRadius: 2,
//                                                                     textAlign: "center",
//                                                                     background: "white",
//                                                                     boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
//                                                                     alignContent: "center",

//                                                                 }}
//                                                             >
//                                                                 <Typography sx={{ color: "#555", fontWeight: 600 }}>
//                                                                     Qty Inspected
//                                                                 </Typography>
//                                                                 <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#0277bd" }}>
//                                                                     {Number(inspectionSummary.accepted || 0) +
//                                                                         Number(inspectionSummary.rejected || 0) +
//                                                                         Number(electricalSummary.accepted || 0) +
//                                                                         Number(electricalSummary.rejected || 0)}
//                                                                 </Typography>
//                                                             </Card>

//                                                             {/* Accepted */}
//                                                             <Card
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     width: 200,
//                                                                     borderRadius: 2,
//                                                                     textAlign: "center",
//                                                                     background: "white",
//                                                                     boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
//                                                                     alignContent: "center",

//                                                                 }}
//                                                             >
//                                                                 <Typography sx={{ color: "#555", fontWeight: 600 }}>
//                                                                     Accepted
//                                                                 </Typography>
//                                                                 <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#2e7d32" }}>
//                                                                     {Number(inspectionSummary.accepted || 0) +
//                                                                         Number(electricalSummary.accepted || 0)}
//                                                                 </Typography>
//                                                             </Card>

//                                                             {/* Rejected */}
//                                                             <Card
//                                                                 sx={{
//                                                                     p: 2,
//                                                                     width: 200,
//                                                                     borderRadius: 2,
//                                                                     textAlign: "center",
//                                                                     background: "white",
//                                                                     boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
//                                                                     alignContent: "center",
//                                                                 }}
//                                                             >
//                                                                 <Typography sx={{ color: "#555", fontWeight: 600 }}>
//                                                                     Rejected
//                                                                 </Typography>
//                                                                 <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#c62828" }}>
//                                                                     {Number(inspectionSummary.rejected || 0) +
//                                                                         Number(electricalSummary.rejected || 0)}
//                                                                 </Typography>

//                                                             </Card>
//                                                             <Card sx={{
//                                                                 p: 2,
//                                                                 width: 600,
//                                                                 borderRadius: 2,
//                                                                 textAlign: "center",
//                                                                 background: "white",
//                                                                 boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
//                                                             }}
//                                                             >
//                                                                 <Typography sx={{ color: "#555", fontWeight: 600 }}>
//                                                                     Remarks
//                                                                 </Typography>
//                                                                 <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#c62828" }}>
//                                                                     <TextField
//                                                                         fullWidth
//                                                                         multiline
//                                                                         // rows={3}
//                                                                         placeholder="Enter remarks here..."
//                                                                         sx={{
//                                                                             background: "white",
//                                                                             borderRadius: 2,
//                                                                             "& .MuiOutlinedInput-root": {
//                                                                                 borderRadius: 2
//                                                                             }
//                                                                         }}
//                                                                         value={report.remarks}
//                                                                         onChange={(e) =>
//                                                                             setReport((prev) => ({ ...prev, remarks: e.target.value }))
//                                                                         }
//                                                                     />
//                                                                 </Typography>

//                                                             </Card>

//                                                         </Box>


//                                                     </Card>
//                                                 </Grid>

//                                                 {/* FULL INSPECTION & APPROVAL SECTION */}
//                                                 {/* <Grid item xs={12}>
//                                                     <Card
//                                                         sx={{
//                                                             p: 4,
//                                                             mt: 3,
//                                                             borderRadius: 4,
//                                                             background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
//                                                             boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
//                                                             border: "1px solid #d0e2ff",
//                                                         }}
//                                                     >
//                                                         <Typography
//                                                             variant="h5"
//                                                             sx={{ fontWeight: "bold", mb: 2, fontSize: 16, fontWeight: 'bold', color: '#0d47a1', fontFamily: 'Times New Roman' }}

//                                                         >
//                                                             INSPECTION & APPROVAL DETAILS
//                                                         </Typography>


//                                                         <Grid container spacing={4}>


//                                                             <Grid item xs={12} md={4}>
//                                                                 <Card
//                                                                     sx={{
//                                                                         p: 3,
//                                                                         borderRadius: 3,
//                                                                         background: "rgba(255,255,255,0.8)",
//                                                                         backdropFilter: "blur(6px)",
//                                                                         boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
//                                                                         border: "1px solid #bbdefb",
//                                                                     }}
//                                                                 >
//                                                                     <Typography
//                                                                         variant="subtitle1"
//                                                                         sx={{
//                                                                             fontWeight: 700,
//                                                                             mb: 2,
//                                                                             color: "#1565c0",
//                                                                             display: "flex",
//                                                                             alignItems: "center",
//                                                                             gap: 1
//                                                                         }}
//                                                                     >
//                                                                         🧑‍🔧 Inspector Details
//                                                                     </Typography>

//                                                                     <Grid container spacing={2}>
//                                                                         <Grid item xs={6}>
//                                                                             <TextField
//                                                                                 label="Name"
//                                                                                 fullWidth
//                                                                                 variant="outlined"
//                                                                                 value={form.inspectorName || ""}
//                                                                                 onChange={(e) =>
//                                                                                     setForm((f) => ({ ...f, inspectorName: e.target.value }))
//                                                                                 }
//                                                                             />
//                                                                         </Grid>

//                                                                         <Grid item xs={6}>
//                                                                             <TextField
//                                                                                 label="Staff No"
//                                                                                 fullWidth
//                                                                                 variant="outlined"
//                                                                                 value={form.inspectorStaffNo || ""}
//                                                                                 onChange={(e) =>
//                                                                                     setForm((f) => ({ ...f, inspectorStaffNo: e.target.value }))
//                                                                                 }
//                                                                             />
//                                                                         </Grid>

//                                                                         <Grid item xs={6}>
//                                                                             <TextField
//                                                                                 type="date"
//                                                                                 label="Date"
//                                                                                 InputLabelProps={{ shrink: true }}
//                                                                                 fullWidth
//                                                                                 variant="outlined"
//                                                                                 value={form.inspectorDate || ""}
//                                                                                 onChange={(e) =>
//                                                                                     setForm((f) => ({ ...f, inspectorDate: e.target.value }))
//                                                                                 }
//                                                                             />
//                                                                         </Grid>


//                                                                         <Grid item xs={6}>
//                                                                             <Button
//                                                                                 variant="contained"
//                                                                                 component="label"
//                                                                                 fullWidth
//                                                                                 sx={{
//                                                                                     background: "linear-gradient(135deg, #64b5f6, #1976d2)",
//                                                                                     color: "white",
//                                                                                     fontWeight: 600,
//                                                                                     borderRadius: 2,
//                                                                                     "&:hover": {
//                                                                                         background: "linear-gradient(135deg, #42a5f5, #0d47a1)",
//                                                                                     }
//                                                                                 }}
//                                                                             >
//                                                                                 Upload Signature
//                                                                                 <input
//                                                                                     type="file"
//                                                                                     hidden
//                                                                                     accept="image/*"
//                                                                                     onChange={(e) => {
//                                                                                         const file = e.target.files[0];
//                                                                                         if (file) {
//                                                                                             setForm((f) => ({
//                                                                                                 ...f,
//                                                                                                 inspectorSignature: file,
//                                                                                                 inspectorSignaturePreview:
//                                                                                                     URL.createObjectURL(file),
//                                                                                             }));
//                                                                                         }
//                                                                                     }}
//                                                                                 />
//                                                                             </Button>
//                                                                         </Grid>


//                                                                         {form.inspectorSignaturePreview && (
//                                                                             <Grid item xs={12}>
//                                                                                 <Box
//                                                                                     sx={{
//                                                                                         width: "100%",
//                                                                                         height: 75,
//                                                                                         border: "2px  #90caf9",
//                                                                                         borderRadius: 2,
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         justifyContent: "center",
//                                                                                         background: "#e3f2fd",
//                                                                                     }}
//                                                                                 >
//                                                                                     <img
//                                                                                         src={form.inspectorSignaturePreview}
//                                                                                         alt="Signature"
//                                                                                         style={{
//                                                                                             maxWidth: "100%",
//                                                                                             maxHeight: "70px",
//                                                                                             objectFit: "contain",
//                                                                                         }}
//                                                                                     />
//                                                                                 </Box>
//                                                                             </Grid>
//                                                                         )}
//                                                                     </Grid>
//                                                                 </Card>
//                                                             </Grid>


//                                                             <Grid item xs={12} md={4}>
//                                                                 <Card
//                                                                     sx={{
//                                                                         p: 3,
//                                                                         borderRadius: 3,
//                                                                         background: "rgba(255,255,255,0.85)",
//                                                                         backdropFilter: "blur(6px)",
//                                                                         textAlign: "center",
//                                                                         border: "1px solid #c8e6c9",
//                                                                         boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
//                                                                         alignContent: "center",
//                                                                         height: "100%"
//                                                                     }}
//                                                                 >
//                                                                     <Typography
//                                                                         variant="subtitle1"
//                                                                         sx={{
//                                                                             fontWeight: 700,
//                                                                             mb: 2,
//                                                                             color: "#2e7d32",
//                                                                             display: "flex",
//                                                                             alignItems: "center",
//                                                                             justifyContent: "center",
//                                                                             gap: 1
//                                                                         }}
//                                                                     >
//                                                                         ✔️ FOD Check
//                                                                     </Typography>

//                                                                     <Checkbox
//                                                                         checked={form.fodCheck || false}
//                                                                         onChange={(e) =>
//                                                                             setForm((f) => ({ ...f, fodCheck: e.target.checked }))
//                                                                         }
//                                                                         sx={{
//                                                                             transform: "scale(1.3)",
//                                                                             color: "#2e7d32"
//                                                                         }}
//                                                                     />

//                                                                     <Typography sx={{ fontWeight: 600, color: "#1b5e20" }}>
//                                                                         FOD Check Completed
//                                                                     </Typography>
//                                                                 </Card>
//                                                             </Grid>
//                                                             <Grid item xs={12} md={4}>
//                                                                 <Card
//                                                                     sx={{
//                                                                         p: 3,
//                                                                         borderRadius: 3,
//                                                                         background: "rgba(255,255,255,0.8)",
//                                                                         backdropFilter: "blur(6px)",
//                                                                         boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
//                                                                         border: "1px solid #bbdefb",
//                                                                     }}
//                                                                 >
//                                                                     <Typography
//                                                                         variant="subtitle1"
//                                                                         sx={{
//                                                                             fontWeight: 700,
//                                                                             mb: 2,
//                                                                             color: "#0d47a1",
//                                                                             display: "flex",
//                                                                             alignItems: "center",
//                                                                             gap: 1
//                                                                         }}
//                                                                     >
//                                                                         📝 Approver Details
//                                                                     </Typography>

//                                                                     <Grid container spacing={2}>
//                                                                         <Grid item xs={6}>
//                                                                             <TextField
//                                                                                 label="Name"
//                                                                                 fullWidth
//                                                                                 variant="outlined"
//                                                                                 value={form.approverName || ""}
//                                                                                 onChange={(e) =>
//                                                                                     setForm((f) => ({ ...f, approverName: e.target.value }))
//                                                                                 }
//                                                                             />
//                                                                         </Grid>

//                                                                         <Grid item xs={6}>
//                                                                             <TextField
//                                                                                 label="Staff No"
//                                                                                 fullWidth
//                                                                                 variant="outlined"
//                                                                                 value={form.approverStaffNo || ""}
//                                                                                 onChange={(e) =>
//                                                                                     setForm((f) => ({ ...f, approverStaffNo: e.target.value }))
//                                                                                 }
//                                                                             />
//                                                                         </Grid>

//                                                                         <Grid item xs={6}>
//                                                                             <TextField
//                                                                                 type="date"
//                                                                                 label="Date"
//                                                                                 InputLabelProps={{ shrink: true }}
//                                                                                 fullWidth
//                                                                                 variant="outlined"
//                                                                                 value={form.approvalDate || ""}
//                                                                                 onChange={(e) =>
//                                                                                     setForm((f) => ({ ...f, approvalDate: e.target.value }))
//                                                                                 }
//                                                                             />
//                                                                         </Grid>


//                                                                         <Grid item xs={6}>
//                                                                             <Button
//                                                                                 variant="contained"
//                                                                                 component="label"
//                                                                                 fullWidth
//                                                                                 sx={{
//                                                                                     background: "linear-gradient(135deg, #7986cb, #303f9f)",
//                                                                                     color: "white",
//                                                                                     fontWeight: 600,
//                                                                                     borderRadius: 2,
//                                                                                     "&:hover": {
//                                                                                         background: "linear-gradient(135deg, #5c6bc0, #1a237e)",
//                                                                                     }
//                                                                                 }}
//                                                                             >
//                                                                                 Upload Signature
//                                                                                 <input
//                                                                                     type="file"
//                                                                                     hidden
//                                                                                     accept="image/*"
//                                                                                     onChange={(e) => {
//                                                                                         const file = e.target.files[0];
//                                                                                         if (file) {
//                                                                                             setForm((f) => ({
//                                                                                                 ...f,
//                                                                                                 approverSignature: file,
//                                                                                                 approverSignaturePreview:
//                                                                                                     URL.createObjectURL(file),
//                                                                                             }));
//                                                                                         }
//                                                                                     }}
//                                                                                 />
//                                                                             </Button>
//                                                                         </Grid>


//                                                                         {form.approverSignaturePreview && (
//                                                                             <Grid item xs={12}>
//                                                                                 <Box
//                                                                                     sx={{
//                                                                                         width: "100%",
//                                                                                         height: 75,
//                                                                                         border: "2px  #9fa8da",
//                                                                                         borderRadius: 2,
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         justifyContent: "center",
//                                                                                         background: "#e8eaf6",
//                                                                                     }}
//                                                                                 >
//                                                                                     <img
//                                                                                         src={form.approverSignaturePreview}
//                                                                                         alt="Signature"
//                                                                                         style={{
//                                                                                             maxWidth: "100%",
//                                                                                             maxHeight: "70px",
//                                                                                             objectFit: "contain",
//                                                                                         }}
//                                                                                     />
//                                                                                 </Box>
//                                                                             </Grid>
//                                                                         )}
//                                                                     </Grid>
//                                                                 </Card>
//                                                             </Grid>
//                                                         </Grid>
//                                                     </Card>
//                                                 </Grid> */}

//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={12}>
//                                                         <Card
//                                                             sx={{
//                                                                 p: 4,
//                                                                 mt: 3,
//                                                                 borderRadius: 4,
//                                                                 background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
//                                                                 boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
//                                                                 border: "1px solid #d0e2ff",
//                                                             }}
//                                                         >
//                                                             <Typography
//                                                                 variant="h5"
//                                                                 sx={{
//                                                                     fontWeight: "bold",
//                                                                     mb: 2,
//                                                                     fontSize: 16,
//                                                                     color: "#0d47a1",
//                                                                     fontFamily: "Times New Roman",
//                                                                 }}
//                                                             >
//                                                                 INSPECTION & APPROVAL DETAILS
//                                                             </Typography>

//                                                             {/* ROW CONTAINER */}
//                                                             <Grid container spacing={4}>
//                                                                 {/* Inspector Details */}
//                                                                 <Grid item xs={12} md={4}>
//                                                                     <Card
//                                                                         sx={{
//                                                                             p: 3,
//                                                                             borderRadius: 3,
//                                                                             background: "rgba(255,255,255,0.8)",
//                                                                             backdropFilter: "blur(6px)",
//                                                                             boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
//                                                                             border: "1px solid #bbdefb",
//                                                                         }}
//                                                                     >
//                                                                         <Typography
//                                                                             variant="subtitle1"
//                                                                             sx={{
//                                                                                 fontWeight: 700,
//                                                                                 mb: 2,
//                                                                                 color: "#1565c0",
//                                                                                 display: "flex",
//                                                                                 alignItems: "center",
//                                                                                 gap: 1,
//                                                                             }}
//                                                                         >
//                                                                             🧑‍🔧 Inspector Details
//                                                                         </Typography>

//                                                                         <Grid container spacing={2}>
//                                                                             <Grid item xs={6}>
//                                                                                 <TextField
//                                                                                     label="Name"
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     value={form.inspectorName}
//                                                                                     onChange={(e) =>
//                                                                                         setForm((f) => ({
//                                                                                             ...f,
//                                                                                             inspectorName: e.target.value,
//                                                                                         }))
//                                                                                     }
//                                                                                 />
//                                                                             </Grid>

//                                                                             <Grid item xs={6}>
//                                                                                 <TextField
//                                                                                     label="Staff No"
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     value={form.inspectorStaffNo}
//                                                                                     onChange={(e) =>
//                                                                                         setForm((f) => ({
//                                                                                             ...f,
//                                                                                             inspectorStaffNo: e.target.value,
//                                                                                         }))
//                                                                                     }
//                                                                                 />
//                                                                             </Grid>

//                                                                             <Grid item xs={6}>
//                                                                                 <TextField
//                                                                                     type="date"
//                                                                                     label="Date"
//                                                                                     InputLabelProps={{ shrink: true }}
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     value={form.inspectorDate}
//                                                                                     onChange={(e) =>
//                                                                                         setForm((f) => ({ ...f, inspectorDate: e.target.value }))
//                                                                                     }
//                                                                                 />
//                                                                             </Grid>

//                                                                             {/* Upload Button */}
//                                                                             <Grid item xs={6}>
//                                                                                 <Button
//                                                                                     variant="contained"
//                                                                                     component="label"
//                                                                                     fullWidth
//                                                                                     sx={{
//                                                                                         background: "linear-gradient(135deg, #64b5f6, #1976d2)",
//                                                                                         color: "white",
//                                                                                         fontWeight: 600,
//                                                                                         borderRadius: 2,
//                                                                                         "&:hover": {
//                                                                                             background: "linear-gradient(135deg, #42a5f5, #0d47a1)",
//                                                                                         },
//                                                                                     }}
//                                                                                 >
//                                                                                     Upload Signature
//                                                                                     <input
//                                                                                         type="file"
//                                                                                         hidden
//                                                                                         accept="image/*"
//                                                                                         onChange={(e) => {
//                                                                                             const file = e.target.files[0];
//                                                                                             if (file) {
//                                                                                                 setForm((f) => ({
//                                                                                                     ...f,
//                                                                                                     inspectorSignature: file,
//                                                                                                     inspectorSignaturePreview:
//                                                                                                         URL.createObjectURL(file),
//                                                                                                 }));
//                                                                                             }
//                                                                                         }}
//                                                                                     />
//                                                                                 </Button>
//                                                                             </Grid>

//                                                                             {/* Preview */}
//                                                                             {form.inspectorSignaturePreview && (
//                                                                                 <Grid item xs={12}>
//                                                                                     <Box
//                                                                                         sx={{
//                                                                                             width: "100%",
//                                                                                             height: 75,
//                                                                                             borderRadius: 2,
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             justifyContent: "center",
//                                                                                             background: "#e3f2fd",
//                                                                                         }}
//                                                                                     >
//                                                                                         <img
//                                                                                             src={form.inspectorSignaturePreview}
//                                                                                             alt="Signature"
//                                                                                             style={{
//                                                                                                 maxWidth: "100%",
//                                                                                                 maxHeight: "70px",
//                                                                                                 objectFit: "contain",
//                                                                                             }}
//                                                                                         />
//                                                                                     </Box>
//                                                                                 </Grid>
//                                                                             )}
//                                                                         </Grid>
//                                                                     </Card>
//                                                                 </Grid>

//                                                                 {/* FOD Check */}
//                                                                 <Grid item xs={12} md={4}>
//                                                                     <Card
//                                                                         sx={{
//                                                                             p: 3,
//                                                                             borderRadius: 3,
//                                                                             background: "rgba(255,255,255,0.85)",
//                                                                             backdropFilter: "blur(6px)",
//                                                                             textAlign: "center",
//                                                                             border: "1px solid #c8e6c9",
//                                                                             boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
//                                                                             alignContent: "center",
//                                                                             height: "100%",
//                                                                         }}
//                                                                     >
//                                                                         <Typography
//                                                                             variant="subtitle1"
//                                                                             sx={{
//                                                                                 fontWeight: 700,
//                                                                                 mb: 2,
//                                                                                 color: "#2e7d32",
//                                                                                 display: "flex",
//                                                                                 alignItems: "center",
//                                                                                 justifyContent: "center",
//                                                                                 gap: 1,
//                                                                             }}
//                                                                         >
//                                                                             ✔️ FOD Check
//                                                                         </Typography>

//                                                                         <Checkbox
//                                                                             checked={form.fodCheck}
//                                                                             onChange={(e) =>
//                                                                                 setForm((f) => ({ ...f, fodCheck: e.target.checked }))
//                                                                             }
//                                                                             sx={{
//                                                                                 transform: "scale(1.3)",
//                                                                                 color: "#2e7d32",
//                                                                             }}
//                                                                         />

//                                                                         <Typography sx={{ fontWeight: 600, color: "#1b5e20" }}>
//                                                                             FOD Check Completed
//                                                                         </Typography>
//                                                                     </Card>
//                                                                 </Grid>

//                                                                 {/* Approver Details */}
//                                                                 <Grid item xs={12} md={4}>
//                                                                     <Card
//                                                                         sx={{
//                                                                             p: 3,
//                                                                             borderRadius: 3,
//                                                                             background: "rgba(255,255,255,0.8)",
//                                                                             backdropFilter: "blur(6px)",
//                                                                             boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
//                                                                             border: "1px solid #bbdefb",
//                                                                         }}
//                                                                     >
//                                                                         <Typography
//                                                                             variant="subtitle1"
//                                                                             sx={{
//                                                                                 fontWeight: 700,
//                                                                                 mb: 2,
//                                                                                 color: "#0d47a1",
//                                                                                 display: "flex",
//                                                                                 alignItems: "center",
//                                                                                 gap: 1,
//                                                                             }}
//                                                                         >
//                                                                             📝 Approver Details
//                                                                         </Typography>

//                                                                         <Grid container spacing={2}>
//                                                                             <Grid item xs={6}>
//                                                                                 <TextField
//                                                                                     label="Name"
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     value={form.approverName}
//                                                                                     onChange={(e) =>
//                                                                                         setForm((f) => ({ ...f, approverName: e.target.value }))
//                                                                                     }
//                                                                                 />
//                                                                             </Grid>

//                                                                             <Grid item xs={6}>
//                                                                                 <TextField
//                                                                                     label="Staff No"
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     value={form.approverStaffNo}
//                                                                                     onChange={(e) =>
//                                                                                         setForm((f) => ({
//                                                                                             ...f,
//                                                                                             approverStaffNo: e.target.value,
//                                                                                         }))
//                                                                                     }
//                                                                                 />
//                                                                             </Grid>

//                                                                             <Grid item xs={6}>
//                                                                                 <TextField
//                                                                                     type="date"
//                                                                                     label="Date"
//                                                                                     InputLabelProps={{ shrink: true }}
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     value={form.approvalDate}
//                                                                                     onChange={(e) =>
//                                                                                         setForm((f) => ({ ...f, approvalDate: e.target.value }))
//                                                                                     }
//                                                                                 />
//                                                                             </Grid>

//                                                                             {/* Upload */}
//                                                                             <Grid item xs={6}>
//                                                                                 <Button
//                                                                                     variant="contained"
//                                                                                     component="label"
//                                                                                     fullWidth
//                                                                                     sx={{
//                                                                                         background: "linear-gradient(135deg, #7986cb, #303f9f)",
//                                                                                         color: "white",
//                                                                                         fontWeight: 600,
//                                                                                         borderRadius: 2,
//                                                                                         "&:hover": {
//                                                                                             background: "linear-gradient(135deg, #5c6bc0, #1a237e)",
//                                                                                         },
//                                                                                     }}
//                                                                                 >
//                                                                                     Upload Signature
//                                                                                     <input
//                                                                                         type="file"
//                                                                                         hidden
//                                                                                         accept="image/*"
//                                                                                         onChange={(e) => {
//                                                                                             const file = e.target.files[0];
//                                                                                             if (file) {
//                                                                                                 setForm((f) => ({
//                                                                                                     ...f,
//                                                                                                     approverSignature: file,
//                                                                                                     approverSignaturePreview:
//                                                                                                         URL.createObjectURL(file),
//                                                                                                 }));
//                                                                                             }
//                                                                                         }}
//                                                                                     />
//                                                                                 </Button>
//                                                                             </Grid>

//                                                                             {/* Preview */}
//                                                                             {form.approverSignaturePreview && (
//                                                                                 <Grid item xs={12}>
//                                                                                     <Box
//                                                                                         sx={{
//                                                                                             width: "100%",
//                                                                                             height: 75,
//                                                                                             borderRadius: 2,
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             justifyContent: "center",
//                                                                                             background: "#e8eaf6",
//                                                                                         }}
//                                                                                     >
//                                                                                         <img
//                                                                                             src={form.approverSignaturePreview}
//                                                                                             alt="Signature"
//                                                                                             style={{
//                                                                                                 maxWidth: "100%",
//                                                                                                 maxHeight: "70px",
//                                                                                                 objectFit: "contain",
//                                                                                             }}
//                                                                                         />
//                                                                                     </Box>
//                                                                                 </Grid>
//                                                                             )}
//                                                                         </Grid>
//                                                                     </Card>
//                                                                 </Grid>
//                                                             </Grid>


//                                                         </Card>
//                                                     </Grid>
//                                                 </Grid>



//                                                 <Grid item xs={12} sx={{ mt: 2 }}>
//                                                     <Stack direction="row" justifyContent="center" spacing={2} >
//                                                         <Button
//                                                             variant="contained"
//                                                             color="primary"
//                                                             onClick={handleSave}
//                                                         >
//                                                             Save Inspection Details
//                                                         </Button>
//                                                         <Button
//                                                             fullWidth
//                                                             variant="contained"
//                                                             color="success"
//                                                             onClick={() => handleOpenQr("accept")}
//                                                             disabled={!form.partNumber}
//                                                             style={{ width: '3rem' }}
//                                                         >
//                                                             <TaskAlt></TaskAlt><QrCode2></QrCode2>
//                                                         </Button>
//                                                         <Button
//                                                             fullWidth
//                                                             variant="contained"
//                                                             color="error"
//                                                             onClick={() => handleOpenQr("reject")}
//                                                             disabled={!form.partNumber}
//                                                             style={{ width: '3rem' }}
//                                                         >
//                                                             <HighlightOffIcon></HighlightOffIcon><QrCode2></QrCode2>
//                                                         </Button>
//                                                     </Stack>
//                                                 </Grid>

//                                             </Grid>
//                                         </Paper>
//                                     </Grid>
//                                 </Grid>
//                             </>
//                         )}
//                     </Box>

//                     <Dialog
//                         open={qrDialogOpen}
//                         onClose={() => setQrDialogOpen(false)}
//                         maxWidth="md"
//                         fullWidth

//                         PaperProps={{
//                             sx: {

//                                 borderRadius: 3,
//                                 background:
//                                     qrDialogType === "accept"
//                                         ? "linear-gradient(135deg, #e8f5e9, #ffffff)"
//                                         : "linear-gradient(135deg, #ffebee, #ffffff)",
//                                 border: `3px solid ${qrDialogType === "accept" ? "#4caf50" : "#f44336"
//                                     }`,
//                                 p: 2,
//                             },
//                         }}
//                     >
//                         <DialogTitle
//                             sx={{
//                                 textAlign: "center",
//                                 fontWeight: 900,
//                                 fontSize: "1.7rem",
//                                 color: qrDialogType === "accept" ? "#1b5e20" : "#b71c1c",
//                             }}
//                         >
//                             {qrDialogType === "accept"
//                                 ? "APPROVAL CONFIRMED"
//                                 : "REJECTION CONFIRMED"}
//                         </DialogTitle>

//                         <DialogContent>
//                             <Grid container spacing={1}>

//                                 {/* STATUS LABEL */}
//                                 <Grid item xs={2}>
//                                     <Box
//                                         sx={{
//                                             height: "50%",
//                                             writingMode: "sideways-lr",
//                                             textOrientation: "sideways",
//                                             fontWeight: 900,
//                                             letterSpacing: 3,
//                                             fontSize: "1.5rem",
//                                             color: "white",
//                                             background:
//                                                 qrDialogType === "accept" ? "#2e7d32" : "#d32f2f",
//                                             borderRadius: 3,
//                                             p: 2,
//                                             textAlign: "center",
//                                             display: "flex",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                             minHeight: "300px",
//                                         }}
//                                     >
//                                         {qrDialogType === "accept" ? "ACCEPTED" : "REJECTED"}
//                                     </Box>
//                                 </Grid>

//                                 {/* DETAILS SECTION */}
//                                 <Grid item xs={7}>
//                                     <Box sx={{ p: 1 }}>

//                                         {/* BASIC DETAILS */}
//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Part Number:{" "}
//                                             <span style={{ fontWeight: 400 }}>{form.partNumber}</span>
//                                         </Typography>

//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Item No:{" "}
//                                             <span style={{ fontWeight: 400 }}>{form.totalQty-form.rejectedInSample}</span>
//                                         </Typography>

//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Description:{" "}
//                                             <span style={{ fontWeight: 400 }}>{form.description}</span>
//                                         </Typography>

//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Quantity:{" "}
//                                             <span style={{ fontWeight: 400 }}>{form.totalQty}</span>
//                                         </Typography>

//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             PO No:{" "}
//                                             <span style={{ fontWeight: 400 }}>{form.poNo}</span>
//                                         </Typography>

//                                         <Divider sx={{ my: 1 }} />

//                                         {/* INSPECTOR */}
//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Inspected By:{" "}
//                                             <span style={{ fontWeight: 400 }}>
//                                                 {form.inspectorName} ({form.inspectorStaffNo})
//                                             </span>
//                                         </Typography>

//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Inspection Date:{" "}
//                                             <span style={{ fontWeight: 400 }}>
//                                                 {form.inspectorDate}
//                                             </span>
//                                         </Typography>

//                                         <Divider sx={{ my: 1 }} />

//                                         {/* APPROVER */}
//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Approved By:{" "}
//                                             <span style={{ fontWeight: 400 }}>
//                                                 {form.approverName} ({form.approverStaffNo})
//                                             </span>
//                                         </Typography>

//                                         <Typography sx={{ fontWeight: 700 }}>
//                                             Approval Date:{" "}
//                                             <span style={{ fontWeight: 400 }}>
//                                                 {form.approvalDate}
//                                             </span>
//                                         </Typography>

//                                         <Divider sx={{ my: 1 }} />

//                                         {/* REASON */}
//                                         <Typography sx={{ fontWeight: 700, mb: 1 }}>
//                                             Reason for {qrDialogType === "accept" ? "Acceptance" : "Rejection"}:
//                                         </Typography>
//                                         <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
//                                             {form.reason || "N/A"}
//                                         </Typography>

//                                     </Box>
//                                 </Grid>

//                                 {/* QR CODE SECTION */}
//                                 <Grid
//                                     item
//                                     xs={0}
//                                     sx={{
//                                         display: "flex",
//                                         justifyContent: "start",
//                                         alignItems: "",
//                                     }}
//                                 >
//                                     <Box

//                                     >
//                                         <QRCodeCanvas
//                                             value={JSON.stringify(qrPayload)}
//                                             size={140}
//                                             bgColor="#ffffff"
//                                             fgColor={qrDialogType === "accept" ? "#2e7d32" : "#c62828"}
//                                             level="H"
//                                         />
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                         </DialogContent>

//                         <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color={qrDialogType === "accept" ? "success" : "error"}
//                                 onClick={() => setQrDialogOpen(false)}
//                                 sx={{
//                                     fontWeight: 800,
//                                     px: 4,
//                                     borderRadius: 2,
//                                 }}
//                             >
//                                 <HighlightOffIcon></HighlightOffIcon>
//                             </Button>
//                         </DialogActions>
//                     </Dialog>


//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    DialogActions,
    DialogTitle,
    Dialog,
    DialogContent,
    Typography,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import DimensionalForm from './DimensionalForm';
import SubContractForm from "./SubContractForm";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { QrCode2 } from "@mui/icons-material";
import { TaskAlt } from "@mui/icons-material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Tooltip from "@mui/material/Tooltip";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { QRCodeCanvas } from "qrcode.react";


import PhysicalForm from "../SubContractInspection/PhysicalForm";
import ElectricalForm from "../SubContractInspection/ElectricalForm";
import IndenterInterventionSection from "./IndenterInterventionSection";

export default function SubContractInspection() {
    // --------------------------------------------
    // STATE MANAGEMENT
    // --------------------------------------------
    const [filter, setFilter] = useState("pending");
    const [tab, setTab] = useState("pending");
    const [pendingData, setPendingData] = useState([]);
    const [showExtra, setShowExtra] = useState(false);
    const [inspectionSummary, setInspectionSummary] = useState({ accepted: 0, rejected: 0 });
    const [electricalSummary, setElectricalSummary] = useState({ accepted: 0, rejected: 0 });
    const [referenceno, setReferenceNo] = useState([]);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [qrDialogType, setQrDialogType] = useState("");  // "accept" | "reject"


    const [selectedId, setSelectedId] = useState(null);

    const [form, setForm] = useState({
        partNumber: "",
        mpn: "",
        batchNo: "",
        poNo: "",
        vendor: "",
        totalQty: 0,
        samplingPercent: 10,
        sampleQty: 0,
        Description: "",
        acceptedInSample: "",
        rejectedInSample: "",
        inspectorName: "",
        inspectorStaffNo: "",
        inspectorDate: "",
        inspectorSignature: null,
        inspectorSignaturePreview: null,
        fodCheck: false,
        approverName: "",
        approverStaffNo: "",
        approvalDate: "",
        approverSignature: null,
        approverSignaturePreview: null,
        category: "", // Added category to state
    });



    const [report, setReport] = useState({
        controlNo: "",
        remarks: "",
    });

    const [qrOpen, setQrOpen] = useState(false);
    const [qrType, setQrType] = useState(null);
    const [qrPayload, setQrPayload] = useState("");
    const [hoveredRow, setHoveredRow] = useState(null);
    const [dimensiondata, setDimensionData] = useState(null);
    const [activeCard, setActiveCard] = useState("pending");
    const [percentError, setPercentError] = useState("");
    const [indenterIntervention, setIndenterIntervention] = useState(false);
    const [processOnHold, setProcessOnHold] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(true);

    const [isFormASaveEnabled, setIsFormASaveEnabled] = useState(false);


    // --------------------------------------------
    // FETCH PENDING GR LIST
    // --------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://192.168.0.149:8000/generateddetails");
                const formattedData = res.data.map((item) => ({
                    slno: item.SL_No,
                    partNumber: item.BEL_Part_Number,
                    description: item.Description,
                    mpn: item.MPN,
                    batchNo: item.Batch_Lot_No,
                    dateCode: item.DateCode,
                    quantity: item.Quantity,
                    poNo: item.BEL_PO_No,
                    vendor: item.Vendor_Name,
                    oemMake: item.OEM_Make,
                    manufacture: item.Manufacturing_Place,
                    grNo: item.GR_No || "",
                    grDate: item.GR_Date ? item.GR_Date.split("T")[0] : "",
                    receiptNo: item.Reference_No || "",
                }));
                setPendingData(formattedData);
            } catch {
                const dummyData = [
                    {
                        SL_No: 1,
                        GR_No: "GR2025-001",
                        GR_Date: "2025-01-15T10:23:00.000Z",
                        BEL_Part_Number: "423458754153",
                        MPN: "MPN-AX45",
                        Batch_Lot_No: "BATCH-789",
                        DateCode: "2024-12",
                        Quantity: 150,
                        BEL_PO_No: "PO-56789",
                        Vendor_Name: "ABC Electronics Pvt Ltd",
                        OEM_Make: "Siemens",
                        Manufacturing_Place: "Germany",
                        Reference_No: "RCPT-001"
                    },
                    {
                        SL_No: 2,
                        GR_No: "GR2025-002",
                        GR_Date: "2025-01-20T09:10:00.000Z",
                        BEL_Part_Number: "245875415332",
                        MPN: "MPN-ZX90",
                        Batch_Lot_No: "BATCH-456",
                        DateCode: "2025-01",
                        Quantity: 300,
                        BEL_PO_No: "PO-99887",
                        Vendor_Name: "Global Tech Supplies",
                        OEM_Make: "Honeywell",
                        Manufacturing_Place: "USA",
                        Reference_No: "RCPT-002"
                    },
                    {
                        SL_No: 3,
                        GR_No: "GR2025-003",
                        GR_Date: "2025-01-22T14:45:00.000Z",
                        BEL_Part_Number: "165654678900",
                        MPN: "MPN-QT12",
                        Batch_Lot_No: "BATCH-123",
                        DateCode: "2024-10",
                        Quantity: 75,
                        BEL_PO_No: "PO-11223",
                        Vendor_Name: "Precision Components Ltd",
                        OEM_Make: "Bosch",
                        Manufacturing_Place: "India",
                        Reference_No: "RCPT-003"
                    }
                ];

                const formattedDummy = dummyData.map((item) => ({
                    slno: item.SL_No,
                    grNo: item.GR_No || "",
                    grDate: item.GR_Date ? item.GR_Date.split("T")[0] : "",
                    partNumber: item.BEL_Part_Number,
                    mpn: item.MPN,
                    batchNo: item.Batch_Lot_No,
                    dateCode: item.DateCode,
                    quantity: item.Quantity,
                    poNo: item.BEL_PO_No,
                    vendor: item.Vendor_Name,
                    oemMake: item.OEM_Make,
                    manufacture: item.Manufacturing_Place,
                    receiptNo: item.Reference_No || "",
                }));

                setPendingData(formattedDummy);
            }
        };
        fetchData();
    }, []);

    // --------------------------------------------
    // AUTOFILL FORM WHEN SELECTED ID CHANGES
    // --------------------------------------------
    useEffect(() => {
        if (selectedId == null) {
            setForm((f) => ({
                ...f,
                partNumber: "",
                mpn: "",
                batchNo: "",
                poNo: "",
                description: "",
                vendor: "",
                totalQty: 0,
                description: '',
                sampleQty: 0,
                samplingPercent: 10,
                acceptedInSample: "",
                rejectedInSample: "",
            }));
            return;
        }

        const row = pendingData.find((r) => r.slno === selectedId);
        if (!row) return;

        setForm((f) => ({
            ...f,
            partNumber: row.partNumber,
            mpn: row.mpn,
            description: row.description,
            batchNo: row.batchNo,
            poNo: row.poNo,
            totalQty: row.quantity,
            vendor: row.vendor,
            samplingPercent: 10,
            sampleQty: Math.round((row.quantity * 10) / 100),
            acceptedInSample: "",
            rejectedInSample: "",
        }));
    }, [selectedId]);

    // --------------------------------------------
    // RECALC SAMPLE QTY WHEN SAMPLING PERCENT OR TOTAL QTY CHANGES
    // --------------------------------------------
    useEffect(() => {
        const p = Number(form.samplingPercent || 0);
        const total = Number(form.totalQty || 0);
        if (isNaN(p) || p < 0) return;
        const s = Math.round((total * Math.max(0, Math.min(100, p))) / 100);
        setForm((f) => ({ ...f, sampleQty: s }));
    }, [form.samplingPercent, form.totalQty]);

    // --------------------------------------------
    // RECALC REJECTED WHEN ACCEPTED IN SAMPLE CHANGES
    // --------------------------------------------
    useEffect(() => {
        const acc = form.acceptedInSample === "" ? null : Number(form.acceptedInSample);
        if (acc === null || isNaN(acc)) {
            setForm((f) => ({ ...f, rejectedInSample: "" }));
            return;
        }
        const rej = Number(form.sampleQty) - acc;
        setForm((f) => ({ ...f, rejectedInSample: String(rej >= 0 ? rej : 0) }));
    }, [form.acceptedInSample, form.sampleQty]);

    // --------------------------------------------
    // HANDLE PART NUMBER CLICK (FETCH REPORTS)
    // --------------------------------------------
    const handlePartNumberClick = (row) => {
        const baseURL = "http://192.168.0.149:8000/subcontractinspectionreport";

        axios.get(baseURL, {
            params: {
                Ref_No: row.receiptNo
            }
        })
            .then((res) => {
                setHoveredRow(res.data);
                setReferenceNo(res.data.Reference_No);
                setIsCardOpen(true);
            })
            .catch((err) => console.error("API error:", err));

        const baseURL2 = "http://192.168.0.149:8000/dimensionreport";

        axios.get(baseURL2, {
            params: {
                Ref_No: row.receiptNo
            }
        })
            .then((res) => {
                setDimensionData(res.data);

                console.log("fgfghfh", res.data)
            })
            .catch((err) => console.error("API error:", err));
    };

    // --------------------------------------------
    // QR PAYLOAD BUILDER
    // --------------------------------------------



    const acceptedItemNo =
        Number(form.totalQty) - Number(form.rejectedInSample);

    const rejectedItemNo = Number(form.rejectedInSample);

    // FINAL ITEM NO FOR QR
    const finalItemNo =
        qrDialogType === "accept" ? acceptedItemNo : rejectedItemNo;

    const buildQrPayload = (type) => {
        return {
            status: type === "accept" ? "ACCEPTED" : "REJECTED",
            partNumber: form.partNumber,
            itemNo: finalItemNo,
            description: form.description,
            quantity: form.totalQty,
            poNumber: form.poNumber,
            inspectorName: form.inspectorName,
            inspectorStaffNo: form.inspectorStaffNo,
            inspectorDate: form.inspectorDate,
            approverName: form.approverName,
            approverStaffNo: form.approverStaffNo,
            approvalDate: form.approvalDate,
            reason: form.reason || "",
        };
    };


    const handleInterventionStatus = async (referenceno, status) => {
        try {
            const response = await fetch("/api/intervention-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ referenceno, status }),
            });

            const result = await response.json();
            console.log("Status updated:", result);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // --------------------------------------------
    // VALIDATION BEFORE OPENING QR
    // --------------------------------------------
    function validateBeforeQr() {
        // -----------------------------------------
        // 0. Basic Checks
        // -----------------------------------------

        if (!form.partNumber)
            return "Select a row from the GR list first.";

        if (form.totalQty <= 0)
            return "Invalid total quantity.";


        // ========================================================
        // 1. INSPECTED BY VALIDATION
        // ========================================================
        // Compute inspection totals
        const totalInspected =
            Number(inspectionSummary.accepted || 0) +
            Number(inspectionSummary.rejected || 0) +
            Number(electricalSummary.accepted || 0) +
            Number(electricalSummary.rejected || 0);

        // Ensure Physical/Electrical inspection is done
        if (totalInspected <= 0)
            return "Inspection not completed. Perform physical/electrical inspection first.";

        // If process is ON HOLD — block QR generation
        if (processOnHold)
            return "Process is on hold. Resume before generating QR.";

        // Name
        if (!form.inspectorName || form.inspectorName.trim() === "")
            return "Enter Inspector Name.";

        // Staff No
        if (!form.inspectorStaffNo || form.inspectorStaffNo.trim() === "")
            return "Enter Inspector Staff No.";

        // Signature (File Upload)
        if (!form.inspectorSignature)
            return "Upload Inspector Digital Signature.";

        // Date
        if (!form.inspectorDate)
            return "Select Inspector Date.";


        // ========================================================
        // 2. APPROVED BY VALIDATION
        // ========================================================

        // Name
        if (!form.approverName || form.approverName.trim() === "")
            return "Enter Approver Name.";

        // Staff No
        if (!form.approverStaffNo || form.approverStaffNo.trim() === "")
            return "Enter Approver Staff No.";

        // Signature (File Upload)
        if (!form.approverSignature)
            return "Upload Approver Digital Signature.";

        // Date
        if (!form.approvalDate)
            return "Select Approval Date.";

        // if (!isFormASaveEnabled) {
        //      alert("Pending");
        //      return;
        // }
        // Continue with Accept action
        // alert("Accepted!");


        // ========================================================
        // If everything is correct → return null
        // ========================================================

        return null;
    }




    function handleOpenQr(type) {
        const err = validateBeforeQr();
        if (err) {
            alert(err);   // You can replace alert with Snackbar later
            return;
        }

        // Set dialog type ("accept" / "reject")
        setQrDialogType(type);

        // Prepare payload for QR (your existing logic)
        const payload = buildQrPayload(type);
        setQrPayload(payload);

        // Open the dialog
        setQrDialogOpen(true);
    }



    function handleCloseQr() {
        setQrOpen(false);
        setQrPayload("");
        setQrType(null);
    }



    // --------------------------------------------
    // STYLES
    // --------------------------------------------
    const cardStyle = (active, from, to) => ({
        background: active ? `linear-gradient(90deg, ${from}, ${to})` : "#f5f7fa",
        color: active ? "white" : "#222",
        cursor: "pointer",
        boxShadow: active ? "0 8px 20px rgba(16,24,40,0.12)" : "0 2px 8px rgba(16,24,40,0.06)",
        borderRadius: 1,
        transition: "all 0.18s ease",
    });

    // --------------------------------------------
    // RENDER
    // --------------------------------------------

    const handleSave = async () => {
        try {
            const formData = new FormData();

            // Inspector details
            formData.append("Name", form.inspectorName);
            formData.append("Staff_No", form.inspectorStaffNo);
            formData.append("Role", "Inspector");
            formData.append("Reference_No", referenceno)
            if (form.inspectorSignature)
                formData.append("file", form.inspectorSignature);

            // FOD check
            // formData.append("fodCheck", form.fodCheck);

            // Approver details
            formData.append("Name", form.approverName);
            formData.append("Staff_No", form.approverStaffNo);
            // formData.append("approvalDate", form.approvalDate);
            formData.append("Role", "Approver");
            if (form.approverSignature)
                formData.append("file", form.approverSignature);

            console.log("formData", formData);

            // Axios POST request
            const response = await axios.post("http://192.168.0.149:8000/authorized-person/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Saved successfully:", response.data);
            alert("Inspection details saved successfully!");
        } catch (error) {
            console.error("Error saving inspection details:", error);
            alert("Failed to save inspection details.");
        }
    };

    return (

        <Box sx={{ p: 1, minHeight: "100vh" }}>
            <Card sx={{ maxWidth: 3000, mx: "auto", borderRadius: 3, color: "#bf1212" }}>
                <CardContent>
                    <img src={'http://192.168.0.149:8000/image/1'} alt='noimage' />
                    <Typography id="title" value="subcontract" variant="h4" align="center" sx={{ fontWeight: 800, mb: 5, fontFamily: 'Roboto' }}>
                        SUB CONTRACT INSPECTION
                    </Typography>

                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                        <Grid item>
                            <Card
                                onClick={() => setTab("pending")}
                                sx={{
                                    width: 200,
                                    p: 2,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    boxShadow: tab === "pending"
                                        ? "0 4px 20px rgba(25,118,210,0.4)"
                                        : "0 2px 8px rgba(0,0,0,0.15)",
                                    background: tab === "pending"
                                        ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                                        : "#e3f2fd",
                                    color: tab === "pending" ? "white" : "black",
                                    transition: "0.25s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <PendingActionsIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" fontWeight={700}>Pending GR List</Typography>
                            </Card>
                        </Grid>

                        <Grid item>
                            <Card
                                onClick={() => setTab("accepted")}
                                sx={{
                                    width: 200,
                                    p: 2,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    boxShadow: tab === "accepted"
                                        ? "0 4px 20px rgba(46,125,50,0.4)"
                                        : "0 2px 8px rgba(0,0,0,0.15)",
                                    background: tab === "accepted"
                                        ? "linear-gradient(135deg, #2e7d32, #66bb6a)"
                                        : "#e8f5e9",
                                    color: tab === "accepted" ? "white" : "black",
                                    transition: "0.25s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" fontSize={19} fontWeight={700}>Accepted GR List</Typography>
                            </Card>
                        </Grid>

                        <Grid item>
                            <Card
                                onClick={() => setTab("rejected")}
                                sx={{
                                    width: 200,
                                    p: 2,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    boxShadow: tab === "rejected"
                                        ? "0 4px 20px rgba(211,47,47,0.4)"
                                        : "0 2px 8px rgba(0,0,0,0.15)",
                                    background: tab === "rejected"
                                        ? "linear-gradient(135deg, #d32f2f, #ef5350)"
                                        : "#ffebee",
                                    color: tab === "rejected" ? "white" : "black",
                                    transition: "0.25s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <CancelIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" fontWeight={700}>Rejected GR List</Typography>
                            </Card>
                        </Grid>

                        <Grid item>
                            <Card
                                onClick={() => setTab("total")}
                                sx={{
                                    width: 200,
                                    p: 2,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    boxShadow: tab === "total"
                                        ? "0 4px 20px rgba(25,118,210,0.4)"
                                        : "0 2px 8px rgba(0,0,0,0.15)",
                                    background: tab === "total"
                                        ? "linear-gradient(135deg, #1565c0, #64b5f6)"
                                        : "#e3f2fd",
                                    color: tab === "total" ? "white" : "black",
                                    transition: "0.25s",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <SummarizeIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" fontWeight={700}>Total</Typography>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        {tab === "pending" && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                backgroundColor: "#e3f2fd",
                                                borderRadius: "12px",
                                                boxShadow: "0px 4px 20px rgba(0,0,0,0.12)",
                                                border: "1px solid #bbdefb",
                                                transition: "0.3s",
                                                "&:hover": {
                                                    boxShadow: "0px 8px 28px rgba(0,0,0,0.18)",
                                                }
                                            }}
                                        >
                                            <Typography
                                                variant="h5"
                                                align="center"
                                                sx={{
                                                    mb: 2,
                                                    fontWeight: "bold",
                                                    fontFamily: "Times New Roman",
                                                    color: "black",
                                                    textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                                                }}
                                            >
                                                PENDING GR LIST FOR INSPECTION
                                            </Typography>

                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        {[
                                                            "Sl No",
                                                            "BEL Part Number",
                                                            "MPN",
                                                            "Description",
                                                            "Batch No",
                                                            "Date Code",
                                                            "Quantity",
                                                            "BEL PO No",
                                                            "Vendor",
                                                            "OEM Make",
                                                            "Manufacture",
                                                            "GR No",
                                                            "GR Date",
                                                            "Reference No"
                                                        ].map((h) => (
                                                            <TableCell
                                                                key={h}
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: "white",
                                                                    backgroundColor: "#1565c0",
                                                                    fontFamily: "Times New Roman",
                                                                    borderRight: "1px solid #bbdefb",
                                                                    "&:last-child": { borderRight: "none" },
                                                                }}
                                                            >
                                                                {h}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {pendingData.map((row, i) => (
                                                        <TableRow
                                                            key={i}
                                                            hover
                                                            onClick={() => setSelectedId(row.slno)}
                                                            sx={{
                                                                backgroundColor:
                                                                    selectedId === row.slno ? "#c8e6c9" : "white",
                                                                cursor: "pointer",
                                                                fontFamily: "Times New Roman",
                                                                transition: "0.2s ease",
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        selectedId === row.slno
                                                                            ? "#aedfae"
                                                                            : "#f1f8ff",
                                                                    transform: "scale(1.01)",
                                                                },
                                                            }}
                                                        >
                                                            <TableCell>{row.slno}</TableCell>

                                                            <TableCell
                                                                style={{
                                                                    color: "#0d47a1",
                                                                    fontWeight: 700,
                                                                    textDecoration: "underline",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => handlePartNumberClick(row)}
                                                            >
                                                                {row.partNumber}
                                                            </TableCell>

                                                            <TableCell>{row.grNo}</TableCell>
                                                            <TableCell>{row.grDate}</TableCell>
                                                            <TableCell>{row.mpn}</TableCell>
                                                            <TableCell>{row.mpn}</TableCell>
                                                            <TableCell>{row.batchNo}</TableCell>
                                                            <TableCell>{row.dateCode}</TableCell>
                                                            <TableCell>{row.quantity}</TableCell>
                                                            <TableCell>{row.poNo}</TableCell>
                                                            <TableCell>{row.vendor}</TableCell>
                                                            <TableCell>{row.oemMake}</TableCell>
                                                            <TableCell>{row.manufacture}</TableCell>
                                                            <TableCell>{row.receiptNo}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>

                                        {isCardOpen && (
                                            <SubContractForm
                                                selectedRow={hoveredRow}
                                                onClose={() => setIsCardOpen(false)}
                                            />
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={12}>
                                        <Paper sx={{ p: 2, mb: 2, background: "#e3f2fd" }}>
                                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'black', fontFamily: 'Times New Roman' }}>
                                                SELECTED ITEM IMPORTANT DETAILS
                                            </Typography>

                                            <Grid container spacing={1}>
                                                <Grid container spacing={2} sx={{ width: "100%", mx: "auto" }}>
                                                    <Grid item xs={12} container spacing={2}>
                                                        <Grid item xs={3}>
                                                            <Box
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    background: "white",
                                                                    boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
                                                                    border: "1px solid #bbdefb",
                                                                    transition: "0.3s",
                                                                    "&:hover": {
                                                                        transform: "scale(1.03)",
                                                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                                                                    },
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontSize: 16,
                                                                        fontWeight: 700,
                                                                        color: "#1565c0",
                                                                        fontFamily: "Times New Roman",
                                                                    }}
                                                                >
                                                                    Part No
                                                                </Typography>
                                                                <Box sx={{ mt: 1 }}>
                                                                    <Typography sx={{ fontWeight: 700 }}>
                                                                        {form.partNumber || "-"}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>

                                                        <Grid item xs={3}>
                                                            <Box
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    background: "white",
                                                                    boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
                                                                    border: "1px solid #bbdefb",
                                                                    transition: "0.3s",
                                                                    "&:hover": {
                                                                        transform: "scale(1.03)",
                                                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                                                                    },
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontSize: 16,
                                                                        fontWeight: 700,
                                                                        color: "#1565c0",
                                                                        fontFamily: "Times New Roman",
                                                                    }}
                                                                >
                                                                    MPN
                                                                </Typography>
                                                                <Box sx={{ mt: 1 }}>
                                                                    <Typography sx={{ fontWeight: 700 }}>
                                                                        {form.mpn || "-"}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>

                                                        <Grid item xs={3}>
                                                            <Box
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    background: "white",
                                                                    boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
                                                                    border: "1px solid #bbdefb",
                                                                    transition: "0.3s",
                                                                    "&:hover": {
                                                                        transform: "scale(1.03)",
                                                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                                                                    },
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontSize: 16,
                                                                        fontWeight: 800,
                                                                        color: "#1565c0",
                                                                        fontFamily: "Times New Roman",
                                                                    }}
                                                                >
                                                                    Batch No
                                                                </Typography>
                                                                <Box sx={{ mt: 1 }}>
                                                                    <Typography sx={{ fontWeight: 700 }}>
                                                                        {form.batchNo || "-"}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>

                                                        <Grid item xs={3}>
                                                            <Box
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    background: "white",
                                                                    boxShadow: "0px 3px 12px rgba(0,0,0,0.12)",
                                                                    border: "1px solid #c8e6c9",
                                                                    transition: "0.3s",
                                                                    "&:hover": {
                                                                        transform: "scale(1.03)",
                                                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                                                                    },
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontSize: 16,
                                                                        fontWeight: 700,
                                                                        color: "#2e7d32",
                                                                        fontFamily: "Times New Roman",
                                                                    }}
                                                                >
                                                                    Total Qty
                                                                </Typography>
                                                                <Box sx={{ mt: 1 }}>
                                                                    <Typography sx={{ fontWeight: 800, color: "green" }}>
                                                                        {form.totalQty}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                {/* NEW INDENTER INTERVENTION COMPONENT INSERTED HERE */}
                                                <IndenterInterventionSection
                                                    form={form}
                                                    setForm={setForm}
                                                    indenterIntervention={indenterIntervention}
                                                    setIndenterIntervention={setIndenterIntervention}
                                                    setProcessOnHold={setProcessOnHold}
                                                    processOnHold={processOnHold}
                                                    referenceno={referenceno}
                                                    handleInterventionStatus={handleInterventionStatus}
                                                />

                                                <Grid item xs={12}>
                                                    {!processOnHold && form.category && (
                                                        <Box sx={{ mt: 3 }}>
                                                            {form.category === "Mechanical" && (
                                                                <PhysicalForm sampleCount={15} onSummaryChange={setInspectionSummary} selectedRow={dimensiondata} Ref_no={referenceno} />
                                                            )}

                                                            {form.category === "Electrical" && (
                                                                <ElectricalForm onSummaryChange={setElectricalSummary} selectedRow={dimensiondata} sampleCount={15} Ref_no={referenceno} />
                                                            )}

                                                            {form.category === "Electromechanical" && (
                                                                <>
                                                                    <PhysicalForm sampleCount={15} onSummaryChange={setInspectionSummary} selectedRow={dimensiondata} Ref_no={referenceno} />
                                                                    <Box sx={{ mt: 4 }} />
                                                                    <ElectricalForm onSummaryChange={setElectricalSummary} selectedRow={dimensiondata} sampleCount={15} Ref_no={referenceno} />
                                                                </>
                                                            )}
                                                        </Box>
                                                    )}

                                                    <Divider sx={{ my: 1 }} />

                                                    {processOnHold && (
                                                        <Paper sx={{ mt: 2, p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                                            <PauseCircleOutlineIcon color="warning" sx={{ fontSize: 40 }} />
                                                            <Box>
                                                                <Typography variant="body1">
                                                                    Process is on hold awaiting indenter response.
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    Click resume to continue.
                                                                </Typography>

                                                                <Box sx={{ mt: 1 }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setProcessOnHold(false);
                                                                            setIndenterIntervention(false);
                                                                        }}
                                                                    >
                                                                        Resume Process
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Paper>
                                                    )}
                                                </Grid>


                                                {/* INSPECTION SUMMARY */}

                                                <Grid item xs={12}>
                                                    <Card
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: 3,
                                                            boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
                                                            background: "linear-gradient(145deg, #e3f2fd, #ffffff)",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: "bold", mb: 2, fontSize: 16, fontWeight: 'bold', color: '#0d47a1', fontFamily: 'Times New Roman' }}


                                                        >
                                                            INSPECTION SUMMARY
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                justifyContent: "center",
                                                                gap: 3,
                                                                mt: 2,
                                                            }}
                                                        >
                                                            {/* Qty Received */}
                                                            <Card
                                                                sx={{
                                                                    p: 2,
                                                                    width: 200,
                                                                    borderRadius: 2,
                                                                    textAlign: "center",
                                                                    background: "white",
                                                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                                                                    alignContent: "center",

                                                                }}
                                                            >
                                                                <Typography sx={{ color: "#555", fontWeight: 600 }}>
                                                                    Qty Received
                                                                </Typography>
                                                                <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#1b5e20" }}>
                                                                    {form.totalQty}
                                                                </Typography>
                                                            </Card>

                                                            {/* Qty Inspected */}
                                                            <Card
                                                                sx={{
                                                                    p: 2,
                                                                    width: 200,
                                                                    borderRadius: 2,
                                                                    textAlign: "center",
                                                                    background: "white",
                                                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                                                                    alignContent: "center",

                                                                }}
                                                            >
                                                                <Typography sx={{ color: "#555", fontWeight: 600 }}>
                                                                    Qty Inspected
                                                                </Typography>
                                                                <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#0277bd" }}>
                                                                    {Number(inspectionSummary.accepted || 0) +
                                                                        Number(inspectionSummary.rejected || 0) +
                                                                        Number(electricalSummary.accepted || 0) +
                                                                        Number(electricalSummary.rejected || 0)}
                                                                </Typography>
                                                            </Card>

                                                            {/* Accepted */}
                                                            <Card
                                                                sx={{
                                                                    p: 2,
                                                                    width: 200,
                                                                    borderRadius: 2,
                                                                    textAlign: "center",
                                                                    background: "white",
                                                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                                                                    alignContent: "center",

                                                                }}
                                                            >
                                                                <Typography sx={{ color: "#555", fontWeight: 600 }}>
                                                                    Accepted
                                                                </Typography>
                                                                <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#2e7d32" }}>
                                                                    {Number(inspectionSummary.accepted || 0) +
                                                                        Number(electricalSummary.accepted || 0)}
                                                                </Typography>
                                                            </Card>

                                                            {/* Rejected */}
                                                            <Card
                                                                sx={{
                                                                    p: 2,
                                                                    width: 200,
                                                                    borderRadius: 2,
                                                                    textAlign: "center",
                                                                    background: "white",
                                                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                                                                    alignContent: "center",

                                                                }}
                                                            >
                                                                <Typography sx={{ color: "#555", fontWeight: 600 }}>
                                                                    Rejected
                                                                </Typography>
                                                                <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#c62828" }}>
                                                                    {Number(inspectionSummary.rejected || 0) +
                                                                        Number(electricalSummary.rejected || 0)}
                                                                </Typography>

                                                            </Card>
                                                            <Card sx={{
                                                                p: 2,
                                                                width: 600,
                                                                borderRadius: 2,
                                                                textAlign: "center",
                                                                background: "white",
                                                                boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                                                            }}
                                                            >
                                                                <Typography sx={{ color: "#555", fontWeight: 600 }}>
                                                                    Remarks
                                                                </Typography>
                                                                <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#c62828" }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        multiline
                                                                        // rows={3}
                                                                        placeholder="Enter remarks here..."
                                                                        sx={{
                                                                            background: "white",
                                                                            borderRadius: 2,
                                                                            "& .MuiOutlinedInput-root": {
                                                                                borderRadius: 2
                                                                            }
                                                                        }}
                                                                        value={report.remarks}
                                                                        onChange={(e) =>
                                                                            setReport((prev) => ({ ...prev, remarks: e.target.value }))
                                                                        }
                                                                    />
                                                                </Typography>

                                                            </Card>

                                                        </Box>


                                                    </Card>
                                                </Grid>

                                                {/* FULL INSPECTION & APPROVAL SECTION */}
                                                
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Card
                                                            sx={{
                                                                p: 4,
                                                                mt: 3,
                                                                borderRadius: 4,
                                                                background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
                                                                boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
                                                                border: "1px solid #d0e2ff",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                sx={{
                                                                    fontWeight: "bold",
                                                                    mb: 2,
                                                                    fontSize: 16,
                                                                    color: "#0d47a1",
                                                                    fontFamily: "Times New Roman",
                                                                }}
                                                            >
                                                                INSPECTION & APPROVAL DETAILS
                                                            </Typography>

                                                            {/* ROW CONTAINER */}
                                                            <Grid container spacing={4}>
                                                                {/* Inspector Details */}
                                                                <Grid item xs={12} md={4}>
                                                                    <Card
                                                                        sx={{
                                                                            p: 3,
                                                                            borderRadius: 3,
                                                                            background: "rgba(255,255,255,0.8)",
                                                                            backdropFilter: "blur(6px)",
                                                                            boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
                                                                            border: "1px solid #bbdefb",
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                mb: 2,
                                                                                color: "#1565c0",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            🧑‍🔧 Inspector Details
                                                                        </Typography>

                                                                        <Grid container spacing={2}>
                                                                            <Grid item xs={6}>
                                                                                <TextField
                                                                                    label="Name"
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    value={form.inspectorName}
                                                                                    onChange={(e) =>
                                                                                        setForm((f) => ({
                                                                                            ...f,
                                                                                            inspectorName: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <TextField
                                                                                    label="Staff No"
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    value={form.inspectorStaffNo}
                                                                                    onChange={(e) =>
                                                                                        setForm((f) => ({
                                                                                            ...f,
                                                                                            inspectorStaffNo: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <TextField
                                                                                    type="date"
                                                                                    label="Date"
                                                                                    InputLabelProps={{ shrink: true }}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    value={form.inspectorDate}
                                                                                    onChange={(e) =>
                                                                                        setForm((f) => ({ ...f, inspectorDate: e.target.value }))
                                                                                    }
                                                                                />
                                                                            </Grid>

                                                                            {/* Upload Button */}
                                                                            <Grid item xs={6}>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    component="label"
                                                                                    fullWidth
                                                                                    sx={{
                                                                                        background: "linear-gradient(135deg, #64b5f6, #1976d2)",
                                                                                        color: "white",
                                                                                        fontWeight: 600,
                                                                                        borderRadius: 2,
                                                                                        "&:hover": {
                                                                                            background: "linear-gradient(135deg, #42a5f5, #0d47a1)",
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    Upload Signature
                                                                                    <input
                                                                                        type="file"
                                                                                        hidden
                                                                                        accept="image/*"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files[0];
                                                                                            if (file) {
                                                                                                setForm((f) => ({
                                                                                                    ...f,
                                                                                                    inspectorSignature: file,
                                                                                                    inspectorSignaturePreview:
                                                                                                        URL.createObjectURL(file),
                                                                                                }));
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Button>
                                                                            </Grid>

                                                                            {/* Preview */}
                                                                            {form.inspectorSignaturePreview && (
                                                                                <Grid item xs={12}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: "100%",
                                                                                            height: 75,
                                                                                            borderRadius: 2,
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            background: "#e3f2fd",
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={form.inspectorSignaturePreview}
                                                                                            alt="Signature"
                                                                                            style={{
                                                                                                maxWidth: "100%",
                                                                                                maxHeight: "70px",
                                                                                                objectFit: "contain",
                                                                                            }}
                                                                                        />
                                                                                    </Box>
                                                                                </Grid>
                                                                            )}
                                                                        </Grid>
                                                                    </Card>
                                                                </Grid>

                                                                {/* FOD Check */}
                                                                <Grid item xs={12} md={4}>
                                                                    <Card
                                                                        sx={{
                                                                            p: 3,
                                                                            borderRadius: 3,
                                                                            background: "rgba(255,255,255,0.85)",
                                                                            backdropFilter: "blur(6px)",
                                                                            textAlign: "center",
                                                                            border: "1px solid #c8e6c9",
                                                                            boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
                                                                            alignContent: "center",
                                                                            height: "100%",
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                mb: 2,
                                                                                color: "#2e7d32",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            ✔️ FOD Check
                                                                        </Typography>

                                                                        <Checkbox
                                                                            checked={form.fodCheck}
                                                                            onChange={(e) =>
                                                                                setForm((f) => ({ ...f, fodCheck: e.target.checked }))
                                                                            }
                                                                            sx={{
                                                                                transform: "scale(1.3)",
                                                                                color: "#2e7d32",
                                                                            }}
                                                                        />

                                                                        <Typography sx={{ fontWeight: 600, color: "#1b5e20" }}>
                                                                            FOD Check Completed
                                                                        </Typography>
                                                                    </Card>
                                                                </Grid>

                                                                {/* Approver Details */}
                                                                <Grid item xs={12} md={4}>
                                                                    <Card
                                                                        sx={{
                                                                            p: 3,
                                                                            borderRadius: 3,
                                                                            background: "rgba(255,255,255,0.8)",
                                                                            backdropFilter: "blur(6px)",
                                                                            boxShadow: "0px 5px 18px rgba(0,0,0,0.10)",
                                                                            border: "1px solid #bbdefb",
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                mb: 2,
                                                                                color: "#0d47a1",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            📝 Approver Details
                                                                        </Typography>

                                                                        <Grid container spacing={2}>
                                                                            <Grid item xs={6}>
                                                                                <TextField
                                                                                    label="Name"
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    value={form.approverName}
                                                                                    onChange={(e) =>
                                                                                        setForm((f) => ({ ...f, approverName: e.target.value }))
                                                                                    }
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <TextField
                                                                                    label="Staff No"
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    value={form.approverStaffNo}
                                                                                    onChange={(e) =>
                                                                                        setForm((f) => ({
                                                                                            ...f,
                                                                                            approverStaffNo: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <TextField
                                                                                    type="date"
                                                                                    label="Date"
                                                                                    InputLabelProps={{ shrink: true }}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    value={form.approvalDate}
                                                                                    onChange={(e) =>
                                                                                        setForm((f) => ({ ...f, approvalDate: e.target.value }))
                                                                                    }
                                                                                />
                                                                            </Grid>

                                                                            {/* Upload */}
                                                                            <Grid item xs={6}>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    component="label"
                                                                                    fullWidth
                                                                                    sx={{
                                                                                        background: "linear-gradient(135deg, #7986cb, #303f9f)",
                                                                                        color: "white",
                                                                                        fontWeight: 600,
                                                                                        borderRadius: 2,
                                                                                        "&:hover": {
                                                                                            background: "linear-gradient(135deg, #5c6bc0, #1a237e)",
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    Upload Signature
                                                                                    <input
                                                                                        type="file"
                                                                                        hidden
                                                                                        accept="image/*"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files[0];
                                                                                            if (file) {
                                                                                                setForm((f) => ({
                                                                                                    ...f,
                                                                                                    approverSignature: file,
                                                                                                    approverSignaturePreview:
                                                                                                        URL.createObjectURL(file),
                                                                                                }));
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Button>
                                                                            </Grid>

                                                                            {/* Preview */}
                                                                            {form.approverSignaturePreview && (
                                                                                <Grid item xs={12}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: "100%",
                                                                                            height: 75,
                                                                                            borderRadius: 2,
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            background: "#e8eaf6",
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={form.approverSignaturePreview}
                                                                                            alt="Signature"
                                                                                            style={{
                                                                                                maxWidth: "100%",
                                                                                                maxHeight: "70px",
                                                                                                objectFit: "contain",
                                                                                            }}
                                                                                        />
                                                                                    </Box>
                                                                                </Grid>
                                                                            )}
                                                                        </Grid>
                                                                    </Card>
                                                                </Grid>
                                                            </Grid>
                                                        </Card>
                                                    </Grid>
                                                </Grid>



                                                <Grid item xs={12} sx={{ mt: 2 }}>
                                                    <Stack direction="row" justifyContent="center" spacing={2} >
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSave}
                                                        >
                                                            Save Inspection Details
                                                        </Button>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => handleOpenQr("accept")}
                                                            disabled={!form.partNumber}
                                                            style={{ width: '3rem' }}
                                                        >
                                                            <TaskAlt></TaskAlt><QrCode2></QrCode2>
                                                        </Button>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => handleOpenQr("reject")}
                                                            disabled={!form.partNumber}
                                                            style={{ width: '3rem' }}
                                                        >
                                                            <HighlightOffIcon></HighlightOffIcon><QrCode2></QrCode2>
                                                        </Button>
                                                    </Stack>
                                                </Grid>

                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Box>

                    <Dialog
                        open={qrDialogOpen}
                        onClose={() => setQrDialogOpen(false)}
                        maxWidth="md"
                        fullWidth

                        PaperProps={{
                            sx: {

                                borderRadius: 3,
                                background:
                                    qrDialogType === "accept"
                                        ? "linear-gradient(135deg, #e8f5e9, #ffffff)"
                                        : "linear-gradient(135deg, #ffebee, #ffffff)",
                                border: `3px solid ${qrDialogType === "accept" ? "#4caf50" : "#f44336"
                                    }`,
                                p: 2,
                            },
                        }}
                    >
                        <DialogTitle
                            sx={{
                                textAlign: "center",
                                fontWeight: 900,
                                fontSize: "1.7rem",
                                color: qrDialogType === "accept" ? "#1b5e20" : "#b71c1c",
                            }}
                        >
                            {qrDialogType === "accept"
                                ? "APPROVAL CONFIRMED"
                                : "REJECTION CONFIRMED"}
                        </DialogTitle>

                        <DialogContent>
                            <Grid container spacing={1}>

                                {/* STATUS LABEL */}
                                <Grid item xs={2}>
                                    <Box
                                        sx={{
                                            height: "50%",
                                            writingMode: "sideways-lr",
                                            textOrientation: "sideways",
                                            fontWeight: 900,
                                            letterSpacing: 3,
                                            fontSize: "1.5rem",
                                            color: "white",
                                            background:
                                                qrDialogType === "accept" ? "#2e7d32" : "#d32f2f",
                                            borderRadius: 3,
                                            p: 2,
                                            textAlign: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            minHeight: "300px",
                                        }}
                                    >
                                        {qrDialogType === "accept" ? "ACCEPTED" : "REJECTED"}
                                    </Box>
                                </Grid>

                                {/* DETAILS SECTION */}
                                <Grid item xs={7}>
                                    <Box sx={{ p: 1 }}>

                                        {/* BASIC DETAILS */}
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Part Number:{" "}
                                            <span style={{ fontWeight: 400 }}>{form.partNumber}</span>
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            Item No:{" "}
                                            <span style={{ fontWeight: 400 }}>{form.totalQty - form.rejectedInSample}</span>
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            Description:{" "}
                                            <span style={{ fontWeight: 400 }}>{form.description}</span>
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            Quantity:{" "}
                                            <span style={{ fontWeight: 400 }}>{form.totalQty}</span>
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            PO No:{" "}
                                            <span style={{ fontWeight: 400 }}>{form.poNo}</span>
                                        </Typography>

                                        <Divider sx={{ my: 1 }} />

                                        {/* INSPECTOR */}
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Inspected By:{" "}
                                            <span style={{ fontWeight: 400 }}>
                                                {form.inspectorName} ({form.inspectorStaffNo})
                                            </span>
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            Inspection Date:{" "}
                                            <span style={{ fontWeight: 400 }}>
                                                {form.inspectorDate}
                                            </span>
                                        </Typography>

                                        <Divider sx={{ my: 1 }} />

                                        {/* APPROVER */}
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Approved By:{" "}
                                            <span style={{ fontWeight: 400 }}>
                                                {form.approverName} ({form.approverStaffNo})
                                            </span>
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            Approval Date:{" "}
                                            <span style={{ fontWeight: 400 }}>
                                                {form.approvalDate}
                                            </span>
                                        </Typography>

                                        <Divider sx={{ my: 1 }} />

                                        {/* REASON */}
                                        <Typography sx={{ fontWeight: 700, mb: 1 }}>
                                            Reason for {qrDialogType === "accept" ? "Acceptance" : "Rejection"}:
                                        </Typography>
                                        <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                                            {form.reason || "N/A"}
                                        </Typography>

                                    </Box>
                                </Grid>

                                {/* QR CODE SECTION */}
                                <Grid
                                    item
                                    xs={0}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "",
                                    }}
                                >
                                    <Box

                                    >
                                        <QRCodeCanvas
                                            value={JSON.stringify(qrPayload)}
                                            size={140}
                                            bgColor="#ffffff"
                                            fgColor={qrDialogType === "accept" ? "#2e7d32" : "#c62828"}
                                            level="H"
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                            <Button
                                variant="contained"
                                color={qrDialogType === "accept" ? "success" : "error"}
                                onClick={() => setQrDialogOpen(false)}
                                sx={{
                                    fontWeight: 800,
                                    px: 4,
                                    borderRadius: 2,
                                }}
                            >
                                <HighlightOffIcon></HighlightOffIcon>
                            </Button>
                        </DialogActions>
                    </Dialog>


                </CardContent>
            </Card>
        </Box>
    );
}