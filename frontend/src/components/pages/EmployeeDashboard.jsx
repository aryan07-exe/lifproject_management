import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const EmployeeAssignmentLookup = () => {
  const [eid, setEid] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eid.trim()) return;

    setLoading(true);
    setError('');
    setSubmitted(true);

    try {
      const res = await axios.get(
        `https://lifproject-management.onrender.com/api/manpower/assignments/${eid.trim()}`
      );
      setAssignments(res.data || []);
    } catch (err) {
      setError('Failed to fetch assignments. Please check your EID or try again later.');
      console.error(err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <Navbar />
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>🔍 View Assigned Projects</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Enter your Employee ID"
          value={eid}
          onChange={(e) => setEid(e.target.value)}
          style={{
            padding: '10px',
            width: '70%',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {loading && <p>Loading assignments...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && submitted && assignments.length === 0 && !error && (
        <p>No assignments found for EID: <strong>{eid}</strong></p>
      )}

      {!loading && assignments.length > 0 && (
        <div>
          <h3>📋 Assignments for EID: {eid}</h3>
          {assignments.map((a, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '15px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}
            >
              <p><strong>Project Name:</strong> {a.projectName}</p>
              <p><strong>Project Type:</strong> {a.projectType}</p>
              <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
              <p><strong>Time Shift:</strong> {a.timeShift}</p>
              <p><strong>Role:</strong> {a.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
</>  );
};

export default EmployeeAssignmentLookup;
