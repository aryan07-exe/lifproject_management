import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeAssignments = ({ eid }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await axios.get(`http://localhost:5000/api/manpower/assignments/${eid}`);
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to load assignments", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, [eid]);

  if (loading) return <p>Loading...</p>;
  if (assignments.length === 0) return <p>No assignments found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Assignments for EID: {eid}</h2>
      {assignments.map((a, i) => (
        <div key={i} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
          <p><strong>Project:</strong> {a.projectName} ({a.projectType})</p>
          <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()} ({a.timeShift})</p>
          <p><strong>Role:</strong> {a.role} | Slot: {a.slotIndex}</p>
        </div>
      ))}
    </div>
  );
};

export default EmployeeAssignments;
