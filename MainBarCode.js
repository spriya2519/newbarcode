import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Fade,
  Divider,
} from "@mui/material";
import { Camera, Table as TableIcon, Image, QrCode } from "lucide-react";
import QRReaderComponent from "./QRCodeScanner";
import ItemTable from "./ItemTable";
import QRImageReader from "./QRImageReader";
import AddItemForm from "./AddItemForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


export default function MainComponent() {
  const [selectedView, setSelectedView] = useState("camera");
    const [activeTab, setActiveTab] = useState("");
  const [items, setItems] = useState([]); // store data dynamically

  const user = { name: "Priya", staffNo: "ST123", date: "2025-10-24" };

    const handleItemAdded = (newItem) => {
            setItems((prev) => [...prev, newItem]);
                setSelectedView("table"); // switch to table view after adding
    };


  // Function to render the component based on selection
  const renderComponent = () => {
    switch (selectedView) {
      case "add":
        return <AddItemForm onItemAdded={handleItemAdded} />;
  
      case "camera":
        return <QRReaderComponent />;
      case "table":
        return <ItemTable user={user} />;
      case "image":
        return <QRImageReader />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 5,
        background: `
          linear-gradient(135deg, #ff9a9e 0%, #fad0c4 25%, #a1c4fd 50%, #c2e9fb 75%, #fbc2eb 100%)
        `,
        backgroundSize: "400% 400%",
        animation: "gradientMove 15s ease infinite",
        "@keyframes gradientMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#0e0b0bff",
          mb: 4,
          textShadow: "2px 4px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <QrCode size={42} />
        QR Code Management Dashboard
      </Typography>
 {/* <Button
  variant="contained"
  onClick={() => setSelectedView("add")}
  startIcon={<AddCircleOutlineIcon />}
  sx={{
    background:
      activeTab === "add"
        ? "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)"
        : "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    color: "#131212ff",
    fontWeight: "bold",
    px: 4,
    py: 1.5,
    borderRadius: 4,
    boxShadow:
      activeTab === "add"
        ? "0 8px 25px rgba(255, 105, 135, 0.5)"
        : "0 5px 15px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    },
  }}
>
  Add Item
</Button> */}



      {/* Button group */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 5,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Camera Button */}
        <Button
          variant="contained"
          onClick={() => setSelectedView("camera")}
          startIcon={<Camera />}
          sx={{
            background:
              selectedView === "camera"
                ? "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)"
                : "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            color: "#131212ff",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 4,
            boxShadow: selectedView === "camera"
              ? "0 8px 25px rgba(255, 105, 135, 0.5)"
              : "0 5px 15px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "translateY(-3px)",
              background:
                "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
            },
          }}
        >
          Camera Reader
        </Button>

        {/* Table Button */}
        <Button
          variant="contained"
          onClick={() => setSelectedView("table")}
          startIcon={<TableIcon />}
          sx={{
            background:
              selectedView === "table"
                ? "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
                : "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            color: "#0e0d0dff",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 4,
            boxShadow: selectedView === "table"
              ? "0 8px 25px rgba(253, 160, 133, 0.5)"
              : "0 5px 15px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "translateY(-3px)",
              background:
                "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            },
          }}
        >
          Item Details
        </Button>

        {/* Image Button */}
        <Button
          variant="contained"
          onClick={() => setSelectedView("image")}
          startIcon={<Image />}
          sx={{
            background:
              selectedView === "image"
                ? "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                : "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            color: "#080808ff",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 4,
            boxShadow: selectedView === "image"
              ? "0 8px 25px rgba(132, 250, 176, 0.5)"
              : "0 5px 15px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "translateY(-3px)",
              background:
                "linear-gradient(135deg, #a1ffce 0%, #faffd1 100%)",
            },
          }}
        >
          Image Upload Reader
        </Button>
      </Box>

      {/* Active Component */}
      <Fade in timeout={600}>
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 900,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            transition: "all 0.4s ease",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#2c3e50" }}
          >
            {selectedView === "camera"
              ? "📷 Scan QR Using Camera"
              : selectedView === "table"
              ? "📋 Item Details Table"
              : "🖼️ Scan QR from Image"}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {renderComponent()}
        </Paper>
      </Fade>
    </Box>
  );
}
