// // AnalyticalDashboard.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Divider,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   useTheme
// } from '@mui/material';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area
// } from 'recharts';
// import {
//   InfoOutlined,
//   TrendingUp,
//   WarningAmber,
//   Speed,
//   Inventory
// } from '@mui/icons-material';

// // --- COLORS & STYLES ---
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// // Custom Tooltip Style
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <Paper elevation={3} sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
//         <Typography variant="subtitle2" color="primary" fontWeight="bold">{label}</Typography>
//         {payload.map((entry, index) => (
//           <Typography key={index} variant="body2" color="text.secondary">
//             {entry.name}: <b>{entry.value}</b> {entry.unit || ''}
//           </Typography>
//         ))}
//       </Paper>
//     );
//   }
//   return null;
// };

// const AnalyticalDashboard = ({ apiBaseUrl, user }) => {
//   const theme = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   // --- DATA FETCHING ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const endpoint = `${apiBaseUrl}/dashboard/analytics`;
        
//         // --- REAL API CALL ---
//         const response = await axios.get(endpoint, { 
//             params: { staff_no: user?.id }
//         });
//         console.log("response data: ",response.data)
//         processData(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Analytics Fetch Error:", err);
//         setError("Failed to load analytical data. Please check connection.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [apiBaseUrl, user]);

//   // --- PROCESS DATA ---
//   const processData = (rawData) => {
//     // 1. Convert Dictionary objects to Arrays for Recharts
//     const pcbTypes = Object.entries(rawData.pcb_types || {}).map(([key, value]) => ({ name: key, value }));
//     const pcbStatuses = Object.entries(rawData.pcb_statuses || {}).map(([key, value]) => ({ name: key, value }));
    
//     // 2. Format Order Trend
//     const orderTrend = (rawData.order_trend || []).map(item => ({
//         ...item,
//         date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
//     }));

//     // 3. Store formatted data
//     setData({
//         ...rawData,
//         pcbTypesArray: pcbTypes,
//         pcbStatusesArray: pcbStatuses,
//         orderTrendFormatted: orderTrend
//     });
//   };

//   // --- CHART WRAPPER (With Scroll Support) ---
//   const ChartWrapper = ({ title, description, children, height = 350, scrollable = false, dataLength = 0 }) => {
//     // Calculate dynamic height for scrollable charts
//     const contentHeight = scrollable && dataLength > 0 ? Math.max(height, dataLength * 50) : '100%';
    
//     return (
//       <Paper 
//         elevation={0} 
//         sx={{ 
//           p: 3, 
//           borderRadius: 3, 
//           border: `1px solid ${theme.palette.divider}`, 
//           height: scrollable ? height : '100%', 
//           // If not scrollable, we allow the Paper to take the height of the content or the fixed height
//           minHeight: height, 
//           display: 'flex', 
//           flexDirection: 'column',
//           overflow: 'hidden'
//         }}
//       >
//         <Box mb={2} flexShrink={0}>
//           <Typography variant="h6" fontWeight="bold" color="text.primary">
//             {title}
//           </Typography>
//           <Box display="flex" gap={1} alignItems="center" mt={0.5}>
//             <InfoOutlined fontSize="small" color="action" />
//             <Typography variant="caption" color="text.secondary">
//               {description}
//             </Typography>
//           </Box>
//         </Box>
//         <Divider sx={{ mb: 2 }} />
        
//         {/* Chart Container */}
//         <Box sx={{ 
//             flexGrow: 1, 
//             minHeight: 0, 
//             overflowY: scrollable ? 'auto' : 'hidden',
//             pr: scrollable ? 1 : 0 
//         }}>
//            <div style={{ height: scrollable ? contentHeight : '100%', minHeight: scrollable ? 'auto' : (height - 100), width: '100%' }}>
//              {children}
//            </div>
//         </Box>
//       </Paper>
//     );
//   };

//   // --- KPI CARD COMPONENT ---
//   const KpiCard = ({ title, value, subtext, icon, color }) => (
//     <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: '100%' }}>
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="start">
//           <Box>
//             <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//               {title}
//             </Typography>
//             <Typography variant="h4" fontWeight="bold" color={color || 'text.primary'}>
//               {value}
//             </Typography>
//             {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
//           </Box>
//           <Box p={1} bgcolor={`${color}15`} borderRadius={2} color={color}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
//   if (!data) return null;

//   return (
//     <Box p={1}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
//         Production Analytics
//       </Typography>

