import React, { useState, useMemo } from 'react';
import { Chart } from 'react-google-charts';

// Gantt Chart Column Definitions
const columns = [
  { type: 'string', label: 'Task ID' },
  { type: 'string', label: 'Task Name' },
  { type: 'string', label: 'Operator' },
  { type: 'date', label: 'Start Date' },
  { type: 'date', label: 'End Date' },
  { type: 'number', label: 'Duration' },
  { type: 'number', label: 'Percent Complete' },
  { type: 'string', label: 'Dependencies' },
];

const OperatorGanttDashboard = ({ rawData }) => {
  // 1. Setup Filter States (Defaulting to a wide range or empty)
  const [filterStart, setFilterStart] = useState('2026-01-01');
  const [filterEnd, setFilterEnd] = useState('2026-02-28');

  const chartData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [columns];

    const startDateBoundary = new Date(filterStart);
    const endDateBoundary = new Date(filterEnd);

    // 2. Filter tasks based on selected range
    const filteredTasks = rawData.filter((task) => {
      const taskStart = new Date(task.start_time);
      const taskEnd = new Date(task.end_time);
      // Show task if it overlaps with the selected window
      return taskStart <= endDateBoundary && taskEnd >= startDateBoundary;
    });

    // 3. Group by Operator
    const grouped = filteredTasks.reduce((acc, task) => {
      const op = task.operator_name || "Unknown Operator";
      if (!acc[op]) acc[op] = [];
      acc[op].push(task);
      return acc;
    }, {});

    const rows = [];

    // 4. For each operator, find least 3 and latest 3 within the filter
    Object.keys(grouped).forEach((operator) => {
      const tasks = grouped[operator].sort(
        (a, b) => new Date(a.start_time) - new Date(b.start_time)
      );

      const least3 = tasks.slice(0, 3);
      const latest3 = tasks.length > 3 ? tasks.slice(-3) : [];

      // Remove duplicates if the list has fewer than 6 tasks total
      const uniqueSelection = Array.from(new Set([...least3, ...latest3]));

      uniqueSelection.forEach((task, index) => {
        let s = new Date(task.start_time);
        let e = new Date(task.end_time);

        // Visual fix: ensure at least 15 min duration for instant tasks
        if (s.getTime() === e.getTime()) {
          e = new Date(s.getTime() + 15 * 60000);
        }

        rows.push([
          `${operator}-${index}-${task.Task_Name}`, 
          task.Task_Name,
          operator,
          s,
          e,
          null,
          100,
          null,
        ]);
      });
    });

    return [columns, ...rows];
  }, [rawData, filterStart, filterEnd]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
        <div>
          <label><b>Start Date: </b></label>
          <input 
            type="date" 
            value={filterStart} 
            onChange={(e) => setFilterStart(e.target.value)} 
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label><b>End Date: </b></label>
          <input 
            type="date" 
            value={filterEnd} 
            onChange={(e) => setFilterEnd(e.target.value)} 
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          Showing 3 Least & 3 Latest tasks per active operator in this range.
        </div>
      </div>

      {chartData.length > 1 ? (
        <Chart
          chartType="Gantt"
          width="100%"
          height="600px"
          data={chartData}
          options={{
            height: 600,
            gantt: {
              trackHeight: 40,
              barHeight: 25,
              criticalPathEnabled: false, // Cleaner view
              labelStyle: {
                fontName: 'Arial',
                fontSize: 12,
              },
            },
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #ccc' }}>
          No operators worked between the selected dates.
        </div>
      )}
    </div>
  );
};

// --- Dummy Data Setup (Usage Example) ---
const App1 = () => {
  const [data, setData] = useState([
    { operator_name: "SANTOSH KUMAR", Task_Name: "Baking PCB", start_time: "2026-01-09 09:00:00", end_time: "2026-01-09 11:00:00" },
    { operator_name: "SANTOSH KUMAR", Task_Name: "Cleaning PCB", start_time: "2026-01-10 10:00:00", end_time: "2026-01-10 12:00:00" },
    { operator_name: "SANTOSH KUMAR", Task_Name: "Visual Inspection", start_time: "2026-01-11 14:00:00", end_time: "2026-01-11 15:00:00" },
    { operator_name: "SANTOSH KUMAR", Task_Name: "Packing", start_time: "2026-02-01 08:00:00", end_time: "2026-02-01 09:00:00" },
    { operator_name: "AMIT SINGH", Task_Name: "Setup Line", start_time: "2026-01-15 08:00:00", end_time: "2026-01-15 10:00:00" },
    { operator_name: "AMIT SINGH", Task_Name: "Component Loading", start_time: "2026-01-15 11:00:00", end_time: "2026-01-15 13:00:00" },
    // ... add more to test filtering
  ]);

  return <OperatorGanttDashboard rawData={data} />;
};

export default App1;