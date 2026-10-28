// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { 
// //   Container, Box, Card, Typography, Button, 
// //   LinearProgress, Paper, Stack, Fade, Snackbar, Alert, Tooltip, IconButton 
// // } from '@mui/material';
// // import {
// //   SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied,
// //   SentimentSatisfiedAlt, SentimentVerySatisfied, CheckCircleRounded, TaskAlt,
// //   VerticalAlignTop, VerticalAlignCenter, VerticalAlignBottom
// // } from '@mui/icons-material';

// // const surveyQuestions = [
// //     { id: 1, text: "The training materials were easy to understand." },
// //     { id: 2, text: "The assessment process was fair and accurate." },
// //     { id: 3, text: "I feel confident in applying these skills in my role." },
// //     { id: 4, text: "The instructor was knowledgeable and helpful." },
// //     { id: 5, text: "The pace of the training was appropriate." },
// //     { id: 6, text: "The facilities and equipment were satisfactory." }
// // ];
  
// // const options = [
// //     { label: "Strongly Disagree", value: "SD", icon: <SentimentVeryDissatisfied fontSize="small" />, baseColor: '#ff4d4d', activeBg: 'rgba(255, 77, 77, 0.15)' },
// //     { label: "Disagree", value: "D", icon: <SentimentDissatisfied fontSize="small" />, baseColor: '#ffa726', activeBg: 'rgba(255, 167, 38, 0.15)' },
// //     { label: "Neutral", value: "N", icon: <SentimentSatisfied fontSize="small" />, baseColor: '#b0bec5', activeBg: 'rgba(176, 190, 197, 0.15)' },
// //     { label: "Agree", value: "A", icon: <SentimentSatisfiedAlt fontSize="small" />, baseColor: '#66bb6a', activeBg: 'rgba(102, 187, 106, 0.15)' },
// //     { label: "Strongly Agree", value: "SA", icon: <SentimentVerySatisfied fontSize="small" />, baseColor: '#00e676', activeBg: 'rgba(0, 230, 118, 0.15)' },
// // ];

// // const SurveyModule = ({ user }) => {
// //   const [isSubmitted, setIsSubmitted] = useState(false);
// //   const [answers, setAnswers] = useState({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [errorToast, setErrorToast] = useState({ open: false, message: "" });

// //   const answeredCount = Object.keys(answers).length;
// //   const progress = (answeredCount / surveyQuestions.length) * 100;
// //   const isComplete = answeredCount === surveyQuestions.length;

// //   const handleOptionChange = (questionId, value) => {
// //     setAnswers(prev => ({ ...prev, [questionId]: value }));
// //   };

// //   const handleSurveySubmit = async () => {
// //     if (!isComplete) return;
// //     setIsSubmitting(true);
    
// //     const payload = {
// //       user_id: user?.id || "B001",
// //       survey_topic: "General Satisfaction Survey",
// //       responses: answers 
// //     };

// //     try {
// //       await axios.post('http://127.0.0.1:8082/save-survey', payload);
// //       setIsSubmitted(true);
// //       setAnswers({}); // Resets answers so the user can submit multiple times
// //     } catch (error) {
// //       setErrorToast({ open: true, message: "Failed to connect. Please try again." });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Scroll Functions
// //   const scrollTo = (position) => {
// //     const height = document.documentElement.scrollHeight;
// //     let target = 0;
// //     if (position === 'bottom') target = height;
// //     if (position === 'middle') target = height / 2;
// //     window.scrollTo({ top: target, behavior: 'smooth' });
// //   };

// //   return (
// //     <Box sx={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0a192f 0%, #112240 100%)', pb: 10 }}>
      
// //       {/* FIXED HEADER */}
// //       <Box 
// //         sx={{ 
// //           position: 'sticky', 
// //           top: 0, 
// //           zIndex: 1000, 
// //           bgcolor: 'rgba(10, 25, 47, 0.85)', 
// //           backdropFilter: 'blur(12px)',
// //           borderBottom: '1px solid rgba(255,255,255,0.05)',
// //           px: { xs: 2, md: 8 },
// //           py: 3,
// //           boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
// //         }}
// //       >
// //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
// //           <Typography variant="h4" sx={{ fontWeight: 800, color: '#ccd6f6' }}>
// //             Quality Survey
// //           </Typography>
// //           <Typography variant="body2" sx={{ color: '#4facfe', fontWeight: 600 }}>
// //             {answeredCount} / {surveyQuestions.length} Answered
// //           </Typography>
// //         </Box>
// //         <LinearProgress 
// //           variant="determinate" 
// //           value={progress} 
// //           sx={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { backgroundImage: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)' } }} 
// //         />
// //       </Box>

