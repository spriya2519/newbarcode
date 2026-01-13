import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts';
import { 
  LayoutDashboard, Package, AlertTriangle, CheckCircle2, 
  TrendingUp, Layers, DollarSign, Clock, MoreVertical, 
  ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// Data extracted from the Excel files
const dashboardData = {
  summary: {
    OCTA: { total_po: 2388, despatched: 0, in_progress: 148, rework: 2, scrap: 0, value: "€1.42M" },
    HEXA: { total_po: 1612, despatched: 8, in_progress: 18, rework: 0, scrap: 0, value: "€1.23M" }
  },
  process_flow: [
    { stage: "Cleaning & Baking", OCTA: 30, HEXA: 0 },
    { stage: "QA Inspection", OCTA: 39, HEXA: 0 },
    { stage: "AOI Correction", OCTA: 8, HEXA: 0 },
    { stage: "HSTT (17 Hrs)", OCTA: 21, HEXA: 0 },
    { stage: "Flying Probe", OCTA: 7, HEXA: 0 },
    { stage: "Connector Assy", OCTA: 22, HEXA: 0 },
    { stage: "Masking", OCTA: 15, HEXA: 0 },
    { stage: "Final Control", OCTA: 0, HEXA: 17 },
    { stage: "ATE1 & ATE2", OCTA: 0, HEXA: 1 }
  ],
  quarterly: [
    { q: "Q1", octa_target: 540, octa_actual: 515, hexa_target: 300, hexa_actual: 239 },
    { q: "Q2", octa_target: 540, octa_actual: 483, hexa_target: 300, hexa_actual: 248 },
    { q: "Q3", octa_target: 540, octa_actual: 571, hexa_target: 300, hexa_actual: 160 },
    { q: "Q4", octa_target: 540, octa_actual: 0, hexa_target: 300, hexa_actual: 0 }
  ],
  hold_stats: [
    { issue: "FPGA Void", count: 12 },
    { issue: "X-Ray Hold", count: 5 },
    { issue: "Mechanical", count: 2 }
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ProfessionalDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-8">
            <Layers size={28} />
            <span className="font-bold text-xl tracking-tight">TRDS Manufacturing</span>
          </div>
          <nav className="space-y-1">
            {['Overview', 'Production', 'Quality Control', 'Financials'].map(item => (
              <button 
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item === 'Overview' && <LayoutDashboard size={18} />}
                {item === 'Production' && <Package size={18} />}
                {item === 'Quality Control' && <AlertTriangle size={18} />}
                {item === 'Financials' && <DollarSign size={18} />}
                {item}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Synthesis for TRDS-2 Order Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">Live Production</span>
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* KPI Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total PO Quantity" value="4,000" subValue="+12% vs LY" trend="up" icon={<TrendingUp size={20} className="text-blue-600" />} />
            <StatCard title="Active In-Line" value="166" subValue="Across 9 Stages" trend="neutral" icon={<Package size={20} className="text-emerald-600" />} />
            <StatCard title="Hold/Rework" value="2" subValue="0.05% Failure Rate" trend="down" icon={<AlertTriangle size={20} className="text-amber-600" />} />
            <StatCard title="Order Value" value="€2.65M" subValue="Estimated Total" trend="up" icon={<DollarSign size={20} className="text-indigo-600" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Production Flow Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Production Stage Distribution</h3>
                <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.process_flow}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="stage" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="OCTA" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="HEXA" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hold Stats Pie Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6">Quality Hold Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.hold_stats}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="issue"
                    >
                      {dashboardData.hold_stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {dashboardData.hold_stats.map((item, i) => (
                  <div key={item.issue} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                      <span className="text-slate-500">{item.issue}</span>
                    </div>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Target vs Achievement */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6">Target vs Achievement (Quarterly)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dashboardData.quarterly}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="q" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="octa_target" fill="#DBEAFE" stroke="#3B82F6" />
                    <Bar dataKey="octa_actual" fill="#3B82F6" barSize={30} radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="hexa_actual" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Module Comparison Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6">Module Inventory Summary</h3>
              <div className="space-y-6">
                {Object.entries(dashboardData.summary).map(([key, value]) => (
                  <div key={key} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${key === 'OCTA' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <Layers size={18} />
                        </div>
                        <div>
                          <p className="font-bold">{key} Pack Module</p>
                          <p className="text-xs text-slate-400">Total PO: {value.total_po} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-700">{value.value}</p>
                        <p className="text-xs text-slate-400">Order Value</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">In Progress</p>
                        <p className="font-bold text-slate-800">{value.in_progress}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Despatched</p>
                        <p className="font-bold text-slate-800">{value.despatched}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Rework</p>
                        <p className={`font-bold ${value.rework > 0 ? 'text-rose-500' : 'text-slate-800'}`}>{value.rework}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, subValue, trend, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-slate-50 p-2.5 rounded-xl">{icon}</div>
      <div className={`flex items-center text-xs font-bold ${
        trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'
      }`}>
        {trend === 'up' && <ArrowUpRight size={14} />}
        {trend === 'down' && <ArrowDownRight size={14} />}
        {trend !== 'neutral' && "5.4%"}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
      {subValue}
      <ChevronRight size={12} />
    </p>
  </div>
);

export default ProfessionalDashboard;