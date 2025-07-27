
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Client() {
  const [projects, setProjects] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");
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
  const allFilled = searchName && searchInvoice;
  const filteredProjects = searchTriggered && allFilled
    ? projects.filter(p => {
        // Require exact match, case-insensitive
        const nameMatch = p.projectName?.toLowerCase() === searchName.toLowerCase();
        const invoiceMatch = p.invoiceName?.toLowerCase() === searchInvoice.toLowerCase();
        return nameMatch && invoiceMatch;
      })
    : [];

  function formatDMY(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#8B1C2B', fontWeight: 700 }}>Project Search</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Project Name"
          value={searchName}
          onChange={e => { setSearchName(e.target.value); setSearchTriggered(false); }}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, minWidth: 180 }}
        />
        <input
          type="text"
          placeholder="Invoice Name"
          value={searchInvoice}
          onChange={e => { setSearchInvoice(e.target.value); setSearchTriggered(false); }}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, minWidth: 180 }}
        />
        <button
          onClick={() => setSearchTriggered(true)}
          disabled={!allFilled}
          style={{ padding: '8px 16px', border: 'none', background: allFilled ? '#8B1C2B' : '#ccc', color: '#fff', borderRadius: 6, cursor: allFilled ? 'pointer' : 'not-allowed' }}
        >Search</button>
        {(searchName || searchInvoice) && (
          <button onClick={() => { setSearchName(""); setSearchInvoice(""); setSearchTriggered(false); }} style={{ padding: '8px 16px', border: 'none', background: '#8B1C2B', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Clear</button>
        )}
      </div>
      {loading && <p style={{ color: '#3182ce', textAlign: 'center' }}>Loading...</p>}
      {error && <p style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</p>}
      <div style={{ marginTop: 24 }}>
        {searchTriggered && allFilled ? (
          filteredProjects.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No projects found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#fbeaec', color: '#8B1C2B' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Project Name</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Type</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Invoice Name</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Project Stage</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Deliverable</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Deadline</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #f8d7dc' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(proj => (
                  proj.deliverables.map((del, idx) => (
                    <tr key={proj._id + '-' + idx} style={{ borderBottom: '1px solid #f8d7dc' }}>
                      <td style={{ padding: '10px' }}>{proj.projectName}</td>
                      <td style={{ padding: '10px' }}>{proj.projectType}</td>
                      <td style={{ padding: '10px' }}>{proj.invoiceName}</td>
                      <td style={{ padding: '10px' }}>{proj.projectStage || '-'}</td>
                      <td style={{ padding: '10px' }}>{del.key}</td>
                      <td style={{ padding: '10px' }}>{formatDMY(del.deadline)}</td>
                      <td style={{ padding: '10px', color: del.status === 'complete' ? '#2ecc71' : del.status === 'pending' ? '#8B1C2B' : del.status === 'client review' ? '#f39c12' : '#95a5a6' }}>{del.status}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          )
        ) : null}
      </div>
    </div>
  );
}
