import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, X, AlertCircle } from "lucide-react";
import "../styles/ViewProject.css";
import '../styles/ViewProject.css';

function ViewProject() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Search filter states
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:5000/api/projects/all", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setProjects(res.data || []);
      } catch (err) {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filtered projects based on search
  const filteredProjects = projects.filter((proj) => {
    const nameMatch = proj.projectName?.toLowerCase().includes(searchName.toLowerCase());
    const invoiceMatch = proj.invoiceName?.toLowerCase().includes(searchInvoice.toLowerCase());
    const dateMatch = searchDate ? (proj.primaryDate && proj.primaryDate.slice(0,10) === searchDate) : true;
    return nameMatch && invoiceMatch && dateMatch;
  });

  return (
    <div className="view-projects-container">
      <div className="page-header">
        <FileText size={28} className="page-icon" />
        <h2 className="page-title">Projects</h2>
      </div>
      {/* Search Filters */}
      <div className="project-filters" style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:18,alignItems:'center'}}>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by Project Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        <input
          type="text"
          className="filter-input"
          placeholder="Search by Invoice Name"
          value={searchInvoice}
          onChange={e => setSearchInvoice(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        <input
          type="date"
          className="filter-input"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
          style={{padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:6,minWidth:180}}
        />
        {(searchName || searchInvoice || searchDate) && (
          <button onClick={()=>{setSearchName("");setSearchInvoice("");setSearchDate("");}} style={{padding:'8px 16px',border:'none',background:'#8B1C2B',color:'#fff',borderRadius:6,cursor:'pointer'}}>Clear</button>
        )}
      </div>
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      <div className="projects-table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Invoice Name</th>
              <th>Project Type</th>
              <th>Category</th>
              <th>Primary Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}>Loading...</td></tr>
            ) : filteredProjects.length === 0 ? (
              <tr><td colSpan={5}>No projects found.</td></tr>
            ) : (
              filteredProjects.map((proj) => (
                <tr key={proj._id} className="project-row" onClick={() => setSelected(proj)} style={{ cursor: "pointer" }}>
                  <td>{proj.projectName}</td>
                  <td>{proj.invoiceName}</td>
                  <td>{proj.projectType}</td>
                  <td>{proj.projectType === "Wedding" ? proj.projectCategory : "-"}</td>
                  <td>{proj.primaryDate ? new Date(proj.primaryDate).toLocaleDateString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for project details */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><X size={22} /></button>
            <h3 className="modal-title">Project Details</h3>
            <div className="modal-section">
              <strong>Project Name:</strong> {selected.projectName}<br/>
              <strong>Invoice Name:</strong> {selected.invoiceName}<br/>
              <strong>Project Type:</strong> {selected.projectType}<br/>
              {selected.projectType === "Wedding" && (
                <><strong>Project Category:</strong> {selected.projectCategory}<br/></>
              )}
              <strong>Primary Date:</strong> {selected.primaryDate ? new Date(selected.primaryDate).toLocaleDateString() : "-"}<br/>
            </div>
            <div className="modal-section">
              <strong>Day-wise Requirements:</strong>
              <ul>
                {selected.dayWiseRequirements && selected.dayWiseRequirements.map((day, idx) => (
                  <li key={idx}>
                    <strong>Date:</strong> {day.date ? new Date(day.date).toLocaleDateString() : "-"}, <strong>Time Shift:</strong> {day.timeShift}<br/>
                    <span style={{fontSize:'0.95em'}}>
                      Crew: Traditional Photographer: {day.traditionalPhotographers}, Traditional Cinematographer: {day.traditionalCinematographers}, Candid Photographer: {day.candidPhotographers}, Candid Cinematographer: {day.candidcinematographers}, Aerial Cinematography: {day.aerialCinematography}, Additional Cinematographers: {day.additionalCinematographers}, Additional Photographers: {day.additionalPhotographers}, Assistant: {day.assistant}, On-Site Editor: {day.onSiteEditor}
                    </span>
                    {day.additionalNotes && (<div><strong>Notes:</strong> {day.additionalNotes}</div>)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-section">
              <strong>Deliverables:</strong>
              <ul>
                {selected.deliverables && selected.deliverables.length > 0 ? (
                  selected.deliverables.map((d, idx) => {
                    let label = "";
                    let status = "Pending";
                    let deadline = "-";
                    // Show all deliverables, including Photo and Video
                    if (typeof d === "object" && d !== null) {
                      label = d.key || d.label || "Deliverable";
                      status = d.status || "Pending";
                      deadline = d.deadline ? new Date(d.deadline).toLocaleDateString() : "-";
                    } else if (typeof d === "string") {
                      label = d.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) { return str.toUpperCase(); });
                    }
                    return (
                      <li key={idx}>
                        <strong>{label}</strong> &mdash; Status: <span style={{color: status === 'pending' ? '#c53030' : '#2d3748'}}>{status}</span>, Deadline: <span style={{color:'#374151'}}>{deadline}</span>
                      </li>
                    );
                  })
                ) : (
                  <li>No deliverables found.</li>
                )}
              </ul>
              {selected.reelCount > 0 && <div>Reel Count: {selected.reelCount}</div>}
              {selected.standardBookCount > 0 && <div>Standard Book Count: {selected.standardBookCount}</div>}
              {selected.premiumBookCount > 0 && <div>Premium Book Count: {selected.premiumBookCount}</div>}
            </div>
            <div className="modal-section">
              <strong>Other Details:</strong>
              <ul>
                {Object.entries(selected).map(([key, value]) => {
                  if (["projectName","invoiceName","projectType","projectCategory","primaryDate","dayWiseRequirements","deliverables","reelCount","standardBookCount","premiumBookCount","_id","__v"].includes(key)) return null;
                  return (
                    <li key={key}><strong>{key}:</strong> {String(value)}</li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProject;
