
import React, { useState, useEffect } from 'react';
import '../styles/Client.css';
import axios from 'axios';
import Navbar from './Navbar';

export default function Client() {
  const [projects, setProjects] = useState([]);
  const [searchInvoiceName, setSearchInvoiceName] = useState("");
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

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

  // Only show results after Search button is clicked and both fields are filled
  const allFilled = searchInvoiceName && searchInvoiceNumber;
  const filteredProjects = searchTriggered && allFilled
    ? projects.filter(p => {
        // Require exact match, case-insensitive
        const invoiceNameMatch = p.invoiceName?.toLowerCase() === searchInvoiceName.toLowerCase();
        const invoiceNumberMatch = (p.invoiceNumber || '').toLowerCase() === searchInvoiceNumber.toLowerCase();
        return invoiceNameMatch && invoiceNumberMatch;
      })
    : [];

  function formatDMY(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  return (
    <> 
      <div className="client-container">
        <h2 className="client-title" style={{ color: '#8B1C2B', textAlign: 'center', fontWeight: 700, marginBottom: 8 }}>Client Project Search</h2>
        <p style={{ textAlign: 'center', color: '#4a5568', marginBottom: 24, fontSize: 16 }}>Search for your project using Invoice Name and Invoice Number</p>
        <div className="client-flex">
          <input
            type="text"
            placeholder="Invoice Name"
            value={searchInvoiceName}
            onChange={e => { setSearchInvoiceName(e.target.value); setSearchTriggered(false); }}
            className="client-input"
          />
          <input
            type="text"
            placeholder="Invoice Number"
            value={searchInvoiceNumber}
            onChange={e => { setSearchInvoiceNumber(e.target.value); setSearchTriggered(false); }}
            className="client-input"
          />
          <button
            onClick={() => setSearchTriggered(true)}
            disabled={!allFilled}
            className="client-btn"
            style={{ background: allFilled ? '#8B1C2B' : '#ccc', cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >Search</button>
          {(searchInvoiceName || searchInvoiceNumber) && (
            <button onClick={() => { setSearchInvoiceName(""); setSearchInvoiceNumber(""); setSearchTriggered(false); }} className="client-btn-clear">Clear</button>
          )}
        </div>
        {loading && <p className="client-loading" style={{ color: '#3182ce', textAlign: 'center', fontWeight: 500 }}>Loading...</p>}
        {error && <p className="client-error" style={{ color: '#e53e3e', textAlign: 'center', fontWeight: 500 }}>{error}</p>}
    <div className="client-results">
          {searchTriggered && allFilled ? (
            filteredProjects.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', fontSize: 16 }}>No projects found.</p>
            ) : (
              <>
                <h3 style={{ color: '#8B1C2B', textAlign: 'center', marginBottom: 12, fontWeight: 600 }}>Project Results</h3>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table className="client-table">
                    <thead>
                      <tr className="client-table-header">
                        <th className="client-th">Project Name</th>
                        <th className="client-th">Type</th>
                        <th className="client-th">Invoice Name</th>
                        <th className="client-th">Project Stage</th>
                        <th className="client-th">Deliverable</th>
                        <th className="client-th">Deadline</th>
                        <th className="client-th">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(proj => (
                        proj.deliverables.map((del, idx) => (
                          <tr key={proj._id + '-' + idx} className="client-table-row">
                            <td className="client-td">{proj.projectName}</td>
                            <td className="client-td">{proj.projectType}</td>
                            <td className="client-td">{proj.invoiceName}</td>
                            <td className="client-td">{proj.projectStage || '-'}</td>
                            <td className="client-td">{del.key}</td>
                            <td className="client-td">{formatDMY(del.deadline)}</td>
                            <td className="client-td" style={{ color: del.status === 'complete' ? '#2ecc71' : del.status === 'pending' ? '#8B1C2B' : del.status === 'client review' ? '#f39c12' : '#95a5a6', fontWeight: 600 }}>{del.status}</td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
