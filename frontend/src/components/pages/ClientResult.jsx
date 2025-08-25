
import React, { useState, useEffect } from 'react';
import '../styles/Client.css';
import axios from 'axios';

function formatDMY(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
}

export default function ClientResult({ project }) {
  const [openIndex, setOpenIndex] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL || 'https://lifproject-management.onrender.com';
  const [localDeliverables, setLocalDeliverables] = useState((project && project.deliverables) ? project.deliverables : []);
  const [commentInputs, setCommentInputs] = useState({});
  const [adding, setAdding] = useState({});
  const compactMode = (project && project.deliverables && project.deliverables.length > 12);

  useEffect(() => {
    setLocalDeliverables((project && project.deliverables) ? project.deliverables : []);
  }, [project]);

  const handleToggle = async (deliverable, idx) => {
    // close if already open
    if (openIndex === idx) {
      setOpenIndex(null);
      return;
    }
    // fetch latest comments before opening
    if (!project?.invoiceNumber) {
      setOpenIndex(idx);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/api/comments/invoice/${encodeURIComponent(project.invoiceNumber)}/deliverable/${deliverable._id}`);
      const comments = res.data && res.data.comments ? res.data.comments : [];
      setLocalDeliverables(prev => {
        const copy = [...prev];
        if (copy[idx]) copy[idx] = { ...copy[idx], comments };
        return copy;
      });
    } catch (err) {
      console.error('Failed to load comments for deliverable', err?.response || err);
    } finally {
      setOpenIndex(idx);
    }
  };

  if (!project) return <div className="client-page" style={{alignItems:'center'}}><div style={{textAlign:'center', paddingTop:120, fontSize:18, color:'#8B1C2B', fontWeight:600}}>No project found.</div></div>;

  return (
    <div className={"client-page root-font " + (compactMode ? 'compact' : '')}>
      <div className="client-project-details">
        <div className="client-project-header">
          <h2>Project Details</h2>
        </div>

        <div className="project-info-section">
          <div className="project-info-grid">
            <div className="project-info-card">
              <span>Project Name</span>
              <div className="value">{project.projectName || '-'}</div>
            </div>
            <div className="project-info-card">
              <span>Type</span>
              <div className="value">{project.projectType || '-'}</div>
            </div>
            <div className="project-info-card">
              <span>Primary Date</span>
              <div className="value">{formatDMY(project.primaryDate)}</div>
            </div>
            <div className="project-info-card">
              <span>Project Stage</span>
              <div className="value">{project.projectStage || '-'}</div>
            </div>
          </div>
        </div>

        <div className="deliverables-section">
          <h3 style={{ margin: 0, marginBottom: 12 }}>Deliverables</h3>

          <div className="deliverables-grid">
            {(localDeliverables || []).length === 0 ? (
              <div className="project-info-card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>No deliverables found</div>
            ) : (
              (localDeliverables || []).map((del, idx) => (
                <div key={del._id || idx} className="deliverable-card">
                  <button className="deliverable-header" onClick={() => handleToggle(del, idx)} aria-expanded={openIndex === idx}>
                    <div className="deliverable-title">
                      <div className="badge">{(del.key || '').charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{del.key}</div>
                        {del.description ? <div className="muted small" style={{ marginTop: 6 }}>{del.description}</div> : null}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="deliverable-status" style={{ background: del.status === 'complete' ? '#e6f4ea' : del.status === 'pending' ? '#fff2f2' : '#fff7e6', color: del.status === 'complete' ? '#1b873b' : '#c62828' }}>{del.status}</div>
                      <div className="muted">{openIndex === idx ? '▴' : '▾'}</div>
                    </div>
                  </button>

                  {openIndex === idx && (
                    <div className="deliverable-body">
                      <div style={{ marginBottom: 8 }}><strong>Deadline:</strong> <span className="muted" style={{ marginLeft: 6 }}>{formatDMY(del.deadline)}</span></div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 8 }}>Comments</div>
                        {(!del.comments || del.comments.length === 0) ? (
                          <div className="muted" style={{ fontStyle: 'italic' }}>No comments yet.</div>
                        ) : (
                          <div className={"comments-list " + ((del.comments || []).length > 4 ? 'scrollable' : '')}>
                            {(del.comments || []).map((c, ci) => (
                              <div key={c._id || ci} className="comment">
                                <div className="comment-author">{c.author || 'Unknown'}</div>
                                <div className="comment-text">{c.text}</div>
                                <div className="comment-time">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="comment-input-wrap">
                          <textarea
                            className="comment-textarea"
                            value={commentInputs[del._id] || ''}
                            onChange={e => setCommentInputs(prev => ({ ...prev, [del._id]: e.target.value }))}
                            placeholder="Write a comment..."
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button className="btn-primary" onClick={async () => {
                                const text = (commentInputs[del._id] || '').trim();
                                if (!text) return alert('Please enter a comment');
                                if (!project?.invoiceNumber) return alert('Invoice number missing');
                                if (adding[del._id]) return;
                                try {
                                  setAdding(prev => ({ ...prev, [del._id]: true }));
                                  await axios.post(`${API_BASE}/api/comments/invoice/${encodeURIComponent(project.invoiceNumber)}/deliverable/${del._id}`, { text, author: (project.clientName || project.projectName || 'Guest') });
                                  // refresh comments for this deliverable
                                  const res = await axios.get(`${API_BASE}/api/comments/invoice/${encodeURIComponent(project.invoiceNumber)}/deliverable/${del._id}`);
                                  const comments = res.data && res.data.comments ? res.data.comments : [];
                                  setLocalDeliverables(prev => {
                                    const copy = [...prev];
                                    if (copy[idx]) copy[idx] = { ...copy[idx], comments };
                                    return copy;
                                  });
                                  setCommentInputs(prev => ({ ...prev, [del._id]: '' }));
                                  setOpenIndex(idx);
                                } catch (err) {
                                  console.error('Add comment failed', err?.response || err);
                                  alert('Failed to add comment: ' + (err?.response?.data?.message || err?.message || 'unknown'));
                                } finally {
                                  setAdding(prev => ({ ...prev, [del._id]: false }));
                                }
                              }} disabled={!!adding[del._id]}>
                                {adding[del._id] ? 'Adding...' : 'Add'}
                            </button>
                          </div>
                        </div>
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
