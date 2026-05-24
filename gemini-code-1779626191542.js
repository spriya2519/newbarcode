import React, { useState, useMemo } from 'react';
// Note: We use React Icons for professional visuals. Add these to your project:
// npm install react-icons
import { FiSearch, FiBriefcase, FiMail, FiPhone, FiChevronDown, FiUserPlus, FiBookOpen } from 'react-icons/fi';

const INITIAL_DIRECTORY = [
  { id: 1, name: 'Alice Vance', department: 'Engineering', title: 'Senior Frontend Developer', extension: '4102', email: 'alice.v@company.com' },
  { id: 2, name: 'Brandon Stark', department: 'Human Resources', title: 'HR Manager', extension: '2205', email: 'brandon.s@company.com' },
  { id: 3, name: 'Clara Oswald', department: 'Marketing', title: 'Growth Specialist', extension: '1094', email: 'clara.o@company.com' },
  { id: 4, name: 'David Miller', department: 'Engineering', title: 'DevOps Lead', extension: '4189', email: 'david.m@company.com' },
  { id: 5, name: 'Elena Rostova', department: 'Finance', title: 'Financial Analyst', extension: '3044', email: 'elena.r@company.com' },
];

const DEPTS = ['Engineering', 'Human Resources', 'Marketing', 'Finance', 'Sales', 'Product'];

