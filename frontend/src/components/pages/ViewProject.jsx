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

  // Gather all unique deliverable keys across all projects
  const allDeliverableKeys = Array.from(new Set(projects.flatMap(p => (p.deliverables || []).map(d => d.key))));

  // Color maps
  const stageColors = {
    incomplete: '#e53e3e',
    'in progress': '#ed8936',
    review: '#3182ce',
    completed: '#38a169',
  };
  const deliverableColors = {
    pending: '#e53e3e',
    complete: '#38a169',
    'client review': '#ed8936',
    closed: '#3182ce',
  };

  return (
    <>
      <Navbar />
      <div style={{ margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#2d3748', fontWeight: 700 }}>Project Overview</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f7fafc' }}>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Project Name</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Type</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Invoice Name</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Invoice #</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Mobile</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Primary Date</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Category</th>
                <th style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>Stage</th>
                {allDeliverableKeys.map(key => (
                  <th key={key} style={{ padding: '6px 4px', border: '1px solid #e2e8f0' }}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id} style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{project.projectName}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>{project.projectType}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>{project.invoiceName}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>{project.invoiceNumber || '-'}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>{project.mobileNumber || '-'}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>{project.primaryDate ? new Date(project.primaryDate).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>{project.projectCategory || '-'}</td>
                  <td style={{ padding: '5px 3px', border: '1px solid #e2e8f0' }}>
                    <span style={{ background: stageColors[project.projectStage] || '#e2e8f0', color: '#fff', borderRadius: 6, padding: '2px 7px', fontWeight: 600, fontSize: 11 }}>
                      {project.projectStage}
                    </span>
                  </td>
                  {allDeliverableKeys.map(key => {
                    const deliverable = (project.deliverables || []).find(d => d.key === key);
                    return (
                      <td key={key} style={{ padding: '5px 3px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        {deliverable ? (
                          <span style={{ background: deliverableColors[deliverable.status] || '#e2e8f0', color: '#fff', borderRadius: 6, padding: '2px 7px', fontWeight: 600, fontSize: 11 }}>
                            {deliverable.status}
                          </span>
                        ) : (
                          <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManpowerOverview;