//       {/* 1. KPI SUMMARY ROW */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <KpiCard 
//             title="Avg. Batch Age" 
//             value={`${data.batch_aging?.average_wip_age_days || 0} Days`} 
//             subtext="Time from creation to now"
//             icon={<Speed />}
//             color={theme.palette.info.main}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <KpiCard 
//             title="Stuck Batches" 
//             value={data.batch_aging?.stuck_count || 0} 
//             subtext="Units inactive > 5 days"
//             icon={<WarningAmber />}
//             color={data.batch_aging?.stuck_count > 0 ? theme.palette.error.main : theme.palette.success.main}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <KpiCard 
//             title="Active Volume" 
//             value={data.production_flow?.reduce((acc, curr) => acc + curr.active_pcbs, 0) || 0}
//             subtext="PCBs currently in progress"
//             icon={<Inventory />}
//             color={theme.palette.primary.main}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <KpiCard 
//             title="Total PCB's" 
//             value={data.orderTrendFormatted?.length > 0 ? data.orderTrendFormatted[data.orderTrendFormatted.length - 1].count : 0}
//             subtext="New orders received today"
//             icon={<TrendingUp />}
//             color={theme.palette.success.main}
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>

//         {/* 2. ORDER TREND (AREA CHART) */}
//         <Grid item xs={12} md={8}>
//           <ChartWrapper 
//             title="Order Received" 
//             description="Daily volume of new PCBs entering the system over time."
//             height={350}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={data.orderTrendFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" name="New Orders" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>

//         {/* 3. PCB TYPES (DONUT) */}
//         <Grid item xs={12} md={4}>
//           <ChartWrapper 
//             title="Product Mix" 
//             description="Distribution of active orders by PCB Type."
//             height={350}
//           >
//              <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data.pcbTypesArray}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {data.pcbTypesArray.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" height={36}/>
//               </PieChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>

//         {/* 4. PRODUCTION FLOW (SCROLLABLE BAR CHART) */}
//         <Grid item xs={12}>
//           <ChartWrapper 
//             title="Active PCBs  & Staff Capacity" 
//             description="Active WIP vs. Qualified Staff Capacity per step. Scroll down to see all 40+ operations."
//             height={500}
//             scrollable={true}
//             dataLength={data.production_flow?.length || 0}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={data.production_flow}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 barGap={2}
//               >
//                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                 <XAxis type="number" />
//                 <YAxis 
//                     dataKey="step" 
//                     type="category" 
//                     width={220} 
//                     tick={{fontSize: 11}} 
//                     interval={0}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}}/>
//                 <Bar dataKey="active_pcbs" name="Active WIP (Units)" fill="#82ca9d" radius={[0, 4, 4, 0]} barSize={15} />
//                 <Bar dataKey="staff_capacity" name="Staff Capacity" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={15} />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>


//         <Grid item xs={12}>
//           <ChartWrapper 
//             title="Production  & Staff Capacity" 
//             description="Active WIP vs. Qualified Staff Capacity per step. Scroll down to see all 40+ operations."
//             height={500}
//             scrollable={true}
//             dataLength={data.Overall_Task_Data?.length || 0}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={data.Overall_Task_Data}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 barGap={2}
//               >
//                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                 <XAxis type="number" />
//                 <YAxis 
//                     dataKey="step" 
//                     type="category" 
//                     width={220} 
//                     tick={{fontSize: 11}} 
//                     interval={0}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}}/>
//                 <Bar dataKey="active_pcbs" name="Active WIP (Units)" fill="#82ca9d" radius={[0, 4, 4, 0]} barSize={15} />
//                 <Bar dataKey="staff_capacity" name="Staff Capacity" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={15} />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>



//         {/* 5. CYCLE TIME ANALYSIS */}
//         <Grid item xs={12} md={6}>
//           <ChartWrapper 
//             title="Cycle Time Analysis" 
//             description="Average time (minutes) spent per operation step."
//             height={600} // Matched to left column to keep layout somewhat balanced, though content may be shorter
//             scrollable={true}
//             dataLength={data.cycle_time?.length || 0}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={data.cycle_time}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                 <XAxis type="number" unit=" min" />
//                 <YAxis dataKey="step_name" type="category" width={180} tick={{fontSize: 11}} interval={0} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="avg_time_minutes" name="Avg Time" fill="#ffc658" radius={[0, 4, 4, 0]} barSize={20} />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartWrapper>
//         </Grid>

//         {/* 6. STATUS DISTRIBUTION & OPERATOR LOAD (BIG VERTICAL STACK) */}
//         <Grid item xs={12} md={6}>
//           <Grid container spacing={3} direction="column">
            
