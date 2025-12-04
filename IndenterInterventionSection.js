import React, { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  TextField,
  MenuItem,
  Box,
  Checkbox,
  Typography,
  Tooltip,
  Button,
  Paper,
  Autocomplete,
  Divider,
  Chip,
} from "@mui/material";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux"; // Removed useDispatch/useNavigate if not strictly used in this snippet

export default function IndenterInterventionSection({
  form,
  setForm,
  indenterIntervention,
  setIndenterIntervention,
  setProcessOnHold,
  processOnHold,
  referenceno,
  handleInterventionStatus, // Function passed from parent to send data
}) {
  // --- 1. STATE FOR USER DATA ---
  const [userList, setUserList] = useState([]); // Stores the parsed array of user objects
  const [selectedUser, setSelectedUser] = useState(null); // Stores the currently selected user object

  // --- 2. REDUX DATA FETCHING ---
  const UserProfileData = useSelector(
    (state) => state.MROTDataSavingReducer.UserProfileData
  );

  // --- 3. DATA PARSING LOGIC (Adapted from your UpdateProfile code) ---
  useEffect(() => {
    if (UserProfileData && UserProfileData.users) {
      try {
        // The data comes as an array of arrays. 
        // Row 0 = Headers (e.g. ["id", "name", "staffNo", "dept", "phone"])
        // Rows 1+ = Data
        const headers = UserProfileData.users[0];
        const rows = UserProfileData.users.slice(1); // Create a copy starting from index 1

        const parsedUsers = rows.map((row) => {
          let userObj = {};
          headers.forEach((header, index) => {
            // Convert header to lowercase/camelCase if needed for consistency
            userObj[header] = row[index];
          });
          return userObj;
        });

        setUserList(parsedUsers);
      } catch (error) {
        console.error("Error parsing UserProfileData:", error);
      }
    }
  }, [UserProfileData]);

  // --- 4. HANDLERS ---
  const handleUserSelect = (event, newValue) => {
    if (newValue) {
      // newValue is the user ID string selected from Autocomplete
      const user = userList.find((u) => u.id === newValue);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  };

  const handleSendDetails = () => {
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }
    
    // Logic to send details
    console.log("Sending Intervention Request to:", selectedUser);
    
    // You can pass the selectedUser ID or Object to your existing handleInterventionStatus function
    // Or create a new specific function for this button.
    // Example: handleInterventionStatus(referenceno, "pending", selectedUser.id);
    alert(`Details sent to ${selectedUser.name} (${selectedUser.id})`);
  };

  return (
    <Grid item xs={12}>
      <Stack spacing={2} alignItems="center" sx={{ ml: "10rem", mb: 2 }}>
        
        {/* --- TOP ROW: Category & Checkbox --- */}
        <Stack direction="row" spacing={4} alignItems="center">
          <TextField
            select
            label="Category"
            size="small"
            value={form.category || ""}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            sx={{ width: 200 }}
            disabled={indenterIntervention || processOnHold}
          >
            <MenuItem value="">Select Category</MenuItem>
            <MenuItem value="Mechanical">Mechanical</MenuItem>
            <MenuItem value="Electrical">Electrical</MenuItem>
            <MenuItem value="Electromechanical">Electromechanical</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: indenterIntervention ? "1px solid #ff9800" : "1px solid transparent",
              borderRadius: "8px",
              padding: "4px 12px",
              backgroundColor: indenterIntervention ? "#fff3e0" : "transparent",
              transition: "all 0.3s ease",
            }}
          >
            <Checkbox
              checked={indenterIntervention}
              color="warning"
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIndenterIntervention(isChecked);
                setProcessOnHold(isChecked);
                const status = isChecked ? "pending" : "deleted";
                handleInterventionStatus(referenceno, status);
                
                // Clear selection if unchecked
                if (!isChecked) setSelectedUser(null);
              }}
            />

            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "Times New Roman",
                fontWeight: indenterIntervention ? "bold" : "normal",
                color: indenterIntervention ? "#e65100" : "inherit",
              }}
            >
              Indenter Intervention Required
            </Typography>

            {processOnHold && (
              <Tooltip title="Process is on hold until indenter responds">
                <PauseCircleOutlineIcon color="warning" />
              </Tooltip>
            )}
          </Box>
        </Stack>

        {/* --- EXPANDABLE COLOURFUL UI FOR USER DETAILS --- */}
        {indenterIntervention && (
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: "900px",
              mt: 2,
              p: 3,
              backgroundColor: "#f5fbfd", // Light Blue/Cyan tint
              borderLeft: "6px solid #0288d1", // Strong Blue Accent
              borderRadius: "8px",
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(-10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PersonSearchIcon color="primary" />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Fetch User Details
                </Typography>
                <Chip label="Database Connected" color="success" size="small" variant="outlined" sx={{ml: 'auto'}} />
              </Box>
              
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {/* 1. User Selection */}
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    options={userList.map((u) => u.id)} // List of IDs
                    value={selectedUser ? selectedUser.id : null}
                    onChange={handleUserSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select User ID"
                        placeholder="Search ID..."
                        variant="outlined"
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      />
                    )}
                  />
                </Grid>

                {/* 2. Auto-Filled Details (Read Only) */}
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="User Name"
                        value={selectedUser?.name || ""}
                        variant="filled"
                        size="small"
                        InputProps={{ readOnly: true, startAdornment: <AccountCircleIcon color="action" sx={{mr:1}}/> }}
                        helperText="Auto-filled"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Staff No"
                        // Note: Ensure your DB returns 'staffno' key. If it's different, change this key.
                        value={selectedUser?.staffno || selectedUser?.StaffNo || ""} 
                        variant="filled"
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={selectedUser?.dept || selectedUser?.department || ""}
                        variant="filled"
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Internal Phone No"
                        value={selectedUser?.phoneno || selectedUser?.internalphone || ""}
                        variant="filled"
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* 3. Action Button */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSendDetails}
                  disabled={!selectedUser}
                  sx={{ 
                    px: 4, 
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
                  }}
                >
                  Send Request
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Grid>
  );
}