export default function ProfessionalDirectory() {
  const [directory, setDirectory] = useState(INITIAL_DIRECTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  const [formData, setFormData] = useState({ name: '', department: 'Engineering', title: '', extension: '', email: '' });

  const departmentsForFilter = useMemo(() => ['All', ...DEPTS], []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.extension || !formData.email) {
      alert('Please fill out Name, Extension, and Email.');
      return;
    }
    const newEmployee = { id: Date.now(), ...formData };
    setDirectory(prev => [...prev, newEmployee].sort((a, b) => a.name.localeCompare(b.name)));
    setFormData({ name: '', department: 'Engineering', title: '', extension: '', email: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      setDirectory(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const filteredDirectory = directory.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.extension.includes(searchTerm);
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div style={styles.appWrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <FiBookOpen size={40} style={styles.headerIcon} />
          <div style={styles.headerTextGroup}>
            <h1 style={styles.title}>Corporate Phone Directory</h1>
            <p style={styles.subtitle}>Real-time employee extensions, roles, and contacts.</p>
          </div>
        </index>

        <div style={styles.mainLayout}>
          <div style={styles.directoryPanel}>
            {/* Search & Filter Header */}
            <div style={styles.controls}>
              <div style={styles.searchWrapper}>
                <FiSearch style={styles.searchIcon} />
                <input type="text" placeholder="Search by name, title, or extension..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput}/>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Filter By Department:</label>
                <div style={styles.selectWrapper}>
                  <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={styles.selectInput}>
                    {departmentsForFilter.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                  <FiChevronDown style={styles.selectArrow} />
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Employee Name</th>
                    <th style={styles.th}>Role / Title</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Extension</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDirectory.map((emp, index) => (
                    <tr key={emp.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.tdNameGroup}>
                        <div style={styles.avatar}>A</div>
                        <div>
                          <div style={styles.tdName}>{emp.name}</div>
                          <span style={styles.deptBadge}>{emp.department}</span>
                        </div>
                      </td>
                      <td style={styles.tdTitle}>{emp.title}</td>
                      <td style={styles.tdContact}>
                        <a href={`mailto:${emp.email}`} style={styles.link}><FiMail size={16}/> {emp.email}</a>
                      </td>
                      <td style={styles.tdExtension}>{emp.extension}</td>
                      <td style={styles.tdActions}>
                        <button onClick={() => handleDelete(emp.id)} style={styles.deleteBtn}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Employee Form */}
          <div style={styles.formPanel}>
            <div style={styles.formHeader}>
              <FiUserPlus size={22} style={styles.formHeaderIcon}/>
              <h2 style={styles.formTitle}>Add New Staff Member</h2>
            </div>
            <p style={styles.formSubtitle}>Fields marked with * are required.</p>
            
            <form onSubmit={handleFormSubmit} style={styles.form}>
              {[
                { label: 'Full Name *', name: 'name', placeholder: 'Jane Doe', icon: FiBriefcase },
                { label: 'Job Title', name: 'title', placeholder: 'UI/UX Designer', icon: FiBriefcase },
                { label: 'Extension *', name: 'extension', placeholder: '4412', icon: FiPhone },
                { label: 'Email *', name: 'email', placeholder: 'jane.d@company.com', icon: FiMail },
              ].map((field) => (
                <div key={field.name} style={styles.formGroup}>
                  <label style={styles.label}>{field.label}</label>
                  <div style={styles.inputWrapper}>
                    <field.icon style={styles.inputIcon} />
                    <input type="text" name={field.name} value={formData[field.name]} onChange={handleInputChange} style={styles.input} placeholder={field.placeholder} required={field.label.includes('*')} />
                  </div>
                </div>
              ))}

              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <div style={styles.selectWrapper}>
                  <select name="department" value={formData.department} onChange={handleInputChange} style={styles.input}>
                    {DEPTS.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                  <FiChevronDown style={styles.selectArrow} />
                </div>
              </div>

              <button type="submit" style={styles.submitBtn}>
                <FiUserPlus /> Add to Official Directory
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // Application Container
  appWrapper: {
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  container: {
    maxWidth: '1360px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '30px',
    overflow: 'hidden',
  },
  
  // Header Section
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '35px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e2e8f0',
  },
  headerIcon: { color: '#2563eb' },
  headerTextGroup: {},
  title: { fontSize: '2.2rem', color: '#1e293b', margin: '0 0 5px 0', fontWeight: '700' },
  subtitle: { fontSize: '1.05rem', color: '#64748b', margin: 0 },

  // Control Row
  controls: {
    display: 'flex',
    gap: '24px',
    marginBottom: '28px',
    alignItems: 'center',
  },
  searchWrapper: { flex: 1, position: 'relative' },
  searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: {
    width: '100%',
    padding: '14px 16px 14px 44px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterLabel: { color: '#64748b', fontWeight: '500', fontSize: '0.95rem' },
  selectWrapper: { position: 'relative' },
  selectArrow: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' },
  selectInput: {
    padding: '12px 36px 12px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    backgroundColor: '#fff',
    appearance: 'none',
  },

  // Directory Panel & Table
  mainLayout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  directoryPanel: { flex: '3 1 700px' },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thead: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  th: { padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  trEven: { backgroundColor: '#ffffff', transition: 'background-color 0.15s' },
  trOdd: { backgroundColor: '#f9fafb', transition: 'background-color 0.15s' },
  tdNameGroup: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1rem' },
  tdName: { color: '#111827', fontWeight: '600', fontSize: '0.98rem', marginBottom: '2px' },
  deptBadge: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '500' },
  tdTitle: { padding: '16px', color: '#334155' },
  tdContact: { padding: '16px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' },
  link: { color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' },
  tdExtension: { padding: '16px', color: '#1d4ed8', fontWeight: '700', fontSize: '1.05rem', fontFamily: 'monospace' },
  tdActions: { padding: '16px' },
  deleteBtn: { padding: '8px 14px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem' },

  // Form Panel
  formPanel: {
    flex: '1 1 320px',
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    alignSelf: 'flex-start',
  },
  formHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  formHeaderIcon: { color: '#2563eb' },
  formTitle: { margin: 0, fontSize: '1.4rem', color: '#0f172a' },
  formSubtitle: { color: '#64748b', fontSize: '0.9rem', marginBottom: '22px' },
  formGroup: { marginBottom: '18px' },
  label: { fontSize: '0.88rem', fontWeight: '600', color: '#475569', marginBottom: '7px', display: 'block' },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '10px',
    padding: '14px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'background-color 0.2s',
  }
};
```http://googleusercontent.com/image_generation_content/176