//             {/* Status Pie Chart - TALL */}
//             {/* <Grid item xs={12}>
//               <ChartWrapper 
//                 title="Current Status Distribution" 
//                 description="Breakdown of all units by their current status."
//                 height={600} // <--- INCREASED HEIGHT
//               >
//                  <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data.pcbStatusesArray}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={160} // Increased radius for better visibility
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {data.pcbStatusesArray.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend verticalAlign="bottom" />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </ChartWrapper>
//             </Grid> */}
            
//             {/* Operator Load Bar Chart - TALL */}
//             <Grid item xs={12}>
//                <ChartWrapper 
//                 title="Operator Workload" 
//                 description="Number of PCBs actively assigned to each operator."
//                 height={600} // <--- INCREASED HEIGHT
//                 scrollable={true} // Kept scrollable just in case
//                 dataLength={data.operator_load?.length || 0}
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data.operator_load} layout="vertical" margin={{ left: 20 }}>
//                   {console.log("data.operator_load ",data.operator_load)}
//                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true}/>
//                     <XAxis type="number" allowDecimals={false} />
//                     <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="pcb_count" name="Assigned PCBs" fill="#FF8042" radius={[0, 4, 4, 0]} barSize={40} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </ChartWrapper>
//             </Grid>


//           </Grid>
//         </Grid>
//     <Grid item xs={12} md={16} >
//         <Grid>
//       <ChartWrapper
//         title="Operations per Operator"
//         description="Number of operations per operator."
//         height={600}
//         scrollable={true}
//         dataLength={data.operator_presence.length} // Use transformedData.length
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data.operator_presence} layout="vertical" margin={{ left: 20 }}>
//             <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true}/>
//             <XAxis type="number" allowDecimals={false} />
//             <YAxis dataKey="staff_no" type="category" width={100} tick={{fontSize: 12}} />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="presence_count" name="Assigned Operations" fill="#FF8442" radius={[0, 4, 4, 0]} barSize={40} />
//           </BarChart>
//         </ResponsiveContainer>
//       </ChartWrapper>
//     </Grid>
//         </Grid>
//         <Grid item xs={12} >
//               <ChartWrapper 
//                 title="Current Status Distribution" 
//                 description="Breakdown of all units by their current status."
//                 height={500} // <--- INCREASED HEIGHT
//               >
//                  <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data.pcbStatusesArray}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={160} // Increased radius for better visibility
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {data.pcbStatusesArray.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend verticalAlign="bottom" />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </ChartWrapper>
//             </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default AnalyticalDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Grid, Paper, Typography, CircularProgress, Alert, Card, 
  alpha, useTheme, Stack, Avatar, Chip, Divider
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, 
  ComposedChart, Line
} from 'recharts';
import {
  TrendingUp, WarningAmber, Speed, Inventory, Analytics, 
  RadioButtonChecked, Assessment, Timer, People, Assignment
} from '@mui/icons-material';

// --- PROFESSIONAL DESIGN TOKENS ---
const DESIGN = {
  primary: '#2563eb',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  indigo: '#4f46e5',
  slate: '#475569',
  chartColors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f43f5e', '#14b8a6']
};