// //       {/* FLOATING NAVIGATION BUTTONS */}
// //       <Box sx={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 1.5, background: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
// //         <Tooltip title="Go to Top" placement="left">
// //           <IconButton onClick={() => scrollTo('top')} sx={{ color: '#8892b0', '&:hover': { color: '#64ffda', bgcolor: 'rgba(100,255,218,0.1)' } }}>
// //             <VerticalAlignTop />
// //           </IconButton>
// //         </Tooltip>
// //         <Tooltip title="Go to Middle" placement="left">
// //           <IconButton onClick={() => scrollTo('middle')} sx={{ color: '#8892b0', '&:hover': { color: '#64ffda', bgcolor: 'rgba(100,255,218,0.1)' } }}>
// //             <VerticalAlignCenter />
// //           </IconButton>
// //         </Tooltip>
// //         <Tooltip title="Go to Bottom" placement="left">
// //           <IconButton onClick={() => scrollTo('bottom')} sx={{ color: '#8892b0', '&:hover': { color: '#64ffda', bgcolor: 'rgba(100,255,218,0.1)' } }}>
// //             <VerticalAlignBottom />
// //           </IconButton>
// //         </Tooltip>
// //       </Box>

// //       <Container maxWidth="lg" sx={{ pt: 6 }}>
// //         {isSubmitted ? (
// //           <Fade in={isSubmitted}>
// //             <Box sx={{ textAlign: 'center', py: 10 }}>
// //               <CheckCircleRounded sx={{ fontSize: 100, mb: 3, color: '#00e676' }} />
// //               <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>Response Recorded</Typography>
// //               <Button 
// //                 variant="outlined" onClick={() => setIsSubmitted(false)} 
// //                 sx={{ mt: 4, borderRadius: 2, px: 4, py: 1, color: '#64ffda', borderColor: '#64ffda' }}
// //               >
// //                 Submit Another Response
// //               </Button>
// //             </Box>
// //           </Fade>
// //         ) : (
// //           <Stack spacing={3}>
// //             {surveyQuestions.map((q, index) => {
// //               const isAnswered = !!answers[q.id];
// //               return (
// //                 <Paper 
// //                   key={q.id} 
// //                   elevation={0} 
// //                   sx={{ 
// //                     p: { xs: 2, md: 3 }, borderRadius: 3, 
// //                     backgroundColor: isAnswered ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
// //                     border: '1px solid', borderColor: isAnswered ? 'rgba(100, 255, 218, 0.2)' : 'rgba(255, 255, 255, 0.05)',
// //                     transition: 'all 0.3s ease'
// //                   }}
// //                 >
// //                   <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e2e8f0', mb: 2, display: 'flex', gap: 1.5 }}>
// //                     <span style={{ color: '#4facfe' }}>{index + 1}.</span> {q.text}
// //                   </Typography>
                  
// //                   {/* SMALLER OPTION CARDS */}
// //                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
// //                     {options.map((opt) => {
// //                       const isSelected = answers[q.id] === opt.value;
// //                       return (
// //                         <Box 
// //                           key={opt.value} onClick={() => handleOptionChange(q.id, opt.value)}
// //                           sx={{ 
// //                             flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
// //                             py: 1.5, px: 1, borderRadius: 2, border: '1px solid',
// //                             borderColor: isSelected ? opt.baseColor : 'rgba(255,255,255,0.08)',
// //                             bgcolor: isSelected ? opt.activeBg : 'rgba(0,0,0,0.2)',
// //                             color: isSelected ? opt.baseColor : '#8892b0', cursor: 'pointer',
// //                             '&:hover': { borderColor: isSelected ? opt.baseColor : 'rgba(255,255,255,0.2)', bgcolor: isSelected ? opt.activeBg : 'rgba(255,255,255,0.05)', color: opt.baseColor },
// //                             '& svg': { color: isSelected ? opt.baseColor : '#64748b' }
// //                           }}
// //                         >
// //                           {opt.icon}
// //                           <Typography variant="caption" sx={{ fontWeight: isSelected ? 700 : 500, letterSpacing: '0.2px' }}>
// //                             {opt.label}
// //                           </Typography>
// //                         </Box>
// //                       );
// //                     })}
// //                   </Stack>
// //                 </Paper>
// //               );
// //             })}
// //           </Stack>
// //         )}

