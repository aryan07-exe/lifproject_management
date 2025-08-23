
import React, { useState } from 'react';
import '../styles/Client.css';

function formatDMY(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
}

export default function ClientResult({ project }) {
  const [openIndex, setOpenIndex] = useState(null);

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

        {/* Deliverables Section (accordion) */}
        <div style={{ borderTop: '1px solid #eee', padding: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 16px', fontWeight: 600, fontSize: 18 }}>Deliverables</h3>

          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {(project.deliverables || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: '#666', background: '#f9f9f9', borderRadius: 8, fontSize: 15 }}>No deliverables found</div>
            ) : (
              (project.deliverables || []).map((del, idx) => (
                <div key={del._id || idx} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e9e9e9', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    aria-expanded={openIndex === idx}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: openIndex === idx ? '#faf7f8' : '#fff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 6, background: '#8B1C2B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{(del.key || '').charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{del.key}</div>
                        {del.description ? <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{del.description}</div> : null}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, padding: '6px 10px', borderRadius: 6, background: del.status === 'complete' ? '#e6f4ea' : del.status === 'pending' ? '#fff2f2' : '#fff7e6', color: del.status === 'complete' ? '#1b873b' : '#c62828' }}>{del.status}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>{openIndex === idx ? '▴' : '▾'}</div>
                    </div>
                  </button>

                  {openIndex === idx && (
                    <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ marginBottom: 8, color: '#444' }}><strong>Deadline:</strong> <span style={{color:'#333', marginLeft:6}}>{formatDMY(del.deadline)}</span></div>
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 8 }}>Comments</div>
                        {(!del.comments || del.comments.length === 0) ? (
                          <div style={{ fontSize: 13, color: '#666', fontStyle: 'italic' }}>No comments yet.</div>
                        ) : (
                          (del.comments || []).map((c, ci) => (
                            <div key={ci} style={{ background: '#fafafa', padding: 10, borderRadius: 6, marginBottom: 8 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{c.author || 'Unknown'}</div>
                              <div style={{ fontSize: 13, color: '#333', marginTop: 6 }}>{c.text}</div>
                              <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
