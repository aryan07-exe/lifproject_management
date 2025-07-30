import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function AssignManpowerPage() {
  const [projects, setProjects] = useState([]);
  const [manpowerList, setManpowerList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState('');

  const roles = [
    'traditionalPhotographers',
    'traditionalCinematographers',
    'candidPhotographers',
    'candidcinematographers',
    'additionalCinematographers',
    'additionalPhotographers',
    'assistant',
    'onSiteEditor',
    'aerialCinematography'
  ];

  // Fetch all projects
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
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

  // Fetch all manpower
  useEffect(() => {
    async function fetchManpower() {
      setLoading(true);
      try {
        const res = await axios.get(" https://lifproject-management.onrender.com/api/manpower/all");
        setManpowerList(res.data || []);
      } catch (err) {
        setError("Failed to fetch manpower.");
      } finally {
        setLoading(false);
      }
    }
    fetchManpower();
  }, []);

  const selectedProject = projects.find(p => p._id === selectedProjectId);
  const dayOptions = selectedProject?.dayWiseRequirements || [];

  // assignments: { [dayId]: { [role]: [ {eid}, ... ] } }
  const handleAssignmentChange = (dayId, role, index, eid) => {
    setAssignments(prev => {
      const prevDay = prev[dayId] || {};
      const updatedRoleAssignments = [...(prevDay[role] || [])];
      updatedRoleAssignments[index] = { eid };
      return { ...prev, [dayId]: { ...prevDay, [role]: updatedRoleAssignments } };
    });
  };

  const roleMap = {
    traditionalPhotographers: 'traditionalPhotographer',
    traditionalCinematographers: 'traditionalCinematographer',
    candidPhotographers: 'candidPhotographer',
    candidcinematographers: 'candidCinematographer',
    additionalCinematographers: 'additionalCinematographer',
    additionalPhotographers: 'additionalPhotographer',
    assistant: 'assistant',
    onSiteEditor: 'onSiteEditor',
    aerialCinematography: 'aerialCinematography'
  };

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      alert("Please select a project.");
      return;
    }
    try {
      await Promise.all(dayOptions.map(day => {
        const dayAssignments = [];
        const rolesObj = assignments[day._id] || {};
        Object.entries(rolesObj).forEach(([role, arr]) => {
          arr.forEach((obj, idx) => {
            if (obj && obj.eid) {
              dayAssignments.push({
                role: roleMap[role] || role,
                eid: obj.eid,
                slotIndex: idx
              });
            }
          });
        });
        return axios.put(
          `https://lifproject-management.onrender.com/api/manpower/${selectedProjectId}/day/${day._id}/assign-manpower`,
          { manPowerassignments: dayAssignments }
        );
      }));
      setSubmitMessage('Assignments submitted successfully!');
    } catch (err) {
      setSubmitMessage('Failed to assign manpower.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#2d3748', fontWeight: 700 }}>Assign Manpower</h2>

        {loading && <p style={{ color: '#3182ce', textAlign: 'center' }}>Loading...</p>}
        {error && <p style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</p>}

        <div style={{ marginBottom: '32px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>Select Project</label>
          <select
            value={selectedProjectId}
            onChange={e => {
              setSelectedProjectId(e.target.value);
              setAssignments({});
              setSubmitMessage('');
            }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px', background: '#f7fafc' }}
          >
            <option value="">-- Select --</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.projectName}</option>
            ))}
          </select>
        </div>

        {selectedProject && dayOptions.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {dayOptions.map((day, dayIdx) => (
              <div key={day._id} style={{ marginBottom: 32, border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, background: '#f7fafc' }}>
                <h4 style={{ color: '#8B1C2B', fontWeight: 600, marginBottom: 12 }}>Day {dayIdx + 1}: {new Date(day.date).toLocaleDateString()} ({day.timeShift})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                  {roles.map(role => {
                    const count = day[role] || 0;
                    if (count === 0) return null;
                    return (
                      <div key={role} style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <strong style={{ color: '#2d3748', fontSize: '17px', marginBottom: '10px', display: 'block' }}>{role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                        {[...Array(count)].map((_, slotIndex) => (
                          <div key={slotIndex} style={{ marginTop: '8px' }}>
                            <select
                              onChange={e => handleAssignmentChange(day._id, role, slotIndex, e.target.value)}
                              value={assignments[day._id]?.[role]?.[slotIndex]?.eid || ''}
                              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', background: '#fff', marginBottom: '4px' }}
                            >
                              <option value="">-- Assign --</option>
                              {manpowerList.map(mp => {
                                let isAssigned = false;
                                for (const p of projects) {
                                  for (const d of p.dayWiseRequirements || []) {
                                    if (d.date && day.date) {
                                      if (new Date(d.date).toISOString().slice(0,10) === new Date(day.date).toISOString().slice(0,10)) {
                                        for (const m of d.manpower || []) {
                                          if (m.eid === mp.eid) {
                                            isAssigned = true;
                                            break;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                return (
                                  <option key={mp.eid} value={mp.eid} disabled={isAssigned}>
                                    {mp.name} ({mp.role}) - {mp.eid}{isAssigned ? ' (Already assigned)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: '#3182ce', color: '#fff', fontWeight: 600, fontSize: '18px', border: 'none', cursor: 'pointer', marginTop: '32px', boxShadow: '0 2px 8px rgba(49,130,206,0.08)' }}>
              Submit Assignments
            </button>
            {submitMessage && <p style={{ textAlign: 'center', color: submitMessage.includes('success') ? '#38a169' : '#e53e3e', marginTop: '18px', fontWeight: 500 }}>{submitMessage}</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default AssignManpowerPage;