// //         {!isSubmitted && (
// //           <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
// //             <Button 
// //               variant="contained" size="large" endIcon={<TaskAlt />} onClick={handleSurveySubmit} disabled={!isComplete || isSubmitting}
// //               sx={{ 
// //                 borderRadius: 8, px: 6, py: 1.5, fontSize: '1.05rem', fontWeight: 700, textTransform: 'none',
// //                 background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)', color: '#0a192f',
// //                 '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(79, 172, 254, 0.4)' },
// //                 '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
// //               }}
// //             >
// //               {isSubmitting ? 'Processing...' : 'Submit Responses'}
// //             </Button>
// //           </Box>
// //         )}
// //       </Container>

// //       <Snackbar open={errorToast.open} autoHideDuration={6000} onClose={() => setErrorToast({ open: false, message: "" })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
// //         <Alert severity="error" variant="filled">{errorToast.message}</Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default SurveyModule;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { 
//   Container, Box, Card, Typography, Button, 
//   LinearProgress, Paper, Stack, Snackbar, Alert, Tooltip, IconButton,
//   Dialog, DialogContent, Slide
// } from '@mui/material';
// import {
//   SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied,
//   SentimentSatisfiedAlt, SentimentVerySatisfied, CheckCircleRounded, TaskAlt,
//   VerticalAlignTop, VerticalAlignCenter, VerticalAlignBottom
// } from '@mui/icons-material';

// const surveyQuestions = [
//     { id: 1, text: "The training materials were easy to understand." },
//     { id: 2, text: "The assessment process was fair and accurate." },
//     { id: 3, text: "I feel confident in applying these skills in my role." },
//     { id: 4, text: "The instructor was knowledgeable and helpful." },
//     { id: 5, text: "The pace of the training was appropriate." },
//     { id: 6, text: "The facilities and equipment were satisfactory." }
// ];
  
// // Light theme optimized colors (active backgrounds are soft pastel tints)
// const options = [
//     { label: "Strongly Disagree", value: "SD", icon: <SentimentVeryDissatisfied fontSize="small" />, baseColor: '#d32f2f', activeBg: '#ffebee' },
//     { label: "Disagree", value: "D", icon: <SentimentDissatisfied fontSize="small" />, baseColor: '#ed6c02', activeBg: '#fff4e5' },
//     { label: "Neutral", value: "N", icon: <SentimentSatisfied fontSize="small" />, baseColor: '#607d8b', activeBg: '#eceff1' },
//     { label: "Agree", value: "A", icon: <SentimentSatisfiedAlt fontSize="small" />, baseColor: '#2e7d32', activeBg: '#edf7ed' },
//     { label: "Strongly Agree", value: "SA", icon: <SentimentVerySatisfied fontSize="small" />, baseColor: '#1b5e20', activeBg: '#e8f5e9' },
// ];

// // Transition for the success popup
// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const SurveyModule = ({ user }) => {
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [answers, setAnswers] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorToast, setErrorToast] = useState({ open: false, message: "" });

//   const answeredCount = Object.keys(answers).length;
//   const progress = (answeredCount / surveyQuestions.length) * 100;
//   const isComplete = answeredCount === surveyQuestions.length;

//   const handleOptionChange = (questionId, value) => {
//     setAnswers(prev => ({ ...prev, [questionId]: value }));
//   };

//   const handleSurveySubmit = async () => {
//     if (!isComplete) return;
//     setIsSubmitting(true);
    
//     const payload = {
//       user_id: user?.id || "B001",
//       survey_topic: "General Satisfaction Survey",
//       responses: answers 
//     };

//     try {
//       await axios.post('http://127.0.0.1:8082/save-survey', payload);
//       // Show the professional popup instead of changing the screen
//       setIsSubmitted(true); 
//     } catch (error) {
//       setErrorToast({ open: true, message: "Failed to connect. Please try again." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClosePopup = () => {
//     setIsSubmitted(false);
//     setAnswers({}); // Reset form silently after popup closes
//     window.scrollTo({ top: 0, behavior: 'smooth' }); // Send user back to top
//   };

//   // Scroll Functions
//   const scrollTo = (position) => {
//     const height = document.documentElement.scrollHeight;
//     let target = 0;
//     if (position === 'bottom') target = height;
//     if (position === 'middle') target = height / 2;
//     window.scrollTo({ top: target, behavior: 'smooth' });
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', pb: 10 }}>
      
