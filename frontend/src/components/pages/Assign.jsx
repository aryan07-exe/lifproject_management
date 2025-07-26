import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AssignManpowerPage() {
  const [projects, setProjects] = useState([]);
  const [manpowerList, setManpowerList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedDayId, setSelectedDayId] = useState('');
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

  const handleAssignmentChange = (role, index, eid) => {
    setAssignments(prev => {
      const updatedRoleAssignments = [...(prev[role] || [])];
      updatedRoleAssignments[index] = { eid };
      return { ...prev, [role]: updatedRoleAssignments };
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
    if (!selectedProjectId || !selectedDayId) {
      alert("Please select project and day.");
      return;
    }

    // Convert assignments object to array of {role, eid, slotIndex} with correct role names
    const assignmentArray = [];
    Object.entries(assignments).forEach(([role, arr]) => {
      arr.forEach((obj, idx) => {
        if (obj && obj.eid) {
          assignmentArray.push({
            role: roleMap[role] || role,
            eid: obj.eid,
            slotIndex: idx
          });
        }
      });
    });

    try {
      const res = await axios.put(
        ` https://lifproject-management.onrender.com/api/manpower/${selectedProjectId}/day/${selectedDayId}/assign-manpower`,
        { manPowerassignments: assignmentArray }
      );
      setSubmitMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setSubmitMessage("Failed to assign manpower.");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#2d3748', fontWeight: 700 }}>Assign Manpower</h2>

      {loading && <p style={{ color: '#3182ce', textAlign: 'center' }}>Loading...</p>}
      {error && <p style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', justifyContent: 'center' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>Select Project</label>
          <select
            value={selectedProjectId}
            onChange={e => {
              setSelectedProjectId(e.target.value);
              setSelectedDayId('');
              setAssignments({});
              setSubmitMessage('');
            }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px', background: '#f7fafc' }}
          >
            <option value="">-- Select --</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>
                {p.projectName}
              </option>
            ))}
          </select>
        </div>

        {dayOptions.length > 0 && (
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, color: '#4a5568' }}>Select Day</label>
            <select
              value={selectedDayId}
              onChange={e => {
                setSelectedDayId(e.target.value);
                setAssignments({});
                setSubmitMessage('');
              }}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px', background: '#f7fafc' }}
            >
              <option value="">-- Select --</option>
              {dayOptions.map(d => (
                <option key={d._id} value={d._id}>
                  {new Date(d.date).toLocaleDateString()} ({d.timeShift})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedDayId && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ color: '#2b6cb0', fontWeight: 600, marginBottom: '18px', textAlign: 'center' }}>Assign Manpower for Each Role</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {roles.map(role => {
              const count = selectedProject?.dayWiseRequirements?.find(d => d._id === selectedDayId)?.[role] || 0;
              if (count === 0) return null;

              return (
                <div key={role} style={{ background: '#f7fafc', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <strong style={{ color: '#2d3748', fontSize: '17px', marginBottom: '10px', display: 'block' }}>{role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                  {[...Array(count)].map((_, i) => (
                    <div key={i} style={{ marginTop: '8px' }}>
                      <select
                        onChange={e => handleAssignmentChange(role, i, e.target.value)}
                        defaultValue=""
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', background: '#fff', marginBottom: '4px' }}
                      >
                        <option value="">-- Assign --</option>
                        {manpowerList.map(mp => (
                          <option key={mp.eid} value={mp.eid}>
                            {mp.name} ({mp.role}) - {mp.eid}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: '#3182ce', color: '#fff', fontWeight: 600, fontSize: '18px', border: 'none', cursor: 'pointer', marginTop: '32px', boxShadow: '0 2px 8px rgba(49,130,206,0.08)' }}>
            Submit Assignments
          </button>
          {submitMessage && <p style={{ textAlign: 'center', color: submitMessage.includes('success') ? '#38a169' : '#e53e3e', marginTop: '18px', fontWeight: 500 }}>{submitMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default AssignManpowerPage;
