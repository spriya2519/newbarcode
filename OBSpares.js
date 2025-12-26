
import React, { useEffect, useState } from "react";
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import axios from 'axios';
import { Autocomplete, Button, Card, Container, DialogContentText, Grid, TextField, Typography } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import { useForm, Controller } from 'react-hook-form';
// import { experimentalStyled as styled } from '@mui/material/styles';
// Line 15 - CORRECT
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
// import { SPARESPAGEDEFAULTDATA } from './SparesPageDefaultData';
import { useDispatch, useSelector } from "react-redux";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { LightModeSharp } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import UpdateIcon from "@mui/icons-material/Update";
import AddCircleIcon from "@mui/icons-material/AddCircle";



// const baseURL = "http://192.168.0.150:8081/GetSparesOBS";
//const baseURL = "http://192.168.0.20:8081/GetSparesOBS";


function OBSpares(props) {
    const [SparesData, SetSparesData] = React.useState([])
    const [RepairData, SetRepairData] = React.useState([])
    const [SparesDefaultData, SetSparesDefaultData] = React.useState([])
    const [dialogdata, setdialogData] = React.useState([])
    const [BidName, SetBidName] = React.useState("TCC");
    const [ShipName, SetShipName] = React.useState("");
    const [Dopen, setDOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [Copen, setCOpen] = React.useState(false);
    const [Ropen, setROpen] = React.useState(false);
    const [Topen, setTOpen] = React.useState(false);
    const [Popen, setPOpen] = React.useState(false);
    const [Eopen, setEOpen] = React.useState(false);
    const [groupedSparesData, setGroupedSparesData] = useState({});
    const [groupedData, setGroupedData] = useState({});
    const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
    const [OpenE, setOpenE] = React.useState(false);
    const [DialogRepairOpen, setDialogRepairOpen] = React.useState(false);
    const [workingdata, SetWorkingData] = React.useState([])
    const [path, setpath] = useState();
    const [ConfigDetails, SetConfigDetails] = useState([]);
    const [searchPath, SetsearchPath] = useState("");


    const [countChange, SetcountChange] = React.useState(0)


    // base url is fetched using  config file 
    var API2 = '/GetSparesOBS';
    // var baseURL = "http://192.168.0.20:8081" + API2
    var baseURL = "http://127.0.0.1:8081" + API2




    var API3 = '/UpdateRepairSparesDataOBS';
    // var baseURL1 = "http://192.168.0.20:8081" + API3




    if (configDetails != undefined) {

        if (configDetails.project[0].ServerIP != undefined) {


            if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

                baseURL = configDetails.project[0].ServerIP[0].NodeServerIP + API2
                // console.log("PythonServerIP from ExperimentonSearch",PythonServerIP)
                // console.log("configDetails from ExperimentonSearch",configDetails.project[0].ServerIP[0])
            }


        }

    }

    const inputString = configDetails.project[0].current_project
    console.log('inputString',inputString)

    // let SpareData=[]
    // Data Feacted Through Axios Get Api






 


   // ... existing imports

    const [originalData, setOriginalData] = React.useState([]); // Store full API response
  

    // 1. Fetch the data
    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            const rawData = response.data.data;
            setOriginalData(rawData); // Save the full list here
            
            // Set initial Repair data
            const qtylandedforrepair = rawData.filter(item => item.Cabinet === 'Repair');
            SetRepairData(qtylandedforrepair);
        }).catch((err) => {
            console.error("Fetch error:", err);
        });
    }, [countChange, baseURL]);

    // 2. Apply Filters whenever 'path' or 'originalData' changes
    useEffect(() => {
        if (!originalData.length) return;

        let filteredResults = [];

        // PATH 1: TALWAR Class ships
        if (path === "IAC_MOD_C/INS_TABAR/" || 
            path === "IAC_MOD_C/INS_TALWAR/" || 
            path === "IAC_MOD_C/INS_TRISHUL/") {
            
            filteredResults = originalData.filter(item => 
                ['INS-TEG', 'INS-TALWAR'].includes(item.ShipName)
            );
        }
        // PATH 2: SHIVALIK Class ships
        else if (path === "IAC_MOD_C/INS_SHIVALIK/") { // Replace with your actual path string
            filteredResults = originalData.filter(item => 
                ['INS-SHIVALIK'].includes(item.ShipName)
            );
        }
        // DEFAULT: Show all or specific default
        else {
            filteredResults = originalData;
        }

        SetSparesData(filteredResults);
        GroupByData(filteredResults); // Update the table display
        
    }, [path, originalData]);

    // ... rest of your code

    function RefreshOBSRepairSpare() {
        SetcountChange(countChange + 1)

    }

    function extractShipName(inputString){

        const parts = inputString.split('/')
        if (parts.length>1){
            
            
            return parts[1];
        }else{
            return null;
        }
   
    }


    function GroupByData(grpData) {



        const grouped = grpData.reduce((result, item) => {
            const partNumber = item.PartNumber.trim();
            if (!result[partNumber]) {
                result[partNumber] = {
                    totalQty: 0,
                    totalQty1: 0,
                    serialNumbers: [],
                    description: item.Description,
                    PartNumber: item.PartNumber,

                    QtyLandedForRepair: item.QtyLandedForRepair,
                    StorageLocation: item.StorageLocation,
                    RunningHrs: item.RunningHrs,
                    MTBF: item.MTBF,
                    Remarks: item.Remarks,
                    Cabinet: item.Cabinet
                    // ... Other relevant properties you want to display once
                };
            }

            // ChatGpt Code
            result[partNumber].totalQty += parseInt(item.QtyOwnShip, 10);
            if (!result[partNumber].serialNumbers.includes(item.SerialNumber)) {
                result[partNumber].serialNumbers.push(item.SerialNumber);
            }
            return result;
        }, {});
        setGroupedData(grouped);



    }



    function backtoHome() {
        window.location.href = "/"
    }
    // Add Obs
    const handleClick = () => {

        setDOpen(true);
    };

    //  to close Obs
    const handleCloseDialog = () => {
        setDOpen(false);
    };

    // when we click on table
    const ontableclick = (event) => {
        // const filtered = SparesData.filter(item => {
        //     console.log("WeeklyPageDataDisplay dialog",item)
        //     return (item.ID === event.target.parentNode.id);

        // });



        // setdialogData(filtered)

    }
    // when we click on cabinet to close

    const handleClickE = (event) => {

        setOpenE(true);
    };
    const handleCloseDialogE = () => {
        setOpenE(false);
        RefreshOBSRepairSpare()
    };
    function handleClickDialogRepair() {
        setDialogRepairOpen(true);
    };

    function handleRepairCloseDialog() {
        setDialogRepairOpen(false);
        RefreshOBSRepairSpare()
    };

    return (
        <div style={{ paddingLeft: "2.0rem", paddingRight: "1.0rem" }}>
            <hr></hr>

            {/* <h1 style={{ textAlign: "center", backgroundColor: "midnightblue", color: 'white' }}> OB Spares </h1> */}
            {/* <h2 style={{ textAlign: "center", backgroundColor: "lavender" }}>OB Spares</h2> */}
            {/* Table code  */}
            {/* Components from MUI Website */}
            <TableContainer component={Paper} style={{ paddingTop: 10, height: "35rem", }} onClick={ontableclick}>
                <Table sx={{ minWidth: 650, height: 'max-content' }} aria-label="simple table" >
                    <TableHead >

                        {/* <TableCell style={{ fontWeight: "bolder" ,fontSize:'16px' }}>ID</TableCell> */}
                        {/* <TableCell style={{ fontWeight: "bolder" }} align="left">Cabinet</TableCell> */}
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Serial Number</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">BEL Part Number</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Description</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Quantity Own Ship</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Quantity Landed For Repair</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Storage Location</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Running Hours</TableCell>
                        <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">MTBF(Hrs)</TableCell>
                        {/* <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="left">Status</TableCell> */}

                    </TableHead>
                    <TableBody>


                        {Object.keys(groupedData).map((partNumber, index) => (
                            <>
                                <TableRow>
                                    {/* <TableCell  align="left">{index+1}</TableCell> */}



                                    <TableCell align="left" style={{ color: "blue", fontSize: '14px' }} >{groupedData[partNumber].serialNumbers.join(', ')}</TableCell>
                                    <TableCell style={{ color: "black", width: '11rem', fontSize: '14px' }} align="left">{partNumber}</TableCell>
                                    <TableCell align="left" style={{ fontSize: '14px' }}>{groupedData[partNumber].description}</TableCell>
                                    <TableCell align="center" style={{ fontSize: '14px' }}>{groupedData[partNumber].totalQty}</TableCell>
                                    <TableCell align="center" style={{ fontSize: '14px' }}>{groupedData[partNumber].QtyLandedForRepair}</TableCell>
                                    <TableCell align="center" style={{ fontSize: '14px' }}>{groupedData[partNumber].StorageLocation}</TableCell>
                                    <TableCell align="center" style={{ fontSize: '14px' }}>{groupedData[partNumber].RunningHrs}</TableCell>
                                    <TableCell align="center" style={{ fontSize: '14px' }}>{groupedData[partNumber].MTBF}</TableCell>
                                    {/* <TableCell align="center" style={{ fontSize: '14px' }}>{groupedData[partNumber].Cabinet}</TableCell> */}
                                </TableRow>


                            </>

                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            {/* Button Add OBS */}
            <div style={{ textAlign: "end", marginTop: '1rem' }}>
                <Button style={{ textTransform: "none", justifyContent: "flex-end", color: 'black', width: '10rem', fontWeight: 'bolder', backgroundColor: 'azure' }} onClick={handleClick}><AddCircleIcon></AddCircleIcon>OBS</Button>
            </div>

            <div style={{ textAlign: "end", marginTop: '1rem' }}>
                <Button style={{ textTransform: "none", justifyContent: "flex-end", color: 'black', width: '10rem', fontWeight: 'bolder', backgroundColor: 'azure' }} onClick={handleClickE}><EditIcon></EditIcon> Location OBS</Button>
            </div>
            <div style={{ textAlign: "end", marginTop: '1rem', marginBottom: '1rem' }}>
                <Button style={{ textTransform: "none", justifyContent: "flex-end", color: 'black', width: '10rem', fontWeight: 'bolder', backgroundColor: 'azure' }} onClick={handleClickDialogRepair}><UpdateIcon></UpdateIcon> Repair OBS</Button>
            </div>



            {RepairData[0] != undefined && (
                <>
                    {/* <h3>Quantity Landed for Repair</h3> */}
                    <hr></hr>
                    <h3 style={{ textAlign: "center", backgroundColor: "lavender", marginTop: '2rem' }}>Quantity Landed for Repair</h3>
                    <TableContainer component={Paper} style={{ paddingTop: 10, height: "20rem" }}>
                        <Table sx={{ height: 'max-content' }} aria-label="simple table" >
                            <TableHead >
                                <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="center">Serial Number</TableCell>
                                <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="center">BEL Part Number</TableCell>
                                <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="center">Description</TableCell>
                                <TableCell style={{ fontWeight: "bolder", fontSize: '15px' }} align="center">Quantity Landed For Repair</TableCell>


                            </TableHead >
                            <TableBody>
                                <>
                                    {
                                        RepairData.map((item) => {
                                            return (
                                                <>
                                                    <TableRow>
                                                        <TableCell style={{ color: "black", fontSize: '14px' }} align="center">{item.SerialNumber}</TableCell>
                                                        <TableCell style={{ color: "black", fontSize: '14px' }} align="center">{item.PartNumber}</TableCell>
                                                        <TableCell style={{ color: "black", fontSize: '14px' }} align="center">{item.Description}</TableCell>
                                                        <TableCell style={{ color: "black", fontSize: '14px' }} align="center">{item.QtyLandedForRepair}</TableCell>



                                                    </TableRow>

                                                </>
                                            )

                                        })
                                    }

                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>


            )}



            {/* Dialog will open when i click on Add OBS Button */}

            <Dialog
                open={Dopen}
                onClose={handleCloseDialog}
                maxWidth
                style={{ paddingLeft: '25rem' }}
            >
                <DialogContentText>
                    < div style={{ alignItems: "center", backgroundColor: "#536e99", justifyContent: "space-between", display: "flex" }}>

                        <div style={{ textAlign: "right", color: 'white' }}>
                            <Button onClick={handleCloseDialog} style={{ backgroundColor: "orange", color: "black" }} >X</Button>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', textAlign: "center" }}> ADD OBS </h4>
                        </div>
                        <div style={{ textAlign: "right", color: 'white' }}>
                            <Button onClick={handleCloseDialog} style={{ backgroundColor: "orange", color: "black" }} >X</Button>
                        </div>

                    </div>

                    <div style={{ paddingTop: "1rem" }}>

                    </div>



                </DialogContentText>
                <DialogContentText>


                    {/* Calling Component to display form */}
                    <OBSSparesDataForm></OBSSparesDataForm>
                </DialogContentText>

            </Dialog>

            <Dialog
                open={OpenE}
                onClose={handleCloseDialogE}
                maxWidth
                style={{ paddingLeft: '25rem' }}
            >
                <DialogContentText>
                    < div style={{ alignItems: "center", backgroundColor: "#536e99", justifyContent: "space-between", display: "flex" }}>

                        <div style={{ textAlign: "right", color: 'white' }}>
                            <Button onClick={handleCloseDialogE} style={{ backgroundColor: "orange", color: "black" }} >X</Button>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', textAlign: "center" }}>Edit Location OBS</h4>
                        </div>
                        <div style={{ textAlign: "right", color: 'white' }}>
                            <Button onClick={handleCloseDialogE} style={{ backgroundColor: "orange", color: "black" }} >X</Button>
                        </div>

                    </div>

                    <div style={{ paddingTop: "1rem" }}>

                    </div>



                </DialogContentText>
                <DialogContentText>


                    {/* Calling Component to display form */}
                    <EDITOBSSparesDataForm SparesData={SparesData} > </EDITOBSSparesDataForm>
                </DialogContentText>

            </Dialog>


            {/* Dialog for Repair */}
            <Dialog
                open={DialogRepairOpen}
                onClose={handleRepairCloseDialog}
                maxWidth
                style={{ paddingLeft: '25rem' }}
            >
                <DialogContentText>
                    < div style={{ alignItems: "center", backgroundColor: "#536e99", justifyContent: "space-between", display: "flex" }}>

                        <div style={{ textAlign: "right", color: 'white' }}>
                            <Button onClick={handleRepairCloseDialog} style={{ backgroundColor: "orange", color: "black" }} >X</Button>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', textAlign: "center" }}> UPDATE REPAIR OBS </h4>
                        </div>
                        <div style={{ textAlign: "right", color: 'white' }}>
                            <Button onClick={handleRepairCloseDialog} style={{ backgroundColor: "orange", color: "black" }} >X</Button>
                        </div>

                    </div>

                    <div style={{ paddingTop: "1rem" }}>

                    </div>



                </DialogContentText>
                <DialogContentText>


                    {/* Calling Component to display form */}
                    {RepairData[0] != undefined && (

                        <>
                            <EDITREPAIROBSSparesDataForm RepairDataSparesData={RepairData} handleRepairCloseDialog={handleRepairCloseDialog}  ></EDITREPAIROBSSparesDataForm>
                        </>
                    )}


                </DialogContentText>

            </Dialog>


        </div>
    )

}

// function QuantityLandedforRepair(props) {
//     return (
//         <>



//         </>
//     )
// }

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



function OBSSparesDataForm() {


    const {
        register,
        handleSubmit,
        watch,
        trigger,
        reset,
        formState: { errors },
    } = useForm();
    const [startDate, setStartDate] = useState(new Date());
    const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
    const handleDateChange = (date) => {
        setStartDate(date);
        return date;
    };



    const onSubmit = async (formData) => {


        // console.log("data",data) 
        // const dateC = new Date(data['DeployedDate']);
        // const formattedDate = dateC.toLocaleDateString("en-US", {
        //     month: '2-digit',
        //     day: '2-digit',
        //     year: 'numeric'
        // });


        // data['DeployedDate'] = formattedDate




        // const dateL = new Date(data['LastRepairDate']);
        // const formattedDate2 = dateL.toLocaleDateString("en-US", {
        //     month: '2-digit',
        //     day: '2-digit',
        //     year: 'numeric'
        // });


        // data['LastRepairDate'] = formattedDate2
        // console.log("formDataformDataformData",formData["Remarks"])

        var TodayDate = dayjs(new Date());
        let NewTodayDate = TodayDate.format('DD-MM-YYYY ');


        let data = {


            // "ID": formData["SerialNumber"].replaceAll(/[X]/g,''),
            "ID": formData["SerialNumber"].replaceAll(/[X]/g, ''),
            "Cabinet": 'Working',
            "SerialNumber": formData["SerialNumber"].trim(),
            "PartNumber": formData["PartNumber"].trim(),
            "Description": formData["Description"],
            "QtyOwnShip": 1,
            "QtyLandedForRepair": 0,
            "StorageLocation": formData["StorageLocation"],
            "RunningHrs": formData["RunningHrs"],
            "MTBF": formData["MTBF"],
            "DeployedDate": NewTodayDate,
            "LastRepairDate": NewTodayDate,
            "Remarks": formData["Remarks"]



        }
        console.log("after changing    fdsgfsgfdgdgdgd", data)


        var API2 = '/GetSparesOBS';
        // var baseURL = "http://192.168.0.20:8081" + API2

        var baseURL = "http://127.0.0.1:8081" + API2

        if (configDetails != undefined) {

            if (configDetails.project[0].ServerIP != undefined) {


                if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

                    baseURL = configDetails.project[0].ServerIP[0].NodeServerIP + API2
                    // console.log("PythonServerIP from ExperimentonSearch",PythonServerIP)
                    // console.log("configDetails from ExperimentonSearch",configDetails.project[0].ServerIP[0])
                }


            }

        }
        // this will save the data in the database 
        axios.post(baseURL, data)
            .then((response) => {
                console.log(response);

            })
            .then((data) => {
                // console.log(data);
                alert("Updated Sucessfully");
            })
            .catch((error) => {
                // console.log(error);
                alert(" Not Updated Sucessfully,Error");
            })




    };




    return (

        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: "1rem", }}>
                    <center>
                        <Box sx={{ flexGrow: 1, borderColor: "red" }} >

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>

                                    {/* code taken from react hook form  */}
                                    <Typography style={{ color: "blue" }}>Serial Number</Typography>
                                    <TextField
                                        style={{ backgroundColor: "lightyellow" }}
                                        name="SerialNumber"
                                        size="small"
                                        {...register('SerialNumber', {
                                            required: true,
                                            required: "Please Enter Serial Number",
                                            pattern: {
                                                value: /^[a-zA-Z0-9]*$/i,
                                                message: "Only Alphanumeric are allowed"

                                            }

                                        })}
                                        InputProps={{
                                            inputProps: {

                                                style: { textTransform: 'uppercase' },
                                            },
                                        }}

                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("SerialNumber")
                                                    ? errors.SerialNumber.message
                                                        ? errors.SerialNumber.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("SerialNumber")
                                                    ? errors.SerialNumber.message.length > 0
                                                        ? true
                                                        : false
                                                    : false

                                        }

                                    />


                                </Grid>
                                <Grid item xs={12} md={4} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>


                                    <Typography style={{ color: "blue" }}> BEL Part Number</Typography>
                                    <TextField
                                        style={{ backgroundColor: "lightyellow" }}
                                        name="PartNumber"
                                        size="small"


                                        InputProps={{
                                            inputProps: {

                                                style: { textTransform: 'uppercase' },
                                            },
                                        }}

                                        {...register('PartNumber', {
                                            required: "true",
                                            required: "Please Enter BEL Part Number",



                                            pattern: {
                                                value: /^[A-Za-z0-9]{11}$/i,
                                                message: "Only 11  Alphanumeric are allowed"

                                            }

                                        })}
                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("PartNumber")
                                                    ? errors.PartNumber.message
                                                        ? errors.PartNumber.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("PartNumber")
                                                    ? errors.PartNumber.message.length > 0
                                                        ? true
                                                        : false
                                                    : false

                                        }

                                    />


                                </Grid>

                                <Grid item xs={12} md={4} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>


                                    <Typography style={{ color: "blue" }}>Description</Typography>
                                    <TextField

                                        name="Description"
                                        {...register('Description', {



                                            required: "true",
                                            required: "Please Enter Description",


                                        })}
                                        size="small"




                                        style={{ backgroundColor: "lightyellow", }}
                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("Description")
                                                    ? errors.Description.message
                                                        ? errors.Description.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("Description")
                                                    ? errors.Description.message.length > 0
                                                        ? true
                                                        : false
                                                    : false

                                        }


                                    />


                                </Grid>



                            </Grid>
                            <Grid container spacing={2} style={{ paddingTop: "2rem" }}>

                                <Grid item xs={12} md={3} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>
                                    <Typography style={{ color: "blue" }}>Storage Location</Typography>
                                    <TextField
                                        style={{ backgroundColor: "lightyellow" }}
                                        size="small"
                                        name="StorageLocation"
                                        {...register('StorageLocation', {



                                            required: "Please Enter Storage Location Name",
                                            pattern: {
                                                value: "(?=.*[A-Z])(?=.*\d)(?=.*[A-Z])",
                                                message: "Please enter Storage Location",

                                            }


                                        })}
                                        InputProps={{
                                            inputProps: {

                                                style: { textTransform: 'uppercase' },
                                            },
                                        }}
                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("StorageLocation")
                                                    ? errors.StorageLocation.message
                                                        ? errors.StorageLocation.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("StorageLocation")
                                                    ? errors.StorageLocation.message.length > 0
                                                        ? true
                                                        : false
                                                    : false

                                        }

                                    />
                                </Grid>

                                <Grid item xs={12} md={3} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>


                                    <Typography style={{ color: "blue" }}>Running hours</Typography>
                                    <TextField

                                        name="RunningHrs"
                                        size="small"
                                        style={{ backgroundColor: "lightyellow" }}



                                        {...register('RunningHrs', {



                                            required: true,
                                            required: "Please Enter Running hours",
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Only digits are allowed"

                                            }


                                        })}
                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("RunningHrs")
                                                    ? errors.RunningHrs.message
                                                        ? errors.RunningHrs.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("RunningHrs")
                                                    ? errors.RunningHrs.message.length > 0
                                                        ? true
                                                        : false
                                                    : false
                                        }

                                    />


                                </Grid>
                                <Grid item xs={12} md={3} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>


                                    <Typography style={{ color: "blue" }}>MTBF (Hrs)</Typography>
                                    <TextField
                                        style={{ backgroundColor: "lightyellow" }}
                                        name="MTBF"
                                        size="small"


                                        {...register('MTBF', {

                                            required: true,
                                            required: "Please Enter MTBF",
                                            pattern: {


                                                value: /[+-]?[0-9]+\.[0-9]+/,
                                                message: "Only float values are allowed"

                                            }

                                        })}
                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("MTBF")
                                                    ? errors.MTBF.message
                                                        ? errors.MTBF.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("MTBF")
                                                    ? errors.MTBF.message.length > 0
                                                        ? true
                                                        : false
                                                    : false

                                        }

                                    />


                                </Grid>
                                <Grid item xs={12} md={3} style={{
                                    backgroundColor: "#faebefff",
                                    "paddingRight": "0.5rem",
                                    "paddingLeft": "0.5rem",
                                    "paddingBottom": "0.5rem",
                                    "paddingTop": "0.5rem"

                                }}>


                                    <Typography style={{ color: "blue" }}>Remarks</Typography>
                                    <TextField

                                        name="Remarks"
                                        {...register('Remarks', {
                                            // required: true,


                                            required: "Please Enter Remarks",
                                            pattern: {
                                                value: /^[a-z]*$/i,
                                                message: "Only Alphabet are allowed"

                                            }


                                        })}
                                        size="small"
                                        InputProps={{
                                            inputProps: {

                                                style: { textTransform: 'uppercase' },
                                            },
                                        }}



                                        style={{ backgroundColor: "lightyellow", }}
                                        helperText={
                                            Object.keys(errors).length === 0
                                                ? ""
                                                : Object.keys(errors).includes("Remarks")
                                                    ? errors.Remarks.message
                                                        ? errors.Remarks.message
                                                        : ""
                                                    : ""
                                        }
                                        error={
                                            Object.keys(errors).length === 0
                                                ? false
                                                : Object.keys(errors).includes("Remarks")
                                                    ? errors.Remarks.message.length > 0
                                                        ? true
                                                        : false
                                                    : false

                                        }



                                    />
                                </Grid>
                            </Grid>




                        </Box>
                    </center>
                    <div style={{ textAlign: "center", paddingBottom: "1rem", paddingTop: "1rem" }}>
                        <Button type="submit" style={{ color: "white", backgroundColor: "#107050", width: "1.0rem" }}><TaskAltIcon></TaskAltIcon></Button>
                    </div>
                </form>
            </Container>


        </>
    );
}
function EDITOBSSparesDataForm(props) {


    const {
        register,
        handleSubmit,
        watch,
        trigger,
        reset,
        formState: { errors },
    } = useForm();
    const [startDate, setStartDate] = useState(new Date());
    const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
    const handleDateChange = (date) => {
        setStartDate(date);
        return date;
    };

    const serialNumbers = props.SparesData.map(item => item.SerialNumber);

    const onSubmit = async (formData) => {


        let serialNumber = formData["SerialNumber"]
        let DATAID = props.SparesData.filter((item) => {
            return (
                item.SerialNumber === serialNumber
            )

        })

        let data = {
            "ID": DATAID[0].ID,
            "StorageLocation": formData["StorageLocation"],

        }



        var API2 = '/UpdateSparesOBS';
        // var baseURL = "http://192.168.0.20:8081" + API2

        var baseURL = "http://127.0.0.1:8081" + API2

        if (configDetails != undefined) {

            if (configDetails.project[0].ServerIP != undefined) {


                if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

                    baseURL = configDetails.project[0].ServerIP[0].NodeServerIP + API2

                }


            }

        }
        // this will save the data in the database 
        console.log("after Edit    OBS DATA", data, baseURL)
        axios.put(baseURL, data)
            .then((response) => {
                // console.log(response);

            })
            .then((data) => {
                // console.log(data);
                alert("Updated Sucessfully");
            })
            .catch((error) => {
                // console.log(error);
                alert(" Not Updated Sucessfully,Error");
            })




    };


    return (

        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: "1rem", }}>
                    <center>
                        <Box sx={{ flexGrow: 1, borderColor: "red" }} >


                            <Grid item xs={12} md={12} style={{
                                backgroundColor: "#faebefff",
                                "paddingRight": "0.5rem",
                                "paddingLeft": "0.5rem",
                                "paddingBottom": "0.5rem",
                                "paddingTop": "0.5rem"

                            }}>

                                {/* code taken from react hook form  */}
                                <Typography style={{ color: "blue" }}>Serial Number</Typography>


                                <Autocomplete
                                    id="SerialNumber"
                                    options={serialNumbers}
                                    //freeSolo  // Allow free input
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth

                                            {...register("SerialNumber", {
                                                required: "Please Provide  Serial Number",
                                            })}
                                            helperText={
                                                Object.keys(errors).length === 0
                                                    ? ""
                                                    : Object.keys(errors).includes("SerialNumber")
                                                        ? errors.SerialNumber.message
                                                            ? errors.SerialNumber.message
                                                            : ""
                                                        : ""
                                            }
                                            error={
                                                Object.keys(errors).length === 0
                                                    ? false
                                                    : Object.keys(errors).includes("SerialNumber")
                                                        ? errors.SerialNumber.message.length > 0
                                                            ? true
                                                            : false
                                                        : false
                                            }
                                            required
                                        />
                                    )}
                                />

                            </Grid>




                            <Grid item xs={12} md={12} style={{
                                backgroundColor: "#faebefff",
                                "paddingRight": "0.5rem",
                                "paddingLeft": "0.5rem",
                                "paddingBottom": "0.5rem",
                                "paddingTop": "0.5rem"

                            }}>
                                <Typography style={{ color: "blue" }}>Storage Location</Typography>
                                <TextField
                                    style={{ backgroundColor: "lightyellow" }}
                                    size="small"
                                    name="StorageLocation"
                                    {...register('StorageLocation', {



                                        required: "Please Enter Storage Location Name",
                                        pattern: {
                                            value: "(?=.*[A-Z])(?=.*\d)(?=.*[A-Z])",
                                            message: "Please enter Storage Location",

                                        }


                                    })}
                                    InputProps={{
                                        inputProps: {

                                            style: { textTransform: 'uppercase' },
                                        },
                                    }}
                                    helperText={
                                        Object.keys(errors).length === 0
                                            ? ""
                                            : Object.keys(errors).includes("StorageLocation")
                                                ? errors.StorageLocation.message
                                                    ? errors.StorageLocation.message
                                                    : ""
                                                : ""
                                    }
                                    error={
                                        Object.keys(errors).length === 0
                                            ? false
                                            : Object.keys(errors).includes("StorageLocation")
                                                ? errors.StorageLocation.message.length > 0
                                                    ? true
                                                    : false
                                                : false

                                    }

                                />
                            </Grid>



                        </Box>
                    </center>
                    <div style={{ textAlign: "center", paddingBottom: "1rem", paddingTop: "1rem" }}>
                        <Button type="submit" style={{ color: "white", backgroundColor: "#107050", width: "1.0rem" }}><TaskAltIcon></TaskAltIcon></Button>
                    </div>
                </form>
            </Container>


        </>
    );
}