//       {/* FIXED HEADER (Light Theme) */}
//       <Box 
//         sx={{ 
//           position: 'sticky', 
//           top: 0, 
//           zIndex: 1000, 
//           bgcolor: 'rgba(255, 255, 255, 0.9)', 
//           backdropFilter: 'blur(12px)',
//           borderBottom: '1px solid',
//           borderColor: 'grey.200',
//           px: { xs: 2, md: 8 },
//           py: 3,
//           boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
//             Quality Survey
//           </Typography>
//           <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
//             {answeredCount} / {surveyQuestions.length} Answered
//           </Typography>
//         </Box>
//         <LinearProgress 
//           variant="determinate" 
//           value={progress} 
//           sx={{ height: 6, borderRadius: 3, backgroundColor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 3 } }} 
//         />
//       </Box>

//       {/* FLOATING NAVIGATION BUTTONS (Light Theme) */}
//       <Box sx={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#ffffff', p: 1, borderRadius: 8, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'grey.100' }}>
//         <Tooltip title="Go to Top" placement="left">
//           <IconButton onClick={() => scrollTo('top')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
//             <VerticalAlignTop />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Go to Middle" placement="left">
//           <IconButton onClick={() => scrollTo('middle')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
//             <VerticalAlignCenter />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Go to Bottom" placement="left">
//           <IconButton onClick={() => scrollTo('bottom')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
//             <VerticalAlignBottom />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       <Container maxWidth="lg" sx={{ pt: 6 }}>
//         <Stack spacing={3}>
//           {surveyQuestions.map((q, index) => {
//             const isAnswered = !!answers[q.id];
//             return (
//               <Paper 
//                 key={q.id} 
//                 elevation={0} 
//                 sx={{ 
//                   p: { xs: 3, md: 4 }, 
//                   borderRadius: 4, 
//                   backgroundColor: '#ffffff',
//                   border: '1px solid', 
//                   borderColor: isAnswered ? 'primary.light' : 'grey.300',
//                   boxShadow: isAnswered ? '0 8px 24px rgba(25, 118, 210, 0.08)' : '0 2px 10px rgba(0,0,0,0.03)',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 3, display: 'flex', gap: 1.5 }}>
//                   <span style={{ color: '#1976d2' }}>{index + 1}.</span> {q.text}
//                 </Typography>
                
//                 {/* SMALLER OPTION CARDS */}
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
//                   {options.map((opt) => {
//                     const isSelected = answers[q.id] === opt.value;
//                     return (
//                       <Box 
//                         key={opt.value} onClick={() => handleOptionChange(q.id, opt.value)}
//                         sx={{ 
//                           flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
//                           py: 1.5, px: 1, borderRadius: 2, border: '1px solid',
//                           borderColor: isSelected ? opt.baseColor : 'grey.200',
//                           bgcolor: isSelected ? opt.activeBg : '#ffffff',
//                           color: isSelected ? opt.baseColor : 'text.secondary', cursor: 'pointer',
//                           '&:hover': { borderColor: isSelected ? opt.baseColor : 'grey.400', bgcolor: isSelected ? opt.activeBg : 'grey.50', color: opt.baseColor },
//                           '& svg': { color: isSelected ? opt.baseColor : 'grey.500' }
//                         }}
//                       >
//                         {opt.icon}
//                         <Typography variant="caption" sx={{ fontWeight: isSelected ? 700 : 500, letterSpacing: '0.2px' }}>
//                           {opt.label}
//                         </Typography>
//                       </Box>
//                     );
//                   })}
//                 </Stack>
//               </Paper>
//             );
//           })}
//         </Stack>

//         <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
//           <Button 
//             variant="contained" size="large" endIcon={<TaskAlt />} onClick={handleSurveySubmit} disabled={!isComplete || isSubmitting}
//             sx={{ 
//               borderRadius: 8, px: 6, py: 1.5, fontSize: '1.05rem', fontWeight: 700, textTransform: 'none',
//               boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
//               '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(25, 118, 210, 0.3)' }
//             }}
//           >
//             {isSubmitting ? 'Processing...' : 'Submit Responses'}
//           </Button>
//         </Box>
//       </Container>

