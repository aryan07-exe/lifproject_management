
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageProject.css';
import Navbar from './Navbar.jsx';




  // Format date as d-m-y
  function formatDMY(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

function ManageProject() {
  // Fetch all manpower for assignment dropdowns
  const [manpowerList, setManpowerList] = useState([]);
  useEffect(() => {
    async function fetchManpower() {
      try {
        const res = await axios.get('https://lifproject-management.onrender.com/api/manpower/all');
        setManpowerList(res.data || []);
      } catch (err) {
        // ignore error
      }
    }
    fetchManpower();
  }, []);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Fetch all projects
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("https://lifproject-management.onrender.com/api/projects/all");
        setProjects(res.data || []);
      } catch (err) {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);
  // Handle form changes for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };
  const handleDayChange = (index, key, value) => {
    const updated = [...selected.dayWiseRequirements];
    updated[index][key] = value;
    setSelected((prev) => ({ ...prev, dayWiseRequirements: updated }));
  };
  const handleDeliverableChange = (index, key, value) => {
    const updated = [...selected.deliverables];
    updated[index][key] = value;
    setSelected((prev) => ({ ...prev, deliverables: updated }));
  };
    // Search filter states
  const [searchName, setSearchName] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sort projects by newest primaryDate first, then filter
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.primaryDate ? new Date(a.primaryDate) : new Date(0);
    const dateB = b.primaryDate ? new Date(b.primaryDate) : new Date(0);
    return dateB - dateA;
  });
  const filteredProjects = sortedProjects.filter((proj) => {
    const nameMatch = proj.projectName?.toLowerCase().includes(searchName.toLowerCase());
    const invoiceMatch = proj.invoiceName?.toLowerCase().includes(searchInvoice.toLowerCase());
    let rangeMatch = true;
    if (startDate && endDate) {
      const projDate = proj.primaryDate ? proj.primaryDate.slice(0,10) : "";
      rangeMatch = projDate >= startDate && projDate <= endDate;
    } else if (startDate) {
      const projDate = proj.primaryDate ? proj.primaryDate.slice(0,10) : "";
      rangeMatch = projDate >= startDate;
    } else if (endDate) {
      const projDate = proj.primaryDate ? proj.primaryDate.slice(0,10) : "";
      rangeMatch = projDate <= endDate;
    }
    return nameMatch && invoiceMatch && rangeMatch;
  });

  // Handle project deletion
  const handleDelete = async (projectName) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`https://lifproject-management.onrender.com/api/projects/by-name/${encodeURIComponent(projectName)}`);
      setProjects((prev) => prev.filter(p => p.projectName !== projectName));
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  // Submit edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      // Ensure projectStage is included in the payload
      const payload = { ...selected, projectStage: selected.projectStage };
      await axios.put(`https://lifproject-management.onrender.com/api/projects/${selected._id}`, payload);
      setEditSuccess("Project updated successfully!");
      // Update the list
      setProjects((prev) => prev.map(p => p._id === selected._id ? { ...selected } : p));
  setTimeout(() => setEditSuccess("") , 1500);
    } catch (err) {
      setEditError("Failed to update project.");
    } finally {
      setEditLoading(false);
    }
  };

  // View popup component
  const ViewProjectModal = ({ project, onClose }) => (
    <div className="manage-modal-overlay" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="manage-modal-content" style={{
        maxWidth: '900px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '30px',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <button 
          type="button" 
          className="manage-modal-close" 
          onClick={onClose} 
          title="Close"
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: '#8B1C2B',
            color: 'white',
            border: 'none',
            borderRadius: '50%'
            ,width: '32px',
            height: '32px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >&times;</button>
        
        <div className="manage-view-form">
          <h2 className="manage-title" style={{
            marginBottom: 30,
            fontSize: '24px',
            borderBottom: '2px solid #8B1C2B',
            paddingBottom: '15px'
          }}>
            Project Details: <span style={{color:'#8B1C2B'}}>{project.projectName}</span>
          </h2>
          
          <div className="manage-edit-section" style={{
            background:'#fff',
            borderRadius: 12,
            padding:'25px',
            marginBottom: 30,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0'
          }}>
            <h3 className="manage-section-header" style={{
              color: '#8B1C2B',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Basic Information</h3>
            <div className="manage-view-row" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {[ 
                { label: 'Project Name', value: project.projectName },
                { label: 'Project Type', value: project.projectType },
                { label: 'Invoice Name', value: project.invoiceName },
                { label: 'Invoice Number', value: project.invoiceNumber },
                { label: 'Mobile Number', value: project.mobileNumber },
                { label: 'Primary Date', value: formatDMY(project.primaryDate) }
              ].map((item, i) => (
                <div key={i} className="manage-view-col" style={{background: '#fbeaec', padding: '15px', borderRadius: '8px'}}>
                  <label style={{color: '#666', fontSize: '14px', marginBottom: '5px', display: 'block'}}>{item.label}:</label>
                  <div style={{fontSize: '16px', fontWeight: '500'}}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="manage-edit-section" style={{
            background:'#fff',
            borderRadius: 12,
            padding:'25px',
            marginBottom: 30,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0'
          }}>
            <h3 className="manage-section-header" style={{
              color: '#8B1C2B',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Day-Wise Requirements</h3>
            <div style={{display: 'grid', gap: '20px'}}>
              {project.dayWiseRequirements.map((day, index) => (
                <div key={index} className="manage-view-day" style={{
                  background: '#fff6f6',
                  borderRadius: '10px',
                  padding: '20px',
                  border: '1px solid #ffe6e6',
                  marginBottom: '10px'
                }}>
                  <div className="manage-view-row" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '15px'
                  }}>
                    {[
                      { label: 'Date', value: formatDMY(day.date) },
                      { label: 'Time Shift', value: day.timeShift },
                      { label: 'Traditional Photographers', value: day.traditionalPhotographers },
                      { label: 'Traditional Cinematographers', value: day.traditionalCinematographers },
                      { label: 'Candid Photographers', value: day.candidPhotographers },
                      { label: 'Candid Cinematographers', value: day.candidcinematographers },
                      { label: 'Additional Cinematographers', value: day.additionalCinematographers },
                      { label: 'Additional Photographers', value: day.additionalPhotographers },
                      { label: 'OnSite Editor', value: day.onSiteEditor },
                      { label: 'Assistant', value: day.assistant },
                      { label: 'Aerial Cinematography', value: day.aerialCinematography },
                      { label: 'Additional Notes', value: day.additionalNotes }
                    ].map((item, i) => (
                      <div key={i} style={{background: '#fff', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
                        <label style={{color: '#666', fontSize: '13px', marginBottom: '4px', display: 'block'}}>{item.label}:</label>
                        <div style={{fontSize: '15px', fontWeight: '500', whiteSpace: 'pre-line'}}>{item.value || '-'}</div>
                      </div>
                    ))}
                  </div>
                  {/* Assigned Manpower Section */}
                  <div style={{marginTop:'18px', background:'#fff', borderRadius:'8px', padding:'14px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', border:'1px solid #e2e8f0'}}>
                    <h4 style={{color:'#2b6cb0', fontWeight:500, fontSize:'16px', marginBottom:'8px'}}>Assigned Manpower</h4>
                    {day.manpower && day.manpower.length > 0 ? (
                      <ul style={{paddingLeft:'18px', marginBottom:0}}>
                        {day.manpower.map((person, idx) => (
                          <li key={idx} style={{marginBottom:'6px', color:'#2d3748', fontSize:'15px'}}>
                            <span style={{fontWeight:500}}>Role:</span> <b>{person.role}</b> &nbsp;|&nbsp; <span style={{fontWeight:500}}>EID:</span> <b>{person.eid}</b> &nbsp;|&nbsp; <span style={{fontWeight:500}}>Slot:</span> {person.slotIndex}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{color:'#888', fontStyle:'italic', fontSize:'15px'}}>No manpower assigned yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="manage-edit-section" style={{
            background:'#fff',
            borderRadius: 12,
            padding:'25px',
            marginBottom: 30,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0'
          }}>
            <h3 className="manage-section-header" style={{
              color: '#8B1C2B',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Deliverables</h3>
            <div style={{display: 'grid', gap: '20px'}}>
              {project.deliverables.map((item, index) => (
                <div key={index} className="manage-view-deliverable" style={{
                  background: '#fbeaec',
                  borderRadius: '10px',
                  padding: '20px',
                  border: '1px solid #f8d7dc'
                }}>
                  <div className="manage-view-row" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '15px'
                  }}>
                    <div style={{background: '#fff', padding: '12px', borderRadius: '6px'}}>
                      <label style={{color: '#666', fontSize: '13px', marginBottom: '4px', display: 'block'}}>Key:</label>
                      <div style={{fontSize: '15px', fontWeight: '500'}}>{item.key}</div>
                    </div>
                    <div style={{background: '#fff', padding: '12px', borderRadius: '6px'}}>
                      <label style={{color: '#666', fontSize: '13px', marginBottom: '4px', display: 'block'}}>Status:</label>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        color: item.status === 'complete' ? '#2ecc71' : 
                               item.status === 'pending' ? '#8B1C2B' :
                               item.status === 'client review' ? '#f39c12' : '#000000ff',
                        textTransform: 'capitalize'
                      }}>
                        {item.status}
                      </div>
                    </div>
                    <div style={{background: '#fff', padding: '12px', borderRadius: '6px'}}>
                      <label style={{color: '#666', fontSize: '13px', marginBottom: '4px', display: 'block'}}>Deadline:</label>
                      <div style={{fontSize: '15px', fontWeight: '500'}}>{formatDMY(item.deadline)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: "2rem" }}>{error}</div>;

  if (viewProject) {
    return <ViewProjectModal project={viewProject} onClose={() => setViewProject(null)} />;
  }

  if (selected) {
    return (
      <div className="manage-modal-overlay">
        <div className="manage-modal-content">
          <button type="button" className="manage-modal-close" onClick={() => setSelected(null)} title="Close">&times;</button>
          <form className="manage-edit-form" onSubmit={handleSubmit}>
            <h2 className="manage-title" style={{marginBottom: 24}}>Edit Project: <span style={{color:'var(--manage-red)'}}>{selected.projectName}</span></h2>
            <div className="manage-edit-section" style={{background:'#fbeaec',borderRadius:10,padding:'18px 18px 10px 18px',marginBottom:24}}>
              <h3 className="manage-section-header">Project Details</h3>
              <div className="manage-field-row">
                <div className="manage-field-col">
                  <label>Project Name:</label>
                  <input type="text" name="projectName" value={selected.projectName} onChange={handleChange} />
                </div>
                <div className="manage-field-col">
                  <label>Project Type:</label>
                  <input type="text" name="projectType" value={selected.projectType} onChange={handleChange} />
                </div>
                <div className="manage-field-col">
                  <label>Invoice Name:</label>
                  <input type="text" name="invoiceName" value={selected.invoiceName} onChange={handleChange} />
                </div>
                <div className="manage-field-col">
                  <label>Invoice Number:</label>
                  <input type="text" name="invoiceNumber" value={selected.invoiceNumber || ''} onChange={handleChange} />
                </div>
                <div className="manage-field-col">
                  <label>Mobile Number:</label>
                  <input type="text" name="mobileNumber" value={selected.mobileNumber || ''} onChange={handleChange} />
                </div>
                <div className="manage-field-col">
                  <label>Primary Date:</label>
                  <input type="date" name="primaryDate" value={selected.primaryDate?.slice(0, 10)} onChange={handleChange} />
                </div>
                <div className="manage-field-col">
                  <label>Project Stage:</label>
                  <select name="projectStage" value={selected.projectStage || ''} onChange={handleChange}>
                    <option value="">Select Stage</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="in progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="manage-edit-section" style={{background:'#fff6f6',borderRadius:10,padding:'18px 18px 10px 18px',marginBottom:24}}>
              <h3 className="manage-section-header">Day-Wise Requirements</h3>
              <div className="manage-day-grid">
                {selected.dayWiseRequirements.map((day, dayIdx) => (
                  <div key={dayIdx} className="manage-edit-day" style={{marginBottom:16,background:'#fff',borderRadius:8,padding:16,border:'1px solid #ffe6e6'}}>
                    <div className="manage-field-row" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:12}}>
                      {/* ...existing day fields... */}
                      <div className="manage-field-col">
                        <label>Date:</label>
                        <input type="date" value={day.date?.slice(0, 10) || ''} onChange={(e) => handleDayChange(dayIdx, "date", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Time Shift:</label>
                        <select value={day.timeShift || ''} onChange={(e) => handleDayChange(dayIdx, "timeShift", e.target.value)}>
                          <option value="">Select Time Shift</option>
                          <option value="Half Day Morning">Half Day Morning</option>
                          <option value="Half Day Evening">Half Day Evening</option>
                          <option value="Full Day">Full Day</option>
                        </select>
                      </div>
                      {/* ...other role fields... */}
                      {/* Assigned Manpower Editing Section */}
                      <div className="manage-field-col" style={{gridColumn:'1/-1', marginTop:'12px'}}>
                        <label style={{fontWeight:'bold', color:'#2b6cb0'}}>Assigned Manpower:</label>
                        {day.manpower && day.manpower.length > 0 ? (
                          day.manpower.map((person, slotIdx) => (
                            <div key={slotIdx} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                              <span style={{fontWeight:500}}>{person.role} (Slot {person.slotIndex}):</span>
                              <select
                                value={person.eid}
                                onChange={e => {
                                  // Update eid for this slot
                                  const updatedDay = {...day};
                                  updatedDay.manpower = [...day.manpower];
                                  updatedDay.manpower[slotIdx] = {...person, eid: e.target.value};
                                  const updatedDays = [...selected.dayWiseRequirements];
                                  updatedDays[dayIdx] = updatedDay;
                                  setSelected(prev => ({...prev, dayWiseRequirements: updatedDays}));
                                }}
                                style={{padding:'6px',borderRadius:6,border:'1px solid #e2e8f0'}}
                              >
                                <option value="">-- Select --</option>
                                {manpowerList.map(mp => (
                                  <option key={mp.eid} value={mp.eid}>{mp.name} ({mp.role}) - {mp.eid}</option>
                                ))}
                              </select>
                            </div>
                          ))
                        ) : (
                          <span style={{color:'#888'}}>No manpower assigned yet.</span>
                        )}
                      </div>
                      {/* ...other fields... */}
                      <div className="manage-field-col">
                        <label>Traditional Photographers:</label>
                        <input type="number" value={day.traditionalPhotographers || 0} onChange={(e) => handleDayChange(dayIdx, "traditionalPhotographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Traditional Cinematographers:</label>
                        <input type="number" value={day.traditionalCinematographers || 0} onChange={(e) => handleDayChange(dayIdx, "traditionalCinematographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Candid Photographers:</label>
                        <input type="number" value={day.candidPhotographers || 0} onChange={(e) => handleDayChange(dayIdx, "candidPhotographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Candid Cinematographers:</label>
                        <input type="number" value={day.candidcinematographers || 0} onChange={(e) => handleDayChange(dayIdx, "candidcinematographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Additional Cinematographers:</label>
                        <input type="number" value={day.additionalCinematographers || 0} onChange={(e) => handleDayChange(dayIdx, "additionalCinematographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Additional Photographers:</label>
                        <input type="number" value={day.additionalPhotographers || 0} onChange={(e) => handleDayChange(dayIdx, "additionalPhotographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>OnSite Editor:</label>
                        <input type="number" value={day.onSiteEditor || 0} onChange={(e) => handleDayChange(dayIdx, "onSiteEditor", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Assistant:</label>
                        <input type="number" value={day.assistant || 0} onChange={(e) => handleDayChange(dayIdx, "assistant", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Aerial Cinematography:</label>
                        <input type="number" value={day.aerialCinematography || 0} onChange={(e) => handleDayChange(dayIdx, "aerialCinematography", e.target.value)} />
                      </div>
                      <div className="manage-field-col" style={{gridColumn:'1/-1'}}>
                        <label>Additional Notes:</label>
                        <textarea value={day.additionalNotes || ''} onChange={(e) => handleDayChange(dayIdx, "additionalNotes", e.target.value)} rows={2} style={{width:'100%'}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="manage-edit-section" style={{background:'#fbeaec',borderRadius:10,padding:'18px 18px 10px 18px',marginBottom:24}}>
              <h3 className="manage-section-header">Deliverables</h3>
              <div className="manage-deliverable-grid">
                {selected.deliverables.map((item, index) => (
                  <div key={index} className="manage-edit-deliverable" style={{marginBottom:12,background:'#fff',borderRadius:8,padding:12,border:'1px solid #f8d7dc'}}>
                    <div className="manage-field-row" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:12}}>
                      <div className="manage-field-col">
                        <label>Key:</label>
                        <input type="text" value={item.key} readOnly />
                      </div>
                      <div className="manage-field-col">
                        <label>Status:</label>
                        <select value={item.status} onChange={(e) => handleDeliverableChange(index, "status", e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="complete">Complete</option>
                          <option value="client review">Client Review</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div className="manage-field-col">
                        <label>Deadline:</label>
                        <input type="date" value={item.deadline?.slice(0, 10)} onChange={(e) => handleDeliverableChange(index, "deadline", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="manage-edit-btn" disabled={editLoading}>{editLoading ? "Updating..." : "Update Project"}</button>
            {editError && <div style={{ color: "red", marginTop: 10 }}>{editError}</div>}
            {editSuccess && <div style={{ color: "green", marginTop: 10 }}>{editSuccess}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="manage-container">
      <h2 className="manage-title">Manage Projects</h2>
      {/* Search Filters */}
      <div className="manage-filters" style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:18,alignItems:'center',paddingLeft:'1vw'}}>
        Project Name<input
          type="text"
          className="manage-filter-input"
          placeholder="Search by Project Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
       Invoice Name <input
          type="text"
          className="manage-filter-input"
          placeholder="Search by Invoice Name"
          value={searchInvoice}
          onChange={e => setSearchInvoice(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
  {/* Primary date search removed */}
       Start Date <input
          type="date"
          className="manage-filter-input"
          placeholder="Start Date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        End Date<input
          type="date"
          className="manage-filter-input"
          placeholder="End Date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        {(searchName || searchInvoice || startDate || endDate) && (
          <button onClick={()=>{setSearchName("");setSearchInvoice("");setStartDate("");setEndDate("");}} style={{padding:'8px 16px',border:'none',background:'#8B1C2B',color:'#fff',borderRadius:6,cursor:'pointer'}}>Clear</button>
        )}
      </div>
      <div className="manage-table-wrapper ">
        <table className="manage-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Invoice Name</th>
              <th>Type</th>
              <th>Primary Date</th>
              <th>Project Stage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj) => (
              <tr key={proj.projectName + '-' + proj.invoiceName} className="project-row">
                <td onClick={() => setViewProject(proj)} style={{cursor: 'pointer'}}>{proj.projectName}</td>
                <td onClick={() => setViewProject(proj)} style={{cursor: 'pointer'}}>{proj.invoiceName}</td>
                <td onClick={() => setViewProject(proj)} style={{cursor: 'pointer'}}>{proj.projectType}</td>
                <td onClick={() => setViewProject(proj)} style={{cursor: 'pointer'}}>{proj.primaryDate ? formatDMY(proj.primaryDate) : "-"}</td>
                <td onClick={() => setViewProject(proj)} style={{cursor: 'pointer'}}>{proj.projectStage}</td>
                <td style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <button className="manage-edit-btn" onClick={() => setSelected(proj)} style={{marginRight: 4}}>Edit</button>
                  <button className="manage-delete-btn" onClick={() => handleDelete(proj.projectName)} style={{background:'#fff',color:'#8B1C2B',border:'1px solid #8B1C2B',borderRadius:6,padding:'6px 14px',cursor:'pointer'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></>
  );
}

export default ManageProject;
