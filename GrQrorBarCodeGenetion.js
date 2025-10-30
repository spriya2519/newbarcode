// import React, { useState, useEffect, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Paper,
//   Box,
//   MenuItem,
// } from "@mui/material";
// import axios from "axios";
// import QRCode from "qrcode.react";
// import JsBarcode from "jsbarcode";
// import { useReactToPrint } from "react-to-print";
// import { Camera, Table as TableIcon, Image, QrCode } from "lucide-react";

// const GrQrorBarCodeGenetion = () => {
//   const [activeCard, setActiveCard] = useState(null);
//   const [pendingData, setPendingData] = useState([]);
//   const [generatedData, setGeneratedData] = useState([]);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [reprintSearch, setReprintSearch] = useState("");
//   const [filteredReprint, setFilteredReprint] = useState([]);
//   const [selectedReprint, setSelectedReprint] = useState(null);
//   const [showQR, setShowQR] = useState(false);
//   const [showBarcode, setShowBarcode] = useState(false);
//   const [reprintQR, setReprintQR] = useState(false);
//   const [reprintBarcode, setReprintBarcode] = useState(false);
//   const printRef = useRef();

//   // Dummy fetch simulation
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("/api/pending");
//         setPendingData(res.data);
//       } catch {
//         const dummy = [
//           {
//             partNumber: "7896541230",
//             mpn: "ABCTEMP-16.000000MHZ",
//             batchNo: "220,240200011-002",
//             dateCode: "2512",
//             quantity: "12000",
//             poNo: "BEPO/EP/4100161001",
//             oemMake: "EPSON",
//             manufacture: "JAPAN",
//             grNo: "15500",
//             grDate: "28/10/2025",
//             receiptNo: "457",
//           },
//           {
//             partNumber: "4561237890",
//             mpn: "XYZTEMP-12.000000MHZ",
//             batchNo: "220,240200011-005",
//             dateCode: "2510",
//             quantity: "8000",
//             poNo: "BEPO/EP/4100161005",
//             oemMake: "SAMSUNG",
//             manufacture: "KOREA",
//             grNo: "15505",
//             grDate: "25/10/2025",
//             receiptNo: "460",
//           },
//         ];
//         setPendingData(dummy);
//         setGeneratedData(
//           dummy.map((d) => ({ ...d, referenceNo: "REF" + d.grNo }))
//         );
//       }
//     };
//     fetchData();
//   }, []);

//   // Hover on Part Number
//   const handleHover = (row) => {
//     setSelectedPart(row);
//     setShowQR(false);
//     setShowBarcode(false);
//     setDialogOpen(true);
//   };

//   // Generate QR
//   const handleGenerateQR = () => {
//     setShowQR(true);
//     setShowBarcode(false);
//   };

//   // Generate Barcode
//   const handleGenerateBarcode = () => {
//     setShowBarcode(true);
//     setShowQR(false);
//     const canvas = document.createElement("canvas");
//     JsBarcode(canvas, selectedPart.referenceNo || selectedPart.partNumber, {
//       format: "CODE128",
//     });
//     document.getElementById("barcode").src = canvas.toDataURL("image/png");
//   };

//   // Print both QR and Barcode
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });

//   // Update specific pending row
//   const handleUpdateRow = (row) => {
//     alert(`Updating data for Part: ${row.partNumber} (dummy POST request)`);
//   };

//   // Reprint search
//   const handleSearchChange = (e) => {
//     const val = e.target.value.toLowerCase();
//     setReprintSearch(val);

//     const filtered = generatedData.filter((d) =>
//       Object.values(d).some((x) => x.toString().toLowerCase().includes(val))
//     );

//     setFilteredReprint(filtered);
//     if (filtered.length === 1) {
//       setSelectedReprint(filtered[0]);
//     } else {
//       setSelectedReprint(null);
//     }
//   };

//   // Reprint QR + Barcode generation
//   const handleReprintQR = () => {
//     if (!selectedReprint) return;
//     setReprintQR(true);
//   };

//   const handleReprintBarcode = () => {
//     if (!selectedReprint) return;
//     setReprintBarcode(true);
//     const canvas = document.createElement("canvas");
//     JsBarcode(canvas, selectedReprint.referenceNo, {
//       format: "CODE128",
//     });
//     document.getElementById("reprint-barcode").src = canvas.toDataURL("image/png");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//        <Box
//         sx={{
//           p: 4,
//           minHeight: "100vh",
//           background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
//         }}
//       >
        
//         <Typography
//           variant="h3"
//           sx={{
//             fontWeight: "bold",
//             color: "#0e0b0bff",
//             mb: 4,
//             textShadow: "2px 4px 8px rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent:"center",
//             gap: 1,
//           }}
//         >
//           <QrCode size={42} />
//            Welcome to IG Store
//         </Typography>