//       {/* SUCCESS POPUP (Professional Dialog) */}
//       <Dialog
//         open={isSubmitted}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={handleClosePopup}
//         PaperProps={{
//           sx: { borderRadius: 4, px: 2, py: 3, maxWidth: 450, width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
//         }}
//       >
//         <DialogContent>
//           <CheckCircleRounded sx={{ fontSize: 90, color: '#4caf50', mb: 2 }} />
//           <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
//             Submission Successful
//           </Typography>
//           <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
//             Thank you for your feedback. Your response has been securely recorded.
//           </Typography>
//           <Button 
//             variant="contained" 
//             fullWidth 
//             size="large"
//             onClick={handleClosePopup}
//             sx={{ borderRadius: 3, py: 1.2, fontWeight: 700, textTransform: 'none', fontSize: '1.1rem', boxShadow: 'none' }}
//           >
//             Done
//           </Button>
//         </DialogContent>
//       </Dialog>

//       {/* ERROR SNACKBAR */}
//       <Snackbar open={errorToast.open} autoHideDuration={6000} onClose={() => setErrorToast({ open: false, message: "" })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
//         <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{errorToast.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default SurveyModule;

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Box, Typography, Button, 
  LinearProgress, Paper, Stack, Snackbar, Alert, Tooltip, IconButton,
  Dialog, DialogContent, Slide
} from '@mui/material';
import {
  SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied,
  SentimentSatisfiedAlt, SentimentVerySatisfied, CheckCircleRounded, TaskAlt,
  VerticalAlignTop, VerticalAlignCenter, VerticalAlignBottom
} from '@mui/icons-material';

const surveyQuestions = [
    { id: 1, text: "The training materials were easy to understand." },
    { id: 2, text: "The assessment process was fair and accurate." },
    { id: 3, text: "I feel confident in applying these skills in my role." },
    { id: 4, text: "The instructor was knowledgeable and helpful." },
    { id: 5, text: "The pace of the training was appropriate." },
    { id: 6, text: "The facilities and equipment were satisfactory." }
];
  
