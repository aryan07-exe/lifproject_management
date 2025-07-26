import React, { useState } from 'react';
import axios from 'axios';

function AddManpowerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eid: '',
    role: '',
    phone: ''
  });

  const [message, setMessage] = useState('');

  const roles = [
    'Photographer',
    'Cinematographer',
    'Editor',
    'Drone Operator',
    'Assistant',
    'On-Site Editor'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(' https://lifproject-management.onrender.com/api/manpower/add', formData);
      setMessage(res.data.message);
      setFormData({ name: '', email: '', eid: '', role: '', phone: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding manpower');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#2d3748', fontWeight: 700 }}>Add Manpower</h2>
      {message && <p style={{ color: message.includes('success') ? '#38a169' : '#e53e3e', textAlign: 'center', marginBottom: '16px' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px' }} />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px' }} />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>EID</label>
          <input type="text" name="eid" value={formData.eid} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px' }} />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px' }} />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontWeight: 500, color: '#4a5568' }}>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '6px', fontSize: '16px', background: '#f7fafc' }}>
            <option value="">-- Select Role --</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#3182ce', color: '#fff', fontWeight: 600, fontSize: '17px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(49,130,206,0.08)' }}>
          Add Manpower
        </button>
      </form>
    </div>
  );
}

export default AddManpowerPage;