//       {/* --- Cards Section --- */}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={4}>
//           <Card
//             onClick={() => setActiveCard("pending")}
//             style={{ backgroundColor: "#ffcccc", cursor: "pointer" }}
//           >
//             <CardContent>
//               <Typography variant="h6" align="center">
//                 QR/Barcode - Yet To Generate
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={4}>
//           <Card
//             onClick={() => setActiveCard("generated")}
//             style={{ backgroundColor: "#ccffcc", cursor: "pointer" }}
//           >
//             <CardContent>
//               <Typography variant="h6" align="center">
//                 QR/Barcode - Generated
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={4}>
//           <Card
//             onClick={() => setActiveCard("reprint")}
//             style={{ backgroundColor: "#cce5ff", cursor: "pointer" }}
//           >
//             <CardContent>
//               <Typography variant="h6" align="center">
//                 Reprint
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* --- Pending Table --- */}
//       <div style={{ marginTop: 30 }}>
//         {activeCard === "pending" && (
//           <>
      
//             <Typography variant="h6">Pending QR/Barcode Creation</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Part Number</TableCell>
//                   <TableCell>MPN</TableCell>
//                   <TableCell>Batch No</TableCell>
//                   <TableCell>Date Code</TableCell>
//                   <TableCell>Quantity</TableCell>
//                   <TableCell>PO No</TableCell>
//                   <TableCell>OEM Make</TableCell>
//                   <TableCell>Manufacture</TableCell>
//                   <TableCell>GR No</TableCell>
//                   <TableCell>GR Date</TableCell>
//                   <TableCell>Receipt No</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {pendingData.map((row, i) => (
//                   <TableRow key={i}>
//                     <TableCell>
//                       <a
//                         href="#"
//                         onMouseEnter={() => handleHover(row)}
//                         style={{ color: "blue", textDecoration: "underline" }}
//                       >
//                         {row.partNumber}
//                       </a>
//                     </TableCell>
//                     <TableCell>{row.mpn}</TableCell>
//                     <TableCell>{row.batchNo}</TableCell>
//                     <TableCell>{row.dateCode}</TableCell>
//                     <TableCell>{row.quantity}</TableCell>
//                     <TableCell>{row.poNo}</TableCell>
//                     <TableCell>{row.oemMake}</TableCell>
//                     <TableCell>{row.manufacture}</TableCell>
//                     <TableCell>{row.grNo}</TableCell>
//                     <TableCell>{row.grDate}</TableCell>
//                     <TableCell>{row.receiptNo}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleUpdateRow(row)}
//                       >
//                         Update
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
            
//           </>
//         )}

//         {/* --- Generated Table --- */}
//         {activeCard === "generated" && (
//           <>
//             <Typography variant="h6">Generated QR/Barcode Details</Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Part Number</TableCell>
//                   <TableCell>Reference No</TableCell>
//                   <TableCell>GR No</TableCell>
//                   <TableCell>PO No</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {generatedData.map((row, i) => (
//                   <TableRow key={i}>
//                     <TableCell>
//                       <a
//                         href="#"
//                         onMouseEnter={() => handleHover(row)}
//                         style={{ color: "blue", textDecoration: "underline" }}
//                       >
//                         {row.partNumber}
//                       </a>
//                     </TableCell>
//                     <TableCell>{row.referenceNo}</TableCell>
//                     <TableCell>{row.grNo}</TableCell>
//                     <TableCell>{row.poNo}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </>
//         )}

//         {/* --- Reprint Section --- */}
//         {activeCard === "reprint" && (
//           <>
//             <Typography variant="h6">Reprint QR/Barcode</Typography>
//             <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//               <TextField
//                 label="Search or Enter Data"
//                 value={reprintSearch}
//                 onChange={handleSearchChange}
//                 style={{ minWidth: 250 }}
//               />

//               {selectedReprint && (
//                 <>
//                   <TextField
//                     label="Receipt No"
//                     value={selectedReprint.receiptNo}
//                     disabled
//                     style={{ width: 120 }}
//                   />
//                   <Button variant="contained" onClick={handleReprintQR}>
//                     View QR
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={handleReprintBarcode}
//                   >
//                     View Barcode
//                   </Button>
//                   <Button variant="outlined" onClick={handlePrint}>
//                     Print Both
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* Show generated QR & Barcode together */}
//             {selectedReprint && (reprintQR || reprintBarcode) && (
//               <div ref={printRef} style={{ textAlign: "center", marginTop: 20 }}>
//                 {reprintQR && (
//                   <QRCode
//                     value={JSON.stringify(selectedReprint)}
//                     size={128}
//                     includeMargin={true}
//                   />
//                 )}
//                 {reprintBarcode && (
//                   <img
//                     id="reprint-barcode"
//                    // alt="barcode"
//                     style={{ marginTop: 10 }}
//                   />
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* --- Details Dialog --- */}
//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Details</DialogTitle>
//         <DialogContent dividers>
//           {selectedPart && (
//             <Table size="small">
//               <TableBody>
//                 {Object.entries(selectedPart).map(([key, value]) => (
//                   <TableRow key={key}>
//                     <TableCell style={{ fontWeight: "bold" }}>{key}</TableCell>
//                     <TableCell>{value}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}