function EDITREPAIROBSSparesDataForm(props) {


    const {
        register,
        control,
        handleSubmit,
        watch,
        trigger,
        reset,
        formState: { errors },
    } = useForm();

    const [startDate, setStartDate] = useState(new Date());
    const [groupedData, setGroupedData] = useState({});

    const [SerialNumbers, setSerialNumbers] = useState([]);
    const [newSerialNumber, SetnewSerialNumber] = useState([]);
    const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)
    var API2 = '/GetSparesOBS';
    // var baseURL = "http://192.168.0.20:8081" + API2

    const handleDateChange = (date) => {
        setStartDate(date);
        return date;
    };


    const repairserialnumbers = props.RepairDataSparesData.filter(item => item.Cabinet === 'Repair');
    const serialNumbers = repairserialnumbers.map(item => item.SerialNumber);


    const onSubmit = async (formData) => {
        // props.Update(GroupByData)
        props.handleRepairCloseDialog()

        let serialNumber = formData["SerialNumber"]


        let DATAID = repairserialnumbers.filter((item) => {
            return (
                item.SerialNumber === serialNumber
            )

        })

        let data = {
            "ID": DATAID[0].ID,
            "Cabinet": "Working",
            "QtyOwnShip": "1",
            "QtyLandedForRepair": "0",

        }


        var API2 = '/UpdateRepairSparesDataOBS';
        var baseURL = "http://127.0.0.1:8001" + API2



        if (configDetails != undefined) {

            if (configDetails.project[0].ServerIP != undefined) {


                if (configDetails.project[0].ServerIP[0].NodeServerIP != undefined) {

                    baseURL = configDetails.project[0].ServerIP[0].NodeServerIP + API2

                }


            }

        }
        // this will save the data in the database 
        console.log("after Edit    OBS DATA", data, baseURL)
        axios.put(baseURL, data)
            .then((data) => {
                // repairserialnumbers.map(item => item.SerialNumber);
                alert("Updated Sucessfully");
                console.log(data);
            })
            .catch((error) => {
                // console.log(error);
                alert(" Not Updated Sucessfully,Error");
            })




    };


    const handleSerialNumberChange = (event, newValue) => {
        if (newValue) {
            setSerialNumbers((prev) => prev.filter((sn) => sn !== newValue));
            SetnewSerialNumber(newValue)
        }

    };
    // React.useEffect(() => {
    //     axios.get(baseURL).then((response) => {
    //         SetSparesData(response.data.data);
    //         const repairserialnumbers = response.data.data.filter(item => item.Cabinet === 'Repair').map(item => item.SerialNumber);
    //         setSerialNumbers(repairserialnumbers)
    //         setGroupedData(response.data.data)
    //     }).catch((err) => {
    //         SetSparesData(SPARESPAGEDEFAULTDATA)
    //         setGroupedData(SPARESPAGEDEFAULTDATA)
    //         const repairserialnumbers = SPARESPAGEDEFAULTDATA.filter(item => item.Cabinet === 'Repair').map(item => item.SerialNumber);
    //         setSerialNumbers(repairserialnumbers)


    //     })


    // }, [])

    console.log("propspropspropspropsprops", props.RepairDataSparesData)



    return (

        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: "1rem", }}>
                    <center>
                        <Box sx={{ flexGrow: 1, borderColor: "red" }} >


                            <Grid item xs={12} md={12} style={{
                                backgroundColor: "#faebefff",
                                "paddingRight": "0.5rem",
                                "paddingLeft": "0.5rem",
                                "paddingBottom": "0.5rem",
                                "paddingTop": "0.5rem"

                            }}>

                                {/* code taken from react hook form  */}
                                <Typography style={{ color: "blue" }}>Serial Number</Typography>


                                <Autocomplete
                                    id="SerialNumber"
                                    options={serialNumbers}
                                    onChange={handleSerialNumberChange}
                                    //freeSolo  // Allow free input
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth

                                            {...register("SerialNumber", {
                                                required: "Please Provide  Serial Number",
                                            })}
                                            helperText={
                                                Object.keys(errors).length === 0
                                                    ? ""
                                                    : Object.keys(errors).includes("SerialNumber")
                                                        ? errors.SerialNumber.message
                                                            ? errors.SerialNumber.message
                                                            : ""
                                                        : ""
                                            }
                                            error={
                                                Object.keys(errors).length === 0
                                                    ? false
                                                    : Object.keys(errors).includes("SerialNumber")
                                                        ? errors.SerialNumber.message.length > 0
                                                            ? true
                                                            : false
                                                        : false
                                            }
                                            required
                                        />
                                    )}
                                />

                            </Grid>



                            {/* 
                            <Grid item xs={12} md={12} style={{
                                backgroundColor: "#faebefff",
                                "paddingRight": "0.5rem",
                                "paddingLeft": "0.5rem",
                                "paddingBottom": "0.5rem",
                                "paddingTop": "0.5rem"

                            }}>
                                <Typography style={{ color: "blue" }}>Status</Typography>
                                <TextField
                                    style={{ backgroundColor: "lightyellow" }}
                                    size="small"
                                    name="Cabinet"
                                    {...register('Cabinet', {



                                        required: "Please Enter Status Name",
                                        pattern: {
                                            value: "(?=.*[A-Z])(?=.*\d)(?=.*[A-Z])",
                                            message: "Please enter Status",

                                        }


                                    })}
                                    InputProps={{
                                        inputProps: {

                                            style: { textTransform: 'uppercase' },
                                        },
                                    }}
                                    helperText={
                                        Object.keys(errors).length === 0
                                            ? ""
                                            : Object.keys(errors).includes("Cabinet")
                                                ? errors.Cabinet.message
                                                    ? errors.Cabinet.message
                                                    : ""
                                                : ""
                                    }
                                    error={
                                        Object.keys(errors).length === 0
                                            ? false
                                            : Object.keys(errors).includes("Cabinet")
                                                ? errors.Cabinet.message.length > 0
                                                    ? true
                                                    : false
                                                : false

                                    }

                                />
                            </Grid> */}



                        </Box>
                    </center>
                    <div style={{ textAlign: "center", paddingBottom: "1rem", paddingTop: "1rem" }}>
                        <Button type="submit" style={{ color: "white", backgroundColor: "#107050", width: "1.0rem" }}  ><TaskAltIcon></TaskAltIcon></Button>
                    </div>
                </form>
            </Container>

        </>
    );
}


export default OBSpares;


