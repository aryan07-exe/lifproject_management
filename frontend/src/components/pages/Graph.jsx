import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Graph = ({ project: propProject }) => {
  const API_BASE = 'https://lifproject-management.onrender.com'|| 'http://localhost:5000';
  const { invoiceNumber } = useParams();
  const [project, setProject] = useState(propProject || null);
  const [loading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState(null);

  const stages = ['incomplete', 'in progress', 'review', 'completed'];
  const stageLabel = s => (s ? s.toString().replace(/(^|\s)\S/g, t => t.toUpperCase()) : s);
  const truncate = (str, n = 80) => {
    if (!str) return '';
    return str.length > n ? str.slice(0, n - 1) + '\u2026' : str;
  };

  useEffect(() => {
  if (propProject) return;
  if (!invoiceNumber) return;

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
  const res = await axios.get(`${API_BASE}/api/projects/all`);
        if (!mounted) return;
        const all = res.data || [];
        const found = all.find(p => (p.invoiceNumber && p.invoiceNumber.toString() === invoiceNumber.toString()) || (p.invoiceName && p.invoiceName.toString() === invoiceNumber.toString()));
        if (found) setProject(found);
      } catch (err) {
  // ignore errors for now
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [invoiceNumber, propProject]);

  // Fetch projects list for search/autocomplete once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects/all`);
        if (!mounted) return;
        setAllProjects(res.data || []);
      } catch (err) {
        // ignore silently
      }
    })();
    return () => { mounted = false; };
  }, []);

  // update suggestions when query changes
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = (allProjects || []).filter(p => (p.projectName || '').toLowerCase().includes(q) || (p.invoiceNumber || '').toString().toLowerCase().includes(q) || (p.invoiceName || '').toLowerCase().includes(q));
    setSuggestions(matches.slice(0, 8));
  }, [query, allProjects]);

  const selectProject = async (s) => {
    try {
      const res = await axios.get(`${API_BASE}/api/projects/all`);
      const all = res.data || [];
      const found = all.find(p => (s._id && p._id === s._id) || (s.invoiceNumber && p.invoiceNumber === s.invoiceNumber));
      setProject(found || s);
    } catch (err) {
      setProject(s);
    } finally {
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchEnter = async () => {
    if (!query) return;
    // prefer first suggestion
    if (suggestions.length > 0) {
      await selectProject(suggestions[0]);
      return;
    }
    // try exact match by invoiceNumber or projectName
    const q = query.trim().toLowerCase();
    const exact = (allProjects || []).find(p => (p.invoiceNumber || '').toString().toLowerCase() === q || (p.projectName || '').toLowerCase() === q || (p.invoiceName || '').toLowerCase() === q);
    if (exact) {
      await selectProject(exact);
      return;
    }
    // nothing matched: clear suggestions
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const currentStageName = (project && project.projectStage) ? project.projectStage : null;
  const findStageIndex = (name) => {
    if (!name) return -1;
    const lowered = name.toString().toLowerCase();
    const idx = stages.findIndex(s => s.toLowerCase() === lowered);
    if (idx !== -1) return idx;
    // fallback: try partial match
    return stages.findIndex(s => lowered.includes(s.toLowerCase()) || s.toLowerCase().includes(lowered));
  };

  const currentIndex = findStageIndex(currentStageName);
  const percent = currentIndex >= 0 ? Math.round((currentIndex / Math.max(1, stages.length - 1)) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <style>{`
        .roadmap-wrap { width: 100%; height: 100%; min-height: calc(100vh - 40px); margin: 0 auto; background: #fff; padding: 24px; box-shadow: 0 1px 3px rgba(12,12,12,0.08); display: grid; grid-template-columns: minmax(320px, 380px) 1fr; gap: 32px; }
        .search-row { display:flex; gap:12px; align-items:center; margin-bottom:12px; }
        .search-input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #e8e8ea; box-shadow: inset 0 1px 0 rgba(255,255,255,0.6); }
        .suggestions { position:relative; }
        .suggest-list { position:absolute; left:0; right:0; background:#fff; border:1px solid #eee; border-radius:8px; margin-top:6px; max-height:280px; overflow:auto; z-index:40; box-shadow: 0 8px 24px rgba(12,12,12,0.06); }
        .suggest-item { padding:10px 12px; cursor:pointer; border-bottom:1px solid #f5f5f6; }
        .suggest-item:hover { background:#fafafa; }
        .roadmap-header { margin-bottom: 10px; }
        .roadmap-title { font-weight:800; font-size:18px; color:#222; letter-spacing:-0.2px; }
        .roadmap-sub { color:#666; font-size:13px; }
        .roadmap { display:flex; flex-direction:column; gap:18px; align-items:flex-start; width:100%; padding: 12px 0; }
        .checkpoint { display:flex; gap:12px; align-items:center; text-align:left; width:100%; cursor:pointer; }
        .dot { width:44px; height:44px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-weight:800; box-shadow: 0 8px 28px rgba(12,12,12,0.06); flex-shrink:0 }
        .checkpoint .label { font-size:15px; color:#333; font-weight:700 }
        .checkpoint .sub { font-size:13px; color:#888; }
        .connector { width:4px; height:44px; background:linear-gradient(180deg,#f2f2f3,#f7f7f8); border-radius:999px; position:relative; margin-left:16px; }
        .connector .fill { position:absolute; left:0; top:0; bottom:0; width:100%; background: linear-gradient(180deg,#8B1C2B,#d14b58); border-radius:999px; box-shadow: 0 6px 20px rgba(209,75,88,0.12); }
        .checkpoint.active { transform: translateX(6px); }
  .details-panel { background:#fafafa; border-radius:8px; padding:14px; }
        .project-meta { display:flex; flex-direction:column; gap:6px; }
        .deliverable-list { margin-top:12px; display:flex; flex-direction:column; gap:10px; }
        .deliverable-card { background:#fff; border:1px solid #f0f0f0; padding:10px 12px; border-radius:8px; display:flex; justify-content:space-between; gap:10px; align-items:center }
        .deliverable-info { display:flex; flex-direction:column; }
        .deliverable-key { font-weight:700 }
  .mini-track { width:240px; display:flex; flex-direction:column; gap:6px; align-items:center }
  .track { width:100%; height:10px; background:#f2f2f3; border-radius:999px; position:relative; }
  .track .fill { height:100%; background: linear-gradient(90deg,#8B1C2B,#d14b58); border-radius:999px; }
  .track-marker { position:absolute; top:50%; transform:translateY(-50%); width:14px; height:14px; border-radius:50%; background:#fff; border:3px solid #8B1C2B; box-shadow: 0 6px 18px rgba(139,28,43,0.08); }
  .track-legend { width:100%; display:flex; justify-content:space-between; font-size:12px; color:#666 }
        .status-chip { padding:6px 8px; border-radius:999px; font-size:12px; font-weight:700 }
        .status-pending { background:#fff7f6; color:#c62828 }
        .status-complete { background:#e6f4ea; color:#1b873b }
        .status-review { background:#fff9ed; color:#b06b22 }
        .meta-small { font-size:12px; color:#666 }
        @media (max-width:900px) {
          .roadmap-wrap { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="roadmap-wrap">
        <div>
          <div className="search-row">
            <input className="search-input" placeholder="Search project name or invoice..." value={query} onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearchEnter(); } }} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} />
            <div style={{ minWidth: 88, textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
              <div style={{ width:44, height:44, borderRadius: 999, display:'flex', alignItems:'center', justifyContent:'center', background: '#fff' }}>
                <div style={{ width:36, height:36, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#8B1C2B', background: `conic-gradient(#8B1C2B ${percent}%, #eee 0)` }}>{percent}%</div>
              </div>
            </div>
          </div>

          <div className="suggestions">
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggest-list">
                {suggestions.map(s => (
                  <div key={s._id || s.invoiceNumber} className="suggest-item" onMouseDown={() => selectProject(s)}>
                    <div style={{ fontWeight:700 }}>{s.projectName || s.invoiceName || 'Untitled'}</div>
                    <div style={{ fontSize:12, color:'#666', marginTop:4 }}>{s.invoiceNumber ? `Invoice: ${s.invoiceNumber}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 8 }} className="roadmap-header">
            <div>
              <div className="roadmap-title">Project Roadmap</div>
              <div className="roadmap-sub">{project ? project.projectName || project.invoiceNumber : (loading ? 'Loading project...' : 'No project selected')}</div>
            </div>
          </div>

          <div className="roadmap" role="list">
            {stages.map((s, i) => {
              const completed = i < currentIndex;
              const isCurrent = i === currentIndex;
              const fillPct = Math.max(0, Math.min(100, Math.round(((Math.min(i, currentIndex) + (completed ? 1 : 0)) / (stages.length - 1)) * 100)));
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginRight:12 }}>
                    <div className="dot" style={{
                      background: completed ? 'linear-gradient(180deg,#8B1C2B,#6f1420)' : isCurrent ? '#fff' : '#fff',
                      color: completed ? '#fff' : (isCurrent ? '#8B1C2B' : '#8B1C2B'),
                      border: isCurrent ? '3px solid #8B1C2B' : '2px solid #f0f0f0'
                    }}>{i+1}</div>
                    {i < stages.length - 1 && (
                      <div className="connector" aria-hidden>
                        <div className="fill" style={{ height: `${fillPct}%` }} />
                      </div>
                    )}
                  </div>
                  <div className={"checkpoint " + (selectedStageIndex === i ? 'active' : '')} onClick={() => setSelectedStageIndex(prev => (prev === i ? null : i))}>
                    <div style={{ display:'flex', flexDirection:'column' }}>
                      <div className="label">{stageLabel(s)}</div>
                      <div className="sub">{isCurrent ? 'Current' : (completed ? 'Completed' : 'Pending')}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="details-panel">
          <div className="project-meta">
            <div style={{ fontWeight:800, fontSize:16 }}>{project ? (project.projectName || project.invoiceNumber) : 'No project selected'}</div>
            <div className="meta-small">{project ? (project.clientName ? `Client: ${project.clientName}` : '') : ''}</div>
            <div style={{ display:'flex', gap:10, marginTop:6 }}>
              <div className="meta-small">Stage: <strong>{project ? (project.projectStage || '—') : '—'}</strong></div>
              <div className="meta-small">Invoice: <strong>{project ? (project.invoiceNumber || '—') : '—'}</strong></div>
            </div>
          </div>

          <div className="deliverable-list">
            {project && project.deliverables && project.deliverables.length > 0 ? (
              project.deliverables.map(d => {
                const dstatus = (d.status || '').toString().toLowerCase();
                const isHighlighted = selectedStageIndex !== null ? (stages.findIndex(s => s.toLowerCase() === dstatus) === selectedStageIndex) : false;
                const chipClass = dstatus.includes('complete') || dstatus.includes('done') ? 'status-complete' : dstatus.includes('review') ? 'status-review' : 'status-pending';
                const stageMatchIndex = stages.findIndex(s => s.toLowerCase() === dstatus);
                const pct = stageMatchIndex >= 0 ? Math.round((stageMatchIndex / Math.max(1, stages.length - 1)) * 100) : 0;
                const leftLabel = stageLabel(stages[Math.max(0, Math.floor(stageMatchIndex) - 0)]) || stageLabel(stages[0]);
                const rightLabel = stageLabel(stages[Math.min(stages.length - 1, Math.max(0, Math.ceil(stageMatchIndex) + 0))]) || stageLabel(stages[stages.length - 1]);
                return (
                  <div key={d._id || d.key || Math.random()} className="deliverable-card" style={{ boxShadow: isHighlighted ? '0 6px 20px rgba(139,28,43,0.06)' : 'none', borderColor: isHighlighted ? '#f3d6d8' : undefined }}>
                    <div className="deliverable-info">
                      <div className="deliverable-key">{d.key || d.name || 'Deliverable'}</div>
                      <div className="meta-small">{d.count ? `${d.count} units` : (d.deadline ? `Due ${new Date(d.deadline).toLocaleDateString()}` : '')}</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div className={`status-chip ${chipClass}`}>{dstatus ? dstatus.toUpperCase() : 'PENDING'}</div>
                      <div className="mini-track">
                        <div className="track" aria-hidden>
                          <div className="fill" style={{ width: `${pct}%` }} />
                          <div className="track-marker" style={{ left: `calc(${pct}% - 7px)` }} />
                        </div>
                        <div className="track-legend">
                          <div>{leftLabel}</div>
                          <div>{rightLabel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color:'#666' }}>No deliverables available for this project.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;