//           <div ref={printRef} style={{ textAlign: "center", marginTop: 10 }}>
//             {showQR && selectedPart && (
//               <QRCode
//                 value={JSON.stringify(selectedPart)}
//                 size={128}
//                 level="H"
//                 includeMargin={true}
//               />
//             )}
//             {showBarcode && (
//               <img id="barcode" alt="barcode" style={{ marginTop: 10 }} />
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleGenerateQR} variant="contained" color="primary">
//             Generate QR
//           </Button>
//           <Button
//             onClick={handleGenerateBarcode}
//             variant="contained"
//             color="secondary"
//           >
//             Generate Barcode
//           </Button>
//           <Button onClick={handlePrint} variant="outlined">
//             Print
//           </Button>
//           <Button onClick={() => setDialogOpen(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//       </Box>
//     </div>
//   );
// };

// export default GrQrorBarCodeGenetion;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Paper,
//   Box,
// } from "@mui/material";
// import axios from "axios";
// // import QRCode from "qrcode.react";
// import JsBarcode from "jsbarcode";
// import { useReactToPrint } from "react-to-print";
// import { QrCode } from "lucide-react";

// import { QRCodeCanvas } from "qrcode.react";



// const GrQrorBarCodeGenetion = () => {
//   const [activeCard, setActiveCard] = useState(null);
//   const [pendingData, setPendingData] = useState([]);
//   const [generatedData, setGeneratedData] = useState([]);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [reprintSearch, setReprintSearch] = useState("");
//   const [filteredReprint, setFilteredReprint] = useState([]);
//   const [selectedReprint, setSelectedReprint] = useState(null);
//   const [showQR, setShowQR] = useState(false);
//   const [showBarcode, setShowBarcode] = useState(false);
//   const [reprintQR, setReprintQR] = useState(false);
//   const [reprintBarcode, setReprintBarcode] = useState(false);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("/api/pending");
//         setPendingData(res.data);
//       } catch {
//         const dummy = [
//           {
//             partNumber: "7896541230",
//             mpn: "ABCTEMP-16.000000MHZ",
//             batchNo: "220,240200011-002",
//             dateCode: "2512",
//             quantity: "12000",
//             poNo: "BEPO/EP/4100161001",
//             oemMake: "EPSON",
//             manufacture: "JAPAN",
//             grNo: "15500",
//             grDate: "28/10/2025",
//             receiptNo: "457",
//           },
//           {
//             partNumber: "4561237890",
//             mpn: "XYZTEMP-12.000000MHZ",
//             batchNo: "220,240200011-005",
//             dateCode: "2510",
//             quantity: "8000",
//             poNo: "BEPO/EP/4100161005",
//             oemMake: "SAMSUNG",
//             manufacture: "KOREA",
//             grNo: "15505",
//             grDate: "25/10/2025",
//             receiptNo: "460",
//           },
//         ];
//         setPendingData(dummy);
//         setGeneratedData(
//           dummy.map((d) => ({ ...d, referenceNo: "REF" + d.grNo }))
//         );
//       }
//     };
//     fetchData();
//   }, []);

//   const handleHover = (row) => {
//     setSelectedPart(row);
//     setShowQR(false);
//     setShowBarcode(false);
//     setDialogOpen(true);
//   };

//   const handleGenerateQR = () => {
//     setShowQR(true);
//     setShowBarcode(false);
//   };

//   const handleGenerateBarcode = () => {
//     setShowBarcode(true);
//     setShowQR(false);
//     const canvas = document.createElement("canvas");
//     JsBarcode(canvas, selectedPart.referenceNo || selectedPart.partNumber, {
//       format: "CODE128",
//     });
//     const imgEl = document.getElementById("barcode");
//     if (imgEl) imgEl.src = canvas.toDataURL("image/png");
//   };

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });

//   const handleUpdateRow = (row) => {
//     alert(`Updating data for Part: ${row.partNumber} (dummy POST request)`);
//   };

//   const handleSearchChange = (e) => {
//     const val = e.target.value.toLowerCase();
//     setReprintSearch(val);
//     const filtered = generatedData.filter((d) =>
//       Object.values(d).some((x) => x.toString().toLowerCase().includes(val))
//     );
//     setFilteredReprint(filtered);
//     if (filtered.length === 1) setSelectedReprint(filtered[0]);
//     else setSelectedReprint(null);
//   };

