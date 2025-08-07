
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/ManpowerCrud.css';
import Navbar from './Navbar';
const API_URL = 'https://lifproject-management.onrender.com/api/manpower-crud';

const initialForm = { name: '', eid: '', email: '', phone: '', role: '' };

const ManpowerCrud = () => {
  const [manpowers, setManpowers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all manpowers
  const fetchManpowers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      setManpowers(res.data || []);
    } catch (err) {
      setError('Failed to fetch manpowers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManpowers();
  }, [fetchManpowers]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add or update manpower
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
  setForm(initialForm);
  setEditId(null);
  await fetchManpowers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save manpower.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare form for editing
  const handleEdit = (mp) => {
    setForm({
      name: mp.name || '',
      eid: mp.eid || '',
      email: mp.email || '',
      phone: mp.phone || '',
      role: mp.role || ''
    });
    setEditId(mp._id);
  };

  // Delete manpower
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this manpower?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchManpowers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete manpower.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setForm(initialForm);
  };

  return (
    <>
    <Navbar/>
    <div className="manpower-crud-container">
      <h2>Manage Manpower</h2>
      <form className="manpower-form" onSubmit={handleSubmit} autoComplete="off">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required disabled={loading} />
        <input name="eid" value={form.eid} onChange={handleChange} placeholder="EID" required disabled={loading} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required disabled={loading} />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required disabled={loading} />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Role" required disabled={loading} />
        <button type="submit" disabled={loading}>{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={handleCancel} disabled={loading}>Cancel</button>}
      </form>
      {error && <div className="error-message">{error}</div>}
      <table className="manpower-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>EID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manpowers.length === 0 && !loading ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No manpower found.</td></tr>
          ) : (
            manpowers.map(mp => (
              <tr key={mp._id}>
                <td data-label="Name">{mp.name}</td>
                <td data-label="EID">{mp.eid}</td>
                <td data-label="Email">{mp.email}</td>
                <td data-label="Phone">{mp.phone}</td>
                <td data-label="Role">{mp.role}</td>
                <td data-label="Actions">
                  <button onClick={() => handleEdit(mp)} disabled={loading}>Edit</button>
                  <button onClick={() => handleDelete(mp._id)} className="delete" disabled={loading}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {loading && <div className="loading-message">Loading...</div>}
    </div></>
  );
};

export default ManpowerCrud;
