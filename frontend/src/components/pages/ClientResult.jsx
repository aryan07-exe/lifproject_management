
import React from 'react';
import '../styles/Client.css';

function formatDMY(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
}

export default function ClientResult({ project }) {
  if (!project) return <div style={{textAlign:'center', paddingTop:'20vh', fontSize:18, color:'#8B1C2B', fontWeight:600}}>No project found.</div>;
  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px 12px' }}>
      <div className="client-project-details" style={{ 
        width: '100%', 
        maxWidth: '90vw',
        border: 'none', 
        borderRadius: 12, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)', 
        background: '#fff', 
        margin: '16px auto',
        '@media (min-width: 768px)': {
          maxWidth: '80vw'
        },
        '@media (min-width: 1024px)': {
          maxWidth: '1200px'
        }
      }}>
        {/* Header */}
        <div style={{ background: '#8B1C2B', padding: '20px 24px', borderRadius: '12px 12px 0 0' }}>
          <h2 style={{ color: '#fff', textAlign: 'center', margin: 0, fontWeight: 600, fontSize: 22 }}>Project Details</h2>
        </div>
        
        {/* Project Info */}
        <div style={{ padding: '24px 20px' }}>
          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            <div style={{ 
              padding: '16px 20px', 
              background: '#fff', 
              border: '1px solid #eee', 
              borderRadius: 8,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: '#666' }}>Project Name</span>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#333', marginTop: 4 }}>{project.projectName || '-'}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: '#666' }}>Type</span>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#333', marginTop: 4 }}>{project.projectType || '-'}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: '#666' }}>Primary Date</span>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#333', marginTop: 4 }}>{formatDMY(project.primaryDate)}</div>
              </div>
              <div>
                <span style={{ fontSize: 15, color: '#666' }}>Project Stage</span>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#333', marginTop: 4 }}>{project.projectStage || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Section */}
        <div style={{ borderTop: '1px solid #eee', padding: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 16px', fontWeight: 600, fontSize: 18 }}>Deliverables</h3>
          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {(project.deliverables || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: '#666', background: '#f9f9f9', borderRadius: 8, fontSize: 15 }}>No deliverables found</div>
            ) : (
              project.deliverables.map((del, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: '#fff',
                  borderRadius: 8,
                  padding: '14px 16px',
                  border: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#333', fontSize: 16, flex: 1 }}>{del.key}</span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: 4,
                      background: del.status === 'complete' ? '#e6f4ea' : del.status === 'pending' ? '#fbe9e7' : del.status === 'client review' ? '#fff3e0' : '#f5f5f5',
                      color: del.status === 'complete' ? '#1b873b' : del.status === 'pending' ? '#c62828' : del.status === 'client review' ? '#e65100' : '#666',
                      fontWeight: 600,
                      fontSize: 13,
                      lineHeight: '20px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>{del.status}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#666' }}>Deadline: <span style={{color: '#333'}}>{formatDMY(del.deadline)}</span></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