//   const handleReprintQR = () => {
//     if (!selectedReprint) return;
//     setReprintQR(true);
//   };

//   const handleReprintBarcode = () => {
//     if (!selectedReprint) return;
//     setReprintBarcode(true);
//     const canvas = document.createElement("canvas");
//     JsBarcode(canvas, selectedReprint.referenceNo, {
//       format: "CODE128",
//     });
//     const imgEl = document.getElementById("reprint-barcode");
//     if (imgEl) imgEl.src = canvas.toDataURL("image/png");
//   };

//   const cardStyle = (type, color1, color2) => ({
//     background: `linear-gradient(135deg, ${color1}, ${color2})`,
//     cursor: "pointer",
//     boxShadow:
//       activeCard === type
//         ? "0 6px 20px rgba(0,0,0,0.3)"
//         : "0 2px 10px rgba(0,0,0,0.1)",
//     transform: activeCard === type ? "scale(1.05)" : "scale(1)",
//     transition: "all 0.3s ease",
//     borderRadius: 15,
//   });

//   return (
//     <Box
//       sx={{
//         p: 4,
//         minHeight: "100vh",
//         background: "linear-gradient(120deg, #fcfbfbff 0%, #bbdefb 100%)",
//       }}
//     >
//       <Typography
//         variant="h3"
//         sx={{
//           fontWeight: "bold",
//           color: "#0d47a1",
//           mb: 4,
//           textShadow: "2px 3px 8px rgba(0,0,0,0.3)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 1,
//         }}
//       >
//         <QrCode size={42} /> Welcome to IG Store
//       </Typography>

//       {/* --- Cards Section --- */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={4}>
//           <Card
//             onClick={() => setActiveCard("pending")}
//             style={cardStyle("pending", "#ff9a9e", "#fad0c4")}
//           >
//             <CardContent>
//               <Typography variant="h6" align="center">
//                  QR/Barcode - Yet To Generate
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card
//             onClick={() => setActiveCard("generated")}
//             style={cardStyle("generated", "#cfeda8ff", "#e9fed6ff")}
//           >
//             <CardContent>
//               <Typography variant="h6" align="center">
//                 QR/Barcode - Generated
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card
//             onClick={() => setActiveCard("reprint")}
//             style={cardStyle("reprint", "#89f7fe", "#66a6ff")}
//           >
//             <CardContent>
//               <Typography variant="h6" align="center">
//                 Reprint
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* --- Dynamic Section --- */}
//       <Box sx={{ mt: 4 }}>
//         {/* --- Pending Table --- */}
//         {activeCard === "pending" && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Pending QR/Barcode Creation
//             </Typography>
//             <Paper sx={{ overflow: "auto", borderRadius: 3 }}>
//               <Table stickyHeader>
//                 <TableHead sx={{ background: "#f48fb1" }}>
//                   <TableRow>
//                     {[
//                       "Part Number",
//                       "MPN",
//                       "Batch No",
//                       "Date Code",
//                       "Quantity",
//                       "PO No",
//                       "OEM Make",
//                       "Manufacture",
//                       "GR No",
//                       "GR Date",
//                       "Receipt No",
//                       "Action",
//                     ].map((header) => (
//                       <TableCell
//                         key={header}
//                         sx={{ fontWeight: "bold", color: "white" }}
//                       >
//                         {header}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {pendingData.map((row, i) => (
//                     <TableRow key={i} hover>
//                       <TableCell>
//                         <a
//                           href="#"
//                           onMouseEnter={() => handleHover(row)}
//                           style={{
//                             color: "#1565c0",
//                             textDecoration: "underline",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {row.partNumber}
//                         </a>
//                       </TableCell>
//                       <TableCell>{row.mpn}</TableCell>
//                       <TableCell>{row.batchNo}</TableCell>
//                       <TableCell>{row.dateCode}</TableCell>
//                       <TableCell>{row.quantity}</TableCell>
//                       <TableCell>{row.poNo}</TableCell>
//                       <TableCell>{row.oemMake}</TableCell>
//                       <TableCell>{row.manufacture}</TableCell>
//                       <TableCell>{row.grNo}</TableCell>
//                       <TableCell>{row.grDate}</TableCell>
//                       <TableCell>{row.receiptNo}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           size="small"
//                           sx={{
//                             background: "linear-gradient(45deg,#f06292,#f8bbd0)",
//                             color: "#fff",
//                             fontWeight: "bold",
//                           }}
//                           onClick={() => handleUpdateRow(row)}
//                         >
//                           Update
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Paper>
//           </>
//         )}

