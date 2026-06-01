
// done by Suraj/girish on 23/03/2026

import {
  Box, TextField, Button, Typography, Paper, Stack, CircularProgress,
  IconButton, Checkbox, FormControlLabel, FormGroup,
  Accordion, AccordionSummary, AccordionDetails, Divider, Tooltip, Chip, Dialog, DialogTitle, DialogContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, Grid, Card, CardContent, MenuItem, InputAdornment, DialogActions, Autocomplete
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import {
  ContentPaste as ContentPasteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  RestartAlt as RestartAltIcon,
  FilePresent as FilePresentIcon,
  FileDownloadOff as FileDownloadOffIcon,
  Close as CloseIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { SaveIcon } from "lucide-react";
// ?? IMPORTING DATA_SOURCES ALONG WITH YOUR EXISTING EXPORTS ??
import { checkForLocalFile, checkBatchFilesLocal, LOCAL_WATCHER_URL, DATA_SOURCES } from "./api";
import { QrReader } from "react-qr-reader";
import { useSelector } from "react-redux";
import DescriptionIcon from '@mui/icons-material/Description';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ScienceIcon from '@mui/icons-material/Science';
import axios from "axios";
import {
  // ... existing icons
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon
} from "@mui/icons-material";


export default function ProcessForm({
  form, currentSerial, savedData, onSubmit, onFetchLastData, onFetchDataBySerial, FilteredData, actionType,
  selectedEquipment, selectedConsumables, viewedFileName, typeLabel, currentStepIdAllData, isReworkAllowed, selectedPrograms
}) {


  const mergeArraysByKey = (arr1, arr2, key) => {
    const map = new Map();

    const parseJSON = (data) => {
      if (Array.isArray(data)) return data;
      if (typeof data === 'string') {
        try { return JSON.parse(data); } catch { return []; }
      }
      return [];
    };

    parseJSON(arr1).forEach(item => { if (item && item[key]) map.set(item[key], item); });
    parseJSON(arr2).forEach(item => { if (item && item[key]) map.set(item[key], item); });

    return Array.from(map.values());
  };

  const [values, setValues] = useState({});
  const [batchSelection, setBatchSelection] = useState({});
  const [batchFileStatus, setBatchFileStatus] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [pasting, setPasting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchSerial, setSearchSerial] = useState("");
  const [batchSearchTerm, setBatchSearchTerm] = useState("");



  // --- NEW: Dynamic API States ---
  const [systemData, setSystemData] = useState({});
  // -------------------------------
  const [applyToAll, setApplyToAll] = useState(false);
  // useEffect(() => {

 



  // 1. Hook for handling LIVE checkboxes from the dashboard
  // useEffect(() => {
  //   setValues(prev => {
  //     // Merge what is already in the form with the newly checked items
  //     const finalEq = mergeArraysByKey(prev.selectedEquipment, selectedEquipment, 'eqpt_no');
  //     const finalCons = mergeArraysByKey(prev.selectedConsumables, selectedConsumables, 'consumable_material_number');

  //     return {
  //       ...prev,
  //       ...(finalEq.length > 0 ? { selectedEquipment: finalEq } : {}),
  //       ...(finalCons.length > 0 ? { selectedConsumables: finalCons } : {}),
  //       ...(viewedFileName ? { viewedDocument: viewedFileName } : {})
  //     };
  //   });
  // }, [selectedEquipment, selectedConsumables, viewedFileName]);

  // // 2. Hook for loading SAVED data from the database
  // useEffect(() => {
  //   if (savedData) {
  //     const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;

  //     if (dataToLoad && Object.keys(dataToLoad).length > 0) {
  //       setValues(prev => {
  //         // Merge what is coming from the database with anything the user just checked
  //         const finalEq = mergeArraysByKey(prev.selectedEquipment, dataToLoad.selectedEquipment, 'eqpt_no');
  //         const finalCons = mergeArraysByKey(prev.selectedConsumables, dataToLoad.selectedConsumables, 'consumable_material_number');

  //         return {
  //           ...prev,
  //           ...dataToLoad, // Load all the text fields, tables, etc.
  //           ...(finalEq.length > 0 ? { selectedEquipment: finalEq } : {}),
  //           ...(finalCons.length > 0 ? { selectedConsumables: finalCons } : {})
  //         };
  //       });
  //     }
  //   }
  // }, [savedData]);




  // 1. Hook for handling LIVE checkboxes from the dashboard
  // useEffect(() => {
  //   setValues(prev => {
  //     // Merge what is already in the form with the newly checked items
  //     const finalEq = mergeArraysByKey(prev.selectedEquipment, selectedEquipment, 'eqpt_no');
  //     const finalCons = mergeArraysByKey(prev.selectedConsumables, selectedConsumables, 'consumable_material_number');
  //     const finalProg = mergeArraysByKey(prev.selectedPrograms, selectedPrograms, 'program_no');

  //     return {
  //       ...prev,
  //       ...(finalEq.length > 0 ? { selectedEquipment: finalEq } : {}),
  //       ...(finalCons.length > 0 ? { selectedConsumables: finalCons } : {}),
  //       selectedPrograms: finalProg,
  //       ...(viewedFileName ? { viewedDocument: viewedFileName } : {})
  //     };
  //   });
  // }, [selectedEquipment, selectedConsumables,selectedPrograms, viewedFileName]);
  // 1. Hook for handling LIVE checkboxes from the dashboard
  useEffect(() => {
    setValues(prev => {
      // Merge what is already in the form with the newly checked items
      const finalEq = mergeArraysByKey(prev.selectedEquipment, selectedEquipment, 'eqpt_no');
      const finalCons = mergeArraysByKey(prev.selectedConsumables, selectedConsumables, 'consumable_material_number');

      // FIXED: Use 'program_details' as the unique key to match OperatorPage checkbox logic
      const finalProg = mergeArraysByKey(prev.selectedPrograms, selectedPrograms, 'program_details');

      return {
        ...prev,
        ...(finalEq.length > 0 ? { selectedEquipment: finalEq } : {}),
        ...(finalCons.length > 0 ? { selectedConsumables: finalCons } : {}),
        selectedPrograms: finalProg,
        ...(viewedFileName ? { viewedDocument: viewedFileName } : {})
      };
    });
  }, [selectedEquipment, selectedConsumables, selectedPrograms, viewedFileName]);

  // 2. Hook for loading SAVED data from the database
  useEffect(() => {
    if (savedData) {
      const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;

      if (dataToLoad && Object.keys(dataToLoad).length > 0) {
        setValues(prev => {
          // Merge what is coming from the database with anything the user just checked
          const finalEq = mergeArraysByKey(prev.selectedEquipment, dataToLoad.selectedEquipment, 'eqpt_no');
          const finalCons = mergeArraysByKey(prev.selectedConsumables, dataToLoad.selectedConsumables, 'consumable_material_number');

          return {
            ...prev,
            ...dataToLoad, // Load all the text fields, tables, etc.
            ...(finalEq.length > 0 ? { selectedEquipment: finalEq } : {}),
            ...(finalCons.length > 0 ? { selectedConsumables: finalCons } : {})
          };
        });
      }
    }
  }, [savedData]);

  // console.log("selectedEquipment444",selectedEquipment1)


  const hasFileField = useMemo(() => form?.fields?.some(f => f.type === "file"), [form?.fields]);
  const machineId = form?.machine_folder;
  const [openScanner, setOpenScanner] = useState(actionType === 'Start');

  // Rework States
  const [reworkRequired, setReworkRequired] = useState(false);
  const [reworkRemarks, setReworkRemarks] = useState("");
  console.log("filteredData", FilteredData)
  console.log("currentStepIdAllData", currentStepIdAllData)
  const otherPcbs = useMemo(() => {
    return (FilteredData || []).filter(item =>
      item.serialNo !== currentSerial && item.serialNo !== "null" && item.serialNo !== null
    );
  }, [FilteredData, currentSerial]);

  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);


  const [isPaused, setIsPaused] = useState(false);
  const isDisabled = actionType === 'view' || isPaused; // We will use this to lock the form
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState("");



  var API2 = "/process/command";
  var BASE_URL = "http://192.168.0.30:8001" + API2;

  var PYTHON_URL = "http://192.168.0.20:2000"
  if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    BASE_URL = configDetails.project[0].ServerIP[0].PythonServerIP3 + API2;

    PYTHON_URL = configDetails.project[0].ServerIP[0].PythonServerIP 
  }

  // --- Reset Form ---
  // const handleResetForm = () => {
  //   if (window.confirm("Are you sure you want to clear all inputs for this PCB?")) {

  //     setValues({});
  //   }
  // };

  ///code added by priya to not reset document.
  // --- Reset Form ---
  const handleResetForm = () => {
    if (window.confirm("Are you sure you want to clear all inputs for this PCB?")) {
      setValues(prev => {
        // 1. Identify the keys you want to keep
        const documentKeys = ["viewedDocument", "viewDocument", "viewedFileName"];
        const preservedData = {};

        // 2. Loop through and save only the document-related values
        documentKeys.forEach(key => {
          if (prev[key]) {
            preservedData[key] = prev[key];
          }
        });

        // 3. Return only the preserved data, effectively clearing everything else
        return preservedData;
      });
    }
  };

  // const handlePastePrevious = async () => {
  //   if (!onFetchLastData) return;
  //   setPasting(true);
  //   const dbData = await onFetchLastData();
  //   setPasting(false);
  //   if (dbData && Object.keys(dbData).length > 0) {
  //     console.log("dbData", dbData)
  //     setValues(prev => ({ ...prev, ...dbData }));
  //   } else {
  //     alert("No previous data found for this stage.");
  //   }
  // };

  const handlePastePrevious = async () => {
    if (!onFetchLastData) return;
    setPasting(true);
    const dbData = await onFetchLastData();
    setPasting(false);
    
    if (dbData && Object.keys(dbData).length > 0) {
      console.log("dbData fetched for paste", dbData);

      // --- 1. Clone the fetched data so we can modify it ---
      const cleanedData = { ...dbData };

      // --- 2. Define the pause-related keys we want to ignore ---
      const keysToIgnore = [
        "pause_time",
        "pause_display_time",
        "pause_reason",
        "is_paused",
        "pause_history"
      ];

      // --- 3. Delete those keys from the cloned data ---
      keysToIgnore.forEach(key => {
        delete cleanedData[key];
      });

      // --- 4. Apply the cleaned data to the form ---
      setValues(prev => ({ ...prev, ...cleanedData }));
      
    } else {
      alert("No previous data found for this stage.");
    }
  };

  const handleSearchBySerial = async () => {
    if (!searchSerial.trim()) {
      alert("Please enter a PCB Serial Number");
      return;
    }
    if (!onFetchDataBySerial) return;

    setSearching(true);
    const dbData = await onFetchDataBySerial(searchSerial);
    setSearching(false);

    if (dbData && dbData[0]?.log_Data && Object.keys(dbData[0]?.log_Data).length > 0) {
      setValues(prev => ({ ...prev, ...dbData[0]?.log_Data }));
    } else {
      alert("No data found for this Serial Number in the current stage.");
    }
  };



  const handleScan = (scannedText) => {
    if (!scannedText) return;

    const text = scannedText.trim();
    try {
      const scannedData = JSON.parse(text);
      setValues(prev => ({ ...prev, ...scannedData }));
      setOpenScanner(false);
    } catch (e) {
      setSearchSerial(text);
      setOpenScanner(false);
      handleSearchBySerial(text);
    }
  };

  // --- Batch File Presence Indicators ---
  useEffect(() => {
    const checkBatch = async () => {
      if (otherPcbs.length > 0 && hasFileField && machineId) {
        const serials = otherPcbs.map(p => p.serialNo);
        const results = await checkBatchFilesLocal(machineId, serials);
        setBatchFileStatus(results);
      }
    };
    checkBatch();
  }, [otherPcbs, hasFileField, machineId]);


  // **********************************************************************************
  // --- NEW: Auto-Fetch Data from Previous Stages ---
  // useEffect(() => {
  //   // Ensure we have the form config, the dataset, and the current PCB serial
  //   if (form && FilteredData && currentSerial) {
  //     // Find the history for the exact PCB we are working on
  //     const currentPcb = FilteredData.find(p => p.serialNo === currentSerial);

  //     if (currentPcb && currentPcb.tasks) {
  //       const autoFetchedValues = {};

  //       // Loop through the current form's fields looking for our custom "fetch_from_stage" trigger
  //       form.fields.forEach(field => {
  //         if (field.fetch_from_stage && field.fetch_key) {
  //           // Find the completed task that matches the requested stage ID
  //           const pastTask = currentPcb.tasks.find(t => t.flowStepId === field.fetch_from_stage);

  //           if (pastTask && pastTask.operator_Json_log) {
  //             // Grab the specific remark, or show a fallback message
  //             autoFetchedValues[field.key] = pastTask.operator_Json_log[field.fetch_key] || "No remarks found.";
  //           } else {
  //             autoFetchedValues[field.key] = "Stage not completed or no data.";
  //           }
  //         }
  //       });

  //       // If we found any data, inject it into the form values
  //       if (Object.keys(autoFetchedValues).length > 0) {
  //         setValues(prev => ({ ...prev, ...autoFetchedValues }));
  //       }
  //     }
  //   }
  // }, [form, FilteredData, currentSerial]);
  useEffect(() => {
    // Ensure we have the form config, the dataset, and the current PCB serial
    if (form && FilteredData && currentSerial) {
      // Find the history for the exact PCB we are working on
      const currentPcb = FilteredData.find(p => p.serialNo === currentSerial);

      if (currentPcb && currentPcb.tasks) {
        const autoFetchedValues = {};

        // Loop through the current form's fields looking for our custom "fetch_from_stage" trigger
        form.fields.forEach(field => {
          if (field.fetch_from_stage && field.fetch_key) {
            // Find the completed task that matches the requested stage ID

            const pastTask = currentPcb.all_pcb_logs.find(t => t.current_step_id === field.fetch_from_stage);
            console.log("cuurentpcbtaks", currentPcb, field.fetch_from_stage, pastTask)
            if (pastTask && pastTask.log_Data) {
              // Grab the specific remark, or show a fallback message
              autoFetchedValues[field.key] = pastTask.log_Data[field.fetch_key] || "No remarks found.";
            } else {
              autoFetchedValues[field.key] = "Stage not completed or no data.";
            }
            console.log("autoFetchedValues[field.key]", autoFetchedValues[field.key])
          }
        });

        // If we found any data, inject it into the form values
        if (Object.keys(autoFetchedValues).length > 0) {
          setValues(prev => ({ ...prev, ...autoFetchedValues }));
        }
      }
    }
  }, [form, FilteredData, currentSerial]);



  // ********************************************************************************



  // --- Auto-link machine file logic ---
  useEffect(() => {
    const autoLink = async () => {
      if (actionType !== 'view' && currentSerial && hasFileField && machineId) {
        const result = await checkForLocalFile(machineId, currentSerial);
        if (result.found) {
          const fileField = form.fields.find(f => f.type === "file");

          if (fileField && !values[fileField.key]) {
            const previewUrl = `${LOCAL_WATCHER_URL}/machine-file/${machineId}/${result.fileName}`;
            handleChange(fileField.key, {
              name: result.fileName,
              url: previewUrl,
              auto: true
            });
          }
        }
      }
    };
    autoLink();
  }, [currentSerial, actionType, form?.fields, hasFileField, machineId]);

  useEffect(() => {
    return () => {
      Object.values(values).forEach(v => {
        if (v?.preview) URL.revokeObjectURL(v.preview);
      });
    };
  }, [values]);


//****************************************************************************************************** */
  // // --- NEW: FETCH API DROPDOWN DATA ON LOAD ---
  // useEffect(() => {
  //   if (form && form.fields) {
  //     form.fields.forEach(async (f) => {
  //       if (f.type === 'system-dropdown' && f.dataSourceId) {
  //         const sourceConfig = DATA_SOURCES[f.dataSourceId];
  //         if (sourceConfig) {
  //           try {
  //             const response = await axios.get(sourceConfig.url);
  //             setSystemData(prev => ({ ...prev, [f.key]: response.data }));
  //           } catch (error) {
  //             console.error(`Failed to fetch ${sourceConfig.name}`, error);
  //           }
  //         }
  //       }
  //     });
  //   }
  // }, [form]);


  // ProcessForm.js

  // --- NEW: FETCH API DROPDOWN DATA ON LOAD ---
  // useEffect(() => {
  //   if (form && form.fields) {
  //     form.fields.forEach(async (f) => {
  //       if (f.type === 'system-dropdown' && f.dataSourceId) {
  //         const sourceConfig = DATA_SOURCES[f.dataSourceId];
  //         if (sourceConfig) {
  //           try {
  //             // ?? CHANGE IS HERE: Combine dynamic IP with the relative endpoint
  //             const response = await axios.get(`${PYTHON_URL}${sourceConfig.endpoint}`);
              
  //             setSystemData(prev => ({ ...prev, [f.key]: response.data }));
  //           } catch (error) {
  //             console.error(`Failed to fetch ${sourceConfig.name}`, error);
  //           }
  //         }
  //       }
  //     });
  //   }
  // }, [form, PYTHON_URL]); // <-- It's good practice to add PYTHON_URL to the dependency array


  // ProcessForm.js priya new code
  useEffect(() => {
    if (form && form.fields) {
      form.fields.forEach(async (f) => {
        if (f.type === 'system-dropdown' && f.dataSourceId) {
          const sourceConfig = DATA_SOURCES[f.dataSourceId];
          
          if (sourceConfig) {
            try {
              // 1. Remove trailing slashes from the base URL
              let safeBaseUrl = PYTHON_URL.replace(/\/+$/, '');
              
              // 2. Ensure the base URL has the http:// protocol
              if (!safeBaseUrl.startsWith('http')) {
                  safeBaseUrl = 'http://' + safeBaseUrl;
              }

              // 3. Ensure the endpoint starts with exactly one slash
              const safeEndpoint = sourceConfig.endpoint.startsWith('/') 
                  ? sourceConfig.endpoint 
                  : `/${sourceConfig.endpoint}`;
                  
              const finalUrl = `${safeBaseUrl}${safeEndpoint}`;
              
              const response = await axios.get(finalUrl);
              setSystemData(prev => ({ ...prev, [f.key]: response.data }));
            } catch (error) {
              console.error(`Failed to fetch ${sourceConfig.name}`, error);
            }
          }
        }
      });
    }
  }, [form, PYTHON_URL]);
//******************************************************************************************************************** */
  // useEffect(() => {
  //   if (savedData) {
  //     const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;
  //     console.log("dataToLoad", dataToLoad)
  //     if (dataToLoad && Object.keys(dataToLoad).length > 0) setValues(dataToLoad);
  //   }
  // }, [savedData]);

  // --- VALIDATION AND BUTTON TOGGLING ---
  // useEffect(() => {
  //   const allFilled = form?.fields?.every(field => {
  //     if (field.type === "checkbox" || field.type === "image" || field.type === "image_gallery" || field.readonly || field.key === "remarks") {
  //       return true;
  //     }

  //     const val = values[field.key];

  //     if (field.type === "dynamic_table") {
  //       const tableRows = val || [];
  //       if (tableRows.length === 0) return false; // Needs at least one row
  //       // Check if every row has a remark and a status selected
  //       return tableRows.every(row => row.remark && row.remark.trim() !== "" && row.status && row.status !== "");
  //     }

  //     if (field.type === "file") {
  //       return !!(
  //         val &&
  //         (val instanceof File || val?.url || val?.file || val?.preview || typeof val === "string")
  //       );
  //     }

  //     return val !== undefined && val !== null && val.toString().trim() !== "";
  //   });

  //   const selectedSerials = Object.keys(batchSelection).filter(k => batchSelection[k]);
  //   const batchFilesMissing = hasFileField
  //     ? selectedSerials.some(s => !batchFileStatus[s])
  //     : false;

  //   setIsValid(allFilled && !batchFilesMissing);

  // }, [values, form, batchSelection, batchFileStatus, hasFileField]);

  // src\AssemblyLine\OperatorDashboard\ProcessForms\ProcessForm.js

  // Inside ProcessForm component


  useEffect(() => {
    const allFilled = form?.fields?.every(field => {
      if (field.type === "checkbox" || field.type === "image" || field.readonly || field.key === "remarks") return true;

      const val = values[field.key];
      if (field.type === "dynamic_table") {
        const tableRows = val || [];
        if (tableRows.length === 0) return false; // Needs at least one row
        // Check if every row has a remark and a status selected
        return tableRows.every(row => row.remark && row.remark.trim() !== "" && row.status && row.status !== "");
      }
      if (field.type === "file") {
        return !!(val && (val instanceof File || val?.url || val?.preview || typeof val === "string"));
      }
      return val !== undefined && val !== null && val.toString().trim() !== "";
    });

    // RESTRICTION REMOVED: isValid no longer checks for batchFileStatus
    setIsValid(allFilled);
  }, [values, form, batchSelection, batchFileStatus, hasFileField]); // Removed batchSelection and batchFileStatus from dependencies
  // const handleChange = (key, value) => {
  //   setValues(prev => ({ ...prev, [key]: value }));
  // };

  // }, [values, form]);

  //**************************************************************** */
  // const handleChange = (key, value) => {

  //   // console.log("key: ",key," value: ",value)
  //   setValues(prev => {
  //     // 1. Keep existing functionality: Always update the field being changed
  //     const newValues = { ...prev, [key]: value };

  //     // 2. Add specific auto-population logic for the solder paste fridge dates
  //     if (key === "paste_remove_fridge" || key === "paste_remove_fridge" || key === "paste_removed_fridge") {

  //       if (value) {
  //         const baseDate = new Date(value);

  //         // Ensure it's a valid date before doing math
  //         if (!isNaN(baseDate.getTime())) {
  //           // +8 Hours
  //           const thawingDate = new Date(baseDate.getTime() + 8 * 60 * 60 * 1000);
  //           // +5 Days
  //           const useBeforeDate = new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000);

  //           // Helper to format JS Date to HTML "datetime-local" format
  //           const formatForDateTimeLocal = (date) => {
  //             const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  //             return offsetDate.toISOString().slice(0, 16);
  //           };

  //           // Inject the calculated dates into the state update
  //           newValues.thawing_details = formatForDateTimeLocal(thawingDate);
  //           newValues.use_before = formatForDateTimeLocal(useBeforeDate);
  //         }
  //       } else {
  //         // If user clears the fridge date, clear the auto-populated dates too
  //         newValues.thawing_details = "";
  //         newValues.use_before = "";
  //       }
  //     }

  //     // 3. Return the fully updated state object
  //     return newValues;
  //   });
  // };

  const handleChange = (key, value) => {

    setValues(prev => {
      // 1. Keep existing functionality: Always update the field being changed
      const newValues = { ...prev, [key]: value };

      // 2. Find the configuration for this specific field from the schema
      const fieldConfig = form?.fields?.find(f => f.key === key);

      // 3. Check if the schema dictates any auto-calculations for this field
      if (fieldConfig && fieldConfig.autoCalculate) {
        if (value) {
          const baseDate = new Date(value);

          // Ensure it's a valid date before doing math
          if (!isNaN(baseDate.getTime())) {

            // Helper to format JS Date to HTML "datetime-local" format
            const formatForDateTimeLocal = (date) => {
              const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
              return offsetDate.toISOString().slice(0, 16);
            };

            // Loop through all calculation rules defined in the schema
            fieldConfig.autoCalculate.forEach(rule => {
              let newTime = baseDate.getTime();

              // Add dynamic offsets if they exist in the schema
              if (rule.addDays) newTime += rule.addDays * 24 * 60 * 60 * 1000;
              if (rule.addHours) newTime += rule.addHours * 60 * 60 * 1000;
              if (rule.addMinutes) newTime += rule.addMinutes * 60 * 1000;
              console.log("here", key, rule.targetKey)
              // Assign the newly calculated date to the target field dynamically
              const calculatedDate = new Date(newTime);
              newValues[rule.targetKey] = formatForDateTimeLocal(calculatedDate);
            });
          }
        } else {
          // If the user clears the base date, clear all auto-populated target fields
          fieldConfig.autoCalculate.forEach(rule => {
            newValues[rule.targetKey] = "";

          });
        }
      }

      // 4. Return the fully updated state object
      return newValues;
    });
  };
  //************************************************************************** */

  const handleBatchToggle = (serial) => {
    setBatchSelection(prev => ({ ...prev, [serial]: !prev[serial] }));
  };

  const handleSelectAllBatch = (e) => {
    const newSelection = {};
    if (e.target.checked) otherPcbs.forEach(p => { newSelection[p.serialNo] = true; });
    setBatchSelection(newSelection);
  };

  const handleSave = () => { onSubmit(values, "Started", Object.keys(batchSelection).filter(k => batchSelection[k])) };

  const handleComplete = () => {
    let data = {
      action: 'complete',
      pcb_id: currentSerial,
      process_name: form?.stage_name
    };
    console.log("data", data)
    axios.post(BASE_URL, data)
      .then((response) => { })
      .catch((error) => { });

    onSubmit(values, "Completed", Object.keys(batchSelection).filter(k => batchSelection[k]))
  };

  const handleRaiseRework = () => {



    // Send status "REWORK" to hit the specific rework endpoint in ProcessFormPage
    onSubmit(values, "REWORK", [], reworkRemarks);
    console.log("Values", values);
  };
  // const handleFileChange = (key, file) => {
  //   if (!file) return;
  //   const preview = URL.createObjectURL(file);
  //   handleChange(key, {
  //     name: file.name,
  //     file: file,
  //     preview: preview,
  //     auto: false
  //   });
  // };
  const handleFileChange = (key, file) => {
    if (!file) return;

    // 1. Find the configuration for this specific file field
    const fieldConfig = form?.fields?.find(f => f.key === key);

    // 2. Strict Validation Check
    if (fieldConfig && fieldConfig.accept) {
      // Extract the extension from the uploaded file (e.g., ".pdf", ".xls")
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      // Convert the accept string into an array (e.g., [".xls", ".xlsx"])
      const acceptedExtensions = fieldConfig.accept.split(',').map(ext => ext.trim().toLowerCase());

      // Check if the uploaded file's extension matches the allowed list
      if (!acceptedExtensions.includes(fileExtension)) {
        alert(`Invalid file type! This stage only accepts: ${fieldConfig.accept}`);
        return; // STOP the upload completely
      }
    }
    // 3. If valid, proceed with setting the file
    const preview = URL.createObjectURL(file);
    handleChange(key, {
      name: file.name,
      file: file,
      preview: preview,
      auto: false
    });

  };


  const isFileReady = useMemo(() => {
    const fileField = form?.fields?.find(f => f.type === "file");
    if (!fileField) return false;

    const val = values[fileField.key];
    return !!(
      val &&
      (val instanceof File || val?.url || val?.preview || val?.file || typeof val === "string")
    );
  }, [values, form?.fields]);


  let currentReworkRemarks = "No data available";
  let raisedReworkRemarks = "Rework not raised"
  console.log("Current Serial:", currentSerial);
  console.log("All Data Prop:", currentStepIdAllData);

  if (currentStepIdAllData && Array.isArray(currentStepIdAllData)) {
    const matchingPcb = currentStepIdAllData.find(
      (pcb) => pcb.serialNo === currentSerial
    );
    console.log("matchingPcb.raised_remarks ", matchingPcb.raised_remarks)
    if (matchingPcb) {
      currentReworkRemarks = matchingPcb.rework_remarks || "No rework data found";
      raisedReworkRemarks = matchingPcb.raised_remarks || "No rework data found";
    } else {
      currentReworkRemarks = "No rework data found for this serial";
      raisedReworkRemarks = "No rework data found for this serial";
    }
  }
  // code added by priya 31_03_2026

  // Add this right before the return statement inside ProcessForm
  const parseJSON = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  };

  const equipmentList = parseJSON(values.selectedEquipment || selectedEquipment);
  const consumablesList = parseJSON(values.selectedConsumables || selectedConsumables);
  const documentName = values.viewedDocument || values.viewDocument || values.viewedFileName || viewedFileName;


  // Update the savedData useEffect to remember if the form was paused
  useEffect(() => {
    if (savedData) {
      const dataToLoad = savedData.operator_Json_log || savedData.log_Data || savedData.process_data || savedData;
      if (dataToLoad && Object.keys(dataToLoad).length > 0) {
        setValues(prev => {
          const finalEq = mergeArraysByKey(prev.selectedEquipment, dataToLoad.selectedEquipment, 'eqpt_no');
          const finalCons = mergeArraysByKey(prev.selectedConsumables, dataToLoad.selectedConsumables, 'consumable_material_number');
          return {
            ...prev,
            ...dataToLoad,
            ...(finalEq.length > 0 ? { selectedEquipment: finalEq } : {}),
            ...(finalCons.length > 0 ? { selectedConsumables: finalCons } : {})
          };
        });

        // If the loaded data says it's paused, lock the form!
        if (dataToLoad.is_paused) {
          setIsPaused(true);
        }
      }
    }
  }, [savedData]);

  // Pause Function
  // 1. Opens the popup instead of pausing instantly
  const handlePauseClick = () => {
    setPauseDialogOpen(true);
  };

  // 2. Confirms the pause and saves the start time + reason
  const handleConfirmPause = () => {
    const nowISO = new Date().toISOString(); // Used for math later
    const displayTime = new Date().toLocaleString();

    const updatedValues = {
      ...values,
      pause_time: nowISO,
      pause_display_time: displayTime,
      pause_reason: pauseReason,
      is_paused: true
    };

    setValues(updatedValues);
    setIsPaused(true);
    setPauseDialogOpen(false);

    onSubmit(updatedValues, "PAUSE", Object.keys(batchSelection).filter(k => batchSelection[k]), null, true);
  };

  // 3. Resumes the task and calculates how many minutes it was paused
  const handleResume = () => {
    const now = new Date();
    const pauseStart = new Date(values.pause_time);
    let diffMins = 0;

    // Calculate duration in minutes
    if (!isNaN(pauseStart.getTime())) {
      diffMins = Math.round((now - pauseStart) / 60000);
    }

    // Create a log entry for this specific pause
    const newPauseLog = {
      reason: values.pause_reason,
      start_time: values.pause_display_time,
      end_time: now.toLocaleString(),
      duration_minutes: diffMins
    };

    // Append to history (handles multiple pauses per stage)
    const existingHistory = values.pause_history || [];

    const updatedValues = {
      ...values,
      is_paused: false,
      pause_time: null,       // Clear current pause
      pause_reason: "",       // Clear current reason
      pause_history: [...existingHistory, newPauseLog] // Save the record
    };

    setValues(updatedValues);
    setIsPaused(false);
    setPauseReason(""); // Reset input field

    onSubmit(updatedValues, "STARTED", Object.keys(batchSelection).filter(k => batchSelection[k]), null, true);
  };


  // --- Extract Auto-Fill Data ---
  const operatorName = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.username || "Unknown Operator";
    } catch (e) {
      return "Unknown Operator";
    }
  }, []);

  const poNumber = useMemo(() => {
   
    const currentPcb = FilteredData?.find(p => p.serialNo === currentSerial);
    return currentPcb?.Production_order || currentPcb?.Production_order || "N/A";
  }, [FilteredData, currentSerial]);

  // --- NEW: Check if the current stage allows the Task Context box ---
  const shouldShowTaskContext = useMemo(() => {
    if (!form?.stage_name) return false;
    const allowedStages = ["INTERMEDIATE CONTROL", "FINAL CONTROL"];
    return allowedStages.includes(form.stage_name.toUpperCase().trim());
  }, [form?.stage_name]);



  // --- AUTO-CHECK CHECKBOXES ON LOAD ---
  useEffect(() => {
    if (form?.fields) {
      setValues(prev => {
        let newValues = { ...prev };
        let hasChanges = false;

        // Loop through all form fields looking for checkboxes
        form.fields.forEach(f => {
          // If the field is a checkbox AND there is no saved data for it yet...
          if (f.type === "checkbox" && newValues[f.key] === undefined) {
            newValues[f.key] = true; // Auto-check it!
            hasChanges = true;
          }
        });

        // Only trigger a re-render if we actually auto-checked something
        return hasChanges ? newValues : prev;
      });
    }
  }, [form?.fields]);
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(99, 102, 241, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 18px 50px rgba(88, 158, 114, 0.43), 0 8px 20px rgba(41, 43, 156, 0.48)",
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">{form?.stage_name}</Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {values.is_paused && values.pause_display_time && (
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<PauseIcon />}
                label={`Paused on: ${values.pause_display_time} | Reason: ${values.pause_reason}`}
                color="warning"
                variant="filled"
                sx={{ fontWeight: 'bold', borderRadius: '8px' }}
              />
            </Box>
          )}
          <Button
            startIcon={<RestartAltIcon fontSize="small" />}
            size="small"
            onClick={handleResetForm}
            disabled={actionType === 'view'}
            sx={{
              minHeight: 32, px: 2, fontSize: "0.75rem", fontWeight: 700, borderRadius: "8px",
              textTransform: "none", backgroundColor: "#e99e4d", color: "#ffffff",
              "&:hover": { backgroundColor: "#e35e17" }
            }}
          >
            Reset
          </Button>

          {actionType !== "view" && (
            <Button
              size="small"
              variant="outlined"
              startIcon={pasting ? <CircularProgress size={14} /> : <ContentPasteIcon fontSize="small" />}
              onClick={handlePastePrevious}
              sx={{
                minHeight: 32, px: 2, fontSize: "0.69rem", fontWeight: 700, borderRadius: "8px",
                borderWidth: "2.5px", textTransform: "none", borderColor: "#71a6d2", color: "#3b82f6",
                "&:hover": { backgroundColor: "#206ae3", color: "#ffffff", borderColor: "#2563eb" }
              }}
            >
              Copy last Record
            </Button>
          )}
          {actionType !== 'view' && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<QrCodeScannerIcon fontSize="small" />}
              onClick={() => setOpenScanner(true)}
              sx={{
                minHeight: 32, px: 2, fontSize: "0.69rem", fontWeight: 700, borderRadius: "8px", borderWidth: "2.5px",
                textTransform: "none", borderColor: "#8b5cf6", color: "#8b5cf6",
                "&:hover": { backgroundColor: "#8b5cf6", color: "#ffffff", borderColor: "#8b5cf6" }
              }}
            >
              Scan QR
            </Button>
          )}

        </Stack>
      </Stack>
      {/* --- SELECTED RESOURCES CARDS --- */}
      {(equipmentList?.length > 0 || consumablesList?.length > 0 || documentName) && (
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* --- DOCUMENT CARD --- */}
          {/* {documentName && (
            <Card variant="outlined" sx={{ bgcolor: '#f0fdf4', borderRadius: 2, borderColor: '#bbf7d0', borderLeft: '4px solid #16a34a' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <DescriptionIcon sx={{ color: '#16a34a', fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
                    Reference Document Used
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#14532d', fontWeight: 600, mt: 0.5 }}>
                    {documentName}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )} */}

          {/* --- EQUIPMENT CARD --- */}
          {/* {equipmentList.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: '#f8fafc', borderRadius: 2, borderColor: '#cbd5e1' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <PrecisionManufacturingIcon sx={{ color: '#0284c7' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0f172a', m: 0 }}>
                    Selected Equipment
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {equipmentList.map((eqpt, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#ffffff' }}>
                        {Object.entries(eqpt).map(([k, v]) => (
                          <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>
                              {k.replace(/_/g, ' ')}:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 500, textAlign: 'right', ml: 1 }}>
                              {String(v)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )} */}

          {equipmentList.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: '#f8fafc', borderRadius: 2, borderColor: '#cbd5e1' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PrecisionManufacturingIcon sx={{ color: '#0284c7' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0f172a', m: 0 }}>
                    Selected Equipment
                  </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ bgcolor: '#ffffff', boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        {/* We dynamically create headers based on the keys of the first object in the list */}
                        {Object.keys(equipmentList[0]).map((key) => (
                          <TableCell
                            key={key}
                            sx={{ fontWeight: 'bold', color: '#475569', fontSize: '0.75rem', textTransform: 'capitalize' }}
                          >
                            {key.replace(/_/g, ' ')}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {equipmentList.map((eqpt, idx) => (
                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          {Object.values(eqpt).map((value, valIdx) => (
                            <TableCell
                              key={valIdx}
                              sx={{ color: '#0f172a', fontSize: '0.75rem', py: 1 }}
                            >
                              {String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}


{/* --- TASK CONTEXT (AUTO-FILLED FIELDS) - CONDITIONALLY RENDERED --- */}
{shouldShowTaskContext && (
        <Box sx={{ mb: 3, p: 2.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Task Context
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PCB Serial No"
                value={currentSerial || "N/A"}
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700 }
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PO Number"
                value={poNumber}
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700 }
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Operator Name"
                value={operatorName}
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700 }
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      )}

          {values.selectedPrograms?.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: '#fefce8', borderRadius: 2, borderColor: '#fef08a' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Selected Programs
                </Typography>
                {values.selectedPrograms.map((p, i) => (
                  <Chip
                    key={i}
                    // FIXED: Safely grab program_details, fallback to program_name, or default text
                    label={p.program_details || p.program_name || "Standard Program"}
                    size="small"
                    sx={{ mr: 1, mb: 1, bgcolor: 'white', border: '1px solid #facc15' }}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* --- CONSUMABLES CARD --- */}
          {/* {consumablesList.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: '#f8fafc', borderRadius: 2, borderColor: '#cbd5e1' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ScienceIcon sx={{ color: '#ea580c' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0f172a', m: 0 }}>
                    Selected Consumables
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {consumablesList.map((cons, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#ffffff' }}>
                        {Object.entries(cons).map(([k, v]) => (
                          <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>
                              {k.replace(/_/g, ' ')}:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 500, textAlign: 'right', ml: 1 }}>
                              {String(v).trim()}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )} */}

          {consumablesList.length > 0 && (
            <Card variant="outlined" sx={{ bgcolor: '#f8fafc', borderRadius: 2, borderColor: '#cbd5e1' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ScienceIcon sx={{ color: '#ea580c' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0f172a', m: 0 }}>
                    Selected Consumables
                  </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ bgcolor: '#ffffff', boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        {/* Dynamically generate headers from the keys of the first object */}
                        {Object.keys(consumablesList[0]).map((key) => (
                          <TableCell
                            key={key}
                            sx={{
                              fontWeight: 'bold',
                              color: '#475569',
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              borderBottom: '1px solid #e2e8f0'
                            }}
                          >
                            {key.replace(/_/g, ' ')}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {consumablesList.map((cons, idx) => (
                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          {Object.entries(cons).map(([k, v], valIdx) => (
                            <TableCell
                              key={valIdx}
                              sx={{
                                color: '#0f172a',
                                fontSize: '0.75rem',
                                py: 1,
                                borderBottom: '1px solid #f1f5f9'
                              }}
                            >
                              {String(v).trim()}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
      {/* ---------------------------------- */}


      {actionType !== 'view' && (
        <Box sx={{ mb: 3, p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', fontSize: '0.95rem' }}>
            COPY DATA FROM ANOTHER PCB
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Enter PCB Serial No..."
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              sx={{ bgcolor: 'white', flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              onClick={handleSearchBySerial}
              disabled={searching || !searchSerial}
              sx={{ borderRadius: '30px', fontWeight: 'bold' }}
            >
              Search & Copy
            </Button>
          </Stack>
        </Box>
      )}

      {/* Main Dynamic Form Rendering Block */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
        {(() => {
          const elements = [];
          const fields = form?.fields || [];
          let i = 0;

          while (i < fields.length) {
            const f = fields[i];

            // 1. Handling Readonly Text as Section Headers
            if (f.type === "text" && f.readonly) {
              elements.push(
                <Box key={f.key} sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', pb: 1 }}>
                    {f.label.replace(/-/g, '').trim()}
                  </Typography>
                </Box>
              );
              i++;
              continue;
            }





            // new code add here
            // 2. Handling Section Headers directly from your Dropdown Array
            // if (f.type && f.type.startsWith("header") || (f.type === "text" && f.readonly && !f.fetch_from_stage)) {

            //   // Automatically set the color based on the dropdown choice
            //   let bgColor = '#1976d2'; // Default Blue
            //   if (f.type === 'header_slate') bgColor = '#1e293b'; // Dark Navy/Black
            //   if (f.type === 'header_red') bgColor = '#be123c';   // Red

            //   elements.push(
            //     <Box key={f.key} sx={{ mt: 5, mb: 2, width: '100%' }}>
            //       <Paper 
            //         elevation={2} 
            //         sx={{ 
            //           bgcolor: bgColor, 
            //           color: '#ffffff',   
            //           px: 3,              
            //           py: 1.5,            
            //           borderRadius: '8px',
            //           display: 'flex',
            //           alignItems: 'center'
            //         }}
            //       >
            //         <Typography variant="h6" sx={{ fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            //           {f.label.replace(/-/g, '').trim()}
            //         </Typography>
            //       </Paper>
            //     </Box>
            //   );
            //   i++;
            //   continue;
            // }





            // Handling Pure Readonly Text as Section Headers (Solid Blue Banner Style)

            if (f.type === "points" && f.readonly) {
              elements.push(
                <Box key={f.key} sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="h6" color="black" sx={{ fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', pb: 1 }}>
                    {f.label.replace(/-/g, '').trim()}
                  </Typography>
                </Box>
              );
              i++;
              continue;
            }


            // 2. Handling Dynamic Table Checklists
            if (f.type === "dynamic_table") {
              const tableData = Array.isArray(values[f.key]) && values[f.key].length > 0
                ? values[f.key]
                : [{ sl_no: "1", remark: "", status: "" }];

              const handleTableChange = (rowIndex, field, val) => {
                const newData = [...tableData];
                newData[rowIndex] = { ...newData[rowIndex], [field]: val };
                handleChange(f.key, newData);
              };

              const handleAddRow = () => {
                const newData = [...tableData, { sl_no: String(tableData.length + 1), remark: "", status: "" }];
                handleChange(f.key, newData);
              };

              const handleRemoveRow = (rowIndex) => {
                const newData = tableData.filter((_, idx) => idx !== rowIndex);
                const sequencedData = newData.map((row, idx) => ({ ...row, sl_no: String(idx + 1) }));
                handleChange(f.key, sequencedData);
              };

              elements.push(
                <Box key={f.key} sx={{ mt: 3, mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {f.label}
                    </Typography>
                    {actionType !== 'view' && (
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleAddRow}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Add Row
                      </Button>
                    )}
                  </Stack>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                          {f.columns.map((col, colIndex) => (
                            <TableCell key={colIndex} sx={{ fontWeight: 'bold' }}>{col}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell sx={{ width: '5%', textAlign: 'center' }}>
                              <Typography variant="body2">{row.sl_no}</Typography>
                            </TableCell>

                            <TableCell sx={{ width: '55%' }}>
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Enter remark..."
                                value={row.remark}
                                onChange={(e) => handleTableChange(rowIndex, "remark", e.target.value)}
                                disabled={actionType === 'view'}
                                variant="standard"
                                InputProps={{ disableUnderline: actionType === 'view' }}
                              />
                            </TableCell>

                            <TableCell sx={{ width: '30%' }}>
                              <RadioGroup
                                row
                                value={row.status}
                                onChange={(e) => handleTableChange(rowIndex, "status", e.target.value)}
                              >
                                <FormControlLabel
                                  value="OK"
                                  control={<Radio size="small" color="success" disabled={actionType === 'view'} />}
                                  label="OK"
                                />
                                <FormControlLabel
                                  value="Not OK"
                                  control={<Radio size="small" color="error" disabled={actionType === 'view'} />}
                                  label="Not OK"
                                />
                              </RadioGroup>
                            </TableCell>

                            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
                              {actionType !== 'view' && tableData.length > 0 && (
                                <IconButton color="error" size="small" onClick={() => handleRemoveRow(rowIndex)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              );
              i++;
              continue;
            }

            // 3. Handling Image & Immediate Checkboxes Layout
            // if (f.type === "image" || f.type === "image_gallery") {
            //   const imageField = f;
            //   i++;

            //   const adjacentCheckboxes = [];
            //   while (i < fields.length && fields[i].type === "checkbox") {
            //     adjacentCheckboxes.push(fields[i]);
            //     i++;
            //   }

            //   elements.push(
            //     <Stack key={imageField.key} direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 2, alignItems: 'center' }}>
            //       <Box sx={{ width: { xs: '100%', md: '45%' } }}>
            //         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            //           {imageField.label}
            //         </Typography>
            //         <Box
            //           component="img"
            //           // src={imageField.value}
            //           src={imageField.value?.startsWith('http') ? imageField.value : `http://192.168.0.20:2000${imageField.value}`}
            //           alt={imageField.label}
            //           sx={{
            //             width: "100%",
            //             maxHeight: "350px",
            //             objectFit: "contain",
            //             borderRadius: 2,
            //             border: "1px solid #cbd5e1",
            //             boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            //           }}
            //           onError={(e) => {
            //             e.target.onerror = null;
            //             // e.target.src = "https://via.placeholder.com/600x200?text=Image+Not+Found+(Check+Server+Path)"; 
            //           }}
            //         />
            //       </Box>

            //       {adjacentCheckboxes.length > 0 && (
            //         <Box sx={{ width: { xs: '100%', md: '55%' }, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            //           <FormGroup>
            //             {adjacentCheckboxes.map(chk => (
            //               <FormControlLabel
            //                 key={chk.key}
            //                 control={
            //                   <Checkbox
            //                     checked={!!values[chk.key]}
            //                     onChange={e => handleChange(chk.key, e.target.checked)}
            //                     disabled={actionType === 'view'}
            //                   />
            //                 }
            //                 label={chk.label}
            //                 sx={{ mb: 1 }}
            //               />
            //             ))}
            //           </FormGroup>
            //         </Box>
            //       )}
            //     </Stack>
            //   );
            //   continue;
            // }
            if (f.type === "image" || f.type === "image_gallery") {
              const imageField = f;
              i++;
          
              const adjacentCheckboxes = [];
              while (i < fields.length && fields[i].type === "checkbox") {
                adjacentCheckboxes.push(fields[i]);
                i++;
              }
          
              elements.push(
                <Stack key={imageField.key} direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 2, alignItems: 'center' }}>
                  <Box sx={{ width: { xs: '100%', md: '45%' } }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {imageField.label}
                    </Typography>
                    <Box
            component="img"
            src={(() => {
              const val = imageField.value || "";
              
              // 1. Extract ONLY the file name, ignoring the entire 6006 URL
              // This turns "http://.../api/diagrams/image.jpg" into just "image.jpg"
              const fileName = val.split('/').pop().split('\\').pop(); 
              
              // 2. Point directly to your port 2000 server. 
              // Based on your URL string, the backend likely serves it from "/api/diagrams/"
              return `${PYTHON_URL}/api/diagrams/${fileName}`;
            })()}
            alt={imageField.label}
            sx={{
              width: "100%",
              maxHeight: "350px",
              objectFit: "contain",
              borderRadius: 2,
              border: "1px solid #cbd5e1",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
            onError={(e) => {
              console.error("Primary image URL failed:", e.target.src);
              
              // FALLBACK 1: Try the direct Upload/Diagrams folder
              if (e.target.src.includes('/api/diagrams/')) {
                const fileName = imageField.value.split('/').pop().split('\\').pop();
                e.target.src = `${PYTHON_URL}/Upload/Diagrams/${fileName}`;
              } 
              // FALLBACK 2: If the backend organizes folders by Stage Name
              else if (e.target.src.includes('/Upload/Diagrams/')) {
                 const fileName = imageField.value.split('/').pop().split('\\').pop();
                 // Use form.stage_name as you suggested for reference!
                 const safeStageName = form?.stage_name || "";
                 e.target.src = `${PYTHON_URL}/Upload/Diagrams/${safeStageName}/${fileName}`;
              }
              else {
                 e.target.onerror = null; // Stop infinite loop if all fail
              }
            }}
          />
                  </Box>
          
                  {adjacentCheckboxes.length > 0 && (
                    <Box sx={{ width: { xs: '100%', md: '55%' }, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <FormGroup>
                        {adjacentCheckboxes.map(chk => (
                          <FormControlLabel
                            key={chk.key}
                            control={
                              <Checkbox
                                checked={!!values[chk.key]}
                                onChange={e => handleChange(chk.key, e.target.checked)}
                                disabled={actionType === 'view'}
                              />
                            }
                            label={chk.label}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  )}
                </Stack>
              );
              continue;
            }

            // 4. Handling File Uploads
            // if (f.type === "file") {
            //   elements.push(
            //     <Stack key={f.key} direction="column" spacing={1}>
            //       <Stack direction="row" spacing={1} alignItems="center">
            //         <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderStyle: 'dashed' }}>
            //           {values[f.key]
            //             ? (typeof values[f.key] === 'object' ? `✅ ${values[f.key]?.name}` : `✅ ${values[f.key]}`)
            //             : `📂 Upload ${f.label} *`}
            //           <input type="file" hidden onChange={e => handleFileChange(f.key, e.target.files[0])} />
            //         </Button>

            //         {values[f.key]?.auto && machineId && (
            //           <Tooltip title={`Auto-linked from ${machineId}`}>
            //             <Chip label="Auto-Linked" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
            //           </Tooltip>
            //         )}

            //         {values[f.key] && actionType !== 'view' && (
            //           <IconButton color="error" onClick={() => handleChange(f.key, null)}>
            //             <DeleteIcon />
            //           </IconButton>
            //         )}
            //       </Stack>

            //       {values[f.key] && (
            //         <Box sx={{ mt: 1 }}>
            //           <iframe
            //             src={values[f.key]?.url || values[f.key]?.preview || (values[f.key]?.file ? URL.createObjectURL(values[f.key].file) : "")}
            //             width="100%"
            //             height="350px"
            //             title={f.label}
            //             style={{ border: "1px solid #e2e8f0", borderRadius: "8px" }}
            //           />
            //         </Box>
            //       )}
            //     </Stack>
            //   );
            //   i++;
            //   continue;
            // }
            if (f.type === "file") {
              const fileData = values[f.key];
              const fileName = fileData?.name || (typeof fileData === 'string' ? fileData : "");
              const fileExt = fileName ? fileName.split('.').pop().toLowerCase() : "";

              // Define which files the browser can actually preview in an iframe
              const isViewable = ['pdf', 'html', 'htm', 'png', 'jpg', 'jpeg', 'txt'].includes(fileExt);

              elements.push(
                <Stack key={f.key} direction="column" spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="outlined" component="label" fullWidth sx={{ p: 2, borderStyle: 'dashed' }}>
                      {fileData
                        ? (typeof fileData === 'object' ? `✅ ${fileName}` : `✅ ${fileData}`)
                        : `📂 Upload ${f.label} *`}

                      <input
                        type="file"
                        hidden
                        accept={f.accept}
                        onChange={e => handleFileChange(f.key, e.target.files[0])}
                      />
                    </Button>

                    {fileData?.auto && machineId && (
                      <Tooltip title={`Auto-linked from ${machineId}`}>
                        <Chip label="Auto-Linked" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                      </Tooltip>
                    )}

                    {fileData && actionType !== 'view' && (
                      <IconButton color="error" onClick={() => handleChange(f.key, null)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>

                  {/* Smart Preview Box */}
                  {fileData && (
                    <Box sx={{
                      mt: 1,
                      p: isViewable ? 0 : 4,
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      bgcolor: isViewable ? 'transparent' : '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isViewable ? (
                        // Show iframe for PDFs, HTML, Images
                        <iframe
                          src={fileData?.url || fileData?.preview || (fileData?.file ? URL.createObjectURL(fileData.file) : "")}
                          width="100%"
                          height="350px"
                          title={f.label}
                          style={{ border: "none", borderRadius: "8px" }}
                        />
                      ) : (
                        // Show a nice fallback UI for Word/Excel files
                        <>
                          <FilePresentIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold" color="#1e293b">
                            {fileName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Browser preview is not available for Word/Excel files.
                          </Typography>
                          <Typography variant="caption" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                            ✓ File successfully attached and will be saved!
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Stack>
              );
              i++;
              continue;
            }
            // 5. Stray Checkboxes
            if (f.type === "checkbox") {
              elements.push(
                <Box key={f.key}>
                  <FormControlLabel
                    control={<Checkbox checked={!!values[f.key]} onChange={e => handleChange(f.key, e.target.checked)} disabled={actionType === 'view'} />}
                    label={f.label}
                  />
                </Box>
              );
              i++;
              continue;
            }






            //************************************************************************ */
            if (f.type === "radio") {
              elements.push(
                <Box key={f.key} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">{f.label}</Typography>
                  <RadioGroup
                    row
                    value={values[f.key] || ""}
                    onChange={e => handleChange(f.key, e.target.value)}
                  >
                    {f.options.map(opt => (
                      <FormControlLabel
                        key={opt.value}
                        value={opt.value}
                        control={<Radio disabled={actionType === 'view'} />}
                        label={opt.label}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              );
              i++;
              continue;
            }

            // // --- SYSTEM API DROPDOWN LOGIC WITH AUTOCOMPLETE & MULTI-SELECT ---
            // if (f.type === "system-dropdown") {
            //   const sourceConfig = DATA_SOURCES[f.dataSourceId];
            //   if (sourceConfig) {
            //     let options = Array.isArray(systemData[f.key]) ? systemData[f.key] : [];

            //     // 1. FILTERING LOGIC
            //     if (f.dependsOnFieldKey) {
            //       const parentValue = values[f.dependsOnFieldKey]; // Current selected location(s)
            //       const parentFieldConfig = fields.find(fi => fi.key === f.dependsOnFieldKey);
                  
            //       if (parentValue && parentFieldConfig) {
            //         const parentSource = DATA_SOURCES[parentFieldConfig.dataSourceId];
            //         const parentOptions = systemData[f.dependsOnFieldKey] || [];
                    
            //         // Handle array for multi-select parents
            //         const parentValuesArr = Array.isArray(parentValue) ? parentValue : [parentValue];
                    
            //         // Extract all part numbers from the selected parent items
            //         const validPartNumbers = parentOptions
            //           .filter(opt => parentValuesArr.includes(String(opt[parentSource.valueKey])))
            //           .map(opt => String(opt[parentSource.linkedDataKey]));

            //         options = options.filter(opt => validPartNumbers.includes(String(opt[sourceConfig.filterByMatchKey])));
            //       } else {
            //         options = []; // Hide if no parent selected
            //       }
            //     }

            //     // Force multi-select explicitly if f.multiple is true or implicitly for these datasources
            //     const isMulti = !!f.multiple || f.dataSourceId === 'LOCATIONS' || f.dataSourceId === 'DEFECTS';

            //     // 2. MAP CURRENT STATE TO AUTOCOMPLETE OPTION OBJECTS
            //     const currentValue = values[f.key];
            //     let selectedOptionValue;
            //     if (isMulti) {
            //       const valArr = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
            //       selectedOptionValue = options.filter(opt => valArr.includes(String(opt[sourceConfig.valueKey])));
            //     } else {
            //       selectedOptionValue = options.find(opt => String(opt[sourceConfig.valueKey]) === String(currentValue)) || null;
            //     }

            //     // Check if "Others" is selected
            //     const isOthersSelected = isMulti 
            //       ? Array.isArray(values[f.key]) && values[f.key].includes("Others")
            //       : values[f.key] === "Others";

            //     elements.push(
            //       <Box key={f.key} sx={{ mb: 2, p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                    
            //         <Autocomplete
            //           multiple={isMulti}
            //           options={options}
            //           disabled={actionType === 'view' || f.readonly}
            //           getOptionLabel={(option) => String(option[sourceConfig.labelKey])}
            //           isOptionEqualToValue={(option, value) => String(option[sourceConfig.valueKey]) === String(value[sourceConfig.valueKey])}
            //           value={selectedOptionValue}
            //           onChange={(event, newValue) => {
            //             // Extract values to save in state (e.g. ["C1", "C2"] or "C1")
            //             let extractedValue;
            //             if (isMulti) {
            //               extractedValue = newValue.map(item => String(item[sourceConfig.valueKey]));
            //             } else {
            //               extractedValue = newValue ? String(newValue[sourceConfig.valueKey]) : '';
            //             }

            //             // Normal update for the Autocomplete
            //             handleChange(f.key, extractedValue);

            //             // AUTO-FILL ALL PART NUMBERS
            //             if (sourceConfig.linkedDataKey) {
            //               if (isMulti) {
            //                 if (newValue && newValue.length > 0) {
            //                   const allLinkedData = newValue.map(item => item[sourceConfig.linkedDataKey]).filter(Boolean);
            //                   const uniqueLinkedData = [...new Set(allLinkedData)].join(', ');
            //                   handleChange(sourceConfig.linkedDataKey, uniqueLinkedData); // e.g. "part_number"
            //                 } else {
            //                   handleChange(sourceConfig.linkedDataKey, ""); // Clear if all tags removed
            //                 }
            //               } else {
            //                 handleChange(sourceConfig.linkedDataKey, newValue ? newValue[sourceConfig.linkedDataKey] : "");
            //               }
            //             }
            //           }}
            //           renderInput={(params) => (
            //             <TextField
            //               {...params}
            //               label={f.label}
            //               required={f.required && (!values[f.key] || values[f.key].length === 0)}
            //               helperText={
            //                 options.length === 0 && f.dependsOnFieldKey && (!values[f.dependsOnFieldKey] || values[f.dependsOnFieldKey].length === 0)
            //                   ? "Please select previous field first"
            //                   : ""
            //               }
            //             />
            //           )}
            //         />

            //         {/* DYNAMICALLY AUTO-RENDER THE PART NUMBER FIELD UNDERNEATH */}
            //         {sourceConfig.linkedDataKey && values[sourceConfig.linkedDataKey] && (
            //           <TextField
            //             fullWidth
            //             sx={{ mt: 2 }}
            //             label={`Extracted ${sourceConfig.linkedDataKey.replace('_', ' ').toUpperCase()}`}
            //             value={values[sourceConfig.linkedDataKey]}
            //             InputProps={{ readOnly: true, sx: { fontWeight: 'bold', color: '#0f172a', bgcolor: '#e2e8f0' } }}
            //             variant="filled"
            //           />
            //         )}

            //         {/* CONDITIONALLY RENDER "OTHERS" REMARKS FIELD */}
            //         {isOthersSelected && (
            //           <TextField
            //             fullWidth
            //             sx={{ mt: 2 }}
            //             label="Remarks for Others"
            //             placeholder="Please specify the defect..."
            //             value={values[`${f.key}_others_remarks`] || ""}
            //             onChange={(e) => handleChange(`${f.key}_others_remarks`, e.target.value)}
            //             required
            //           />
            //         )}
            //       </Box>
            //     );
            //   }
            //   i++;
            //   continue;
            // }
            // // --- SYSTEM API DROPDOWN LOGIC WITH AUTOCOMPLETE & MULTI-SELECT ---
            // if (f.type === "system-dropdown") {
            //   const sourceConfig = DATA_SOURCES[f.dataSourceId];
            //   if (sourceConfig) {
            //     let options = Array.isArray(systemData[f.key]) ? systemData[f.key] : [];

            //     // 1. FILTERING LOGIC
            //     if (f.dependsOnFieldKey) {
            //       const parentValue = values[f.dependsOnFieldKey]; // Current selected location(s)
            //       const parentFieldConfig = fields.find(fi => fi.key === f.dependsOnFieldKey);
                  
            //       if (parentValue && parentFieldConfig) {
            //         const parentSource = DATA_SOURCES[parentFieldConfig.dataSourceId];
            //         const parentOptions = systemData[f.dependsOnFieldKey] || [];
                    
            //         // Decode the comma-separated string back into an array to filter
            //         const parentValuesArr = typeof parentValue === 'string' && parentValue !== '' 
            //             ? parentValue.split(', ') 
            //             : (Array.isArray(parentValue) ? parentValue : [parentValue]);
                    
            //         // Extract all part numbers from the selected parent items
            //         const validPartNumbers = parentOptions
            //           .filter(opt => parentValuesArr.includes(String(opt[parentSource.valueKey])))
            //           .map(opt => String(opt[parentSource.linkedDataKey]));

            //         options = options.filter(opt => validPartNumbers.includes(String(opt[sourceConfig.filterByMatchKey])));
            //       } else {
            //         options = []; // Hide if no parent selected
            //       }
            //     }

            //     // Force multi-select explicitly if f.multiple is true or implicitly for these datasources
            //     const isMulti = !!f.multiple || f.dataSourceId === 'LOCATIONS' || f.dataSourceId === 'DEFECTS';

            //     // 2. MAP CURRENT STATE TO AUTOCOMPLETE OPTION OBJECTS
            //     const currentValue = values[f.key];
            //     let selectedOptionValue;
            //     if (isMulti) {
            //       // Decode string back to array so the Autocomplete component can read it
            //       const valArr = typeof currentValue === 'string' && currentValue !== '' 
            //           ? currentValue.split(', ') 
            //           : (Array.isArray(currentValue) ? currentValue : []);
            //       selectedOptionValue = options.filter(opt => valArr.includes(String(opt[sourceConfig.valueKey])));
            //     } else {
            //       selectedOptionValue = options.find(opt => String(opt[sourceConfig.valueKey]) === String(currentValue)) || null;
            //     }

            //     // Check if "Others" is selected
            //     const isOthersSelected = isMulti 
            //       ? typeof currentValue === 'string' && currentValue.split(', ').includes("Others")
            //       : currentValue === "Others";

            //     elements.push(
            //       <Box key={f.key} sx={{ mb: 2, p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                    
            //         <Autocomplete
            //           multiple={isMulti}
            //           options={options}
            //           disabled={actionType === 'view' || f.readonly}
            //           getOptionLabel={(option) => String(option[sourceConfig.labelKey])}
            //           isOptionEqualToValue={(option, value) => String(option[sourceConfig.valueKey]) === String(value[sourceConfig.valueKey])}
            //           value={selectedOptionValue}
            //           onChange={(event, newValue) => {
                        
            //             // 1. EXTRACT AND JOIN AS A COMMA-SEPARATED STRING
            //             // This makes it visible on the ProductionLiveDashboard!
            //             let extractedValue;
            //             if (isMulti) {
            //               extractedValue = newValue.map(item => String(item[sourceConfig.valueKey])).join(', ');
            //             } else {
            //               extractedValue = newValue ? String(newValue[sourceConfig.valueKey]) : '';
            //             }

            //             // Normal update for the Autocomplete
            //             handleChange(f.key, extractedValue);

            //             // 2. AUTO-FILL ALL PART NUMBERS
            //             if (sourceConfig.linkedDataKey) {
            //               if (isMulti) {
            //                 if (newValue && newValue.length > 0) {
            //                   const allLinkedData = newValue.map(item => item[sourceConfig.linkedDataKey]).filter(Boolean);
            //                   const uniqueLinkedData = [...new Set(allLinkedData)].join(', ');
            //                   handleChange(sourceConfig.linkedDataKey, uniqueLinkedData); // e.g. "part_number"
            //                 } else {
            //                   handleChange(sourceConfig.linkedDataKey, ""); // Clear if all tags removed
            //                 }
            //               } else {
            //                 handleChange(sourceConfig.linkedDataKey, newValue ? newValue[sourceConfig.linkedDataKey] : "");
            //               }
            //             }
            //           }}
            //           renderInput={(params) => (
            //             <TextField
            //               {...params}
            //               label={f.label}
            //               required={f.required && (!values[f.key] || values[f.key].length === 0)}
            //               helperText={
            //                 options.length === 0 && f.dependsOnFieldKey && (!values[f.dependsOnFieldKey] || values[f.dependsOnFieldKey].length === 0)
            //                   ? "Please select previous field first"
            //                   : ""
            //               }
            //             />
            //           )}
            //         />

            //         {/* DYNAMICALLY AUTO-RENDER THE PART NUMBER FIELD UNDERNEATH */}
            //         {sourceConfig.linkedDataKey && values[sourceConfig.linkedDataKey] && (
            //           <TextField
            //             fullWidth
            //             sx={{ mt: 2 }}
            //             label={`Extracted ${sourceConfig.linkedDataKey.replace('_', ' ').toUpperCase()}`}
            //             value={values[sourceConfig.linkedDataKey]}
            //             InputProps={{ readOnly: true, sx: { fontWeight: 'bold', color: '#0f172a', bgcolor: '#e2e8f0' } }}
            //             variant="filled"
            //           />
            //         )}

            //         {/* CONDITIONALLY RENDER "OTHERS" REMARKS FIELD */}
            //         {isOthersSelected && (
            //           <TextField
            //             fullWidth
            //             sx={{ mt: 2 }}
            //             label="Remarks for Others"
            //             placeholder="Please specify the defect..."
            //             value={values[`${f.key}_others_remarks`] || ""}
            //             onChange={(e) => handleChange(`${f.key}_others_remarks`, e.target.value)}
            //             required
            //           />
            //         )}
            //       </Box>
            //     );
            //   }
            //   i++;
            //   continue;
            // }

//************************************************************************************************************************************************************************************************************************************ */
            // // --- SYSTEM API DROPDOWN LOGIC WITH AUTOCOMPLETE & MULTI-SELECT ---
            // if (f.type === "system-dropdown") {
            //   const sourceConfig = DATA_SOURCES[f.dataSourceId];
            //   if (sourceConfig) {
            //     let options = Array.isArray(systemData[f.key]) ? systemData[f.key] : [];

            //     // 1. FILTERING LOGIC
            //     if (f.dependsOnFieldKey) {
            //       const parentValue = values[f.dependsOnFieldKey]; // Current selected location(s)
            //       const parentFieldConfig = fields.find(fi => fi.key === f.dependsOnFieldKey);
                  
            //       if (parentValue && parentFieldConfig) {
            //         const parentSource = DATA_SOURCES[parentFieldConfig.dataSourceId];
            //         const parentOptions = systemData[f.dependsOnFieldKey] || [];
                    
            //         // Decode the comma-separated string back into an array to filter
            //         const parentValuesArr = typeof parentValue === 'string' && parentValue !== '' 
            //             ? parentValue.split(', ') 
            //             : (Array.isArray(parentValue) ? parentValue : [parentValue]);
                    
            //         // Extract all part numbers from the selected parent items
            //         const validPartNumbers = parentOptions
            //           .filter(opt => parentValuesArr.includes(String(opt[parentSource.valueKey])))
            //           .map(opt => String(opt[parentSource.linkedDataKey]));

            //         options = options.filter(opt => validPartNumbers.includes(String(opt[sourceConfig.filterByMatchKey])));
            //       } else {
            //         options = []; // Hide if no parent selected
            //       }
            //     }

            //     // Force multi-select explicitly if f.multiple is true or implicitly for these datasources
            //     const isMulti = !!f.multiple || f.dataSourceId === 'LOCATIONS' || f.dataSourceId === 'DEFECTS';

            //     // 2. MAP CURRENT STATE TO AUTOCOMPLETE OPTION OBJECTS
            //     const currentValue = values[f.key];
            //     let selectedOptionValue;
            //     if (isMulti) {
            //       // Decode string back to array so the Autocomplete component can read it
            //       const valArr = typeof currentValue === 'string' && currentValue !== '' 
            //           ? currentValue.split(', ') 
            //           : (Array.isArray(currentValue) ? currentValue : []);
            //       selectedOptionValue = options.filter(opt => valArr.includes(String(opt[sourceConfig.valueKey])));
            //     } else {
            //       selectedOptionValue = options.find(opt => String(opt[sourceConfig.valueKey]) === String(currentValue)) || null;
            //     }

            //     // ?? NEW: Safely check if "Others" is anywhere in the selected string ??
            //     const isOthersSelected = typeof currentValue === 'string' && currentValue.includes("Others");

            //     elements.push(
            //       <Box key={f.key} sx={{ mb: 2, p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                    
            //         <Autocomplete
            //           multiple={isMulti}
            //           options={options}
            //           disabled={actionType === 'view' || f.readonly}
            //           getOptionLabel={(option) => String(option[sourceConfig.labelKey])}
            //           isOptionEqualToValue={(option, value) => String(option[sourceConfig.valueKey]) === String(value[sourceConfig.valueKey])}
            //           value={selectedOptionValue}
            //           onChange={(event, newValue) => {
                        
            //             // EXTRACT AND JOIN AS A COMMA-SEPARATED STRING
            //             let extractedValue;
            //             if (isMulti) {
            //               extractedValue = newValue.map(item => String(item[sourceConfig.valueKey])).join(', ');
            //             } else {
            //               extractedValue = newValue ? String(newValue[sourceConfig.valueKey]) : '';
            //             }

            //             // Normal update for the Autocomplete
            //             handleChange(f.key, extractedValue);
                        
            //             // If "Others" is removed, automatically clear the remarks field so it doesn't save old data
            //             if (!extractedValue.includes("Others")) {
            //                handleChange("others_remarks", "");
            //             }

            //             // AUTO-FILL ALL PART NUMBERS
            //             if (sourceConfig.linkedDataKey) {
            //               if (isMulti) {
            //                 if (newValue && newValue.length > 0) {
            //                   const allLinkedData = newValue.map(item => item[sourceConfig.linkedDataKey]).filter(Boolean);
            //                   const uniqueLinkedData = [...new Set(allLinkedData)].join(', ');
            //                   handleChange(sourceConfig.linkedDataKey, uniqueLinkedData); // e.g. "part_number"
            //                 } else {
            //                   handleChange(sourceConfig.linkedDataKey, ""); // Clear if all tags removed
            //                 }
            //               } else {
            //                 handleChange(sourceConfig.linkedDataKey, newValue ? newValue[sourceConfig.linkedDataKey] : "");
            //               }
            //             }
            //           }}
            //           renderInput={(params) => (
            //             <TextField
            //               {...params}
            //               label={f.label}
            //               required={f.required && (!values[f.key] || values[f.key].length === 0)}
            //               helperText={
            //                 options.length === 0 && f.dependsOnFieldKey && (!values[f.dependsOnFieldKey] || values[f.dependsOnFieldKey].length === 0)
            //                   ? "Please select previous field first"
            //                   : ""
            //               }
            //             />
            //           )}
            //         />

            //         {/* DYNAMICALLY AUTO-RENDER THE PART NUMBER FIELD UNDERNEATH */}
            //         {sourceConfig.linkedDataKey && values[sourceConfig.linkedDataKey] && (
            //           <TextField
            //             fullWidth
            //             sx={{ mt: 2 }}
            //             label={`Extracted ${sourceConfig.linkedDataKey.replace('_', ' ').toUpperCase()}`}
            //             value={values[sourceConfig.linkedDataKey]}
            //             InputProps={{ readOnly: true, sx: { fontWeight: 'bold', color: '#0f172a', bgcolor: '#e2e8f0' } }}
            //             variant="filled"
            //           />
            //         )}

            //         {/* ?? DYNAMICALLY RENDER THE "OTHERS" REMARKS FIELD ?? */}
            //         {isOthersSelected && (
            //           <TextField
            //             fullWidth
            //             sx={{ mt: 2, bgcolor: '#ffffff' }}
            //             label="Remarks for Others"
            //             placeholder="Please specify the defect in detail..."
            //             value={values["others_remarks"] || ""}
            //             onChange={(e) => handleChange("others_remarks", e.target.value)}
            //             required
            //           />
            //         )}
            //       </Box>
            //     );
            //   }
            //   i++;
            //   continue;
            // }

            // --- SYSTEM API DROPDOWN LOGIC WITH AUTOCOMPLETE & MULTI-SELECT ---
            if (f.type === "system-dropdown") {
              const sourceConfig = DATA_SOURCES[f.dataSourceId];
              if (sourceConfig) {
                let options = Array.isArray(systemData[f.key]) ? systemData[f.key] : [];

                // 1. FILTERING LOGIC
                if (f.dependsOnFieldKey) {
                  const parentValue = values[f.dependsOnFieldKey]; // Current selected location(s)
                  const parentFieldConfig = fields.find(fi => fi.key === f.dependsOnFieldKey);
                  
                  if (parentValue && parentFieldConfig) {
                    const parentSource = DATA_SOURCES[parentFieldConfig.dataSourceId];
                    const parentOptions = systemData[f.dependsOnFieldKey] || [];
                    
                    const parentValuesArr = typeof parentValue === 'string' && parentValue !== '' 
                        ? parentValue.split(', ') 
                        : (Array.isArray(parentValue) ? parentValue : [parentValue]);
                    
                    const validPartNumbers = parentOptions
                      .filter(opt => parentValuesArr.includes(String(opt[parentSource.valueKey])))
                      .map(opt => String(opt[parentSource.linkedDataKey]));

                    options = options.filter(opt => validPartNumbers.includes(String(opt[sourceConfig.filterByMatchKey])));
                  } else {
                    options = []; // Hide if no parent selected
                  }
                }

                // Force multi-select explicitly if f.multiple is true or implicitly for these datasources
                const isMulti = !!f.multiple || f.dataSourceId === 'LOCATIONS' || f.dataSourceId === 'DEFECTS';

                // 2. MAP CURRENT STATE TO AUTOCOMPLETE OPTION OBJECTS
                const currentValue = values[f.key];
                let selectedOptionValue;
                if (isMulti) {
                  const valArr = typeof currentValue === 'string' && currentValue !== '' 
                      ? currentValue.split(', ') 
                      : (Array.isArray(currentValue) ? currentValue : []);
                  selectedOptionValue = options.filter(opt => valArr.includes(String(opt[sourceConfig.valueKey])));
                } else {
                  selectedOptionValue = options.find(opt => String(opt[sourceConfig.valueKey]) === String(currentValue)) || null;
                }

                const isOthersSelected = typeof currentValue === 'string' && currentValue.includes("Others");

                elements.push(
                  <Box key={f.key} sx={{ mb: 3 }}>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                          <TableRow>
                            {/* Uses Designer Header OR Fallback Label */}
                            <TableCell sx={{ fontWeight: 'bold', color: '#1e293b', width: (sourceConfig.linkedDataKey || isOthersSelected) ? '40%' : '100%' }}>
                              {f.dropdownHeader || f.label} {f.required && <span style={{color: '#e11d48'}}>*</span>}
                            </TableCell>
                            
                            {/* Uses Designer Header OR Fallback */}
                            {sourceConfig.linkedDataKey && values[sourceConfig.linkedDataKey] && (
                              <TableCell sx={{ fontWeight: 'bold', color: '#1e293b', width: '30%' }}>
                                {f.extractedHeader || `Extracted ${sourceConfig.linkedDataKey.replace('_', ' ').toUpperCase()}`}
                              </TableCell>
                            )}
                            
                            {/* Uses Designer Header OR Fallback */}
                            {isOthersSelected && (
                              <TableCell sx={{ fontWeight: 'bold', color: '#1e293b', width: '30%' }}>
                                {f.remarksHeader || 'Remarks for Others'}
                              </TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ verticalAlign: 'top', pt: 2, pb: 2, borderBottom: 'none' }}>
                              <Autocomplete
                                multiple={isMulti}
                                options={options}
                                disabled={actionType === 'view' || f.readonly}
                                getOptionLabel={(option) => String(option[sourceConfig.labelKey])}
                                isOptionEqualToValue={(option, value) => String(option[sourceConfig.valueKey]) === String(value[sourceConfig.valueKey])}
                                value={selectedOptionValue}
                                sx={{ bgcolor: '#ffffff' }}
                                onChange={(event, newValue) => {
                                  
                                  let extractedValue;
                                  if (isMulti) {
                                    extractedValue = newValue.map(item => String(item[sourceConfig.valueKey])).join(', ');
                                  } else {
                                    extractedValue = newValue ? String(newValue[sourceConfig.valueKey]) : '';
                                  }

                                  handleChange(f.key, extractedValue);
                                  
                                  if (!extractedValue.includes("Others")) {
                                     handleChange("others_remarks", "");
                                  }

                                  if (sourceConfig.linkedDataKey) {
                                    if (isMulti) {
                                      if (newValue && newValue.length > 0) {
                                        const allLinkedData = newValue.map(item => item[sourceConfig.linkedDataKey]).filter(Boolean);
                                        const uniqueLinkedData = [...new Set(allLinkedData)].join(', ');
                                        handleChange(sourceConfig.linkedDataKey, uniqueLinkedData); 
                                      } else {
                                        handleChange(sourceConfig.linkedDataKey, ""); 
                                      }
                                    } else {
                                      handleChange(sourceConfig.linkedDataKey, newValue ? newValue[sourceConfig.linkedDataKey] : "");
                                    }
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select options..."
                                    required={f.required && (!values[f.key] || values[f.key].length === 0)}
                                    helperText={
                                      options.length === 0 && f.dependsOnFieldKey && (!values[f.dependsOnFieldKey] || values[f.dependsOnFieldKey].length === 0)
                                        ? "Please select previous field first"
                                        : ""
                                    }
                                  />
                                )}
                              />
                            </TableCell>

                            {sourceConfig.linkedDataKey && values[sourceConfig.linkedDataKey] && (
                              <TableCell sx={{ verticalAlign: 'top', pt: 2, pb: 2, borderBottom: 'none' }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={values[sourceConfig.linkedDataKey]}
                                  InputProps={{ readOnly: true, sx: { fontWeight: 'bold', color: '#0f172a', bgcolor: '#e2e8f0' } }}
                                  variant="outlined"
                                />
                              </TableCell>
                            )}

                            {isOthersSelected && (
                              <TableCell sx={{ verticalAlign: 'top', pt: 2, pb: 2, borderBottom: 'none' }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Please specify in detail..."
                                  value={values["others_remarks"] || ""}
                                  onChange={(e) => handleChange("others_remarks", e.target.value)}
                                  required
                                  sx={{ bgcolor: '#ffffff' }}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                );
              }
              i++;
              continue;
            }
//******************************************************************************************************************** */
            const isSelect = f.type === "select";
            let inputType = "text";
            if (f.type === "date") inputType = "date";
            if (f.type === "datetime" || f.type === "datetime-local") inputType = "datetime-local";
            const needsShrink = inputType === "date" || inputType === "datetime-local";

            if (f.type === "select") {
              elements.push(

                <Box key={f.key}>
                  <TextField
                    select={isSelect}
                    label={f.label}
                    fullWidth
                    type={f.type === "date" ? "date" : "text"}
                    multiline={f.type === "textarea"}
                    rows={f.type === "textarea" ? 3 : 1}
                    InputLabelProps={f.type === "date" ? { shrink: true } : {}}
                    value={values[f.key] || ""}
                    onChange={e => handleChange(f.key, e.target.value)}
                    disabled={actionType === 'view' || f.readonly}
                  >
                    {/* Map through the options array if it's a select field */}
                    {isSelect && f.options?.map((option, idx) => (
                      <MenuItem key={idx} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              );
              i++;
            }
            else if (f.type === "datetime-local" || f.type === "datetime") {
              // console.log("handleChange")
              elements.push(
                <Box key={f.key}>
                  <TextField
                    label={f.label}
                    fullWidth
                    type={inputType}
                    multiline={f.type === "textarea"}
                    rows={f.type === "textarea" ? 3 : 1}
                    InputLabelProps={needsShrink ? { shrink: true } : {}}
                    value={values[f.key] || ""}
                    onChange={e => handleChange(f.key, e.target.value)}
                    disabled={actionType === 'view' || f.readonly}
                  />
                </Box>
              );
              i++;
            }
            else {
              elements.push(
                <Box key={f.key}>
                  <TextField
                    label={f.label}
                    fullWidth
                    type={f.type === "date" ? "date" : "text"}
                    multiline={f.type === "textarea"}
                    rows={f.type === "textarea" ? 3 : 1}
                    InputLabelProps={f.type === "date" ? { shrink: true } : {}}
                    value={values[f.key] || ""}
                    onChange={e => handleChange(f.key, e.target.value)}
                    disabled={actionType === 'view' || f.readonly}
                  />
                </Box>
              );
              i++;
            }
            //  *************************************************************************






            // 5. Stray Checkboxes
            if (f.type === "checkbox") {
              elements.push(
                <Box key={f.key}>
                  <FormControlLabel
                    control={<Checkbox checked={!!values[f.key]} onChange={e => handleChange(f.key, e.target.checked)} disabled={actionType === 'view'} />}
                    label={f.label}
                  />
                </Box>
              );
              i++;
              continue;
            }


          }

          return elements;
        })()}
      </Box>

      {/* {otherPcbs.length > 0 && actionType !== 'view' && (
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">
              {hasFileField ? "Batch Select (File Sync Verification)" : "Apply Data to Other PCBs"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel label="Select All" control={<Checkbox onChange={handleSelectAllBatch} />} />
            <Divider sx={{ my: 1 }} />
            <FormGroup row>
       
              {[...otherPcbs]
                .sort((a, b) => String(a.serialNo).localeCompare(String(b.serialNo), undefined, { numeric: true }))
                .map(pcb => {
                const hasFile = batchFileStatus[pcb.serialNo];
                return (
                  <Box key={pcb.serialNo} sx={{ width: '33%', display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Checkbox checked={!!batchSelection[pcb.serialNo]} onChange={() => handleBatchToggle(pcb.serialNo)} />
                    <Typography variant="body2" sx={{ mr: 1 }}>{pcb.serialNo}</Typography>
                    {hasFileField && (
                      hasFile ? <Tooltip title="File Found"><FilePresentIcon color="success" fontSize="small" /></Tooltip> :
                        <Tooltip title="File Missing"><FileDownloadOffIcon color="error" fontSize="small" /></Tooltip>
                    )}
                  </Box>
                );
              })}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

      )} */}
      {/* --- REWORK INTEGRATION --- */}
      {actionType !== 'view' && isReworkAllowed && (<>
        <Box sx={{ mt: 4, p: 2, border: '1px solid #fca5a5', bgcolor: '#fff5f5', borderRadius: 2 }}>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            Current Rework Raised Remarks :
          </Typography>
          <TextField
            fullWidth
            disabled
            multiline
            rows={2}
            variant="filled"
            value={raisedReworkRemarks}
            sx={{
              bgcolor: '#fff5f5',
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#1e293b', // Makes disabled text easier to read
              }
            }}
          />
        </Box>


        <Box sx={{ mt: 4, p: 2, border: '1px solid #fca5a5', bgcolor: '#fff5f5', borderRadius: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={reworkRequired} onChange={(e) => setReworkRequired(e.target.checked)} color="error" />}
            label={<Typography fontWeight="bold" color="error">Is rework required?</Typography>}
          />
          {reworkRequired && (
            <TextField
              fullWidth multiline rows={2} sx={{ mt: 1, bgcolor: 'white' }}
              label="Defect Remarks (Mandatory for Rework)"
              value={reworkRemarks}
              onChange={(e) => setReworkRemarks(e.target.value)}
              error={!reworkRemarks.trim()}
              helperText={!reworkRemarks.trim() ? "Please describe the defect to send to BGA Rework Station" : ""}
            />
          )}

        </Box>
        <Box sx={{ mt: 4, p: 2, border: '1px solid #fca5a5', bgcolor: '#fff5f5', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            Remarks After Completing Rework:
          </Typography>
          <TextField
            fullWidth
            disabled
            multiline
            rows={2}
            variant="filled"
            value={currentReworkRemarks}
            sx={{
              bgcolor: '#fff5f5',
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#1e293b', // Makes disabled text easier to read
              }
            }}
          />
        </Box>
      </>
      )}





      {otherPcbs.length > 0 && actionType !== 'view' && (
        <Box sx={{ mt: 4 }}>
          {/* If there's a file field, ask the user if they want to apply data to others */}
          {hasFileField ? (
            <Box sx={{ p: 2, bgcolor: '#fff4e5', borderRadius: 2, mb: 2, border: '1px solid #ffd8a8' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Apply this data (including files) to other selected PCBs?
              </Typography>
              <RadioGroup
                row
                value={applyToAll ? "yes" : "no"}
                onChange={(e) => {
                  const val = e.target.value === "yes";
                  setApplyToAll(val);
                  if (!val) setBatchSelection({}); // Clear selections if "No"
                }}
              >
                <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Box>
          ) : null}

          {/* Only show the actual selection list if (no files OR user said YES to toggle) */}
          {(!hasFileField || applyToAll) && (
            <Accordion
              sx={{
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                '&:before': { display: 'none' } // Removes default MUI accordion top line
              }}
              elevation={0}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="800" color="#1e293b">
                  {hasFileField ? "Batch Select (File Sync Verification)" : "Apply Data to Other PCBs"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>

                {/* Header Controls: Select All & Search */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
                  <FormControlLabel
                    label={<Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Select All</Typography>}
                    control={<Checkbox onChange={handleSelectAllBatch} />}
                  />

                  <TextField
                    size="small"
                    placeholder="Search PCB Serial..."
                    value={batchSearchTerm}
                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: '260px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        '& fieldset': { borderColor: '#e2e8f0' },
                        '&:hover fieldset': { borderColor: '#94a3b8' },
                      }
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 2, borderColor: '#e2e8f0' }} />

                {/* SCROLLABLE CONTAINER */}
                <Box sx={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  pr: 1, // Padding right so scrollbar doesn't overlap text
                  // Custom subtle scrollbar styling
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: '#f8fafc', borderRadius: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' },
                  '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' }
                }}>
                  <FormGroup row>
                    {[...otherPcbs]
                      // 1. FILTER BY SEARCH TERM FIRST
                      .filter(pcb => String(pcb.serialNo).toLowerCase().includes(batchSearchTerm.toLowerCase()))
                      // 2. THEN SORT
                      .sort((a, b) => String(a.serialNo).localeCompare(String(b.serialNo), undefined, { numeric: true }))
                      // 3. THEN MAP
                      .map(pcb => {
                        const hasFile = batchFileStatus[pcb.serialNo];
                        return (
                          <Box key={pcb.serialNo} sx={{ width: '33%', display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <Checkbox
                              checked={!!batchSelection[pcb.serialNo]}
                              onChange={() => handleBatchToggle(pcb.serialNo)}
                              size="small"
                              sx={{ color: '#cbd5e1' }}
                            />
                            <Typography variant="body2" sx={{ mr: 1, fontWeight: 600, color: '#334155' }}>
                              {pcb.serialNo}
                            </Typography>
                            {/* {hasFileField && (
                              hasFile
                                ? <Tooltip title="File Found"><FilePresentIcon sx={{ color: '#10b981', fontSize: '1.2rem' }} /></Tooltip>
                                : <Tooltip title="File Missing"><FileDownloadOffIcon sx={{ color: '#ef4444', fontSize: '1.2rem' }} /></Tooltip>
                            )} */}
                          </Box>
                        );
                      })}
                  </FormGroup>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}

      {/* <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
        {reworkRequired ? (
          <Button variant="contained" color="error" onClick={handleRaiseRework} disabled={!reworkRemarks.trim()} sx={{ borderRadius: '30px', fontWeight: '600', padding: '10px 20px' }}>
            Raise Rework & Reject
          </Button>
        ) : (
          <>
            {actionType === 'Start' && (
              <>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isFileReady && hasFileField}
                sx={{
                  width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
                  background: 'linear-gradient(145deg, #95e698, #91cf94)',
                  "&:hover": { background: 'linear-gradient(145deg, #4c9a50, #4c904d)' },
                  "&:disabled": { background: '#e2e8f0', color: '#94a3b8' }
                }}
              >
                <SaveIcon sx={{ mr: 1 }} /> Save Progress
              </Button>

<Button
variant="contained"
onClick={handlePause}
sx={{
  width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
  background: 'linear-gradient(145deg, #ffa726, #fb8c00)', // Orange gradient
  "&:hover": { background: 'linear-gradient(145deg, #fb8c00, #ffa726)' }
}}
startIcon={<PauseIcon />}
>
Pause Task
</Button>
</>

              
            )}
            <Button
              variant="contained" color="success" onClick={handleComplete}
              disabled={!isValid || actionType === 'view'}
              sx={{
                width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
                background: 'linear-gradient(145deg, #66bb6a, #81c784)',
                "&:hover": { background: 'linear-gradient(145deg, #81c784, #66bb6a)' },
                "&:disabled": { background: '#e2e8f0', color: '#94a3b8' }
              }}
            >
              Complete Task
            </Button>
          </>
        )}
      </Stack> */}

      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
        {reworkRequired ? (
          <Button variant="contained" color="error" onClick={handleRaiseRework} disabled={!reworkRemarks.trim()} sx={{ borderRadius: '30px', fontWeight: '600', padding: '10px 20px' }}>
            Raise Rework & Reject
          </Button>
        ) : isPaused ? (
          /* SHOW ONLY RESUME BUTTON IF PAUSED */
          <Button
            variant="contained"
            onClick={handleResume}
            sx={{
              width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
              background: 'linear-gradient(145deg, #4ade80, #22c55e)', // Green
              "&:hover": { background: 'linear-gradient(145deg, #22c55e, #16a34a)' }
            }}
            startIcon={<PlayArrowIcon />}
          >
            Resume Task
          </Button>
        ) : (
          /* SHOW STANDARD BUTTONS IF NOT PAUSED */
          <>
            {actionType === 'Start' && (
              <>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isFileReady && hasFileField}
                  sx={{
                    width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
                    background: 'linear-gradient(145deg, #95e698, #91cf94)',
                    "&:hover": { background: 'linear-gradient(145deg, #4c9a50, #4c904d)' },
                    "&:disabled": { background: '#e2e8f0', color: '#94a3b8' }
                  }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Save Progress
                </Button>

                <Button
                  variant="contained"
                  onClick={handlePauseClick} // <--- CHANGE THIS LINE
                  sx={{
                    width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
                    background: 'linear-gradient(145deg, #ffa726, #fb8c00)',
                    "&:hover": { background: 'linear-gradient(145deg, #fb8c00, #ffa726)' }
                  }}
                  startIcon={<PauseIcon />}
                >
                  Pause Task
                </Button>
              </>
            )}
            <Button
              variant="contained" color="success" onClick={handleComplete}
              disabled={!isValid || actionType === 'view'}
              sx={{
                width: "fit-content", borderRadius: '30px', fontWeight: '600', padding: '10px 20px',
                background: 'linear-gradient(145deg, #66bb6a, #81c784)',
                "&:hover": { background: 'linear-gradient(145deg, #81c784, #66bb6a)' },
                "&:disabled": { background: '#e2e8f0', color: '#94a3b8' }
              }}
            >
              Complete Task
            </Button>
          </>
        )}
      </Stack>

      {/* --- QR Scanner Modal Dialog --- */}
      <Dialog
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Scan QR / Barcode</Typography>
          <CloseIcon
            onClick={() => setOpenScanner(false)}
            style={{ backgroundColor: 'tomato', color: 'white', cursor: 'pointer', borderRadius: '4px', padding: '2px' }}
          />
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#000', height: '400px', position: 'relative' }}>
          {openScanner && (
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => { if (result?.text) handleScan(result?.text); }}
              containerStyle={{ width: '100%', height: '100%', paddingTop: 0 }}
              videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '200px', height: '200px', border: '3px solid #4ade80', borderRadius: '12px', zIndex: 10, pointerEvents: 'none'
          }} />
        </DialogContent>
      </Dialog>

      {/* --- Pause Reason Dialog --- */}
      <Dialog
        open={pauseDialogOpen}
        onClose={() => setPauseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: '#fb8c00', color: 'white', fontWeight: 'bold' }}>
          Pause Task
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#334155' }}>
            Please provide a reason for pausing this task:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="e.g., Machine breakdown, Waiting for parts, Lunch break..."
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setPauseDialogOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPause}
            variant="contained"
            color="warning"
            disabled={!pauseReason.trim()} // Prevents pausing without a reason!
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          >
            Confirm Pause
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}