const AnalyticalDashboard = ({ apiBaseUrl, user }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/dashboard/analytics`, { 
            params: { staff_no: user?.id }
        });
        processData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Network failed to synchronize analytics");
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl, user]);

  const processData = (rawData) => {
    setData({
      ...rawData,
      pcbTypesArray: Object.entries(rawData.pcb_types || {}).map(([name, value]) => ({ name, value })),
      pcbStatusesArray: Object.entries(rawData.pcb_statuses || {}).map(([name, value]) => ({ name, value })),
      orderTrendFormatted: (rawData.order_trend || []).map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      })),
      // Optimization: To keep the dashboard single-page, we show high-impact stages (Top 15)
      productionFlow: rawData.production_flow?.slice(0, 15) || [],
      overallTaskData: rawData.Overall_Task_Data?.slice(0, 15) || [],
      cycleTime: rawData.cycle_time?.slice(0, 15) || [],
      operatorLoad: rawData.operator_load?.slice(0, 10) || [],
      operatorPresence: rawData.operator_presence?.slice(0, 10) || []
    });
  };

  const BentoBox = ({ title, children, icon: Icon, flex = 1, color = DESIGN.slate }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 1.5, height: '100%', display: 'flex', flexDirection: 'column',
        borderRadius: 3, border: `1px solid ${alpha(DESIGN.slate, 0.1)}`,
        bgcolor: '#ffffff', flex: flex, overflow: 'hidden'
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        {Icon && <Icon sx={{ fontSize: 16, color: color }} />}
        <Typography variant="caption" sx={{ fontWeight: 800, color: DESIGN.slate, letterSpacing: 0.5 }}>
          {title.toUpperCase()}
        </Typography>
      </Stack>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );

  const KpiWidget = ({ label, value, color, icon: Icon }) => (
    <Box sx={{ 
      flex: 1, p: 1.5, borderRadius: 3, bgcolor: alpha(color, 0.05), 
      border: `1px solid ${alpha(color, 0.1)}`, display: 'flex', alignItems: 'center', gap: 2 
    }}>
      <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}><Icon sx={{ fontSize: 18 }} /></Avatar>
      <Box>
        <Typography variant="caption" sx={{ color: DESIGN.slate, fontWeight: 700, display: 'block' }}>{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 900, color: color, lineHeight: 1 }}>{value}</Typography>
      </Box>
    </Box>
  );

  if (loading) return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: '100vh', p: 1.5, bgcolor: '#f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER & KPIs */}
      <Stack direction="row" spacing={2} mb={1.5} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 240 }}>
          <Assessment color="primary" />
          <Typography variant="h6" fontWeight={900}>Operations Intelligence</Typography>
        </Stack>
        <KpiWidget label="BATCH AGING" value={`${data.batch_aging?.average_wip_age_days}d Avg`} color={DESIGN.primary} icon={Timer} />
        <KpiWidget label="STUCK UNITS" value={data.batch_aging?.stuck_count} color={DESIGN.error} icon={WarningAmber} />
        <KpiWidget label="WIP VOLUME" value={data.production_flow?.reduce((a, b) => a + b.active_pcbs, 0)} color={DESIGN.success} icon={Inventory} />
        <KpiWidget label="SYSTEM INTAKE" value={data.orderTrendFormatted?.slice(-1)[0]?.count || 0} color={DESIGN.indigo} icon={TrendingUp} />
      </Stack>

      {/* DASHBOARD GRID */}
      <Grid container spacing={1.5} sx={{ flexGrow: 1, minHeight: 0 }}>
        
        {/* COL 1: Performance & Tasks */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <BentoBox title="Flow vs Capacity" icon={Speed} color={DESIGN.primary}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.productionFlow}>
                <XAxis dataKey="step" hide />
                <YAxis fontSize={9} />
                <Tooltip />
                <Bar dataKey="active_pcbs" name="WIP" fill={DESIGN.primary} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="staff_capacity" name="Cap" stroke={DESIGN.error} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </BentoBox>
          <BentoBox title="Task Saturation" icon={Assignment} color={DESIGN.success}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.overallTaskData}>
                <XAxis dataKey="step" hide />
                <YAxis fontSize={9} />
                <Tooltip />
                <Bar dataKey="active_pcbs" name="Active" fill={DESIGN.success} radius={[2, 2, 0, 0]} />
                <Line type="step" dataKey="staff_capacity" name="Staff" stroke={DESIGN.indigo} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </BentoBox>
        </Grid>

        {/* COL 2: Trends & Timing */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <BentoBox title="Intake Timeline" icon={TrendingUp} color={DESIGN.indigo}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.orderTrendFormatted}>
                <XAxis dataKey="date" fontSize={9} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke={DESIGN.indigo} fill={alpha(DESIGN.indigo, 0.2)} />
              </AreaChart>
            </ResponsiveContainer>
          </BentoBox>
          <BentoBox title="Cycle Time (Min)" icon={Timer} color={DESIGN.warning}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cycleTime} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="step_name" type="category" fontSize={8} width={80} />
                <Tooltip />
                <Bar dataKey="avg_time_minutes" fill={DESIGN.warning} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </BentoBox>
        </Grid>

        {/* COL 3: Distribution & Staff */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ flex: 1.2, display: 'flex', gap: 1.5 }}>
            <BentoBox title="Status Mix">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pcbStatusesArray} innerRadius="50%" outerRadius="85%" dataKey="value">
                    {data.pcbStatusesArray.map((e, i) => <Cell key={i} fill={DESIGN.chartColors[i % 8]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </BentoBox>
            <BentoBox title="Product Mix">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pcbTypesArray} outerRadius="85%" dataKey="value">
                    {data.pcbTypesArray.map((e, i) => <Cell key={i} fill={DESIGN.chartColors[(i+3) % 8]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </BentoBox>
          </Box>
          
          <BentoBox title="Staff Allocation" icon={People} color={DESIGN.slate}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.operatorLoad} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={8} interval={0} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Bar dataKey="pcb_count" name="PCBs" fill={DESIGN.slate} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </BentoBox>

          <BentoBox title="Operator Presence" icon={RadioButtonChecked} color={DESIGN.slate}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.operatorPresence} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="staff_no" type="category" fontSize={8} width={50} />
                <Tooltip />
                <Bar dataKey="presence_count" name="Ops" fill={alpha(DESIGN.slate, 0.6)} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </BentoBox>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AnalyticalDashboard;