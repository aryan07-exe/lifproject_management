
import React, { useState, useEffect } from 'react';
import '../styles/Client.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Client() {
  const [projects, setProjects] = useState([]);
  const [searchPrimaryDate, setSearchPrimaryDate] = useState("");
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

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

  // Only show results after submit, not before
  const allFilled = searchPrimaryDate && searchInvoiceNumber;
  const filteredProjects = allFilled
    ? projects.filter(p => {
        const primaryDateMatch = p.primaryDate && p.primaryDate.slice(0,10) === searchPrimaryDate;
        const invoiceNumberMatch = (p.invoiceNumber || '').toLowerCase() === searchInvoiceNumber.toLowerCase();
        return primaryDateMatch && invoiceNumberMatch;
      })
    : [];

  // No need for formatDMY here

  const handleLogin = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    if (allFilled) {
      const project = filteredProjects[0];
      if (project) {
        navigate('/client-result', { state: { project } });
      } else {
        setError('No project found with the provided details.');
      }
    } else {
      setError('Please fill both fields.');
    }
  };

  return (
    <div className="client-login-outer" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff 60%, #f8e6e9 100%)', padding: '0 8px' }}>
      <div className="client-login-box" style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(139,28,43,0.10)', padding: 24, margin: '0 auto' }}>
        <h2 className="client-title" style={{ color: '#8B1C2B', textAlign: 'center', fontWeight: 800, marginBottom: 18, fontSize: 28, letterSpacing: 1 }}>Client Login</h2>
        <form className="client-login-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleLogin}>
          <label style={{ fontWeight: 600, color: '#8B1C2B', marginBottom: 4, fontSize: 15 }}>Primary Date</label>
          <input
            type="date"
            value={searchPrimaryDate}
            onChange={e => { setSearchPrimaryDate(e.target.value); setError(""); setSubmitted(false); }}
            className="client-input"
            style={{ fontSize: 17, padding: 13, borderRadius: 8, border: '1.5px solid #8B1C2B', marginBottom: 10, background: '#fafbfc' }}
          />
          <label style={{ fontWeight: 600, color: '#8B1C2B', marginBottom: 4, fontSize: 15 }}>Invoice Number</label>
          <input
            type="text"
            placeholder="Enter Invoice Number"
            value={searchInvoiceNumber}
            onChange={e => { setSearchInvoiceNumber(e.target.value); setError(""); setSubmitted(false); }}
            className="client-input"
            style={{ fontSize: 17, padding: 13, borderRadius: 8, border: '1.5px solid #8B1C2B', marginBottom: 10, background: '#fafbfc' }}
          />
          <button
            type="submit"
            className="client-btn"
            style={{ background: allFilled ? '#8B1C2B' : '#ccc', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: 13, border: 'none', marginTop: 10, boxShadow: allFilled ? '0 2px 8px #8B1C2B22' : 'none', transition: 'background 0.2s' }}
          >Login</button>
          {(searchPrimaryDate || searchInvoiceNumber) && (
            <button type="button" onClick={() => { setSearchPrimaryDate(""); setSearchInvoiceNumber(""); setError(""); setSubmitted(false); }} className="client-btn-clear" style={{ fontSize: 15, marginTop: 0, color: '#8B1C2B', background: 'none', border: 'none', textDecoration: 'underline', alignSelf: 'flex-end' }}>Clear</button>
          )}
        </form>
        {loading && <p className="client-loading" style={{ color: '#3182ce', textAlign: 'center', fontWeight: 500, marginTop: 16 }}>Loading...</p>}
        {submitted && error && <p className="client-error" style={{ color: '#e53e3e', textAlign: 'center', fontWeight: 600, marginTop: 16, fontSize: 16 }}>{error}</p>}
      </div>
    </div>
  );
}
