import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './Navbar';

const ManpowerOverview = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await axios.get("https://lifproject-management.onrender.com/api/projects/all");
        setProjects(res.data || []);
      } catch (err) {
        setError("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '60px', color: '#3182ce', fontSize: '20px' }}>Loading...</div>
  );
  if (error) return (
    <div style={{ textAlign: 'center', marginTop: '60px', color: '#e53e3e', fontSize: '20px' }}>{error}</div>
  );

  return (
    <>
      <Navbar />
      <div style={{  margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#2d3748', fontWeight: 700 }}>Project-wise Manpower Assignments</h2>
        {projects.map((project) => (
          <div key={project._id} style={{ background: '#f7fafc', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '32px', padding: '24px' }}>
            <h3 style={{ color: '#2b6cb0', fontWeight: 600, fontSize: '22px', marginBottom: '10px' }}>📌 {project.projectName} <span style={{ color: '#4a5568', fontWeight: 400 }}>({project.projectType})</span></h3>
            <p style={{ color: '#4a5568', marginBottom: '18px' }}>📅 Primary Date: <b>{new Date(project.primaryDate).toLocaleDateString()}</b></p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {project.dayWiseRequirements.map((day) => (
                <div key={day._id} style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '18px', marginBottom: '10px' }}>
                  <h4 style={{ color: '#3182ce', fontWeight: 500, fontSize: '18px', marginBottom: '8px' }}>🗓️ {new Date(day.date).toLocaleDateString()} - {day.timeShift}</h4>
                  {day.manpower && day.manpower.length > 0 ? (
                    <ul style={{ paddingLeft: '18px', marginBottom: 0 }}>
                      {day.manpower.map((person, idx) => (
                        <li key={idx} style={{ marginBottom: '6px', color: '#2d3748', fontSize: '15px' }}>
                          <span style={{ fontWeight: 500 }}>Role:</span> <b>{person.role}</b> &nbsp;|&nbsp; <span style={{ fontWeight: 500 }}>EID:</span> <b>{person.eid}</b> &nbsp;|&nbsp; <span style={{ fontWeight: 500 }}>Slot:</span> {person.slotIndex}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic', fontSize: '15px' }}>No manpower assigned yet.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManpowerOverview;
