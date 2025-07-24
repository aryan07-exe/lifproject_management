
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
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
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
  const [searchDate, setSearchDate] = useState("");

  // Sort projects by newest primaryDate first, then filter
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.primaryDate ? new Date(a.primaryDate) : new Date(0);
    const dateB = b.primaryDate ? new Date(b.primaryDate) : new Date(0);
    return dateB - dateA;
  });
  const filteredProjects = sortedProjects.filter((proj) => {
    const nameMatch = proj.projectName?.toLowerCase().includes(searchName.toLowerCase());
    const invoiceMatch = proj.invoiceName?.toLowerCase().includes(searchInvoice.toLowerCase());
    const dateMatch = searchDate ? (proj.primaryDate && proj.primaryDate.slice(0,10) === searchDate) : true;
    return nameMatch && invoiceMatch && dateMatch;
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
      await axios.put(`https://lifproject-management.onrender.com/api/projects/${selected._id}`, selected);
      setEditSuccess("Project updated successfully!");
      // Update the list
      setProjects((prev) => prev.map(p => p._id === selected._id ? selected : p));
      setTimeout(() => setEditSuccess(""), 1500);
    } catch (err) {
      setEditError("Failed to update project.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: "2rem" }}>{error}</div>;

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
                  <label>Primary Date:</label>
                  <input type="date" name="primaryDate" value={selected.primaryDate?.slice(0, 10)} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="manage-edit-section" style={{background:'#fff6f6',borderRadius:10,padding:'18px 18px 10px 18px',marginBottom:24}}>
              <h3 className="manage-section-header">Day-Wise Requirements</h3>
              <div className="manage-day-grid">
                {selected.dayWiseRequirements.map((day, index) => (
                  <div key={index} className="manage-edit-day">
                    <div className="manage-field-row">
                      <div className="manage-field-col">
                        <label>Date:</label>
                        <input type="date" value={day.date?.slice(0, 10)} onChange={(e) => handleDayChange(index, "date", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Time Shift:</label>
                        <select value={day.timeShift} onChange={(e) => handleDayChange(index, "timeShift", e.target.value)}>
                          <option value="Half Day Morning">Half Day Morning</option>
                          <option value="Half Day Evening">Half Day Evening</option>
                          <option value="Full Day">Full Day</option>
                        </select>
                      </div>
                      <div className="manage-field-col">
                        <label>Traditional Photographers:</label>
                        <input type="number" value={day.traditionalPhotographers} onChange={(e) => handleDayChange(index, "traditionalPhotographers", e.target.value)} />
                      </div>
                      <div className="manage-field-col">
                        <label>Assistant:</label>
                        <input type="number" value={day.assistant} onChange={(e) => handleDayChange(index, "assistant", e.target.value)} />
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
                  <div key={index} className="manage-edit-deliverable">
                    <div className="manage-field-row">
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
      <div className="manage-filters" style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:18,alignItems:'center',paddingLeft:'2vw'}}>
        <input
          type="text"
          className="manage-filter-input"
          placeholder="Search by Project Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        <input
          type="text"
          className="manage-filter-input"
          placeholder="Search by Invoice Name"
          value={searchInvoice}
          onChange={e => setSearchInvoice(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        <input
          type="date"
          className="manage-filter-input"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        {(searchName || searchInvoice || searchDate) && (
          <button onClick={()=>{setSearchName("");setSearchInvoice("");setSearchDate("");}} style={{padding:'8px 16px',border:'none',background:'#8B1C2B',color:'#fff',borderRadius:6,cursor:'pointer'}}>Clear</button>
        )}
      </div>
      <div className="manage-table-wrapper">
        <table className="manage-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Invoice Name</th>
              <th>Type</th>
              <th>Primary Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj) => (
              <tr key={proj.projectName + '-' + proj.invoiceName} className="project-row">
                <td>{proj.projectName}</td>
                <td>{proj.invoiceName}</td>
                <td>{proj.projectType}</td>
                <td>{proj.primaryDate ? formatDMY(proj.primaryDate) : "-"}</td>
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
