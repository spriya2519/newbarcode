import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function AddItemForm({ onItemAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🌐 Replace with your FastAPI endpoint
      const res = await axios.post("http://localhost:8000/items", formData);
      onItemAdded(res.data); // send data back to parent
      setFormData({ name: "", category: "", price: "" });
      alert("✅ Item added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        ➕ Add New Item
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            fontWeight: "bold",
          }}
        >
          {loading ? "Saving..." : "Add Item"}
        </Button>
      </Box>
    </Paper>
  );
}