//         {/* --- Generated Table --- */}
//         {activeCard === "generated" && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Generated QR/Barcode Details
//             </Typography>
//             <Paper sx={{ overflow: "auto", borderRadius: 3 }}>
//               <Table stickyHeader>
//                 <TableHead sx={{ background: "#81c784" }}>
//                   <TableRow>
//                     {["Part Number", "Reference No", "GR No", "PO No"].map(
//                       (header) => (
//                         <TableCell
//                           key={header}
//                           sx={{ fontWeight: "bold", color: "white" }}
//                         >
//                           {header}
//                         </TableCell>
//                       )
//                     )}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {generatedData.map((row, i) => (
//                     <TableRow key={i} hover>
//                       <TableCell>
//                         <a
//                           href="#"
//                           onMouseEnter={() => handleHover(row)}
//                           style={{
//                             color: "#1b5e20",
//                             fontWeight: "bold",
//                             textDecoration: "underline",
//                           }}
//                         >
//                           {row.partNumber}
//                         </a>
//                       </TableCell>
//                       <TableCell>{row.referenceNo}</TableCell>
//                       <TableCell>{row.grNo}</TableCell>
//                       <TableCell>{row.poNo}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Paper>
//           </>
//         )}

//         {/* --- Reprint Section --- */}
//         {activeCard === "reprint" && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Reprint QR/Barcode
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
//               <TextField
//                 label="Search or Enter Data"
//                 value={reprintSearch}
//                 onChange={handleSearchChange}
//                 sx={{ minWidth: 250, bgcolor: "#fff" }}
//               />
//               {selectedReprint && (
//                 <>
//                   <TextField
//                     label="Receipt No"
//                     value={selectedReprint.receiptNo}
//                     disabled
//                     sx={{ width: 120 }}
//                   />
//                   <Button variant="contained" color="success" onClick={handleReprintQR}>
//                     View QR
//                   </Button>
//                   <Button
//                     variant="contained"
//                     sx={{ background: "#0288d1" }}
//                     onClick={handleReprintBarcode}
//                   >
//                     View Barcode
//                   </Button>
//                   <Button variant="outlined" color="secondary" onClick={handlePrint}>
//                     Print Both
//                   </Button>
//                 </>
//               )}
//             </Box>

//             {selectedReprint && (reprintQR || reprintBarcode) && (
//               <div ref={printRef} style={{ textAlign: "center", marginTop: 20 }}>
//                 {reprintQR && (
//                   <QRCodeCanvas   value={JSON.stringify(selectedReprint)} size={300} includeMargin={true} />

//                   // <QRCode
//                   //   value={JSON.stringify(selectedReprint)}
//                   //   size={128}
//                   //   includeMargin={true}
//                   // />

                  
//                 )}
//                 {reprintBarcode && (
//                   <img id="reprint-barcode" style={{ marginTop: 10 }} />
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </Box>

