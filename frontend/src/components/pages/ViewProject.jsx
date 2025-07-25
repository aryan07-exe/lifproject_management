import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


// Modern, read-only popup for viewing all project details
function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`https://lifproject-management.onrender.com/api/projects/${id}`);
        setFormData(res.data);
      } catch (err) {
        setError("Failed to fetch project.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  function formatDMY(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: "2rem" }}>{error}</div>;
  if (!formData) return null;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        maxWidth: 900,
        width: '95vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: 36,
        position: 'relative',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#8B1C2B',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontSize: 22,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
          title="Close"
        >&times;</button>
        <h2 style={{
          marginBottom: 24,
          fontSize: 26,
          color: '#8B1C2B',
          borderBottom: '2px solid #fbeaec',
          paddingBottom: 12
        }}>Project Details: <span style={{color:'#222'}}>{formData.projectName}</span></h2>

        <div style={{marginBottom: 32}}>
          <h3 style={{color:'#8B1C2B',marginBottom:10,fontSize:18}}>Basic Information</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:18}}>
            <div><b>Project Name:</b><br/>{formData.projectName}</div>
            <div><b>Project Type:</b><br/>{formData.projectType}</div>
            <div><b>Invoice Name:</b><br/>{formData.invoiceName}</div>
            <div><b>Primary Date:</b><br/>{formatDMY(formData.primaryDate)}</div>
            {formData.projectCategory && <div><b>Category:</b><br/>{formData.projectCategory}</div>}
          </div>
        </div>

        <div style={{marginBottom: 32}}>
          <h3 style={{color:'#8B1C2B',marginBottom:10,fontSize:18}}>Day-Wise Requirements</h3>
          {formData.dayWiseRequirements && formData.dayWiseRequirements.length > 0 ? (
            formData.dayWiseRequirements.map((day, idx) => (
              <div key={idx} style={{
                background:'#fff6f6',
                borderRadius:10,
                padding:'18px 18px 10px 18px',
                marginBottom:18,
                border:'1px solid #ffe6e6',
                boxShadow:'0 1px 6px rgba(139,28,43,0.04)'
              }}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:12}}>
                  <div><b>Date:</b><br/>{formatDMY(day.date)}</div>
                  <div><b>Time Shift:</b><br/>{day.timeShift}</div>
                  <div><b>Traditional Photographers:</b><br/>{day.traditionalPhotographers}</div>
                  <div><b>Traditional Cinematographers:</b><br/>{day.traditionalCinematographers}</div>
                  <div><b>Candid Photographers:</b><br/>{day.candidPhotographers}</div>
                  <div><b>Candid Cinematographers:</b><br/>{day.candidcinematographers}</div>
                  <div><b>Additional Cinematographers:</b><br/>{day.additionalCinematographers}</div>
                  <div><b>Additional Photographers:</b><br/>{day.additionalPhotographers}</div>
                  <div><b>OnSite Editor:</b><br/>{day.onSiteEditor}</div>
                  <div><b>Assistant:</b><br/>{day.assistant}</div>
                  <div><b>Aerial Cinematography:</b><br/>{day.aerialCinematography}</div>
                  <div style={{gridColumn:'1/-1'}}><b>Additional Notes:</b><br/>{day.additionalNotes || '-'}</div>
                </div>
              </div>
            ))
          ) : <div style={{color:'#888'}}>No day-wise requirements found.</div>}
        </div>

        <div style={{marginBottom: 12}}>
          <h3 style={{color:'#8B1C2B',marginBottom:10,fontSize:18}}>Deliverables</h3>
          {formData.deliverables && formData.deliverables.length > 0 ? (
            <div style={{display:'grid',gap:16}}>
              {formData.deliverables.map((item, idx) => (
                <div key={idx} style={{
                  background:'#fbeaec',
                  borderRadius:8,
                  padding:'14px 18px',
                  border:'1px solid #f8d7dc',
                  display:'grid',
                  gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',
                  gap:12
                }}>
                  <div><b>Key:</b><br/>{item.key}</div>
                  <div><b>Status:</b><br/>{item.status}</div>
                  <div><b>Deadline:</b><br/>{formatDMY(item.deadline)}</div>
                </div>
              ))}
            </div>
          ) : <div style={{color:'#888'}}>No deliverables found.</div>}
        </div>
      </div>
    </div>
  );
}
export default ViewProject;