const options = [
    { label: "Strongly Disagree", value: "SD", icon: <SentimentVeryDissatisfied fontSize="small" />, baseColor: '#d32f2f', activeBg: '#ffebee' },
    { label: "Disagree", value: "D", icon: <SentimentDissatisfied fontSize="small" />, baseColor: '#ed6c02', activeBg: '#fff4e5' },
    { label: "Neutral", value: "N", icon: <SentimentSatisfied fontSize="small" />, baseColor: '#607d8b', activeBg: '#eceff1' },
    { label: "Agree", value: "A", icon: <SentimentSatisfiedAlt fontSize="small" />, baseColor: '#2e7d32', activeBg: '#edf7ed' },
    { label: "Strongly Agree", value: "SA", icon: <SentimentVerySatisfied fontSize="small" />, baseColor: '#1b5e20', activeBg: '#e8f5e9' },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SurveyModule = ({ user }) => {
  const [isSubmitted, setIsSubmitted] = useState(false); // Controls the popup
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false); // Controls the final Thank You screen
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState({ open: false, message: "" });

  const answeredCount = hasCompletedSurvey ? surveyQuestions.length : Object.keys(answers).length;
  const progress = (answeredCount / surveyQuestions.length) * 100;
  const isComplete = answeredCount === surveyQuestions.length;

  const handleOptionChange = (questionId, value) => {
    if (hasCompletedSurvey) return; // Prevent changes if already completed
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSurveySubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    
    const payload = {
      user_id: user?.id || "B001",
      survey_topic: "General Satisfaction Survey",
      responses: answers 
    };

    try {
      await axios.post('http://127.0.0.1:8082/save-survey', payload);
      setIsSubmitted(true); // Open the success popup
    } catch (error) {
      setErrorToast({ open: true, message: "Failed to connect. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setIsSubmitted(false); // Close popup
    setHasCompletedSurvey(true); // Switch to the permanent Thank You screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (position) => {
    const height = document.documentElement.scrollHeight;
    let target = 0;
    if (position === 'bottom') target = height;
    if (position === 'middle') target = height / 2;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', pb: 10 }}>
      
      {/* FIXED HEADER */}
      <Box 
        sx={{ 
          position: 'sticky', top: 0, zIndex: 1000, 
          bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid', borderColor: 'grey.200',
          px: { xs: 2, md: 8 }, py: 3, boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Quality Survey
          </Typography>
          <Typography variant="body2" sx={{ color: hasCompletedSurvey ? 'success.main' : 'primary.main', fontWeight: 600 }}>
            {hasCompletedSurvey ? "Completed" : `${answeredCount} / ${surveyQuestions.length} Answered`}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={hasCompletedSurvey ? "success" : "primary"}
          sx={{ height: 6, borderRadius: 3, backgroundColor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 3 } }} 
        />
      </Box>

      {/* FLOATING NAVIGATION BUTTONS (Hidden after completion) */}
      {!hasCompletedSurvey && (
        <Box sx={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#ffffff', p: 1, borderRadius: 8, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'grey.100' }}>
          <Tooltip title="Go to Top" placement="left">
            <IconButton onClick={() => scrollTo('top')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
              <VerticalAlignTop />
            </IconButton>
          </Tooltip>
          <Tooltip title="Go to Middle" placement="left">
            <IconButton onClick={() => scrollTo('middle')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
              <VerticalAlignCenter />
            </IconButton>
          </Tooltip>
          <Tooltip title="Go to Bottom" placement="left">
            <IconButton onClick={() => scrollTo('bottom')} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
              <VerticalAlignBottom />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {hasCompletedSurvey ? (
          /* PERMANENT THANK YOU SCREEN */
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 4, md: 8 }, 
              borderRadius: 4, 
              backgroundColor: '#ffffff',
              border: '1px solid', borderColor: 'grey.300',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              mt: 4
            }}
          >
            <CheckCircleRounded sx={{ fontSize: 80, color: '#4caf50', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
              Thank You!
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
              Your response has been successfully recorded. We appreciate your time and feedback.
            </Typography>
          </Paper>
        ) : (
          /* SURVEY QUESTIONS */
          <>
            <Stack spacing={3}>
              {surveyQuestions.map((q, index) => {
                const isAnswered = !!answers[q.id];
                return (
                  <Paper 
                    key={q.id} 
                    elevation={0} 
                    sx={{ 
                      p: { xs: 3, md: 4 }, 
                      borderRadius: 4, 
                      backgroundColor: '#ffffff',
                      border: '1px solid', 
                      borderColor: isAnswered ? 'primary.light' : 'grey.300',
                      boxShadow: isAnswered ? '0 8px 24px rgba(25, 118, 210, 0.08)' : '0 2px 10px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 3, display: 'flex', gap: 1.5 }}>
                      <span style={{ color: '#1976d2' }}>{index + 1}.</span> {q.text}
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      {options.map((opt) => {
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <Box 
                            key={opt.value} onClick={() => handleOptionChange(q.id, opt.value)}
                            sx={{ 
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                              py: 1.5, px: 1, borderRadius: 2, border: '1px solid',
                              borderColor: isSelected ? opt.baseColor : 'grey.200',
                              bgcolor: isSelected ? opt.activeBg : '#ffffff',
                              color: isSelected ? opt.baseColor : 'text.secondary', cursor: 'pointer',
                              '&:hover': { borderColor: isSelected ? opt.baseColor : 'grey.400', bgcolor: isSelected ? opt.activeBg : 'grey.50', color: opt.baseColor },
                              '& svg': { color: isSelected ? opt.baseColor : 'grey.500' }
                            }}
                          >
                            {opt.icon}
                            <Typography variant="caption" sx={{ fontWeight: isSelected ? 700 : 500, letterSpacing: '0.2px' }}>
                              {opt.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" size="large" endIcon={<TaskAlt />} onClick={handleSurveySubmit} disabled={!isComplete || isSubmitting}
                sx={{ 
                  borderRadius: 8, px: 6, py: 1.5, fontSize: '1.05rem', fontWeight: 700, textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(25, 118, 210, 0.3)' }
                }}
              >
                {isSubmitting ? 'Processing...' : 'Submit Responses'}
              </Button>
            </Box>
          </>
        )}
      </Container>

      {/* SUCCESS POPUP (Professional Dialog) */}
      <Dialog
        open={isSubmitted}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosePopup}
        PaperProps={{
          sx: { borderRadius: 4, px: 2, py: 3, maxWidth: 450, width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogContent>
          <CheckCircleRounded sx={{ fontSize: 90, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
            Submission Successful
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Thank you for your feedback. Your response has been securely recorded.
          </Typography>
          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            onClick={handleClosePopup}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 700, textTransform: 'none', fontSize: '1.1rem', boxShadow: 'none' }}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>

      {/* ERROR SNACKBAR */}
      <Snackbar open={errorToast.open} autoHideDuration={6000} onClose={() => setErrorToast({ open: false, message: "" })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{errorToast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SurveyModule;