//       {/* --- Details Dialog --- */}
//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle sx={{ bgcolor: "#f48fb1", color: "white", fontWeight: "bold" }}>
//           Details
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedPart && (
//             <Table size="small">
//               <TableBody>
//                 {Object.entries(selectedPart).map(([key, value]) => (
//                   <TableRow key={key}>
//                     <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
//                       {key}
//                     </TableCell>
//                     <TableCell>{value}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}

//           <div ref={printRef} style={{ textAlign: "center", marginTop: 10 }}>
//             {showQR && selectedPart && (
//               <QRCodeCanvas value={JSON.stringify(selectedPart)} size={300} includeMargin={true} />

//               // <QRCode
//               //   value={JSON.stringify(selectedPart)}
//               //   size={128}
//               //   level="H"
//               //   includeMargin={true}
//               // />
//             )}
//             {showBarcode && (
//               <img id="barcode" alt="barcode" style={{ marginTop: 10 }} />
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleGenerateQR} variant="contained" color="primary">
//             Generate QR
//           </Button>
//           <Button
//             onClick={handleGenerateBarcode}
//             variant="contained"
//             color="secondary"
//           >
//             Generate Barcode
//           </Button>
//           <Button onClick={handlePrint} variant="outlined" color="success">
//             Print
//           </Button>
//           <Button onClick={() => setDialogOpen(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default GrQrorBarCodeGenetion;
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { useReactToPrint } from "react-to-print";
import { QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf"; // 

/**
 * GrQrorBarCodeGenetion
 * - QR content: formatted text (readable by regular scanners)
 * - Barcode: generated and stored as dataURL so it appears on first click
 * - Print Both prints the visible QR + barcode container
 */
const GrQrorBarCodeGenetion = () => {
  const [activeCard, setActiveCard] = useState("pending");
  const [pendingData, setPendingData] = useState([]);
  const [generatedData, setGeneratedData] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [reprintSearch, setReprintSearch] = useState("");
  const [filteredReprint, setFilteredReprint] = useState([]);
  const [selectedReprint, setSelectedReprint] = useState(null);

  const [showQR, setShowQR] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(null); // for dialog
  const [reprintQR, setReprintQR] = useState(false);
  const [reprintBarcode, setReprintBarcode] = useState(false);
  const [reprintBarcodeDataUrl, setReprintBarcodeDataUrl] = useState(null);

  const printRef = useRef();

  // --- Helpers ---
  const formatDetailsAsText = (obj) => {
    if (!obj) return "";
    return Object.entries(obj)
      .map(([k, v]) => `${toLabel(k)}: ${v}`)
      .join("\n");
  };

  const toLabel = (key) =>
    // simple key -> human label conversion, you can extend map if needed
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const generateBarcodeDataUrl = (value, opts = {}) => {
    // returns dataURL synchronously
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      displayValue: true,
      ...opts,
    });
    return canvas.toDataURL("image/png");
  };

  // --- Initial fetch / dummy data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/pending"); // keep original API
        setPendingData(res.data);
        setGeneratedData(res.data.map((d) => ({ ...d, referenceNo: d.referenceNo || "REF" + (d.grNo || "") })));
      } catch {
        const dummy = [
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
          {
            partNumber: "4561237890",
            mpn: "XYZTEMP-12.000000MHZ",
            batchNo: "220,240200011-005",
            dateCode: "2510",
            quantity: "8000",
            poNo: "BEPO/EP/4100161005",
            oemMake: "SAMSUNG",
            manufacture: "KOREA",
            grNo: "15505",
            grDate: "25/10/2025",
            receiptNo: "460",
          },
        ];
        setPendingData(dummy);
        setGeneratedData(dummy.map((d) => ({ ...d, referenceNo: "REF" + d.grNo })));
      }
    };
    fetchData();
  }, []);

  // --- Selected Part dialog open (generate default barcode immediately when requested) ---
  useEffect(() => {
    if (showBarcode && selectedPart) {
      // generate immediate barcode data URL for dialog
      const val = selectedPart.referenceNo || selectedPart.partNumber || "";
      const url = generateBarcodeDataUrl(val, { lineColor: "#0D47A1" });
      setBarcodeDataUrl(url);
    }
  }, [showBarcode, selectedPart]);

  // --- Reprint barcode generation
  useEffect(() => {
    if (reprintBarcode && selectedReprint) {
      const val = selectedReprint.referenceNo || selectedReprint.partNumber || "";
      const url = generateBarcodeDataUrl(val, { lineColor: "#0D47A1" });
      setReprintBarcodeDataUrl(url);
    }
  }, [reprintBarcode, selectedReprint]);

  // --- Handlers ---
  const handleHover = (row) => {
    setSelectedPart(row);
    setShowQR(false);
    setShowBarcode(false);
    setBarcodeDataUrl(null);
    setDialogOpen(true);
  };

  const handleGenerateQR = () => {
    setShowQR(true);
    // keep barcode false unless user generates it
  };

  const handleGenerateBarcode = () => {
    setShowBarcode(true);
    // barcodeDataUrl will be generated by effect above
  };

  const handleUpdateRow = (row) => {
    // placeholder
    alert(`Updating data for Part: ${row.partNumber} (dummy POST request)`);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value.toLowerCase();
    setReprintSearch(val);
    const filtered = generatedData.filter((d) =>
      Object.values(d).some((x) => String(x).toLowerCase().includes(val))
    );
    setFilteredReprint(filtered);
    setSelectedReprint(filtered.length === 1 ? filtered[0] : null);
  };

  const handleReprintQR = () => {
    if (!selectedReprint) return;
    setReprintQR(true);
  };

  const handleReprintBarcode = () => {
    if (!selectedReprint) return;
    setReprintBarcode(true);
    // reprintBarcodeDataUrl will be set by effect
  };

  // Print container (prints whatever is inside printRef at that time)
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // For dialog: print both QR + barcode
  const handlePrintBothFromDialog = () => {
  

      if (!selectedReprint) return;

  // Ensure both are visible
  setShowQR(true);
  setShowBarcode(true);

  // Wait for QR & Barcode to render in DOM
  setTimeout(() => {
    try {
      const pdf = new jsPDF("p", "pt", "a4");
      pdf.setFontSize(14);
      pdf.text("QR & Barcode Reprint", 40, 40);

      // 🟢 get QR image from the QRCodeCanvas inside your reprint section
      const qrCanvas = document.querySelector("#reprintQR canvas");
      const qrImage = qrCanvas ? qrCanvas.toDataURL("image/png") : null;

      let y = 70;

      if (qrImage) {
        pdf.addImage(qrImage, "PNG", 40, y, 200, 200);
        y += 220;
      }

      if (reprintBarcodeDataUrl) {
        pdf.addImage(reprintBarcodeDataUrl, "PNG", 40, y, 300, 80);
        y += 100;
      }

      // 🧾 Add details text below
      const detailsText = Object.entries(selectedReprint)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const lines = pdf.splitTextToSize(detailsText, 500);
      pdf.text(lines, 40, y + 30);

      // 💾 Save as PDF
      pdf.save(`${selectedReprint.partNumber || "label"}_Reprint.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }, 600); // wait to ensure QR/Barcode fully rendered
  };

  // For reprint: print both
  // const handlePrintBothFromReprint = () => {
  //   if (!selectedReprint) return;
  //   setReprintQR(true);
  //   setReprintBarcode(true);
  //   // reprintBarcodeDataUrl generated by effect on reprintBarcode
  //   setTimeout(() => {
  //     handlePrint();
  //   }, 400);
  // };

  const handlePrintBothFromReprint = () => {
  if (!selectedReprint) return;

  // Ensure both are visible
  setReprintQR(true);
  setReprintBarcode(true);

  // Wait for QR & Barcode to render in DOM
  setTimeout(() => {
    try {
      const pdf = new jsPDF("p", "pt", "a4");
      pdf.setFontSize(14);
      pdf.text("QR & Barcode Reprint", 40, 40);

      // 🟢 get QR image from the QRCodeCanvas inside your reprint section
      const qrCanvas = document.querySelector("#reprintQR canvas");
      const qrImage = qrCanvas ? qrCanvas.toDataURL("image/png") : null;

      let y = 70;

      if (qrImage) {
        pdf.addImage(qrImage, "PNG", 40, y, 200, 200);
        y += 220;
      }

      if (reprintBarcodeDataUrl) {
        pdf.addImage(reprintBarcodeDataUrl, "PNG", 40, y, 300, 80);
        y += 100;
      }

      // 🧾 Add details text below
      const detailsText = Object.entries(selectedReprint)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const lines = pdf.splitTextToSize(detailsText, 500);
      pdf.text(lines, 40, y + 30);

      // 💾 Save as PDF
      pdf.save(`${selectedReprint.partNumber || "label"}_Reprint.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }, 600); // wait to ensure QR/Barcode fully rendered
};
  // Utility: render table rows for full details (used in dialog and elsewhere)
  const renderDetailRows = (obj) =>
    Object.entries(obj).map(([k, v]) => (
      <TableRow key={k}>
        <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>{toLabel(k)}</TableCell>
        <TableCell>{v}</TableCell>
      </TableRow>
    ));

  // Card style (more professional)
  const cardStyle = (active, from, to) => ({
    background: active ? `linear-gradient(90deg, ${from}, ${to})` : "#f5f7fa",
    color: active ? "white" : "#222",
    cursor: "pointer",
    boxShadow: active ? "0 8px 20px rgba(16,24,40,0.12)" : "0 2px 8px rgba(16,24,40,0.06)",
    borderRadius: 1,
    transition: "all 0.18s ease",
  });

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "linear-gradient(180deg,#f7f9fc 0%,#eef3f8 100%)" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#0D3B66", mb: 3, display: "flex", alignItems: "center", gap: 1,justifyContent:"center" }}>
      Welcome to IG Store
      </Typography>

      {/* Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button onClick={() => setActiveCard("pending")} sx={cardStyle(activeCard === "pending", "#a1170dff", "#d23e19ff")}>
      
              <Typography variant="h6" align="center">Barcode - Yet to Generate</Typography>
            
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button onClick={() => setActiveCard("generated")} sx={cardStyle(activeCard === "generated", "#116466", "#388E3C")}>
        
              <Typography variant="h6" align="center">Barcode - Generated</Typography>
           
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button onClick={() => setActiveCard("reprint")} sx={cardStyle(activeCard === "reprint", "#4B0082", "#2E8B57")}>
            
              <Typography variant="h6" align="center">Reprint</Typography>
            
          </Button>
        </Grid>
      </Grid>

      {/* --- CONTENT BELOW --- */}
      <Box mt={4}>
        {/* Pending Table (full details) */}
        {activeCard === "pending" && (
          <>
            <Typography  variant="h6" sx={{ mb: 2, color: "#0D3B66" }}>Pending QR/Barcode Creation</Typography>
            <Paper sx={{ overflow: "auto", borderRadius: 2 }}>
              <Table stickyHeader>
                
                <TableHead sx={{ background: "#0D47A1", color: "white" }}>
                  <TableRow>
                    {["BEL Part Number", "MPN", "Batch No", "Date Code", "Quantity", "BEL PO No", "OEM Make", "Manufacture", "GR No", "GR Date", "Receipt No", "Action"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: "black" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingData.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell onClick={() => handleHover(row)} sx={{ color: "#0D47A1", cursor: "pointer", textDecoration: "underline" }}>{row.partNumber}</TableCell>
                      <TableCell>{row.mpn}</TableCell>
                      <TableCell>{row.batchNo}</TableCell>
                      <TableCell>{row.dateCode}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.poNo}</TableCell>
                      <TableCell>{row.oemMake}</TableCell>
                      <TableCell>{row.manufacture}</TableCell>
                      <TableCell>{row.grNo}</TableCell>
                      <TableCell>{row.grDate}</TableCell>
                      <TableCell>{row.receiptNo}</TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" onClick={() => handleUpdateRow(row)}>Update</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}

        {/* Generated Table (compact, click to reprint/view) */}
        {activeCard === "generated" && (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: "#0D3B66" }}>Generated QR/Barcode Details</Typography>
            <Paper sx={{ overflow: "auto", borderRadius: 2 }}>
              <Table stickyHeader>
                <TableHead sx={{ background: "#116466" }}>
                  <TableRow>
                   {["BEL Part Number", "MPN", "Batch No", "Date Code", "Quantity", "BEL PO No", "OEM Make", "Manufacture", "GR No", "GR Date", "Receipt No"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: "black" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generatedData.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell onClick={() => { setSelectedReprint(row); setDialogOpen(true); }} sx={{ color: "#0D47A1", cursor: "pointer", textDecoration: "underline" }}>{row.partNumber}</TableCell>
                     <TableCell>{row.mpn}</TableCell>
                      <TableCell>{row.batchNo}</TableCell>
                      <TableCell>{row.dateCode}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.poNo}</TableCell>
                      <TableCell>{row.oemMake}</TableCell>
                      <TableCell>{row.manufacture}</TableCell>
                      <TableCell>{row.grNo}</TableCell>
                      <TableCell>{row.grDate}</TableCell>
                      <TableCell>{row.receiptNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}

        {/* Reprint Section */}
        {activeCard === "reprint" && (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: "#0D3B66" }}>Reprint QR/Barcode</Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <TextField label="Search or Enter Data" value={reprintSearch} onChange={handleSearchChange} sx={{ minWidth: 300, bgcolor: "white" }} />
              {selectedReprint && (
                <>
                  <TextField label="Receipt No" value={selectedReprint.receiptNo} disabled sx={{ width: 140 }} />
                  <Button variant="contained" onClick={handleReprintQR}>Generate QR</Button>
                  <Button variant="contained" sx={{ background: "#0288d1" }} onClick={handleReprintBarcode}>Generate Barcode</Button>
                  <Button variant="outlined" onClick={handlePrintBothFromReprint}>Print Both</Button>
                </>
              )}
            </Box>
      


            {selectedReprint && (reprintQR || reprintBarcode) && (
              <Box ref={printRef} sx={{ textAlign: "center", mt: 2 }}>
                {reprintQR && (
                  <>
                    <QRCodeCanvas value={formatDetailsAsText(selectedReprint)} size={220} includeMargin />
      
                  </>
                )}
                {reprintBarcode && reprintBarcodeDataUrl && (
                  <Box component="div" sx={{ mt: 1 }}>
                    <img src={reprintBarcodeDataUrl} alt="barcode" style={{ marginTop: 10, height: 80 }} />
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Dialog (used both for Pending row and Generated row click) */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#0D47A1", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Part Details</span>
          <IconButton size="small" sx={{ color: "white",backgroundColor:'red' }} onClick={() => setDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedPart ? (
            <>
              <Table size="small">
                <TableBody>{renderDetailRows(selectedPart)}</TableBody>
              </Table>

              {/* printRef should wrap the visible QR+barcode for printing */}
              <Box ref={printRef} sx={{ textAlign: "center", mt: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                {showQR && (
                  <>
                    <QRCodeCanvas value={formatDetailsAsText(selectedPart)} size={220} includeMargin />

                  </>
                )}

                {showBarcode && barcodeDataUrl && (
                  <img id="barcode" src={barcodeDataUrl} alt="barcode" style={{ marginTop: 10, height: 80 }} />
                )}
              </Box>
            </>
          ) : (
            <Typography>No part selected.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleGenerateQR} variant="contained" color="primary">View QR</Button>
          <Button onClick={handleGenerateBarcode} variant="contained" color="secondary">View Barcode</Button>

          {/* Print both (dialog) - ensures both are visible then prints */}
          <Button onClick={handlePrintBothFromDialog} variant="outlined" color="success">Print Both</Button>
          {/* <Button onClick={() => setDialogOpen(false)} style={{backgroundColor:'red'}}>Close</Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GrQrorBarCodeGenetion;
