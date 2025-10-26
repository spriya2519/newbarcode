// import React, { useState } from "react";
// import LoginForm from "./components/LoginForm";
// import ItemTable from "./components/ItemTable";

// export default function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [user, setUser] = useState({});
//   const [parts, setParts] = useState([]);

//   const handleLogin = (details) => {
//     setUser(details);
//     setLoggedIn(true);
//     // Sample data after login
//     setParts([
//       { partno: "P1001", desc: "Sample Item 1", qty: 10, gr_no: "GR001", accepted: null, comment: "" },
//       { partno: "P1002", desc: "Sample Item 2", qty: 5, gr_no: "GR002", accepted: null, comment: "" },
//     ]);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setUser({});
//     setParts([]);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {!loggedIn ? (
//         <LoginForm onLogin={handleLogin} />
//       ) : (
//         <ItemTable user={user} parts={parts} setParts={setParts} onLogout={handleLogout} />
//       )}
//     </div>
//   );
// }
import React from "react";
import ItemTable from "./ItemTable";

function App() {
  const user = { name: "Priya", staffNo: "ST123", date: "2025-10-24" };

  return <ItemTable user={user} />;
}

export default App;
